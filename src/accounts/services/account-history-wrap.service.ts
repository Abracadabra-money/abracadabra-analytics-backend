import { Injectable } from '@nestjs/common';

import { LoansDbHelperService } from '../../loans/services/loans-db-helper.service';
import { IAccountHistory } from '../../pools-sync/services/pool-sync-task-utils.service';
import { PoolsEntity } from '../../pools/dao/pools.entity';

import { AccountHistoryService } from './account-history.service';
import { AccountsService } from './accounts.service';

import { AccountHistoriesEntity } from '../dao/account-histories.entity';
import { AccountsEntity } from '../dao/accounts.entity';

@Injectable()
export class AccountHistoryWrapService {
    constructor(
        private readonly accountHistoryService: AccountHistoryService,
        private readonly loansDbHelperService: LoansDbHelperService,
        private readonly accountsService: AccountsService,
    ) {}

    public async saveHistories(account: AccountsEntity, histories: IAccountHistory[], pool: PoolsEntity) {
        for (const newHistory of histories) {
            let history = await this.accountHistoryService.readOne({ hash: newHistory.hash, account });

            const doc: Partial<AccountHistoriesEntity> = {
                hash: newHistory.hash,
                borrowPart: newHistory.borrowPart,
                collateralShare: newHistory.collateralShare,
                account,
                createdAt: newHistory.timestamp,
                updatedAt: newHistory.timestamp,
                prewBorrowPart: newHistory.prewBorrowPart,
                prewCollateralShare: newHistory.prewCollateralShare,
                isLiquidated: newHistory.isLiquidated,
            };

            if (!history) {
                history = await this.accountHistoryService.create(doc);
                const cache = await this.loansDbHelperService.createLoan(history, account, pool);
                await this.accountHistoryService.updateOne({ id: history.id }, { cache, updatedAt: history.updatedAt });
            }

            await this.accountsService.updateOne({ id: account.id }, { lastState: history });
        }
    }
}
