import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CountryCreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly dial_code: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}
