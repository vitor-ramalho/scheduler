# Email Service Implementation Plan

## Overview
Implementation of a comprehensive email notification system for the scheduler application, focusing on appointment confirmations and professional notifications, with extensibility for future email flows.

---

## 1. Core Requirements Analysis

### Primary Use Cases
1. **Patient/Client Appointment Notifications**
   - Appointment confirmation email when booking is created
   - Appointment reminder email (24 hours before)
   - Appointment cancellation notification
   - Appointment rescheduling notification

2. **Professional/Doctor Notifications**
   - New appointment notification
   - Appointment cancellation notification
   - Daily schedule summary
   - Appointment changes/updates

### Additional Recommended Email Flows
3. **Authentication & Onboarding**
   - Welcome email after registration
   - Email verification
   - Password reset emails
   - Organization setup completion

4. **Administrative**
   - Weekly/Monthly appointment reports to organization managers
   - System notifications (organization disabled, payment issues)
   - No-show notifications

5. **Marketing & Engagement** (Future)
   - Follow-up surveys after appointments
   - Newsletter/updates
   - Re-engagement campaigns

---

## 2. Technical Architecture

### Technology Stack
- **Email Service Provider**: NodeMailer (SMTP) with option for SendGrid/AWS SES integration
- **Template Engine**: Handlebars for email templates
- **Queue System**: Bull (Redis-based) for asynchronous email processing
- **Storage**: Redis for queue management and rate limiting

### Module Structure
```
api/src/
├── notification/
│   ├── email/
│   │   ├── email.module.ts
│   │   ├── email.service.ts
│   │   ├── email.processor.ts (Bull Queue processor)
│   │   ├── templates/
│   │   │   ├── appointment-confirmation.hbs
│   │   │   ├── appointment-reminder.hbs
│   │   │   ├── appointment-cancelled.hbs
│   │   │   ├── professional-new-appointment.hbs
│   │   │   ├── welcome.hbs
│   │   │   ├── password-reset.hbs
│   │   │   ├── daily-schedule.hbs
│   │   │   └── layouts/
│   │   │       └── main.hbs
│   │   ├── dto/
│   │   │   ├── send-email.dto.ts
│   │   │   └── email-context.dto.ts
│   │   └── interfaces/
│   │       ├── email-template.interface.ts
│   │       └── email-config.interface.ts
│   └── notification.module.ts (parent module)
```

---

## 3. Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up email infrastructure and basic sending capability

#### Tasks:
1. **Install Dependencies**
   ```bash
   npm install @nestjs-modules/mailer nodemailer handlebars
   npm install @types/nodemailer --save-dev
   npm install @nestjs/bull bull
   npm install ioredis
   ```

2. **Environment Configuration**
   Add to `.env`:
   ```env
   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_FROM=noreply@yourapp.com
   MAIL_FROM_NAME=Scheduler App
   
   # Redis for Queue
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```

3. **Create Email Configuration**
   - `src/config/email.config.ts`
   - Register email config in ConfigModule

4. **Create Base Email Module**
   - EmailModule with MailerModule integration
   - EmailService with basic send functionality
   - Email template structure

5. **Create Basic Templates**
   - Main layout template
   - Appointment confirmation template
   - Professional notification template

**Deliverables**:
- ✅ Email service can send basic emails
- ✅ Template rendering works
- ✅ Configuration is environment-based

---

### Phase 2: Appointment Email Flows (Week 2)
**Goal**: Implement core appointment notification flows

#### Tasks:
1. **Appointment Creation Flow**
   - Modify `AppointmentsService.createAppointment()` to trigger emails
   - Send confirmation to client
   - Send notification to professional
   - Include appointment details (date, time, location, professional name)

2. **Appointment Cancellation Flow**
   - Modify cancellation logic
   - Send cancellation notice to client
   - Send cancellation notice to professional

3. **Appointment Update/Rescheduling Flow**
   - Detect changes in appointment
   - Send update notifications to both parties

4. **Create Email DTOs and Interfaces**
   ```typescript
   interface AppointmentEmailContext {
     clientName: string;
     clientEmail: string;
     professionalName: string;
     professionalEmail: string;
     appointmentDate: Date;
     appointmentTime: string;
     organizationName: string;
     appointmentId: string;
     cancellationReason?: string;
   }
   ```

5. **Implement Queue System**
   - Create email queue with Bull
   - Add email processor for async sending
   - Implement retry logic for failed emails

