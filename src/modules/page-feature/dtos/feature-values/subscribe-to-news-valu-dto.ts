import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SubscribeToNewsValueDto {
  @ApiProperty()
  @IsOptional()
  @MinLength(1)
  readonly photo: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  readonly thankYouMessage: string;
}
