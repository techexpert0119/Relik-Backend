import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.facebook.clientId'),
      clientSecret: configService.get<string>('auth.facebook.clientSecret'),
      callbackURL: configService.get<string>('auth.facebook.callbackUrl'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
    console.log(configService.get<string>('auth.facebook.callbackUrl'), 'cal');
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      accessToken,
      id,
    };

    done(null, user);
  }
}
