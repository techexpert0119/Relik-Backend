import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubscriptionCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly subscriptionName: string;
}
