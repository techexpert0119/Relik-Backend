import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class SmsShortCodeValueDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly photo: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  readonly title: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly isHideInternationalPhoneNumber: boolean;

  @ApiProperty()
  @IsOptional()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly shortCodes: ReadonlyArray<ShortCode>;
}

export class ShortCode {
  @ApiProperty()
  @IsNotEmpty()
  readonly country: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly operators: ReadonlyArray<Operator>;
}

export class Operator {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly shortCode: number;
}
