import { Injectable } from '@nestjs/common';
import { BigNumber } from 'nestjs-ethers';

import { BORROW_OPENING_FEE_PRECISION, DISTRIBUTION_PART, DISTRIBUTION_PRECISION, LIQUIDATION_MULTIPLIER_PRECISION } from '../../blockchain/contracts/constants';
import { LOGS_SYNC_STEP } from '../../env';
import { LoggerService } from '../../logger/logger.service';
import { CauldronVer, PoolsEntity } from '../../pools/dao/pools.entity';
import { PoolHistoryService } from '../../pools/services/pool-history.service';
import { parseInput, getAddressesFromLogs } from '../../utils';

import { IBlockData, PoolSyncBlockchainService } from './pool-sync-blockchain.service';

interface GetSyncRateResult {
    fromBlock: number;
    toBlock: number;
}

export interface IPoolHistory {
    hash: string;
    exchangeRate: string;
    totalCollateralShare: string;
    totalBorrow: string;
    feesEarned: string;
    timestamp: Date;
    liquidationFee: string;
    borrowFees: string;
    interest: string;
}

export interface IAccountHistory {
    hash: string;
    isLiquidated: boolean;
    borrowPart: string;
    collateralShare: string;
    timestamp: Date;
    prewBorrowPart: string;
    prewCollateralShare: string;
}

export interface IAccountsHistory {
    [key: string]: IAccountHistory[];
}

@Injectable()
export class PoolSyncTaskUtilsService {
    constructor(
        private readonly loggerService: LoggerService,
        private readonly poolHistoryService: PoolHistoryService,
        private readonly poolSyncBlockchainService: PoolSyncBlockchainService,
    ) {}

    public getSyncRate(lastSyncBlock: number, currentChainBlock: number) {
        const rate: GetSyncRateResult = {
            fromBlock: lastSyncBlock + 1,
            toBlock: lastSyncBlock + LOGS_SYNC_STEP,
        };

        if (rate.toBlock > currentChainBlock) {
            rate.toBlock = currentChainBlock;
        }

        return rate;
    }

