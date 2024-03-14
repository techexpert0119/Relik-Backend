import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor(configService: ConfigService) {
    super({
      consumerKey: configService.get<string>('auth.twitter.clientId'),
      consumerSecret: configService.get<string>('auth.twitter.clientSecret'),
      callbackURL: configService.get<string>('auth.twitter.callbackUrl'),
      includeEmail: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails, id } = profile;
    console.log(profile, 11);
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      accessToken,
      id,
    };
    console.log(profile, 'twutter');
    done(null, user);
  }
}
