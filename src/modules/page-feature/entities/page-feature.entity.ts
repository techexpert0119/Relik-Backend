import { Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { Types } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { FeatureValueDto } from '../dtos/feature-value.dto';
import { AppLinkVariant } from '../enums/app-link-variant';
import { ENUM_VIDEO_LINK_TYPE } from '../constants/page-feature.enum.constant';
import { Page, PageDraft } from '../../page/entities/page.entity';

export const PageFeaturesDatabaseName = 'pageFeature';
export const PageDraftFeaturesDatabaseName = 'pageDraftFeatures';

export class PageFeatureBase extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ type: Number })
  order: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature',
  })
  featureId: Types.ObjectId;

  @Prop(
    raw({
      headerValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
        },
      },
      //_links_________________________________________________________________________________________________________
      linkValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      linkedInValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      instagramLinkValues: {
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      socialHandlesValues: {
        type: {
          facebookLink: { required: false, type: String },
          instagramLink: { required: false, type: String },
          xLink: { required: false, type: String },
          whatsAppLink: {
            required: false,
            type: {
              country: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
              },
              number: { required: true, type: Number },
            },
          },
          snapchatLink: { required: false, type: String },
          youtubeLink: { required: false, type: String },
          tiktokLink: { required: false, type: String },
          twitchLink: { required: false, type: String },
          redditLink: { required: false, type: String },
          threadsLink: { required: false, type: String },
          telegramLink: {
            required: false,
            type: {
              country: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
              },
              number: { required: true, type: Number },
            },
          },
          linkedInLink: { required: false, type: String },
        },
      },
      telegramValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      twitchValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      slackValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      tikTokValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      clubhouseValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      pinterestValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      whatsAppLinkValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          phone: {
            required: true,
            type: {
              country: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
              },
              number: { required: true, type: Number },
            },
          },
          image: { required: false, type: String },
        },
      },
      xLinkValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      youtubeLinkValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
        },
      },
      facebookLinkValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
          image: { required: false, type: String },
        },
      },
      // ______________________________________________________________________________________________________________

      footerValues: {
        required: false,
        type: {
          photo: { required: false, type: String },
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String },
        },
      },
      iosAppValues: {
        required: false,
        type: {
          variant: { required: true, type: String, enum: AppLinkVariant },
          link: { required: true, type: String },
        },
      },
      googleStoreLinkValues: {
        required: false,
        type: {
          variant: { required: true, type: String, enum: AppLinkVariant },
          link: { required: true, type: String },
        },
      },
      huaweiStoreLinkValues: {
        required: false,
        type: {
          variant: { required: true, type: String, enum: AppLinkVariant },
          link: { required: true, type: String },
        },
      },
      galaxyStoreLinkValues: {
        required: false,
        type: {
          variant: { required: true, type: String, enum: AppLinkVariant },
          link: { required: true, type: String },
        },
      },
      contactValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          fields: {
            required: true,
            type: {
              name: {
                required: true,
                type: {
                  isActive: { required: true, type: Boolean },
                  isRequired: { required: true, type: Boolean },
                },
              },
              emailAddress: {
                required: true,
                type: {
                  isActive: { required: true, type: Boolean },
                  isRequired: { required: true, type: Boolean },
                },
              },
              mobile: {
                required: true,
                type: {
                  isActive: { required: true, type: Boolean },
                  isRequired: { required: true, type: Boolean },
                },
              },
              message: {
                required: true,
                type: {
                  isActive: { required: true, type: Boolean },
                  isRequired: { required: true, type: Boolean },
                },
              },
              country: {
                required: true,
                type: {
                  isActive: { required: true, type: Boolean },
                  isRequired: { required: true, type: Boolean },
                },
              },
            },
          },
          emailAddress: { required: true, type: String },
          description: { required: false, type: String },
          thankYouMessage: { required: false, type: String },
        },
      },
      mailToValues: {
        required: false,
        type: {
          photo: { required: false, type: String },
          title: { required: true, type: String, min: 3 },
          emailAddress: { required: true, type: String },
          subject: { required: false, type: String },
          body: { required: false, type: String },
        },
      },
      callLinkValues: {
        required: false,
        type: {
          photo: { required: false, type: String },
          title: { required: true, type: String, min: 3 },
          phone: {
            required: true,
            type: {
              country: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
              },
              number: { required: true, type: Number },
            },
          },
        },
      },
      smsLinkValues: {
        required: false,
        type: {
          photo: { required: false, type: String },
          title: { required: true, type: String, min: 3 },
          phone: {
            required: true,
            type: {
              country: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
              },
              number: { required: true, type: Number },
            },
          },
        },
      },
      smsShortCodeValues: {
        required: false,
        type: {
          photo: { required: false, type: String },
          title: { required: true, type: String, min: 3 },
          isHideInternationalPhoneNumber: { required: true, type: Boolean },
          phoneNumber: { required: false, type: String },
          shortCodes: [
            {
              country: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Country',
              },
              operators: [
                {
                  name: { required: true, type: String },
                  price: { required: true, type: Number },
                  shortCode: { required: true, type: Number },
                },
              ],
            },
          ],
          backgroundColor: { required: false, type: String },
          fontColor: { required: false, type: String },
        },
      },
      paidMessageValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          isShowAsListItem: { required: true, type: Boolean },
          price: { required: true, type: Number },
          isPredefinedMessage: { required: false, type: Boolean },
          predefinedMessage: { required: false, type: String },
          emailAddress: { required: true, type: String },
          description: { required: false, type: String },
          thankYouMessage: { required: false, type: String },
        },
      },
      eventValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          date: { required: true, type: Date },
          country: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
          },
          city: { required: true, type: String },
          location: { required: true, type: String },
          link: { required: true, type: String },
          backgroundColor: { required: false, type: String },
          fontColor: { required: false, type: String },
        },
      },
      videoValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          videoIframe: { required: true, type: String },
        },
      },
      htmlValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          html: { required: true, type: String },
        },
      },
      audioValues: {
        required: false,
        type: {
          photo: { required: false, type: String },
          title: { required: true, type: String, min: 3 },
          file: { required: true, type: String },
          audioTitle: { required: true, type: String },
          audioAuthor: { required: true, type: String },
          isImageAsBackground: { required: true, type: Boolean },
        },
      },
      appleMusicValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          linkType: {
            required: true,
            type: String,
            enum: ENUM_VIDEO_LINK_TYPE,
          },
          embeddedOrIframeLink: { required: true, type: String },
        },
      },
      spotifyValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          linkType: {
            required: true,
            type: String,
            enum: ENUM_VIDEO_LINK_TYPE,
          },
          embeddedOrIframeLink: { required: true, type: String },
          width: { required: true, type: Number },
          height: { required: true, type: Number },
        },
      },
      youtubeValues: {
        required: false,
        type: {
          photo: { required: false, type: String, min: 3 },
          title: { required: true, type: String, min: 3 },
          linkType: {
            required: true,
            type: String,
            enum: ENUM_VIDEO_LINK_TYPE,
          },
          embeddedOrIframeLink: { required: true, type: String },
          width: { required: true, type: Number },
          height: { required: true, type: Number },
          isAutoplay: { required: true, type: Boolean },
          isShowPlayerControls: { required: true, type: Boolean },
          isAllowFullscreen: { required: true, type: Boolean },
        },
      },
      audiomackValues: {
        required: false,
        type: {
          title: { required: true, type: String, min: 3 },
          iframe: { required: true, type: String },
        },
      },
      appstoreLinkValues: {
        required: false,
        type: {
          appLinkVariant: {
            required: true,
            type: String,
            enum: AppLinkVariant,
          },
          link: { required: true, type: String, min: 5 },
        },
      },
      androidAppLinkValues: {
        required: false,
        type: {
          link: { required: true, type: String, min: 5 },
        },
      },
      largeAppLinkValues: {
        required: false,
        type: {
          title: { required: false, type: String, min: 5 },
          bottomText: { required: false, type: String, min: 5 },
          link: { required: true, type: String, min: 5 },
        },
      },
      subscribeToNewsValues: {
        required: false,
        type: {
          image: { required: false, type: String, min: 1 },
          title: { required: true, type: String, min: 3 },
          link: { required: true, type: String, min: 3 },
          description: { required: false, type: String },
          thankYouMessage: { required: false, type: String },
        },
      },
    })
  )
  values: FeatureValueDto;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

@DatabaseEntity({ collection: PageDraftFeaturesDatabaseName })
export class PageFeatureDraft extends PageFeatureBase {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: PageDraft.name,
    index: true,
  })
  pageId: Types.ObjectId;
}

export const PageFeatureDraftSchema =
  SchemaFactory.createForClass(PageFeatureDraft);
export type PageFeatureDraftDoc = PageFeatureDraft & Document;

// ____________________________________________________________________________________________________________________

@DatabaseEntity({ collection: PageFeaturesDatabaseName })
export class PageFeature extends PageFeatureBase {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Page.name,
    index: true,
  })
  pageId: Types.ObjectId;
}

export const PageFeatureSchema = SchemaFactory.createForClass(PageFeature);
export type PageFeatureDoc = PageFeatureDraft & Document;
