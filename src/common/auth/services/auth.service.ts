import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../../../modules/session/services/session.service';
import { RoleDoc } from '../../../modules/role/entities/role.entity';
import axios from 'axios';
import { TwitterUser } from 'src/modules/user/interfaces/user.interface';
import { TokenType } from '../enums/token-type.enum';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretKey: string;
  private readonly refreshTokenSecretKey: string;
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly callbackURL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService
  ) {
    this.accessTokenSecretKey =
      this.configService.get<string>('auth.jwt.secret');
    this.refreshTokenSecretKey = this.configService.get<string>(
      'auth.jwt.refreshTokenSecret'
    );
    this.consumerKey = configService.get<string>('auth.twitter.clientId');
    this.consumerSecret = configService.get<string>(
      'auth.twitter.clientSecret'
    );
    this.callbackURL = configService.get<string>('auth.twitter.callbackUrl');
  }

  async createAccessToken(properties: {
    payload: {
      userId: string;
      firstName: string;
      email: string;
      isActive: boolean;
      role: RoleDoc;
    };
    sessionId: string;
  }): Promise<string> {
    const { sessionId } = properties;
    const { userId, firstName, email, isActive, role } = properties.payload;

    const session = await this.sessionService.findById(sessionId);
    if (!session) throw new BadRequestException('Session id is missing');

    return this.jwtService.signAsync(
      {
        tokenType: TokenType.Access,
        sub: userId,
        email: email,
        firstName: firstName,
        isActive: isActive,
        role: role,
        sessionId: session.id,
      },
      {
        secret: this.accessTokenSecretKey,
        expiresIn: 60 * 60 * 24,
      }
    );
  }

  async createRefreshToken(
    userId: string,
    email: string,
    sessionId: string
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        tokenType: TokenType.Refresh,
        sub: userId,
        email: email,
        sessionId: sessionId,
      },
      {
        secret: this.accessTokenSecretKey,
        expiresIn: '7d',
      }
    );
  }

  //get Twitter user logic

  async getTwitterOAuthToken(code: string) {
    const TWITTER_OAUTH_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
    const BasicAuthToken = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
      'utf8'
    ).toString('base64');
    try {
      // POST request to the token url to get the access token
      const res = await axios.post<{
        token_type: 'bearer';
        expires_in: 7200;
        access_token: string;
        scope: string;
      }>(
        TWITTER_OAUTH_TOKEN_URL,
        new URLSearchParams({
          client_id: this.consumerKey,
          code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
          redirect_uri: this.callbackURL,
          grant_type: 'authorization_code',
          include_email: 'true',
          code,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${BasicAuthToken}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return console.log(err, 211);
    }
  }

  async getTwitterUser(accessToken: string): Promise<TwitterUser | null> {
    try {
      const res = await axios.get<{ data: TwitterUser }>(
        'https://api.twitter.com/2/users/me',
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data.data ?? null;
    } catch (err) {
      return null;
    }
  }
}
