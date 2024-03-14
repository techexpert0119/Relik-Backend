import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const AgencyDatabaseName = 'agency';

@DatabaseEntity({ collection: AgencyDatabaseName })
export class Agency extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    type: String,
  })
  businessName: string;

  @Prop({
    type: String,
  })
  businessUrl: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ])
  admins: Types.ObjectId[];

  @Prop({
    required: true,
    default: true,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({
    required: false,
  })
  photo?: string;
}

export const AgencySchema = SchemaFactory.createForClass(Agency);

export type AgencyDoc = Agency & Document;
