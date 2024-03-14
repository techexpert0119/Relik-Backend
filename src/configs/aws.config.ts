import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    s3: {
      bucket: process.env.AWS_S3_BUCKET ?? 'bucket',
      region: process.env.AWS_REGION,
      baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
    },
  })
);
