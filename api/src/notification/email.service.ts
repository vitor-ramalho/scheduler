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
    organizationPhone?: string;
    organizationEmail?: string;
  }): Promise<void> {
    try {
      const html = this.createAppointmentConfirmationTemplate(data);

      await this.transporter.sendMail({
        from: this.configService.get('email.from'),
        to: data.clientEmail,
        subject: `Confirmação de Agendamento - ${data.organizationName}`,
        html,
      });

      this.logger.log(`Confirmation email sent to ${data.clientEmail}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send confirmation email: ${message}`);
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
    organizationPhone?: string;
    organizationEmail?: string;
  }): Promise<void> {
    try {
      const html = this.createProfessionalNotificationTemplate(data);

      await this.transporter.sendMail({
        from: this.configService.get('email.from'),
        to: data.professionalEmail,
        subject: `Novo Agendamento - ${data.clientName}`,
        html,
      });

      this.logger.log(`Notification email sent to ${data.professionalEmail}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send notification email: ${message}`);
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
    organizationPhone?: string;
    organizationEmail?: string;
  }): string {
    const contactInfo: string[] = [];
    if (data.organizationPhone) {
      contactInfo.push(
        `<p><strong>Telefone:</strong> ${data.organizationPhone}</p>`,
      );
    }
    if (data.organizationEmail) {
      contactInfo.push(
        `<p><strong>E-mail:</strong> ${data.organizationEmail}</p>`,
      );
    }

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
          .contact { background-color: #FEF3C7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Agendamento Confirmado</h1>
          </div>
          <div class="content">
            <h2>Olá ${data.clientName},</h2>
            <p>Seu agendamento foi confirmado com sucesso!</p>
            <div class="details">
              <p><strong>Profissional:</strong> ${data.professionalName}</p>
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Horário:</strong> ${data.time}</p>
              <p><strong>Local:</strong> ${data.organizationName}</p>
            </div>
            <p>Por favor, chegue 10 minutos antes do horário agendado.</p>
            ${
              contactInfo.length > 0
                ? `
            <div class="contact">
              <p><strong>Precisa remarcar ou cancelar?</strong></p>
              <p>Entre em contato conosco:</p>
              ${contactInfo.join('\n')}
            </div>
            `
                : '<p>Se precisar remarcar ou cancelar, por favor entre em contato conosco.</p>'
            }
            <p>Atenciosamente,<br>Equipe ${data.organizationName}</p>
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
    organizationPhone?: string;
    organizationEmail?: string;
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
            <h1>Novo Agendamento</h1>
          </div>
          <div class="content">
            <h2>Olá ${data.professionalName},</h2>
            <p>Você tem um novo agendamento!</p>
            <div class="details">
              <p><strong>Cliente:</strong> ${data.clientName}</p>
              <p><strong>Data:</strong> ${data.date}</p>
              <p><strong>Horário:</strong> ${data.time}</p>
            </div>
            <p>Por favor, revise sua agenda.</p>
            <p>Atenciosamente,<br>Sistema ${data.organizationName}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