    public async buildHistory(blockData: IBlockData[], pool: PoolsEntity) {
        const poolHistory: IPoolHistory[] = [];
        const addressesHistory: IAccountsHistory = {};

        const lastPoolHistory = await this.poolHistoryService.getLastHistory({ pool });

        if (lastPoolHistory) {
            poolHistory.push({
                exchangeRate: lastPoolHistory.exchangeRate,
                totalBorrow: lastPoolHistory.totalBorrow,
                feesEarned: lastPoolHistory.accrueInfo,
                totalCollateralShare: lastPoolHistory.totalCollateralShare,
                hash: lastPoolHistory.hash,
                timestamp: new Date(),
                borrowFees: '',
                interest: '',
                liquidationFee: '',
            });
        }

        for (const block of blockData) {
            const { blockNumber, timestamp, txs } = block;

            const prevPoolHistory = poolHistory[poolHistory.length - 1];

            let exchangeRate = BigNumber.from(0);
            let totalCollateralShare = BigNumber.from(0);
            let totalBorrow = BigNumber.from(0);
            const feesEarned = await this.poolSyncBlockchainService.getFeesEarned(pool.address, pool.network, pool.cauldronVer, blockNumber);
            let liquidationFee = BigNumber.from(0);
            let borrowFees = BigNumber.from(0);
            let interest = BigNumber.from(0);
            let prevFeesEarned = BigNumber.from(0);

            if (prevPoolHistory) {
                exchangeRate = BigNumber.from(prevPoolHistory.exchangeRate);
                totalCollateralShare = BigNumber.from(prevPoolHistory.totalCollateralShare);
                totalBorrow = BigNumber.from(prevPoolHistory.totalBorrow);
                prevFeesEarned = BigNumber.from(prevPoolHistory.feesEarned);
            }

            let includBorrow = false;

            for (const group of txs) {
                const { tx, logs } = group;

                if (!tx) {
                    this.loggerService.error('TX not find', { extra: { group } });
                    throw Error('Tx not find');
                }

                const isLiquidated = tx.data.slice(0, 10).toLowerCase() === '0x912860c5';

                let users: string[] = [];

                if (isLiquidated) {
                    const decodedInput = parseInput(tx);
                    const rawUsers: string[] = decodedInput.args[0];
                    users = [...new Set(rawUsers)];
                } else {
                    users = getAddressesFromLogs(logs);
                }

                let allBorrowAmount = BigNumber.from(0);

                for (const account of users) {
                    for (const log of logs) {
                        const { name, args } = log;

                        if (name === 'LogBorrow' && args.from === account) {
                            includBorrow = true;
                        }

                        if (name === 'LogRepay' && args.to === account && pool.cauldronVer === CauldronVer.V2 && isLiquidated) {
                            allBorrowAmount = allBorrowAmount.add(BigNumber.from(args.amount));
                        }
                    }

                    const [prewUserBorrow, userBorrow] = await this.poolSyncBlockchainService.accountBorrow(pool.address, pool.cauldronVer, pool.network, account, blockNumber);
                    const [prewUserCollateral, userCollateral] = await this.poolSyncBlockchainService.accountCollateral(
                        pool.address,
                        pool.cauldronVer,
                        pool.network,
                        account,
                        blockNumber,
                    );

                    if (!addressesHistory[account]) {
                        addressesHistory[account] = [];
                    }

                    addressesHistory[account].push({
                        borrowPart: userBorrow.toString(),
                        collateralShare: userCollateral.toString(),
                        prewBorrowPart: prewUserBorrow.toString(),
                        prewCollateralShare: prewUserCollateral.toString(),
                        timestamp,
                        hash: tx.hash,
                        isLiquidated,
                    });
                }

                for (const log of logs) {
                    const { name, args } = log;
                    if (name === 'LogBorrow') {
                        totalBorrow = totalBorrow.add(BigNumber.from(args.part));
                    }

                    if (name === 'LogAddCollateral') {
                        totalCollateralShare = totalCollateralShare.add(BigNumber.from(args.share));
                    }

                    if (name === 'LogRepay') {
                        totalBorrow = totalBorrow.sub(BigNumber.from(args.part));
                    }

                    if (name === 'LogRemoveCollateral') {
                        totalCollateralShare = totalCollateralShare.sub(BigNumber.from(args.share));
                    }

                    if (name === 'LogAccrue') {
                        interest = interest.add(BigNumber.from(args.accruedAmount));
                    }

                    if (name === 'LogExchangeRate') {
                        exchangeRate = args.rate;
                    }
                }

                if (pool.cauldronVer === CauldronVer.V2 && isLiquidated) {
                    const distributionAmount = allBorrowAmount
                        .mul(pool.liquidationFee)
                        .div(LIQUIDATION_MULTIPLIER_PRECISION)
                        .sub(allBorrowAmount)
                        .mul(DISTRIBUTION_PART)
                        .div(DISTRIBUTION_PRECISION);
                    liquidationFee = liquidationFee.add(distributionAmount);
                }
            }

            if (pool.cauldronVer !== CauldronVer.V1 && includBorrow) {
                borrowFees = feesEarned.sub(prevFeesEarned).sub(interest).sub(liquidationFee);
            }

            poolHistory.push({
                exchangeRate: exchangeRate.toString(),
                totalCollateralShare: totalCollateralShare.toString(),
                totalBorrow: totalBorrow.toString(),
                feesEarned: feesEarned.toString(),
                timestamp,
                hash: blockNumber.toString(),
                liquidationFee: liquidationFee.toString(),
                borrowFees: borrowFees.toString(),
                interest: interest.toString(),
            });
        }

        if (pool.cauldronVer === CauldronVer.V1) {
            for (let i = 0; i < poolHistory.length; i++) {
                const { feesEarned, totalBorrow } = poolHistory[i];

                const borrow = BigNumber.from(totalBorrow).mul(pool.borrowFee).div(BORROW_OPENING_FEE_PRECISION);
                poolHistory[i].feesEarned = BigNumber.from(feesEarned).add(borrow).toString();
            }
        }

        return {
            poolHistory,
            addressesHistory,
        };
    }
}
