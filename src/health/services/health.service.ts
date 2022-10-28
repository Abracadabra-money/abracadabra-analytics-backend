import { Injectable } from '@nestjs/common';

import { networks } from '../../blockchain/constants';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { PoolsService } from '../../pools/services/pools.service';

import { HealthStoreService } from './health-store.service';

@Injectable()
export class HealthService {
    constructor(private readonly healthStoreService: HealthStoreService, private readonly blockchainService: BlockchainService, private readonly poolsService: PoolsService) {}

    public getPoolSyncStatus(address: string) {
        return this.healthStoreService.getPoolSyncStatus(address);
    }

    public setPoolSyncStatus(address: string, status: boolean) {
        return this.healthStoreService.setPoolSyncStatus(address, status);
    }

    public setPoolLastBlock(address: string, lastBlock: number) {
        return this.healthStoreService.setPoolLastBlock(address, lastBlock);
    }

    public getPoolLastBlock(address: string) {
        return this.healthStoreService.getPoolLastBlock(address);
    }

    public getPoolsStatus() {
        return Promise.all(
            networks.map(async (network) => {
                const provider = this.blockchainService.getProvider(network);
                const currentBlock = await provider.getBlockNumber();
                const pools = await this.poolsService.readByNetwork(network);
                return {
                    currentBlock,
                    network,
                    pools: pools.map((pool) => {
                        const lastSyncBlock = this.getPoolLastBlock(pool.address);
                        const lastBlock = lastSyncBlock || Number(pool.initialBlock);
                        return {
                            name: pool.name,
                            lastSyncBlock: lastBlock,
                            needToSync: currentBlock - lastBlock,
                            syncing: this.healthStoreService.getPoolSyncStatus(pool.address),
                        };
                    }),
                };
            }),
        );
    }
}
