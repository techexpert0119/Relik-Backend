import { Module } from '@nestjs/common';
import { SubscriptionController } from 'src/modules/subscription/controller/subscription.controller';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';

@Module({
  controllers: [SubscriptionController],
  providers: [],
  exports: [],
  imports: [SubscriptionModule],
})
export class RoutesSubscriptionModule {}
