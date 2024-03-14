import { registerAs } from '@nestjs/config';

export default registerAs(
  'ip',
  (): Record<string, any> => ({
    lookupKey: process.env.IP_LOOKUP_KEY,
    lookupURL: process.env.IP_LOOKUP_URL,
  })
);
