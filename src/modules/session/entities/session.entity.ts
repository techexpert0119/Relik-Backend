import { DatabaseEntity } from '../../../common/database/decorators/database.decorator';
import { DatabaseMongoUUIDEntityAbstract } from '../../../common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/entities/user.entity';

@DatabaseEntity({ collection: 'sessions' })
export class Session extends DatabaseMongoUUIDEntityAbstract {
  @Prop({ required: true, type: String, maxlength: 46 })
  ip: string;

  @Prop({ type: String })
  lastAccessTime: string;

  @Prop({ required: false, type: String })
  userAgent?: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

export type SessionDoc = Session & Document;
