import { Injectable } from '@nestjs/common';

import { HealthService } from './services/health.service';

@Injectable()
export class HealthHandler {
    constructor(private readonly healthService: HealthService) {}

    public getServerStatus() {
        return this.healthService.getPoolsStatus();
    }
}
