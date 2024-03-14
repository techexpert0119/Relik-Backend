import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, MaxLength, MinLength } from 'class-validator';

export class AppStoreLinkValueDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  @MaxLength(100)
  link: string;
}
