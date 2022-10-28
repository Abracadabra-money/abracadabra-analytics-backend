import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthStoreService {
    private readonly poolsSyncLastBlock: { [key: string]: number } = {};

    private readonly poolsSyncStatus: { [key: string]: boolean } = {};

    public getPoolsLastBlock() {
        return this.poolsSyncLastBlock;
    }

    public getPoolLastBlock(address: string): number {
        return this.poolsSyncLastBlock[address] ?? 0;
    }

    public setPoolLastBlock(address: string, lastBlock: number): void {
        this.poolsSyncLastBlock[address] = lastBlock;
    }

    public getPoolSyncStatus(address: string): boolean {
        const status = this.poolsSyncStatus[address];
        return status ?? false;
    }

    public setPoolSyncStatus(address: string, status: boolean): void {
        this.poolsSyncStatus[address] = status;
    }
}
