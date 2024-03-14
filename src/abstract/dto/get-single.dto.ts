import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional } from 'class-validator';

export class GetSingleDto {
  @IsOptional()
  @IsJSON()
  @ApiProperty({ description: 'only JSON' })
  include?: string;
}
