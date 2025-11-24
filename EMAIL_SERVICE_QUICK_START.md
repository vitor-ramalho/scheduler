# Email Service - Quick Start Implementation Guide

## Phase 1: Foundation Setup (Start Here)

### Step 1: Install Dependencies

```bash
cd api
npm install @nestjs-modules/mailer nodemailer handlebars
npm install @nestjs/bull bull ioredis
npm install --save-dev @types/nodemailer
```

### Step 2: Environment Configuration

Add to `api/.env`:
```env
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@scheduler-app.com
MAIL_FROM_NAME=Scheduler System

# Redis for Queue
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Step 3: Create Email Configuration File

**File**: `api/src/config/email.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: {
    email: process.env.MAIL_FROM || 'noreply@scheduler.com',
    name: process.env.MAIL_FROM_NAME || 'Scheduler App',
  },
  templates: {
    dir: __dirname + '/../notification/email/templates',
    options: {
      strict: true,
    },
  },
}));
```

Update `api/src/config/index.ts`:
```typescript
import appConfig from './app.config';
import databaseConfig from './database.config';
import emailConfig from './email.config';

export { appConfig, databaseConfig, emailConfig };
```

### Step 4: Create Email Module Structure

**File**: `api/src/notification/email/interfaces/email-options.interface.ts`
```typescript
export interface EmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, any>;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface AppointmentEmailContext {
  clientName: string;
  clientEmail: string;
  professionalName: string;
  professionalEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  organizationName: string;
  appointmentId: string;
  cancellationReason?: string;
}
```

**File**: `api/src/notification/email/email.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailOptions } from './interfaces/email-options.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  /**
   * Send email immediately (use for critical emails only)
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const { to, subject, template, context, cc, bcc } = options;

      await this.mailerService.sendMail({
        to,
        cc,
        bcc,
        subject,
        template: `./${template}`,
        context: {
          ...context,
          year: new Date().getFullYear(),
          appName: this.configService.get('email.from.name'),
        },
      });

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Queue email for asynchronous sending (recommended for most cases)
   */
  async queueEmail(options: EmailOptions, delay = 0): Promise<void> {
    try {
      await this.emailQueue.add('send-email', options, {
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      });

      this.logger.log(`Email queued successfully for ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to queue email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Send appointment confirmation to client
   */
  async sendAppointmentConfirmation(context: {
    to: string;
    clientName: string;
    professionalName: string;
    appointmentDate: string;
    appointmentTime: string;
    organizationName: string;
    appointmentId: string;
  }): Promise<void> {
    await this.queueEmail({
      to: context.to,
      subject: `Appointment Confirmation - ${context.organizationName}`,
      template: 'appointment-confirmation',
      context,
    });
  }

  /**
   * Send new appointment notification to professional
   */
  async sendProfessionalNotification(context: {
    to: string;
    professionalName: string;
    clientName: string;
    appointmentDate: string;
    appointmentTime: string;
    organizationName: string;
    appointmentId: string;
  }): Promise<void> {
    await this.queueEmail({
      to: context.to,
      subject: `New Appointment Scheduled`,
      template: 'professional-new-appointment',
      context,
    });
  }

  /**
   * Send appointment cancellation notification
   */
  async sendAppointmentCancellation(context: {
    to: string;
    recipientName: string;
    appointmentDate: string;
    appointmentTime: string;
    organizationName: string;
    cancellationReason?: string;
  }): Promise<void> {
    await this.queueEmail({
      to: context.to,
      subject: `Appointment Cancelled - ${context.organizationName}`,
      template: 'appointment-cancelled',
      context,
    });
  }

  /**
   * Send appointment reminder (24 hours before)
   */
  async sendAppointmentReminder(context: {
    to: string;
    clientName: string;
    professionalName: string;
    appointmentDate: string;
    appointmentTime: string;
    organizationName: string;
    appointmentId: string;
  }): Promise<void> {
    await this.queueEmail({
      to: context.to,
      subject: `Appointment Reminder - Tomorrow`,
      template: 'appointment-reminder',
      context,
    });
  }
}
```

**File**: `api/src/notification/email/email.processor.ts`
```typescript
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailOptions } from './interfaces/email-options.interface';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailOptions>): Promise<void> {
    const { to, subject, template, context, cc, bcc } = job.data;

    try {
      await this.mailerService.sendMail({
        to,
        cc,
        bcc,
        subject,
        template: `./${template}`,
        context: {
          ...context,
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(`Email sent successfully to ${to} (Job ${job.id})`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to} (Job ${job.id}): ${error.message}`,
        error.stack,
      );
      throw error; // Will trigger retry
    }
  }
}
```

**File**: `api/src/notification/email/email.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('email.host'),
          port: configService.get('email.port'),
          secure: configService.get('email.secure'),
          auth: {
            user: configService.get('email.auth.user'),
            pass: configService.get('email.auth.pass'),
          },
        },
        defaults: {
          from: `"${configService.get('email.from.name')}" <${configService.get('email.from.email')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
```

**File**: `api/src/notification/notification.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';

@Module({
  imports: [EmailModule],
  exports: [EmailModule],
})
export class NotificationModule {}
```

### Step 5: Update App Module

**File**: `api/src/app.module.ts` (add these imports)
```typescript
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from './notification/notification.module';
import { emailConfig } from './config';

@Module({
  imports: [
    // ... existing imports
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, emailConfig], // Add emailConfig
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
    NotificationModule, // Add this
    // ... other modules
  ],
})
export class AppModule {}
```

### Step 6: Create Email Templates

**File**: `api/src/notification/email/templates/layouts/main.hbs`
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4F46E5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9fafb;
      padding: 30px;
      border: 1px solid #e5e7eb;
    }
    .footer {
      background-color: #374151;
      color: #9ca3af;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      border-radius: 0 0 5px 5px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .details {
      background-color: white;
      padding: 15px;
      border-left: 4px solid #4F46E5;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{appName}}</h1>
  </div>
  <div class="content">
    {{{body}}}
  </div>
  <div class="footer">
    <p>&copy; {{year}} {{appName}}. All rights reserved.</p>
    <p>
      <a href="#" style="color: #9ca3af;">Unsubscribe</a> |
      <a href="#" style="color: #9ca3af;">Privacy Policy</a>
    </p>
  </div>
</body>
</html>
```

**File**: `api/src/notification/email/templates/appointment-confirmation.hbs`
```html
<h2>Hello {{clientName}},</h2>

<p>Your appointment has been confirmed!</p>

<div class="details">
  <h3>Appointment Details</h3>
  <p><strong>Professional:</strong> {{professionalName}}</p>
  <p><strong>Date:</strong> {{appointmentDate}}</p>
  <p><strong>Time:</strong> {{appointmentTime}}</p>
  <p><strong>Organization:</strong> {{organizationName}}</p>
</div>

<p>Please arrive 10 minutes before your scheduled time.</p>

<p>If you need to reschedule or cancel, please contact us as soon as possible.</p>

<p>We look forward to seeing you!</p>

<p>Best regards,<br>{{organizationName}} Team</p>
```

**File**: `api/src/notification/email/templates/professional-new-appointment.hbs`
```html
<h2>Hello {{professionalName}},</h2>

<p>You have a new appointment scheduled.</p>

<div class="details">
  <h3>Appointment Details</h3>
  <p><strong>Client:</strong> {{clientName}}</p>
  <p><strong>Date:</strong> {{appointmentDate}}</p>
  <p><strong>Time:</strong> {{appointmentTime}}</p>
  <p><strong>Appointment ID:</strong> {{appointmentId}}</p>
</div>

<p>Please review your schedule and prepare accordingly.</p>

<p>Best regards,<br>{{organizationName}} System</p>
```

**File**: `api/src/notification/email/templates/appointment-cancelled.hbs`
```html
<h2>Hello {{recipientName}},</h2>

<p>We regret to inform you that your appointment has been cancelled.</p>

<div class="details">
  <h3>Cancelled Appointment</h3>
  <p><strong>Date:</strong> {{appointmentDate}}</p>
  <p><strong>Time:</strong> {{appointmentTime}}</p>
  {{#if cancellationReason}}
  <p><strong>Reason:</strong> {{cancellationReason}}</p>
  {{/if}}
</div>

<p>If you would like to reschedule, please contact us or book a new appointment through our system.</p>

<p>We apologize for any inconvenience.</p>

<p>Best regards,<br>{{organizationName}} Team</p>
```

**File**: `api/src/notification/email/templates/appointment-reminder.hbs`
```html
<h2>Hello {{clientName}},</h2>

<p>This is a friendly reminder about your upcoming appointment tomorrow.</p>

<div class="details">
  <h3>Appointment Details</h3>
  <p><strong>Professional:</strong> {{professionalName}}</p>
  <p><strong>Date:</strong> {{appointmentDate}}</p>
  <p><strong>Time:</strong> {{appointmentTime}}</p>
  <p><strong>Organization:</strong> {{organizationName}}</p>
</div>

<p><strong>Important:</strong> Please arrive 10 minutes early.</p>

<p>If you need to cancel or reschedule, please do so as soon as possible.</p>

<p>See you soon!</p>

<p>Best regards,<br>{{organizationName}} Team</p>
```

### Step 7: Integrate with Appointments Service

**File**: `api/src/appointments/appointments.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { NotificationModule } from '../notification/notification.module'; // Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Client]),
    NotificationModule, // Add this
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
```

**File**: `api/src/appointments/appointments.service.ts` (update)
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { AppointmentDto } from './dto/appointment.dto';
import { EmailService } from '../notification/email/email.service'; // Add this
import { format } from 'date-fns'; // Install: npm install date-fns

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly emailService: EmailService, // Add this
  ) {}

  async createAppointment(
    appointmentData: AppointmentDto,
    organizationId: string,
    professionalId: string,
  ) {
    console.log({ appointmentData });
    const client = await this.clientRepository.findOne({
      where: {
        id: appointmentData.clientId,
        organization: { id: organizationId },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      client,
      organization: {
        id: organizationId,
      },
      professional: {
        id: professionalId,
      },
    });
    
    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Load full relations for email context
    const fullAppointment = await this.appointmentRepository.findOne({
      where: { id: savedAppointment.id },
      relations: ['client', 'professional', 'organization'],
    });

    // Send confirmation email to client
    await this.emailService.sendAppointmentConfirmation({
      to: fullAppointment.client.email,
      clientName: fullAppointment.client.name,
      professionalName: fullAppointment.professional.firstName + ' ' + fullAppointment.professional.lastName,
      appointmentDate: format(new Date(fullAppointment.startDate), 'MMMM dd, yyyy'),
      appointmentTime: format(new Date(fullAppointment.startDate), 'hh:mm a'),
      organizationName: fullAppointment.organization.name,
      appointmentId: fullAppointment.id,
    });

    // Send notification to professional
    await this.emailService.sendProfessionalNotification({
      to: fullAppointment.professional.email,
      professionalName: fullAppointment.professional.firstName + ' ' + fullAppointment.professional.lastName,
      clientName: fullAppointment.client.name,
      appointmentDate: format(new Date(fullAppointment.startDate), 'MMMM dd, yyyy'),
      appointmentTime: format(new Date(fullAppointment.startDate), 'hh:mm a'),
      organizationName: fullAppointment.organization.name,
      appointmentId: fullAppointment.id,
    });

    return savedAppointment;
  }

  // ... rest of the methods
}
```

### Step 8: Install Redis (Required for Queue)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Docker:**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Docker Compose** (add to `docker-compose.yml`):
```yaml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data

volumes:
  redis_data:
```

### Step 9: Test the Email Service

Create a test endpoint in `app.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';
import { EmailService } from './notification/email/email.service';

@Controller()
export class AppController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test-email')
  async testEmail() {
    await this.emailService.sendAppointmentConfirmation({
      to: 'test@example.com',
      clientName: 'John Doe',
      professionalName: 'Dr. Smith',
      appointmentDate: 'December 25, 2025',
      appointmentTime: '10:00 AM',
      organizationName: 'Test Clinic',
      appointmentId: '12345',
    });
    
    return { message: 'Test email queued successfully' };
  }
}
```

### Step 10: Run and Test

```bash
# Start Redis (if not already running)
redis-server

# Start your API
npm run start:dev

# Test the email endpoint
curl http://localhost:3000/test-email
```

---

## Next Steps

Once Phase 1 is working:

1. **Phase 2**: Add cancellation and rescheduling emails
2. **Phase 3**: Implement reminder system with cron jobs
3. **Phase 4**: Add authentication emails (welcome, password reset)
4. **Phase 5**: Add email logging and monitoring

---

## Troubleshooting

### Gmail SMTP Issues
- Enable "Less secure app access" or use App Passwords
- Enable 2FA and generate App Password in Google Account settings

### Redis Connection Issues
- Check Redis is running: `redis-cli ping` (should return PONG)
- Verify port and host in .env file

### Template Not Found
- Check template path matches exactly
- Verify file extensions are `.hbs`
- Check file permissions

### Emails Not Sending
- Check queue is processing: Look for logs in console
- Verify SMTP credentials are correct
- Check spam folder for test emails

---

## Production Checklist

Before deploying to production:

- [ ] Use production SMTP service (SendGrid, AWS SES, etc.)
- [ ] Set up email logging to database
- [ ] Configure rate limiting
- [ ] Add monitoring and alerts
- [ ] Test all email templates
- [ ] Verify unsubscribe functionality
- [ ] Configure SPF/DKIM/DMARC records
- [ ] Load test email queue
- [ ] Set up Redis persistence
- [ ] Configure backup for email logs