**Deliverables**:
- ✅ Clients receive appointment confirmations
- ✅ Professionals receive new appointment notifications
- ✅ Cancellation emails work for both parties
- ✅ Emails are sent asynchronously via queue

---

### Phase 3: Reminders & Scheduled Emails (Week 3)
**Goal**: Implement time-based email notifications

#### Tasks:
1. **Appointment Reminder System**
   - Create cron job to check upcoming appointments
   - Send reminder emails 24 hours before appointment
   - Configurable reminder timing per organization

2. **Daily Schedule Summary**
   - Send daily digest to professionals
   - List of appointments for the day
   - Scheduled for morning delivery (e.g., 7 AM)

3. **Create Scheduler Module**
   ```bash
   npm install @nestjs/schedule
   ```
   - Use `@Cron()` decorators for scheduled tasks
   - EmailSchedulerService for reminder logic

4. **Database Tracking**
   - Add `reminderSent` boolean to Appointment entity
   - Track email delivery status
   - Prevent duplicate reminders

**Deliverables**:
- ✅ Automated appointment reminders work
- ✅ Daily schedule emails sent to professionals
- ✅ Email tracking prevents duplicates

---

### Phase 4: Authentication & User Management Emails (Week 4)
**Goal**: Complete user lifecycle email flows

#### Tasks:
1. **Welcome Email**
   - Triggered after user registration
   - Include getting started guide
   - Link to documentation

2. **Email Verification**
   - Generate verification token
   - Send verification link
   - Update user entity with `emailVerified` field

3. **Password Reset Flow**
   - Modify auth service to trigger reset email
   - Generate secure reset token
   - Create password reset template

4. **Organization Notifications**
   - Organization disabled notification
   - Payment issues
   - Subscription changes

**Deliverables**:
- ✅ Complete authentication email flows
- ✅ User verification system working
- ✅ Password reset via email functional

---

### Phase 5: Admin Features & Monitoring (Week 5)
**Goal**: Admin tools and email system monitoring

#### Tasks:
1. **Email Logs & History**
   - Create EmailLog entity
   - Track all sent emails
   - Store delivery status

2. **Email Analytics Dashboard**
   - API endpoints for email stats
   - Delivery rates
   - Failed email tracking

3. **Admin Email Management**
   - Resend failed emails
   - View email logs
   - Test email functionality

4. **Rate Limiting**
   - Implement per-user email limits
   - Prevent spam
   - Queue throttling

5. **Email Templates Management**
   - Admin interface to preview templates
   - Template customization per organization (future)

**Deliverables**:
- ✅ Email logging and tracking
- ✅ Admin dashboard for email monitoring
- ✅ Rate limiting prevents abuse

---

## 4. Database Schema Changes

### New Entities

#### EmailLog Entity
```typescript
@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column({ nullable: true })
  cc?: string;

  @Column()
  subject: string;

  @Column()
  template: string;

  @Column({ type: 'json' })
  context: object;

  @Column({ default: 'pending' })
  status: 'pending' | 'sent' | 'failed' | 'bounced';

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ nullable: true })
  sentAt?: Date;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Organization, { nullable: true })
  organization?: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
```

#### Update Appointment Entity
```typescript
// Add to Appointment entity
@Column({ default: false })
reminderSent: boolean;

@Column({ default: false })
confirmationSent: boolean;
```

#### Update User Entity
```typescript
// Add to User entity
@Column({ default: false })
emailVerified: boolean;

@Column({ nullable: true })
emailVerificationToken?: string;
```

---

## 5. Email Templates Design

### Template Variables Structure
All templates will receive:
- **Company branding**: Logo, colors, name
- **Contact information**: Support email, phone
- **Legal**: Privacy policy, terms of service links
- **Unsubscribe**: Link to manage preferences

### Responsive Design
- Mobile-first approach
- Tested across major email clients
- Plain text fallback for all templates

---

## 6. Testing Strategy

### Unit Tests
- Email service methods
- Template rendering
- Queue processing logic

### Integration Tests
- End-to-end email flows
- Queue job execution
- Template rendering with real data

### Manual Testing Checklist
- [ ] Test with Gmail, Outlook, Apple Mail
- [ ] Mobile email client testing
- [ ] Spam filter testing
- [ ] Link functionality verification
- [ ] Unsubscribe functionality

---

