import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const FeatureGroupDatabaseName = 'featureGroup';

@DatabaseEntity({ collection: FeatureGroupDatabaseName })
export class FeatureGroup extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, type: String })
  groupName: string;
  
}

export type FeatureGroupDoc = FeatureGroup & Document;
export const FeatureGroupSchema = SchemaFactory.createForClass(FeatureGroup);
