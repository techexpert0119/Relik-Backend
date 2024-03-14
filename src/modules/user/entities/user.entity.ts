import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Types,
} from 'mongoose';
import { DatabaseMongoUUIDEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.uuid.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';

export const UserDatabaseName = 'users';

@DatabaseEntity({ collection: UserDatabaseName })
export class User extends DatabaseMongoUUIDEntityAbstract {
  @Prop({
    index: true,
    trim: true,
    type: String,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
    lowercase: true,
    type: String,
    maxlength: 100,
  })
  email: string;

  @Prop({
    index: true,
    unique: true,
    trim: true,
    lowercase: true,
    type: String,
    maxlength: 100,
  })
  cleanedEmail: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  })
  role: Types.ObjectId;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    required: true,
    default: 0,
    type: Number,
  })
  passwordAttempt: number;

  @Prop({
    required: true,
    type: Date,
  })
  signUpDate: Date;

  @Prop({
    required: true,
    enum: ENUM_USER_SIGN_UP_FROM,
  })
  signUpFrom: ENUM_USER_SIGN_UP_FROM;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  })
  subscriptionId: String;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
    },
  ])
  agencies: Types.ObjectId[];

  @Prop({
    required: true,
    default: true,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({
    required: false,
    type: Date,
  })
  inactiveDate?: Date;

  @Prop({
    required: false,
  })
  photo?: String;

  @Prop({
    required: false,
  })
  permissions?: String[];

  @Prop({
    type: String,
  })
  googleId: String;

  @Prop({
    type: String,
  })
  facebookId: String;
  
  @Prop({
    type: String,
  })
  XId: String; //twitterId

  @Prop({
    type: String,
  })
  hashedRt: string;

  @Prop({
    type: String,
  })
  currentAgency: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDoc = User & Document;

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.email = this.email.toLowerCase();
  next();
});
