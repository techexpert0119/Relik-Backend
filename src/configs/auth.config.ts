import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    google: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackUrl: `http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}${process.env.GOOGLE_CALLBACK_URL}`,
    },
    facebook: {
      clientId: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackUrl: `http://${process.env.HTTP_HOST}:${process.env.HTTP_PORT}${process.env.FB_CALLBACK_URL}`,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackUrl: process.env.TWITTER_CALLBACK_URL,
    },
    jwt: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY ?? '123456',
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
      accessTokenTtl: process.env.JWT_ACCESS_TOKEN_TTL,
      refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY ?? '123456',
    },
  })
);
