import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesUserModule } from 'src/router/routes/routes.user.module';
import { AppController } from 'src/app/controllers/app.controller';
import { RoutesAuthModule } from 'src/router/routes/routes.auth.module';
import { RoutesSubscriptionModule } from './routes/routes.subscription.module';
import { RoutesFileModule } from './routes/routes.file.module';
import { RoutesPermissionModule } from './routes/routes.permission.module';
import { RoutesPageModule } from './routes/routes.page.module';
import { RoutesFetureModule } from './routes/routes.feature.module';
import { RoutesPageFetureModule } from './routes/routes.page-feature.module';
import { RoutesCountryModule } from './routes/routes.country.module';
import { RoutesRoleModule } from './routes/routes.role.module';
import { MailModule } from 'src/common/mail/mail.module';
import { RoutesUserProfileModule } from './routes/routes.user.profile.module copy';
import { FeatureGroupModule } from '../modules/feature-group/feature-group.module';
import { FeatureElementModule } from '../modules/feature-element/feature-element.module';
import { RoutesVerificationModule } from './routes/routes.verification.module';
import { RoutesAgencyModule } from './routes/routes.agency.module';
import { ValidateEmailModule } from 'src/common/validate-email/validate-email.module';
import { RoutesPerformanceModule } from './routes/routes.performance.module';
import { RoutesPageVersionHistoryModule } from './routes/routes.page.version.history.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type
      | Promise<DynamicModule>
      | ForwardReference
    )[] = [];

    imports.push(
      RoutesUserModule,
      RoutesAuthModule,
      RoutesFileModule,
      RoutesSubscriptionModule,
      RoutesPermissionModule,
      RoutesPageModule,
      RoutesFetureModule,
      RoutesPageFetureModule,
      FeatureGroupModule,
      FeatureElementModule,
      RoutesCountryModule,
      RoutesRoleModule,
      RoutesUserProfileModule,
      RoutesVerificationModule,
      MailModule,
      ValidateEmailModule,
      RoutesAgencyModule,
      RoutesPerformanceModule,
      RoutesPageVersionHistoryModule,
      NestJsRouterModule.register([
        { path: '/role', module: RoutesRoleModule },
        { path: '/user/profile', module: RoutesUserProfileModule },
        { path: '/user', module: RoutesUserModule },
        { path: '/auth', module: RoutesAuthModule },
        { path: '/file', module: RoutesFileModule },
        { path: '/subscription', module: RoutesSubscriptionModule },
        { path: '/permissions', module: RoutesPermissionModule },
        { path: '/page', module: RoutesPageModule },
        {
          path: '/page-version-history',
          module: RoutesPageVersionHistoryModule,
        },
        { path: '/feature-group', module: FeatureGroupModule },
        { path: '/feature-element', module: FeatureElementModule },
        { path: '/feature', module: RoutesFetureModule },
        { path: '/page-feature', module: RoutesPageFetureModule },
        { path: '/country', module: RoutesCountryModule },
        { path: '/verification', module: RoutesVerificationModule },
        { path: '/agency', module: RoutesAgencyModule },
        { path: '/performance', module: RoutesPerformanceModule },
      ])
    );

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [AppController],
      imports,
    };
  }
}
