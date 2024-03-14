import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOneDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly description: string;
}
