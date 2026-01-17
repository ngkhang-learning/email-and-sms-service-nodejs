import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import 'dotenv/config';

const env = process.env;

class MailerSendService {
  #instance;
  #config;

  constructor() {
    this.#instance = new MailerSend({
      apiKey: env.MAILERSEND_API_KEY,
    });

    this.#config = {
      sentFrom: new Sender(
        `ngkhang@${env.MAILERSEND_ADMIN_SENDER_DOMAIN}`,
        env.MAILERSEND_ADMIN_SENDER_NAME,
      ),
    };
  }

  async send({ to, toName, subject, html }) {
    try {
      // Setup email and name of the recipient(s)
      const recipients = [new Recipient(to, toName)];

      // Setup email params
      const emailParams = new EmailParams()
        .setFrom(this.#config.sentFrom)
        .setTo(recipients)
        .setReplyTo(this.#config.sentFrom)
        .setSubject(subject)
        .setHtml(html);

      const result = await this.#instance.email.send(emailParams);
      return result;
    } catch (error) {
      console.error('Mailer Send service: sendmail error: ', error);
      throw error;
    }
  }
}

export const mailerSendService = new MailerSendService();
