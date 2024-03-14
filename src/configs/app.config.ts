import { registerAs } from '@nestjs/config';
import { version } from 'package.json';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'relik',
    env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,
    client_host: process.env.CLIENT_HOST,
    repoVersion: version,
    versioning: {
      enable: process.env.HTTP_VERSIONING_ENABLE === 'true' ?? false,
      prefix: 'v',
      version: process.env.HTTP_VERSION ?? '1',
    },

    globalPrefix: '/',
    http: {
      enable: process.env.HTTP_ENABLE === 'true' ?? false,
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },
    pageLinkDomain: process.env.PAGE_LINK_DOMAIN,
    jobEnable: process.env.JOB_ENABLE === 'true' ?? false,
  })
);
