import { Controller, Get } from '@nestjs/common';
import { buildController } from 'src/abstract/abstract.controller';
import { FeatureElementCreateDto } from '../dtos/feature-element.create.dto';
import { FeatureElementUpdateDto } from '../dtos/feature-element.update.dto';
import { FeatureElementService } from '../services/feature-element.service';
import { FeatureElement } from '../entities/feature-element.entity';

const BaseController = buildController({
  createDto: FeatureElementCreateDto,
  updateDto: FeatureElementUpdateDto,
  model: FeatureElement,
  name: 'feature-element',
});

@Controller()
export class FeatureElementController extends BaseController {
  constructor(private readonly featureElementService: FeatureElementService) {
    super(featureElementService);
  }

  @Get()
  public async getAll() {
    const res = await this.featureElementService.getAll();
    return { data: res };
  }
}
