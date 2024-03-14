import { QueryHandler } from '@nestjs/cqrs';
import { Query, IInferredQueryHandler } from '@nestjs-architects/typed-cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  FeatureElement,
  FeatureElementDoc,
} from '../entities/feature-element.entity';
import { Model } from 'mongoose';

export class GetFeatureElementsQuery extends Query<FeatureElementDoc[]> {
  constructor() {
    super();
  }
}

@QueryHandler(GetFeatureElementsQuery)
export class GetFeatureElementsQueryHandler
  implements IInferredQueryHandler<GetFeatureElementsQuery>
{
  constructor(
    @InjectModel(FeatureElement.name)
    private featureElementModel: Model<FeatureElement>
  ) {}

  async execute(): Promise<FeatureElementDoc[]> {
    return this.featureElementModel.find();
  }
}
