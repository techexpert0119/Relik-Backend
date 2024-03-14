import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PageCreateDto } from './page.create.dto';
import { IsString } from 'class-validator';

export class PageUpdateDto extends PartialType(PageCreateDto) {
  @ApiProperty()
  @IsString()
  readonly pageCoverPhoto: String;

  @ApiProperty()
  @IsString()
  readonly theme: String;

  @ApiProperty()
  @IsString()
  readonly logoShape: String;

  @ApiProperty()
  @IsString()
  readonly fontFamily: String;

  @ApiProperty()
  @IsString()
  readonly fontColor: String;

  @ApiProperty({
    example: {
      color: 'String',
      isGradient: 'String',
      image: 'String',
    },
  })
  @IsString()
  readonly background: {
    color: String;
    isGradient: String;
    image: String;
  };

  @ApiProperty({
    example: {
      type: 'String',
      backgroundcolor: 'String',
      fontColor: 'String',
    },
  })
  @IsString()
  readonly buttons: {
    type: String;
    backgroundcolor: String;
    fontColor: String;
  };
}
