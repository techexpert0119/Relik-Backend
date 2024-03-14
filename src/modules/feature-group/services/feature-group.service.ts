import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/abstract/abstract.service';
import { InjectModel } from '@nestjs/mongoose';
import { FeatureGroup } from '../entities/feature-group.entity';
import { Model } from 'mongoose';

@Injectable()
export class FeatureGroupService extends AbstractService {
  constructor(
    @InjectModel(FeatureGroup.name)
    private featureGroupModel: Model<FeatureGroup>
  ) {
    super(featureGroupModel);
  }
}
