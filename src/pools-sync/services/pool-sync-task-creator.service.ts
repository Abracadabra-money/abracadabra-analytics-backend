import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Networks, networks } from '../../blockchain/constants';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { PoolsService } from '../../pools/services/pools.service';

import { PoolSyncTaskService } from './pool-sync-task.service';

@Injectable()
export class PoolSyncTaskCreatorService {
    private isSunc = {
        [Networks.MAINNET]: false,
        [Networks.BINANCE]: false,
        [Networks.FANTOM]: false,
        [Networks.AVALANCHE]: false,
        [Networks.ARBITRUM]: false,
    }

    constructor(private readonly blockchainService: BlockchainService, private readonly poolsService: PoolsService, private readonly poolSyncTaskService: PoolSyncTaskService) {}

    @Cron(CronExpression.EVERY_5_SECONDS)
    public async createTasks() {
        for (const network of networks) {
            this.startTask(network);
        }
    }

    private async startTask(network: Networks){
        if (this.isSunc[network]) return;
        this.isSunc[network] = true;
        try {
            const provider = this.blockchainService.getProvider(network);
            const currentBlock = await provider.getBlockNumber();
            const pools = await this.poolsService.readByNetwork(network);
            for (const pool of pools) {
                await this.poolSyncTaskService.syncTask(pool, currentBlock);
            }
        } catch (err) {
            console.log(err);
        }
        this.isSunc[network] = false;
    }
}