## 7. Configuration & Environment

### Development Environment
- Use Mailtrap or MailHog for testing
- No real emails sent in development
- All emails logged to console

### Staging Environment
- Use real SMTP but limited recipients
- Test with internal team emails only

### Production Environment
- Full SMTP or SendGrid/AWS SES
- Rate limiting enabled
- Monitoring and alerting active

---

## 8. Monitoring & Alerts

### Metrics to Track
1. **Email Delivery Rate**: % of successfully sent emails
2. **Bounce Rate**: % of bounced emails
3. **Queue Depth**: Number of pending emails
4. **Processing Time**: Average time to send email
5. **Failed Jobs**: Number of failed queue jobs

### Alerts
- Alert when delivery rate drops below 95%
- Alert when queue depth exceeds 1000
- Alert on repeated job failures

---

## 9. Security Considerations

### Data Protection
- Never log email content with PII
- Encrypt sensitive data in email logs
- GDPR compliance for email storage

### Spam Prevention
- Rate limiting per user/organization
- DKIM/SPF/DMARC configuration
- Unsubscribe links in all marketing emails

### Token Security
- Short expiration for verification tokens (24h)
- One-time use tokens
- Secure random generation

---

## 10. Future Enhancements

### Phase 6+
1. **Multi-language Support**
   - Template translations
   - Locale-based sending

2. **SMS Integration**
   - Appointment reminders via SMS
   - Two-factor authentication

3. **Push Notifications**
   - Mobile app notifications
   - Web push notifications

4. **Advanced Scheduling**
   - Custom reminder timing per user
   - Follow-up email sequences

5. **AI-Powered Features**
   - Smart send time optimization
   - Personalized content
   - Predictive no-show prevention

6. **Template Builder**
   - Visual template editor
   - Organization-specific branding
   - A/B testing capabilities

---

## 11. Migration & Rollout Strategy

### Pre-Launch
1. Prepare email templates in staging
2. Test with internal team
3. Validate all email flows
4. Configure production SMTP

### Soft Launch (Week 1)
- Enable for 10% of organizations
- Monitor delivery rates
- Collect feedback

### Full Rollout (Week 2-3)
- Gradually increase to 100%
- Monitor system performance
- Address any issues

### Post-Launch
- Weekly review of email metrics
- Iterate on template design
- Gather user feedback

---

## 12. Cost Estimation

### Infrastructure Costs
- **Redis**: $10-20/month (managed service)
- **SendGrid/AWS SES**: $0.10 per 1,000 emails
- **Monitoring**: Included in existing tools

### Development Time
- **Total Estimated Time**: 5 weeks
- **Developer Resources**: 1 full-time developer
- **Testing & QA**: 1 week additional

### Maintenance
- **Ongoing monitoring**: 2-4 hours/week
- **Template updates**: Ad-hoc
- **Feature enhancements**: Quarterly

---

## 13. Success Metrics

### Key Performance Indicators (KPIs)
1. **Email Delivery Rate**: Target > 98%
2. **Open Rate**: Target > 40% for transactional emails
3. **Click-Through Rate**: Target > 15% for actionable emails
4. **Bounce Rate**: Target < 2%
5. **Complaint Rate**: Target < 0.1%

### Business Impact
- Reduced no-show rate (target: -20%)
- Improved client satisfaction (NPS score)
- Increased professional efficiency
- Better client engagement

---

## 14. Documentation Requirements

### Developer Documentation
- Setup guide for local development
- API documentation for email service
- Template development guide
- Queue management guide

### User Documentation
- Email notification settings guide
- Troubleshooting common issues
- Email preferences management

---

## 15. Dependencies & Prerequisites

### Required Services
- [x] PostgreSQL database (existing)
- [ ] Redis server (new)
- [ ] SMTP server or email service provider
- [x] NestJS application (existing)

### Team Requirements
- Backend developer familiar with NestJS
- Designer for email templates (optional)
- QA engineer for testing

---

## Conclusion

This implementation plan provides a comprehensive, phased approach to building a robust email notification system. Starting with core appointment notifications and progressively adding features ensures a stable, scalable solution.

**Next Steps**:
1. Review and approve this plan
2. Provision Redis infrastructure
3. Set up SMTP credentials
4. Begin Phase 1 implementation

**Estimated Timeline**: 5-6 weeks for full implementation
**Priority**: High - Critical for user engagement and appointment management
