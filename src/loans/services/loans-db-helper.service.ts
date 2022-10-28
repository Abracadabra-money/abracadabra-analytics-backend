import { Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { AccountHistoriesEntity } from '../../accounts/dao/account-histories.entity';
import { AccountsEntity } from '../../accounts/dao/accounts.entity';
import { CoingeckoCurrency } from '../../coingecko/constants';
import { CoingeckoService } from '../../coingecko/services/coingecko-service';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { PoolHistoryService } from '../../pools/services/pool-history.service';
import { toTokenValue } from '../../utils';

import { LoansService } from './loans-service';

import { LiquidationStatus, LoanOpenStatus, LoanStatus, NewLoanOpened } from '../constants';
import { LoansEntity } from '../dao/loans.entity';

@Injectable()
export class LoansDbHelperService {
    constructor(private readonly poolHistoryService: PoolHistoryService, private readonly loansService: LoansService, private readonly coingeckoService: CoingeckoService) {}

    public async createLoan(accountHistory: AccountHistoriesEntity, account: AccountsEntity, pool: PoolsEntity): Promise<LoansEntity> {
        const mimPrice = await this.coingeckoService.getPrice(CoingeckoCurrency.MIM, accountHistory.createdAt).toPromise();
        const [colloratorDecimal, mimDecimal] = pool.decimals;

        const { exchangeRate } = await this.poolHistoryService.readOne({ createdAt: accountHistory.createdAt, pool });

        const collateralPrice = 1 / toTokenValue(Number(exchangeRate), colloratorDecimal);

        const collateralisedUsd = toTokenValue(Number(accountHistory.collateralShare), colloratorDecimal) * collateralPrice;

        const mimBorrowedUsd = toTokenValue(Number(accountHistory.borrowPart), mimDecimal) * Number(mimPrice);

        const ltv = collateralisedUsd > 0 ? mimBorrowedUsd / collateralisedUsd : 0;

        let liquidationStatus = LiquidationStatus.UNKNOW;
        let liquidationAmount: string;
        let liquidationAmountUsd: number;
        let liquidationPrice: number;
        let repaid: string;
        let repaidUsd: number;

        if (accountHistory.isLiquidated) {
            liquidationStatus = BigInt(accountHistory.borrowPart) > 0 ? LiquidationStatus.PARTIAL : LiquidationStatus.FULL;

            liquidationAmount = BigNumber.from(accountHistory.prewCollateralShare).sub(accountHistory.collateralShare).toString();
            liquidationAmountUsd = toTokenValue(Number(liquidationAmount), colloratorDecimal) * collateralPrice;
            repaid = BigNumber.from(accountHistory.prewBorrowPart).sub(accountHistory.borrowPart).toString();
            repaidUsd = toTokenValue(Number(repaid), mimDecimal) * Number(mimPrice);
            liquidationPrice = collateralPrice;
        }

        const data: Partial<LoansEntity> = {
            pool,
            account,
            collateralised: accountHistory.collateralShare,
            collateralisedUsd,
            mimBorrowed: accountHistory.borrowPart,
            mimBorrowedUsd,
            loanStatus: accountHistory.isLiquidated ? LoanStatus.LIQUIDATED : LoanStatus.NOT_LIQUIDATED,
            newLoanOpened:
                BigInt(accountHistory.borrowPart) > BigInt(0) && BigInt(accountHistory.prewBorrowPart) === BigInt(0) ? NewLoanOpened.NEW_LOAN : NewLoanOpened.PRE_EXISTING_LOAN,
            loanOpenStatus: BigInt(accountHistory.borrowPart) === BigInt(0) ? LoanOpenStatus.CLOSE : LoanOpenStatus.OPEN,
            ltv,
            liquidationStatus,
            liquidationAmount,
            liquidationPrice,
            liquidationAmountUsd,
            repaid,
            repaidUsd,
            createdAt: accountHistory.createdAt,
            updatedAt: accountHistory.updatedAt,
        };

        return await this.loansService.create(data);
    }
}
