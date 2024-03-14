import { LinkValueDto } from './feature-values/link-value.dto';
import { ApiProperty } from '@nestjs/swagger';
import { HeaderValueDto } from './feature-values/header-value.dto';
import { AppStoreLinkValueDto } from './feature-values/app-store-link-value-dto';
import { SmsShortCodeValueDto } from './feature-values/sms-short-code-value.dto';
import { SubscribeToNewsValueDto } from './feature-values/subscribe-to-news-valu-dto';
import { ContactValueDto } from './feature-values/contact-value.dto';

export class FeatureValueDto {
  @ApiProperty()
  linkValue?: LinkValueDto;

  @ApiProperty()
  headerValue?: HeaderValueDto;

  @ApiProperty()
  appstoreLinkValues?: AppStoreLinkValueDto;

  @ApiProperty()
  smsShortCodeValues?: SmsShortCodeValueDto;

  @ApiProperty()
  subscribeToNewsValues?: SubscribeToNewsValueDto;

  @ApiProperty()
  contactValues?: ContactValueDto;
}
