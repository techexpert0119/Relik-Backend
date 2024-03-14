import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class AgencyCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  businessName: string;
  @IsNotEmpty()
  @ApiProperty()
  businessUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  admins?: Types.ObjectId[];
  @ApiProperty()
  isActive?: boolean;
  @ApiProperty()
  photo?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  nameOfCelebrities?: string[];

  @ApiProperty()
  @IsOptional()
  createdBy?: Types.ObjectId;
}
