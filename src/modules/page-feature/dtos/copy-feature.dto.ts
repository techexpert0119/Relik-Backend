import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CopyFeatureDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  featureId: number;
}
