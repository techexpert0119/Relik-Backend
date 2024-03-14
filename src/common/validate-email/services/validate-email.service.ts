import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateEmailService {
  // private readonly disposableEmailDomains = [
  // ];
  // private readonly freeEmailDomains = [
  //   "mail.ru"
  // ];
  // private readonly mustCleaned = [
  //   'google.com',
  // ];
  // async validateEmail(email: string): Promise<any> {
  //   if (!validator.default.isEmail(email)) {
  //     return {
  //       isValid: false,
  //       message: 'Invalid email format',
  //       type: 'unknown',
  //       isCatchAll: false,
  //       isDisposable: false,
  //     };
  //   }
  //   const [, domain] = email.split('@');
  //   return new Promise((resolve) => {
  //     dns.resolve(domain, 'MX', async (err, addresses) => {
  //       if (err) {
  //         resolve({
  //           isValid: false,
  //           message: 'Domain does not exist or cannot be resolved',
  //           type: 'unknown',
  //           isCatchAll: false,
  //           isDisposable: false,
  //         });
  //       } else {
  //         const isValidEmail = await this.checkEmailValidity(email, addresses[0]?.exchange);
  //         if (!isValidEmail) {
  //           resolve({
  //             isValid: false,
  //             message: 'Email address does not exist',
  //             type: 'unknown',
  //             isCatchAll: false,
  //             isDisposable: false,
  //           });
  //         } else {
  //           const domainType = this.classifyDomain(domain, addresses);
  //           const isCatchAll = this.hasCatchAllMX(addresses);
  //           const isDisposable = this.isDisposableDomain(domain);
  //           resolve({
  //             isValid: true,
  //             message: 'Email is valid',
  //             type: domainType,
  //             isCatchAll: isCatchAll,
  //             isDisposable: isDisposable,
  //           });
  //         }
  //       }
  //     });
  //   });
  // }
  // private classifyDomain(domain: string, mxRecords: any[]): string {
  //   if (this.freeEmailDomains.includes(domain)) {
  //     return 'free';
  //   } else {
  //     for (const record of mxRecords) {
  //       const domain = record.exchange.toLowerCase();
  //       if (this.mustCleaned.some(provider => domain.includes(provider))) {
  //         return "must-clean";
  //       }
  //     }
  //     return 'unknown';
  //   }
  // }
  // private hasCatchAllMX(mxRecords: any[]): boolean {
  //   return mxRecords.some(record => record.exchange === '*');
  // }
  // private isDisposableDomain(domain: string): boolean {
  //   return this.disposableEmailDomains.includes(domain);
  // }
  // private async checkEmailValidity(email: string, dnsRecord: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     const client = new net.Socket();
  //     const rl = readline.createInterface({
  //       input: client,
  //       output: client,
  //     });
  //     client.connect(25, dnsRecord, () => {
  //       // Connection established
  //     });
  //     rl.on('line', (line) => {
  //       if (line.startsWith('220')) {
  //         client.write(`HELO mydomain.com\r\n`);
  //       } else if (line.startsWith('250 2.1.0')) {
  //         client.write(`RCPT TO: <${email}>\r\n`);
  //       } else if (line.startsWith('250 2.1.5')) {
  //         resolve(true);
  //         client.end();
  //       } else if (line.startsWith('550-5.1.1')) {
  //         resolve(false);
  //         client.end();
  //       } else if (line.startsWith('250')) {
  //         client.write(`MAIL FROM: <sender@mydomain.com>\r\n`);
  //       } else if (line.startsWith('550')) {
  //         reject(line);
  //         client.end();
  //       }
  //     });
  //     client.on('error', (error) => {
  //       reject(error);
  //     });
  //   });
  // }
}
