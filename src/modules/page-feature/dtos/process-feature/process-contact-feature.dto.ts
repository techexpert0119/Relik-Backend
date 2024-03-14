import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class Phone {
  @IsNumber()
  readonly number: number;

  @IsString()
  readonly country: string;
}

export class ProcessContactFeatureDto {
  @IsString()
  @IsNotEmpty()
  readonly pageFeatureId: string;

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly emailAddress?: string;

  @IsString()
  @IsOptional()
  readonly message?: string;

  @IsString()
  @IsOptional()
  readonly country?: string;

  @IsObject({ each: true })
  @IsOptional()
  readonly phone?: Phone;
}
