import { Injectable, LoggerService, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class AppLogger extends ConsoleLogger implements LoggerService {
  // Audit logging for sensitive operations
  audit(action: string, userId: string, details: Record<string, any>) {
    this.log(`AUDIT: ${action} by user ${userId}`, 'AuditLog');
    this.log(`Details: ${JSON.stringify(details)}`, 'AuditLog');
  }

  // Override error to include more context
  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);

    // In production, you might want to send this to an external service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to external error tracking service (e.g., Sentry)
    }
  }
}
