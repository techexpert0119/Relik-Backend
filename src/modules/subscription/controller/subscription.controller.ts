import { buildController } from 'src/abstract/abstract.controller';
import { SubscriptionCreateDto } from '../dtos/subscription.create.dto';
import { SubscriptionUpdateDto } from '../dtos/subscription.update.dto';
import { Subscription } from '../entities/subscription.entity';
import { Controller } from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';

const BaseController = buildController({
  createDto: SubscriptionCreateDto,
  updateDto: SubscriptionUpdateDto,
  model: Subscription,
  name: 'subscription',
});

@Controller()
export class SubscriptionController extends BaseController {
  constructor(private readonly subscriptionService: SubscriptionService) {
    super(subscriptionService);
  }
}
