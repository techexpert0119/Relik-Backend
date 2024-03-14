import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class PageCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly pageName: string;

  @ApiProperty()
  @IsString()
  readonly pageLink: string;

  @ApiProperty()
  @IsString()
  readonly pageDescription: string;

  @ApiProperty()
  @IsString()
  readonly pageProfilePhoto: string;

  @ApiProperty()
  @IsOptional()
  readonly agencyId?: Types.ObjectId;
}
