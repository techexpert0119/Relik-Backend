import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LinkType } from '../../enums/link-type.enum';

export class LinkValueDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty()
  @IsEnum(LinkType)
  linkType: LinkType;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
