import { Module } from '@nestjs/common';
import { SubscriptionService } from './services/subscription.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionSchema,
} from './entities/subscription.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  exports: [SubscriptionService],
  providers: [SubscriptionService],
  controllers: [],
})
export class SubscriptionModule {}
