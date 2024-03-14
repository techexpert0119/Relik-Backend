import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { FeatureGroup } from 'src/modules/feature-group/entities/feature-group.entity';
import { FeatureElement } from 'src/modules/feature-element/entities/feature-element.entity';
import { ENUM_FEATURES_COMPONENTS_TYPE } from '../constants/feature.enum.constant';

export const FeatureGroupDatabaseName = 'feature';

@DatabaseEntity({ collection: FeatureGroupDatabaseName })
export class Feature extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, type: Number })
  order: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'FeatureGroup' }])
  featureGroup: FeatureGroup[];

  @Prop({ required: true, enum: ENUM_FEATURES_COMPONENTS_TYPE, unique: true })
  component: ENUM_FEATURES_COMPONENTS_TYPE;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'FeatureElement' }])
  featureElement: FeatureElement[];
}

export type FeatureDoc = Feature & Document;
export const FeatureSchema = SchemaFactory.createForClass(Feature);
