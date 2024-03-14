import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class GetResourceDto {
  @IsString()
  page = '0';

  @IsString()
  take = '10';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsJSON()
  @ApiProperty({ description: 'only JSON' })
  include?: string;

  @IsOptional()
  @IsJSON()
  @ApiProperty({ description: 'only JSON' })
  where?: string;
}
