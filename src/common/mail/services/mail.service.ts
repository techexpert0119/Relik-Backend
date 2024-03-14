import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  private readonly token: string;
  private readonly sender: string;
  constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get<string>('mail.token');
    this.sender = this.configService.get<string>('mail.sender');
  }

  async sendMail(
    recipientEmail: string,
    subject: string,
    html: string
  ): Promise<boolean> {
    const client = new MailtrapClient({ token: this.token });
    const sender = { name: 'relik.com', email: this.sender };
    const isSended = await client
      .send({
        from: sender,
        to: [{ email: recipientEmail }],
        subject,
        html: html,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err, 'email issue');
      });

    return !!isSended;
  }
}
