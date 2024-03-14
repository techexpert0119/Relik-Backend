import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import {
  ENUM_VERIFICATION_PURPOSE,
  ENUM_VERIFICATION_STATUS,
} from '../constants/varification.enum.constant';

export const VerificationDatabaseName = 'verification';

@DatabaseEntity({ collection: VerificationDatabaseName })
export class Verification extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  })
  role: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  verificationLink: string;

  @Prop({
    type: String,
  })
  verificationToken: string;

  @Prop({
    required: false,
    type: Date,
  })
  expireDate: Date;

  @Prop({
    required: true,
    enum: ENUM_VERIFICATION_STATUS,
  })
  status: ENUM_VERIFICATION_STATUS;
  @Prop({
    required: true,
    enum: ENUM_VERIFICATION_PURPOSE,
  })
  purpose: ENUM_VERIFICATION_PURPOSE;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
  })
  agency: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  invitedUser: Types.ObjectId;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);

export type VerificationDoc = Verification & Document;
