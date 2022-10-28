import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoolTransformerService } from './services/pool-transformer.service';
import { PoolsService } from './services/pools.service';

@Injectable()
export class PoolHandler {
    constructor(private readonly poolTransformerService: PoolTransformerService, private readonly poolsService: PoolsService) {}

    public getPools() {
        return from(this.poolsService.read()).pipe(map((pools) => ({ pools: pools.map((pool) => this.poolTransformerService.toPool(pool)) })));
    }
}
