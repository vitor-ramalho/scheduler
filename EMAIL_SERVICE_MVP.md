# Email Service - MVP Implementation (1-2 Days)

## 🚀 MVP Scope - Keep It Simple

### What We're Building (Minimum Viable Product):
1. ✅ Send appointment confirmation to client when booking is created
2. ✅ Send notification to professional when new appointment is booked
3. ✅ Basic email templates (no fancy design needed)
4. ⚠️ **NO** queue system (send emails synchronously)
5. ⚠️ **NO** Redis setup
6. ⚠️ **NO** reminders (can add later)
7. ⚠️ **NO** email logging (use console logs for now)

**Result**: Clients and professionals get emails when appointments are booked. That's it. Ship it fast!

---

## Step 1: Install Dependencies (2 minutes)

```bash
cd api
npm install @nestjs-modules/mailer nodemailer handlebars
npm install --save-dev @types/nodemailer
```

---

## Step 2: Environment Setup (2 minutes)

Add to `api/.env`:
```env
# Email Configuration (Use Gmail for MVP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@scheduler.com
```

**Gmail Setup**: 
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Generate password for "Mail"
- Use that password in `MAIL_PASSWORD`

---

## Step 3: Create Email Config (5 minutes)

**File**: `api/src/config/email.config.ts`
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: process.env.MAIL_FROM || 'noreply@scheduler.com',
}));
```

**Update**: `api/src/config/index.ts`
```typescript
import appConfig from './app.config';
import databaseConfig from './database.config';
import emailConfig from './email.config';

