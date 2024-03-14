import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../role/entities/role.entity';
import { VerificationService } from './services/verification.service';
import { User, UserSchema } from '../user/entities/user.entity';
import { MailModule } from 'src/common/mail/mail.module';
import {
  Verification,
  VerificationSchema,
} from './entities/varification.entity';

@Module({
  imports: [
    MailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
  exports: [VerificationService],
  providers: [VerificationService],
  controllers: [],
})
export class VerificationModule {}
