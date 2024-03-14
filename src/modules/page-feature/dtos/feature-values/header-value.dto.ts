import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class HeaderValueDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;
}
