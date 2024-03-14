import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class EditUserDto {
  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  businessName?: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  businessUrl?: string;
}
