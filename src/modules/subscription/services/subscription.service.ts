import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from '../entities/subscription.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubscriptionService extends AbstractService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>
  ) {
    super(subscriptionModel);
  }
}
