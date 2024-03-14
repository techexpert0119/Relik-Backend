import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOneDto {
  @IsString()
  @ApiProperty({ required: true })
  readonly pageDraftId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  readonly description: string;
}
