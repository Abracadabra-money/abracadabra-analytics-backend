import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoolFeesEarnedHistoriesEntity } from './dao/pool-fees-earned.entity';
import { PoolHistoriesEntity } from './dao/pool-histories.entity';
import { PoolsEntity } from './dao/pools.entity';
import { PoolController } from './pool.controller';
import { PoolHandler } from './pool.handler';
import { PoolFeesEarnedDbHelperService } from './services/pool-fees-earned-db-helper.service';
import { PoolFeesEarnedService } from './services/pool-fees-earned.service';
import { PoolHistoryWrapService } from './services/pool-history-wrap.service';
import { PoolHistoryService } from './services/pool-history.service';
import { PoolTransformerService } from './services/pool-transformer.service';
import { PoolsService } from './services/pools.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([PoolsEntity, PoolHistoriesEntity, PoolFeesEarnedHistoriesEntity])],
    providers: [PoolsService, PoolHistoryService, PoolTransformerService, PoolHandler, PoolFeesEarnedService, PoolHistoryWrapService, PoolFeesEarnedDbHelperService],
    exports: [PoolsService, PoolHistoryService, PoolHistoryWrapService, PoolFeesEarnedService],
    controllers: [PoolController],
})
export class PoolsModule {}
