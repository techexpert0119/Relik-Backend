import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const SubscriptionDatabaseName = 'subscriptions';

@DatabaseEntity({ collection: SubscriptionDatabaseName })
export class Subscription extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    required: true,
    type: String,
  })
  subscriptionName: string;
}
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
export type SubscriptionDoc = Subscription & Document;
