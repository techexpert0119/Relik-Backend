import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HeaderLayoutType } from '../enums/header-layout-type';

export class UpdatePageHeaderDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  pageName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pageDescription?: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(HeaderLayoutType)
  headerLayoutType?: HeaderLayoutType;
}
