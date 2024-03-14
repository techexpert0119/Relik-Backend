import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IHelperJwtOptions,
  IHelperJwtVerifyOptions,
} from 'src/common/helper/interfaces/helper.interface';

@Injectable()
export class HelperEncryptionService {
  constructor(private readonly jwtService: JwtService) {}

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string {
    return this.jwtService.sign(payload, {
      secret: options.secretKey,
      expiresIn: options.expiredIn,
      notBefore: options.notBefore ?? 0,
      audience: options.audience,
      issuer: options.issuer,
      subject: options.subject,
    });
  }

  jwtVerify(token: string, options: IHelperJwtVerifyOptions): boolean {
    try {
      this.jwtService.verify(token, {
        secret: options.secretKey,
        audience: options.audience,
        issuer: options.issuer,
        subject: options.subject,
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }
}
