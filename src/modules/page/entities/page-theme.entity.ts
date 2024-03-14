import { Prop, Schema } from '@nestjs/mongoose';
import { LogoShape } from '../enums/logo-shape';
import { ImageVariant } from '../enums/image-variant';
import { ButtonRadiusVariant } from '../enums/button-radius-variant';
import { ButtonBorderVariant } from '../enums/button-border-variant';
import { ButtonShadowVariant } from '../enums/button-shadow-variant';
import { HeaderLayoutType } from '../enums/header-layout-type';

export enum ThemeFontFamily {
  Jost = 'Jost',
  Lato = 'Lato',
  OpenSans = 'Open Sans',
}

@Schema({ _id: false })
export class PageTheme {
  @Prop({
    required: true,
    type: String,
    enum: LogoShape,
    default: LogoShape.Rounded,
  })
  // TODO: Remove unneeded optionals when we will clean db
  logoShape?: LogoShape;

  @Prop({
    required: true,
    type: Number,
    enum: HeaderLayoutType,
    default: HeaderLayoutType.Default,
  })
  headerLayoutType: HeaderLayoutType;

  @Prop({ type: String, enum: ThemeFontFamily, default: ThemeFontFamily.Jost })
  fontFamily?: ThemeFontFamily;

  @Prop({ type: String, default: '#3D2D41', required: true })
  fontColor: string;

  @Prop({ type: String, default: '#DEA341', required: true })
  logoColor: string;

  @Prop({ type: String, default: '#FFF2DE', required: true })
  background: string;

  @Prop({ type: String, enum: ImageVariant })
  image?: ImageVariant;

  @Prop({
    type: String,
    enum: ButtonRadiusVariant,
    default: ButtonRadiusVariant.Full,
  })
  buttonRadius: ButtonRadiusVariant;

  @Prop({
    type: String,
    enum: ButtonBorderVariant,
    default: ButtonBorderVariant.Thin,
  })
  buttonBorder: ButtonBorderVariant;

  @Prop({
    type: String,
    enum: ButtonShadowVariant,
    default: ButtonShadowVariant.None,
  })
  buttonShadow: ButtonShadowVariant;

  @Prop({ type: String, default: '#000', required: true })
  buttonFontColor: string;

  @Prop({ type: String, default: '#fff', required: true })
  buttonBackground: string;
}
