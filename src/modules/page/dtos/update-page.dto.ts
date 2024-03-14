import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageStatus } from '../enums/page-status';

export class UpdatePageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  pageProfilePhoto?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pageCoverPhoto?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: PageStatus;
}
