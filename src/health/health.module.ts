import { Global, Module } from '@nestjs/common';

import { HealthController } from './health.controllert';
import { HealthHandler } from './health.handler';
import { HealthStoreService } from './services/health-store.service';
import { HealthService } from './services/health.service';

@Global()
@Module({
    controllers: [HealthController],
    providers: [HealthService, HealthHandler, HealthStoreService],
    exports: [HealthService],
})
export class HealthModule {}
