import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const FeatureElementDatabaseName = 'featureElement';

@DatabaseEntity({ collection: FeatureElementDatabaseName })
export class FeatureElement extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, type: String })
  elementName: string;
}

export type FeatureElementDoc = FeatureElement & Document;
export const FeatureElementSchema =
  SchemaFactory.createForClass(FeatureElement);
