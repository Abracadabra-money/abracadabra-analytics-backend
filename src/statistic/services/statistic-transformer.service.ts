import { Injectable } from '@nestjs/common';

import { AccountsEntity } from '../../accounts/dao/accounts.entity';
import { IPagination } from '../../common/interfaces/pagination.interface';
import { LoansEntity } from '../../loans/dao/loans.entity';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { shorten } from '../../utils/shorten';

import { GetFeesChanges } from '../dto/get-fees-changes.dto';

@Injectable()
export class StatisticTransformerService {
    public toTvl(tvl: number) {
        return { tvl };
    }

    public toTotalMimBorrower(data: { cauldron: PoolsEntity; totalBorrow: number }[], group?: GetFeesChanges['group']) {
        let result = data.map(({ cauldron, totalBorrow }) => ({ pool: cauldron.id, assetType: cauldron.assetType, network: cauldron.network, totalBorrow }));
        if (group === 'network') {
            const o = {};
            for (const d of result) {
                if (o[d.network]) {
                    o[d.network].totalBorrow += d.totalBorrow;
                } else {
                    o[d.network] = d;
                }
            }
            result = Object.values(o);
        }
        if (group === 'asset') {
            const o = {};
            for (const d of result) {
                if (o[d.assetType]) {
                    o[d.assetType].totalBorrow += d.totalBorrow;
                } else {
                    o[d.assetType] = d;
                }
            }
            result = Object.values(o);
        }
        return result;
    }

    public toTotalCollateral(data: { cauldron: PoolsEntity; totalCollateralShare: number }[], group?: GetFeesChanges['group']) {
        let result = data.map(({ cauldron, totalCollateralShare }) => ({ pool: cauldron.id, assetType: cauldron.assetType, network: cauldron.network, totalCollateralShare }));
        if (group === 'network') {
            const o = {};
            for (const d of result) {
                if (o[d.network]) {
                    o[d.network].totalCollateralShare += d.totalCollateralShare;
                } else {
                    o[d.network] = d;
                }
            }
            result = Object.values(o);
        }
        if (group === 'asset') {
            const o = {};
            for (const d of result) {
                if (o[d.assetType]) {
                    o[d.assetType].totalCollateralShare += d.totalCollateralShare;
                } else {
                    o[d.assetType] = d;
                }
            }
            result = Object.values(o);
        }
        return result;
    }

    public toCount(count: number) {
        return { count };
    }

    public toAmount(amount: number) {
        return { amount };
    }

    public toPrice(price: number | string) {
        return { price };
    }

    public toLoanAtRiskWithPagination({ accounts, pagination }: { accounts: AccountsEntity[]; pagination: IPagination }) {
        return {
            pagination,
            loans: accounts.map((account) => this.toLoanAtRisk(account)),
        };
    }

    public toLoanAtRisk(account: AccountsEntity) {
        return {
            id: account.lastState.cache.id,
            address: shorten(account.address),
            pool: account.pool.name,
            ltv: Number(account.lastState.cache.ltv),
            maxLtv: Number(account.pool.maximumCollateralRatioPercent),
            value: Number(account.lastState.cache.mimBorrowedUsd),
        };
    }

    public toLiquidationLoanPagination({ loans, pagination }: { loans: LoansEntity[]; pagination: IPagination }) {
        return {
            pagination,
            loans: loans.map((loan) => this.toLiquidationLoan(loan)),
        };
    }

    public toLiquidationLoan(loan: LoansEntity) {
        return {
            id: loan.id,
            pool: loan.pool.name,
            liquidationPrice: loan.liquidationPrice,
            collateral: loan.liquidationAmountUsd,
            repaid: loan.repaidUsd,
            hash: loan.raw.hash,
            date: loan.createdAt,
            network: loan.pool.network,
        };
    }
}
