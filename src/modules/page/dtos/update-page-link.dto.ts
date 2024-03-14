import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePageLinkDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly pageLink: string;
}
