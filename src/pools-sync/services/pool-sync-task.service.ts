import { Injectable } from '@nestjs/common';

import { AccountHistoryWrapService } from '../../accounts/services/account-history-wrap.service';
import { AccountsService } from '../../accounts/services/accounts.service';
import { HealthService } from '../../health/services/health.service';
import { LoggerService } from '../../logger/logger.service';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { PoolHistoryWrapService } from '../../pools/services/pool-history-wrap.service';

import { PoolSyncBlockchainService } from './pool-sync-blockchain.service';
import { PoolSyncDbHelperService } from './pool-sync-db-helper.service';
import { PoolSyncTaskUtilsService } from './pool-sync-task-utils.service';

@Injectable()
export class PoolSyncTaskService {
    constructor(
        private readonly poolSyncTaskUtilsService: PoolSyncTaskUtilsService,
        private readonly healthService: HealthService,
        private readonly loggerService: LoggerService,
        private readonly poolSyncDbHelperService: PoolSyncDbHelperService,
        private readonly poolHistoryWrapService: PoolHistoryWrapService,
        private readonly accountHistoryWrapService: AccountHistoryWrapService,
        private readonly accountsService: AccountsService,
        private readonly poolSyncBlockchainService: PoolSyncBlockchainService,
    ) {}

    public async syncTask(pool: PoolsEntity, currentBlock: number): Promise<void> {
        const syncStatus = this.healthService.getPoolSyncStatus(pool.address);
        let syncLastBlock = await this.healthService.getPoolLastBlock(pool.address);
        if (!pool.canSync || syncStatus || syncLastBlock === currentBlock) return;

        this.healthService.setPoolSyncStatus(pool.address, true);
        const startTime = Date.now();

        if (pool.fullReSync) {
            await this.poolSyncDbHelperService.poolReSync(pool);
            await this.healthService.setPoolLastBlock(pool.address, 0);
            syncLastBlock = await this.healthService.getPoolLastBlock(pool.address);
        }
        const savedLastSyncBlock = await this.poolSyncDbHelperService.getPoolLastSyncBlock(pool);
        const lastBlock = savedLastSyncBlock > syncLastBlock ? savedLastSyncBlock : syncLastBlock;
        const { fromBlock, toBlock } = this.poolSyncTaskUtilsService.getSyncRate(lastBlock, currentBlock);
        if (fromBlock > toBlock) return;
        try {
            const changeData = await this.poolSyncBlockchainService.getCauldronChangeData(pool.address, pool.network, fromBlock, toBlock);
            const { poolHistory, addressesHistory } = await this.poolSyncTaskUtilsService.buildHistory(changeData, pool);
            await this.poolHistoryWrapService.saveHistories(pool, poolHistory);
            for (const address in addressesHistory) {
                const account = await this.accountsService.findOrCreate(address, pool);
                await this.accountHistoryWrapService.saveHistories(account, addressesHistory[address], pool);
            }
            this.healthService.setPoolSyncStatus(pool.address, false);
            await this.healthService.setPoolLastBlock(pool.address, toBlock);
            this.loggerService.info('Sync complete', { extra: { pool: pool.address, time: Date.now() - startTime, fromBlock, toBlock } });
        } catch (err) {
            this.healthService.setPoolSyncStatus(pool.address, false);
            this.loggerService.error('Sync failed', { extra: { pool: pool.address, fromBlock, toBlock } });
            throw err;
        }
    }
}
