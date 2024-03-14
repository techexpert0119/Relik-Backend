import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ReorderRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  featureId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  pageId: string;

  @Min(1)
  @IsInt()
  @ApiProperty({ required: true })
  moveTo: number;
}
