import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { networks } from '../../blockchain/constants';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { PoolsService } from '../../pools/services/pools.service';

import { PoolSyncTaskService } from './pool-sync-task.service';

@Injectable()
export class PoolSyncTaskCreatorService {
    private isSunc = false;

    constructor(private readonly blockchainService: BlockchainService, private readonly poolsService: PoolsService, private readonly poolSyncTaskService: PoolSyncTaskService) {}

    @Cron(CronExpression.EVERY_5_SECONDS)
    public async createTasks() {
        if (this.isSunc) return;
        this.isSunc = true;
        for (const network of networks) {
            try {
                const provider = this.blockchainService.getProvider(network);
                const currentBlock = await provider.getBlockNumber();
                const pools = await this.poolsService.readByNetwork(network);
                for (const pool of pools) {
                    await this.poolSyncTaskService.syncTask(pool, currentBlock);
                }
            } catch (err) {}
        }
        this.isSunc = false;
    }
}
