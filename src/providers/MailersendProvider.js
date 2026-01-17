import { MailerSend, EmailParams, Sender, Recipient, Attachment } from 'mailersend';
import 'dotenv/config';
import fs from 'fs';
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
      // setSendAt: Math.floor(new Date(Date.now() + 30 * 60 * 1000).getTime() / 1000), // Unix timestamp – send in 30 mins
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

  async sendWithTemplate({ to, toName, subject, templateId, personalization, attachmentFiles }) {
    try {
      // Setup email and name of the recipient(s)
      const recipients = [new Recipient(to, toName)];

      // Setup email params
      const emailParams = new EmailParams()
        .setFrom(this.#config.sentFrom)
        .setTo(recipients)
        .setReplyTo(this.#config.sentFrom)
        .setSubject(subject)
        .setPersonalization(personalization)
        .setTemplateId(templateId)
        .setAttachments(this.#buildAttachments(attachmentFiles));

      const result = await this.#instance.email.send(emailParams);
      return result;
    } catch (error) {
      console.error('Mailer Send service (with template and attachment): sendmail error: ', error);
      throw error;
    }
  }

  #buildAttachments(attachments) {
    return attachments.map(
      (att) =>
        new Attachment(
          fs.readFileSync(att.filePath, { encoding: 'base64' }),
          att.fileName,
          att.attachmentType,
        ),
    );
  }
}

export const mailerSendService = new MailerSendService();
