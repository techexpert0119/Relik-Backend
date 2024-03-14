import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    host: process.env?.DATABASE_URL_MAIN ?? 'mongodb://localhost:27017',
  })
);
