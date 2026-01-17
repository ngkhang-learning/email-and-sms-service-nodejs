// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Resend } from 'resend';
import 'dotenv/config';
const env = process.env;

class ResendService {
  #instance;

  constructor() {
    this.#instance = new Resend(env.RESEND_API_KEY);
  }

  async send({ to, subject, html }) {
    try {
      const result = await this.#instance.emails.send({
        from: env.RESEND_ADMIN_SENDER_EMAIL,
        to, // If you do not valid domain on Resend, you only send email to email register on Resend
        subject,
        html,
      });

      return result;
    } catch (error) {
      console.error('Resend service: sendmail error: ', error);
      throw error;
    }
  }
}

export const resendService = new ResendService();
