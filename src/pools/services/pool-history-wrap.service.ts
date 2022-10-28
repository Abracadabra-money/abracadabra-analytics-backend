import { Injectable } from '@nestjs/common';

import { IPoolHistory } from '../../pools-sync/services/pool-sync-task-utils.service';

import { PoolFeesEarnedDbHelperService } from './pool-fees-earned-db-helper.service';
import { PoolHistoryService } from './pool-history.service';
import { PoolsService } from './pools.service';

import { PoolHistoriesEntity } from '../dao/pool-histories.entity';
import { PoolsEntity } from '../dao/pools.entity';

@Injectable()
export class PoolHistoryWrapService {
    constructor(
        private readonly poolHistoryService: PoolHistoryService,
        private readonly poolFeesEarnedDbHelperService: PoolFeesEarnedDbHelperService,
        private readonly poolsService: PoolsService,
    ) {}

    public async saveHistories(pool: PoolsEntity, poolHistory: IPoolHistory[]) {
        for (let i = 0; i < poolHistory.length; i++) {
            const newHistory = poolHistory[i];
            const prewHistory = poolHistory[i - 1];

            let history = await this.poolHistoryService.readOne({ hash: newHistory.hash, pool });

            const doc: Partial<PoolHistoriesEntity> = {
                pool,
                exchangeRate: newHistory.exchangeRate,
                totalBorrow: newHistory.totalBorrow,
                totalCollateralShare: newHistory.totalCollateralShare,
                accrueInfo: newHistory.feesEarned,
                createdAt: newHistory.timestamp,
                updatedAt: newHistory.timestamp,
                hash: newHistory.hash,
            };

            if (!history) {
                history = await this.poolHistoryService.create(doc);
                const cache = await this.poolFeesEarnedDbHelperService.createPoolFeesEarned(prewHistory ? prewHistory.feesEarned : '0', history, pool, newHistory);
                await this.poolHistoryService.updateOne({ id: history.id }, { cache, updatedAt: history.updatedAt });
            }

            await this.poolsService.updateOne({ id: pool.id }, { lastState: history });
        }
    }
}
