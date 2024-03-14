import { QueryHandler } from '@nestjs/cqrs';
import { Query, IInferredQueryHandler } from '@nestjs-architects/typed-cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  FeatureGroup,
  FeatureGroupDoc,
} from '../entities/feature-group.entity';
import { Model } from 'mongoose';

export class GetFeatureGroupsQuery extends Query<FeatureGroupDoc[]> {
  constructor() {
    super();
  }
}

@QueryHandler(GetFeatureGroupsQuery)
export class GetFeatureGroupsQueryHandler
  implements IInferredQueryHandler<GetFeatureGroupsQuery>
{
  constructor(
    @InjectModel(FeatureGroup.name)
    private featureGroupModel: Model<FeatureGroup>
  ) {}

  async execute(): Promise<FeatureGroupDoc[]> {
    return this.featureGroupModel.find();
  }
}
