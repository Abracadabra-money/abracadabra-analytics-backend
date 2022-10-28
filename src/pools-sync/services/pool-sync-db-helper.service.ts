import { Injectable } from '@nestjs/common';

import { AccountHistoryService } from '../../accounts/services/account-history.service';
import { AccountsService } from '../../accounts/services/accounts.service';
import { LoansService } from '../../loans/services/loans-service';
import { LoggerService } from '../../logger/logger.service';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { PoolFeesEarnedService } from '../../pools/services/pool-fees-earned.service';
import { PoolHistoryService } from '../../pools/services/pool-history.service';
import { PoolsService } from '../../pools/services/pools.service';

import { IAccountsHistory } from './pool-sync-task-utils.service';

@Injectable()
export class PoolSyncDbHelperService {
    constructor(
        private readonly poolsService: PoolsService,
        private readonly accountService: AccountsService,
        private readonly loansService: LoansService,
        private readonly loggerService: LoggerService,
        private readonly poolHistoryService: PoolHistoryService,
        private readonly accountHistoryService: AccountHistoryService,
        private readonly poolFeesEarnedService: PoolFeesEarnedService,
    ) {}

    public async poolReSync(pool: PoolsEntity): Promise<void> {
        const accounts = await this.accountService.readMany({ pool });

        for (const account of accounts) {
            await this.accountService.updateOne({ id: account.id }, { lastState: null });
            await this.accountHistoryService.delete(account);
            await this.loansService.delete(account);
        }

        await this.poolsService.updateOne({ id: pool.id }, { lastState: null });
        await this.poolHistoryService.delete(pool);
        await this.poolFeesEarnedService.delete(pool);
        await this.poolsService.updateOne({ id: pool.id }, { fullReSync: false });

        this.loggerService.info(`All data remove ${pool.address}`);
    }

    public async getPoolLastSyncBlock(pool: PoolsEntity): Promise<number> {
        let lastBlock: number;

        const lastPoolHistory = await this.poolHistoryService.getLastHistory({ pool });

        if (lastPoolHistory) {
            lastBlock = Number(lastPoolHistory.hash);
        }

        return lastBlock ?? Number(pool.initialBlock);
    }

    public async checkAddressInAddressesHistory(address: string, addressesHistory: IAccountsHistory, pool: PoolsEntity) {
        if (!addressesHistory[address]) {
            addressesHistory[address] = [];
        }

        if (addressesHistory[address].length === 0) {
            const account = await this.accountService.findOne(address, pool);
            if (account) {
                const lastAccountHistory = await this.accountHistoryService.getLastHistory({ account });
                if (lastAccountHistory) {
                    addressesHistory[address].push({
                        borrowPart: lastAccountHistory.borrowPart,
                        collateralShare: lastAccountHistory.collateralShare,
                        prewBorrowPart: lastAccountHistory.prewBorrowPart,
                        prewCollateralShare: lastAccountHistory.prewCollateralShare,
                        timestamp: lastAccountHistory.createdAt,
                        hash: lastAccountHistory.hash,
                        isLiquidated: lastAccountHistory.isLiquidated,
                    });
                }
            }
        }

        return addressesHistory;
    }
}
