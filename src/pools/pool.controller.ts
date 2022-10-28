import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PoolHandler } from './pool.handler';

@ApiTags('Pools')
@Controller('pools')
export class PoolController {
    constructor(private readonly poolHandler: PoolHandler) {}

    @Get()
    public getPools() {
        return this.poolHandler.getPools();
    }
}
