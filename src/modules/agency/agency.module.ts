import { Module, forwardRef } from '@nestjs/common';
import { AgencyService } from './services/agency.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Agency, AgencySchema } from './entities/agency.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { PageModule } from '../page/page.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Agency.name, schema: AgencySchema }]),
    PageModule,
    forwardRef(() => UserModule),
  ],
  exports: [AgencyService],
  providers: [AgencyService],
  controllers: [],
})
export class AgencyModule {}
