import { Module } from '@nestjs/common';
import { PageController } from 'src/modules/page/controller/page.controller';
import { PageModule } from 'src/modules/page/page.module';

@Module({
  controllers: [PageController],
  providers: [],
  exports: [],
  imports: [PageModule],
})
export class RoutesPageModule {}
