import twilio from 'twilio';
import 'dotenv/config';

class TwilioService {
  #instance;

  constructor() {
    this.#instance = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN);
  }

  async send({ to, body }) {
    try {
      const message = await this.#instance.messages.create({
        from: '+14013943035',
        to,
        body,
      });

      return message;
    } catch (error) {
      console.error('Twilio service: send sms error: ', error);
      throw error;
    }
  }
}

export const smsService = new TwilioService();
