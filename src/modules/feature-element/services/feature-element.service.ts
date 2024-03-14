import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { FeatureElement } from '../entities/feature-element.entity';
import { Model } from 'mongoose';

@Injectable()
export class FeatureElementService extends AbstractService {
  constructor(
    @InjectModel(FeatureElement.name)
    private featureElementModel: Model<FeatureElement>
  ) {
    super(featureElementModel);
  }

  async getAll() {
    return this.featureElementModel.find();
  }
}
