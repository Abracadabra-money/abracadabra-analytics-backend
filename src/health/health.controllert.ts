import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthHandler } from './health.handler';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(private readonly healthHandler: HealthHandler) {}

    @Get('status')
    public getServerStatus() {
        return this.healthHandler.getServerStatus();
    }
}