export { appConfig, databaseConfig, emailConfig };
```

---

## Step 4: Create Simple Email Service (15 minutes)

**File**: `api/src/notification/email.service.ts`
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      auth: {
        user: this.configService.get('email.auth.user'),
        pass: this.configService.get('email.auth.pass'),
      },
    });
  }

  /**
   * Send appointment confirmation to client
   */
  async sendAppointmentConfirmation(data: {
    clientEmail: string;
    clientName: string;
    professionalName: string;
    date: string;
    time: string;
    organizationName: string;
  }): Promise<void> {
    try {
      const html = this.createAppointmentConfirmationTemplate(data);

      await this.transporter.sendMail({
        from: this.configService.get('email.from'),
        to: data.clientEmail,
        subject: `Appointment Confirmation - ${data.organizationName}`,
        html,
      });

      this.logger.log(`Confirmation email sent to ${data.clientEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email: ${error.message}`);
      // Don't throw - we don't want to block appointment creation if email fails
    }
  }

  /**
   * Send new appointment notification to professional
   */
  async sendProfessionalNotification(data: {
    professionalEmail: string;
    professionalName: string;
    clientName: string;
    date: string;
    time: string;
    organizationName: string;
  }): Promise<void> {
    try {
      const html = this.createProfessionalNotificationTemplate(data);

      await this.transporter.sendMail({
        from: this.configService.get('email.from'),
        to: data.professionalEmail,
        subject: `New Appointment - ${data.clientName}`,
        html,
      });

      this.logger.log(`Notification email sent to ${data.professionalEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send notification email: ${error.message}`);
      // Don't throw - just log the error
    }
  }

  // Simple HTML email template for client confirmation
  private createAppointmentConfirmationTemplate(data: {
    clientName: string;
    professionalName: string;
    date: string;
    time: string;
    organizationName: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .details { background-color: white; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Confirmed</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.clientName},</h2>
            <p>Your appointment has been confirmed!</p>
            <div class="details">
              <p><strong>Professional:</strong> ${data.professionalName}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
              <p><strong>Location:</strong> ${data.organizationName}</p>
            </div>
            <p>Please arrive 10 minutes before your scheduled time.</p>
            <p>If you need to reschedule or cancel, please contact us.</p>
            <p>Best regards,<br>${data.organizationName} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.organizationName}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Simple HTML email template for professional notification
  private createProfessionalNotificationTemplate(data: {
    professionalName: string;
    clientName: string;
    date: string;
    time: string;
    organizationName: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; }
          .details { background-color: white; padding: 15px; border-left: 4px solid #10B981; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Appointment</h1>
          </div>
          <div class="content">
            <h2>Hello Dr. ${data.professionalName},</h2>
            <p>You have a new appointment scheduled.</p>
            <div class="details">
              <p><strong>Patient:</strong> ${data.clientName}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Time:</strong> ${data.time}</p>
            </div>
            <p>Please review your schedule.</p>
            <p>Best regards,<br>${data.organizationName} System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
```

---

## Step 5: Create Email Module (3 minutes)

**File**: `api/src/notification/email.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
```

---

## Step 6: Update App Module (2 minutes)

**File**: `api/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig, databaseConfig, emailConfig } from './config'; // Add emailConfig
import { EmailModule } from './notification/email.module'; // Add this
// ... other imports

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, emailConfig], // Add emailConfig here
    }),
    // ... other modules
    EmailModule, // Add this
  ],
})
export class AppModule {}
```

---

## Step 7: Update Appointments Service (10 minutes)

**File**: `api/src/appointments/appointments.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { EmailModule } from '../notification/email.module'; // Add this

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Client]),
    EmailModule, // Add this
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
```

**File**: `api/src/appointments/appointments.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { AppointmentDto } from './dto/appointment.dto';
import { EmailService } from '../notification/email.service'; // Add this

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
    // ... existing code to create appointment ...
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
      organization: { id: organizationId },
      professional: { id: professionalId },
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);

    // Load full appointment with relations for email
    const fullAppointment = await this.appointmentRepository.findOne({
      where: { id: savedAppointment.id },
      relations: ['client', 'professional', 'organization'],
    });

    // Send emails (won't block if they fail)
    this.sendAppointmentEmails(fullAppointment);

    return savedAppointment;
  }

  // Send appointment emails asynchronously
  private async sendAppointmentEmails(appointment: Appointment) {
    try {
      const appointmentDate = new Date(appointment.startDate);
      const dateStr = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = appointmentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Send confirmation to client
      await this.emailService.sendAppointmentConfirmation({
        clientEmail: appointment.client.email,
        clientName: appointment.client.name,
        professionalName: `${appointment.professional.firstName} ${appointment.professional.lastName}`,
        date: dateStr,
        time: timeStr,
        organizationName: appointment.organization.name,
      });

      // Send notification to professional
      await this.emailService.sendProfessionalNotification({
        professionalEmail: appointment.professional.email,
        professionalName: `${appointment.professional.firstName} ${appointment.professional.lastName}`,
        clientName: appointment.client.name,
        date: dateStr,
        time: timeStr,
        organizationName: appointment.organization.name,
      });
    } catch (error) {
      console.error('Error sending appointment emails:', error);
      // Don't throw - emails failing shouldn't break appointment creation
    }
  }

  // ... rest of your existing methods ...
}
```

---

## Step 8: Test It! (5 minutes)

1. **Start your API:**
```bash
cd api
npm run start:dev
```

2. **Create a test appointment** through your existing API endpoint (use Postman or your frontend)

3. **Check console logs** - you should see:
```
[EmailService] Confirmation email sent to client@example.com
[EmailService] Notification email sent to professional@example.com
```

4. **Check email inboxes** - both client and professional should receive emails!

---

## That's It! 🎉

**Total Implementation Time**: ~1-2 hours

**What You Get**:
- ✅ Appointment confirmation emails to clients
- ✅ New appointment notifications to professionals
- ✅ Simple, clean email templates
- ✅ No external dependencies (no Redis, no queues)
- ✅ Error handling (emails won't break appointments)
- ✅ Easy to extend later

---

## Testing Tips

### Test Locally:
```bash
# Use your real Gmail for testing
MAIL_USER=your.email@gmail.com
MAIL_PASSWORD=your-app-password
```

### What to Test:
1. Create an appointment → Check both emails arrive
2. Try with invalid email address → Appointment still created
3. Check email formatting on mobile and desktop
4. Verify links and content look correct

---

## Future Improvements (When You Have Time)

Later, you can add:
- 📅 Appointment reminders (24 hours before)
- ❌ Cancellation emails
- 📝 Email templates in separate files
- 🔄 Queue system for better reliability
- 📊 Email logging and tracking
- 🌍 Multi-language support

But for MVP, this is **PERFECT**! Ship it and iterate based on user feedback.

---

## Troubleshooting

### "Authentication failed" error:
- Make sure you're using Gmail App Password, not your regular password
- Enable 2FA in Google Account first

### Emails going to spam:
- Normal for new domains
- Ask users to check spam folder
- Later: Set up SPF/DKIM records

### Emails not sending:
- Check console logs for errors
- Verify SMTP credentials in .env
- Test SMTP connection with a simple script

### Appointment creation slow:
- Email sending happens synchronously
- If it's too slow, wrap email calls in `Promise.all()` or add later when you implement queue

---

## Production Checklist

Before going live:
- [ ] Use production email service (SendGrid free tier or AWS SES)
- [ ] Don't use personal Gmail in production
- [ ] Add error monitoring (Sentry)
- [ ] Test with real user emails
- [ ] Make sure emails look good on mobile
- [ ] Add unsubscribe link (if sending marketing emails)

---

## Summary

This MVP implementation:
- ✅ Takes 1-2 hours to implement
- ✅ No complex setup (no Redis, no queues)
- ✅ Sends emails when appointments are created
- ✅ Doesn't break appointment creation if emails fail
- ✅ Easy to maintain and extend

**Ship it now, improve it later!** 🚀
