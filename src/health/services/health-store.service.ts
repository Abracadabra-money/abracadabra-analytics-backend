import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class HealthStoreService {
    constructor(private readonly redisService: RedisService){}

    private readonly poolsSyncLastBlock: { [key: string]: number } = {};

    private readonly poolsSyncStatus: { [key: string]: boolean } = {};

    public getPoolsLastBlock() {
        return this.poolsSyncLastBlock;
    }

    public async getPoolLastBlock(address: string): Promise<number> {
        const key = this.createKey(address, `pool-last-block`);
        const state = await this.redisService.getClient().get(key); 
        return state ? Number(state) : 0;
    }

    public setPoolLastBlock(address: string, lastBlock: number) {
        const key = this.createKey(address, `pool-last-block`);
        return this.redisService.getClient().set(key, lastBlock);
    }

    public getPoolSyncStatus(address: string): boolean {
        const status = this.poolsSyncStatus[address];
        return status ?? false;
    }

    public setPoolSyncStatus(address: string, status: boolean): void {
        this.poolsSyncStatus[address] = status;
    }

    private createKey(currency: string, key: string) {
        return `${currency}-${key}`;
    }
}
