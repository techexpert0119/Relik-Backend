import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FeatureGroupCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly groupName: string;
}
