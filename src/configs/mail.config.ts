import { registerAs } from '@nestjs/config';

export default registerAs(
  'mail',
  (): Record<string, any> => ({
    token: process.env.MAIL_TOKEN,
    sender: process.env.SENDER_EMAIL,
  })
);
