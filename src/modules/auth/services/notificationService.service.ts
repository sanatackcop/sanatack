import { Injectable } from '@nestjs/common';
import { createTransport, SentMessageInfo, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export default class NotificationsService {
  private readonly provider: EmailManager;
  constructor() {
    this.provider = new EmailManager();
  }

  send(message: EmailMessage): Promise<unknown> {
    return this.provider.send(message);
  }
}

export interface EmailMessage {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  from_client?: boolean;
}

export class EmailManager {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(message: EmailMessage): Promise<any> {
    const messageToSend = {};
    if (message.subject) messageToSend['subject'] = message.subject;
    if (message.to) messageToSend['to'] = message.to;
    if (message.html) messageToSend['html'] = message.html;
    if (message.text) messageToSend['text'] = message.text;
    if (message.from) messageToSend['from'] = message.from;
    if (process.env.SMTP_EMAIL) messageToSend['from'] = process.env.SMTP_EMAIL;
    if (message.from && !message.from_client)
      messageToSend['from'] = message.from;
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.transporter.sendMail(
        {
          ...messageToSend,
        },
        (error: Error, info: SentMessageInfo) => {
          if (error) {
            console.log({ error, host: process.env.SMTP_HOST });
            return reject(error);
          }
          return resolve(info);
        }
      );
    });
  }
}
