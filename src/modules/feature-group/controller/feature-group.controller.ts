import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { GetFeatureGroupsQuery } from '../queries/get-all-feaute-groups.query';

const controllerName = 'feature-group';

@ApiTags(controllerName)
@Controller()
export class FeatureGroupController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  public async getAll() {
    return this.queryBus.execute(new GetFeatureGroupsQuery());
  }
}
