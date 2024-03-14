import { Controller, Get } from '@nestjs/common';
import { FeatureService } from '../services/feature.service';
import { FeatureCreateDto } from '../dtos/feature.create.dto';
import { FeatureUpdateDto } from '../dtos/feature.update.dto';
import { Feature } from '../entities/feature.entity';
import { buildController } from 'src/abstract/abstract.controller';
const BaseController = buildController({
  createDto: FeatureCreateDto,
  updateDto: FeatureUpdateDto,
  model: Feature,
  name: 'feature',
});
@Controller()
export class FeatureController extends BaseController {
  constructor(private readonly featureService: FeatureService) {
    super(featureService);
  }
  @Get()
  async getAll() {
    const res = await this.featureService.getAll();
    return { data: res };
  }
}
