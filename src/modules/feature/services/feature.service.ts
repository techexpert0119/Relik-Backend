import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from 'src/abstract/abstract.service';
import { Feature } from '../entities/feature.entity';
import { ENUM_FEATURES_COMPONENTS_TYPE } from '../constants/feature.enum.constant';

@Injectable()
export class FeatureService extends AbstractService {
  constructor(@InjectModel(Feature.name) private featureModel: Model<Feature>) {
    super(featureModel);
  }

  async getAll() {
    return this.featureModel
      .find()
      .sort({ order: 1 })
      .populate({ path: 'featureElement', select: 'elementName' })
      .exec();
  }

  async findByComponent(component: ENUM_FEATURES_COMPONENTS_TYPE) {
    return await this.featureModel.findOne({ component });
  }
}
