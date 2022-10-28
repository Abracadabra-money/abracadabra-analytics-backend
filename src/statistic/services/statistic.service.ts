import { Injectable } from '@nestjs/common';
import { BigNumber, utils } from 'ethers';
import { combineLatest, from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { AccountsService } from '../../accounts/services/accounts.service';
import { Networks } from '../../blockchain/constants';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { DateFilterDto } from '../../common/dao/date-filter.dto';
import { LoansService } from '../../loans/services/loans-service';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { PoolFeesEarnedService } from '../../pools/services/pool-fees-earned.service';
import { PoolsService } from '../../pools/services/pools.service';
import { toTokenValue } from '../../utils/blockchain';
import { checkDate } from '../../utils/timestamp';

import { StatisticHelpersService } from './statistic-helpers.service';

import { GetFeesChanges } from '../dto/get-fees-changes.dto';
import { GetFeesDto } from '../dto/get-fees.dto';
import { GetLiquidationsAccountDto } from '../dto/get-liquidations-account.dto';
import { GetLoansAtRiskDto } from '../dto/get-loans-at-risk.dto';

@Injectable()
export class StatisticService {
    constructor(
        private readonly poolsService: PoolsService,
        private readonly poolFeesEarnedService: PoolFeesEarnedService,
        private readonly blockchainService: BlockchainService,
        private readonly statisticHelpersService: StatisticHelpersService,
        private readonly accountsService: AccountsService,
        private readonly loansService: LoansService,
    ) {}

    public globalTvl() {
        const networks = [Networks.MAINNET, Networks.FANTOM, Networks.AVALANCHE, Networks.ARBITRUM, Networks.BINANCE];

        return combineLatest(networks.map((network) => this.getNetworkTvl(network))).pipe(
            map((infos) => {
                const data = {
                    tvl: infos.map(({ tvl }) => tvl).reduce((a, b) => a + b, 0),
                    networks: {},
                };

                for (let i = 0; i < infos.length; i++) {
                    data.networks[infos[i].network] = infos[i].tvl;
                }

                return data;
            }),
        );
    }

    private getNetworkTvl(network: Networks) {
        return from(this.poolsService.read({ network })).pipe(
            mergeMap((pools) => combineLatest(pools.map((pool) => from(this.getPoolTvl(pool))))),
            map((tvls) => tvls.reduce((a, b) => a + b, 0)),
            map((tvl) => ({ network, tvl })),
        );
    }

    private async getPoolTvl(pool: PoolsEntity) {
        const cauldron = this.blockchainService.getCauldron(pool.address, pool.network, pool.cauldronVer);
        const colloratorDecimal = pool.decimals[0];
        const totalCollateralShare = await cauldron.totalCollateralShare();
        const exchangeRate = await cauldron.exchangeRate();

        const tcs = toTokenValue(Number(totalCollateralShare), colloratorDecimal);
        const tPrice = 1 / toTokenValue(Number(exchangeRate), colloratorDecimal);

        return tcs * tPrice;
    }

    public getFeesEarned(date?: DateFilterDto) {
        const checkedDate = checkDate(date);

        return from(this.poolsService.read()).pipe(
            mergeMap((pools) => Promise.all(pools.map((pool) => this.poolFeesEarnedService.getPoolAndHistory(pool, checkedDate)))),
            map((infos) =>
                infos.map(({ pool, history }) => {
                    const fees = history.map(({ feeEarnedTotal }) => feeEarnedTotal);
                    const info = { address: pool.address, network: pool.network };
                    const feesEarned = fees.reduce((a, b) => BigNumber.from(a).add(BigNumber.from(b)), BigNumber.from(0));

                    return {
                        feesEarned: feesEarned.toString(),
                        ...info,
                    };
                }),
            ),
            map((infos) => {
                const fees = infos.map(({ feesEarned }) => feesEarned);
                const total = fees.reduce((a, b) => BigNumber.from(a).add(BigNumber.from(b)), BigNumber.from(0));

                return {
                    totalFeesEarned: total.toString(),
                    pools: infos,
                };
            }),
        );
    }

    public getMimInCirculation() {
        return from(this.poolsService.read()).pipe(
            mergeMap((pools) => Promise.all(pools.map((pool) => this.getPoolMimCirculation(pool)))),
            map((amounts) => amounts.reduce((a, b) => a.add(b), BigNumber.from(0))),
            map((amount) => ({ circulation: amount.toString() })),
        );
    }

    private async getPoolMimCirculation(pool: PoolsEntity): Promise<BigNumber> {
        const poolContract = this.blockchainService.getCauldron(pool.address, pool.network, pool.cauldronVer);
        const { base } = await poolContract.totalBorrow();
        return base;
    }

    public async getTotalFees({ cauldronId, network, assetType, group }: GetFeesChanges) {
        return this.poolFeesEarnedService.getTotalFeesGenerated(cauldronId, network, assetType, group);
    }

    public async getTotalFeesGeneratedChangesList({ cauldronId, network, assetType, group }: GetFeesChanges) {
        return this.poolFeesEarnedService.getTotalFeesGeneratedChangesList(cauldronId, network, assetType, group);
    }

    public async getLoansOpenChangesList({ cauldronId, network, assetType, group }: GetFeesChanges) {
        return this.loansService.getAccountsWithOpenLoansChangesList(cauldronId, network, assetType, group);
    }

    public getTvl(dto: GetFeesDto): Observable<number> {
        const quary = this.statisticHelpersService.getFeeQuary(dto);
        return from(this.poolsService.read(quary)).pipe(
            map((cauldrons) => cauldrons.map((cauldron) => this.statisticHelpersService.poolTvl(cauldron))),
            map((tvls) => tvls.reduce((a, b) => a + b, 0)),
        );
    }

    public getTotalMimBorrower(dto: GetFeesChanges) {
        const quary = this.statisticHelpersService.getFeeQuary(dto);
        return from(this.poolsService.read(quary)).pipe(
            map((cauldrons) =>
                cauldrons.map((cauldron) => ({
                    cauldron,
                    totalBorrow: this.statisticHelpersService.totalBorrowToAmount(cauldron),
                })),
            ),
        );
    }

    public getTotalCollateral(dto: GetFeesChanges) {
        const quary = this.statisticHelpersService.getFeeQuary(dto);
        return from(this.poolsService.read(quary)).pipe(
            map((cauldrons) =>
                cauldrons.map((cauldron) => ({
                    cauldron,
                    totalCollateralShare: this.statisticHelpersService.totalCollateralShareToAmount(cauldron),
                })),
            ),
        );
    }

    public getLoansTotalOpen({ cauldronId, network, assetType }: GetFeesDto): Observable<number> {
        return from(this.accountsService.getCountWithOpenLoans(cauldronId, network, assetType));
    }

    public getLoansLoanSize({ cauldronId, network, assetType }: GetFeesDto): Observable<number> {
        return from(this.accountsService.getAccountsWithOpenLoans(cauldronId, network, assetType)).pipe(
            map((accounts) => accounts.map((account) => this.statisticHelpersService.borrowPartToAmount(account))),
            map((borrows) => borrows.reduce((a, b) => a + b, 0) / borrows.length),
        );
    }

    public getLiquidationsTotalNumber({ cauldronId, network, assetType }: GetFeesDto) {
        return this.loansService.getLiquidationsTotalNumber(cauldronId, network, assetType);
    }

    public getLiquidationsTotalValue({ cauldronId, network, assetType }: GetFeesDto) {
        return this.loansService.getLiquidationsTotalValue(cauldronId, network, assetType);
    }

    public getAvgLiquidationsTotalValue({ cauldronId, network, assetType }: GetFeesDto) {
        return this.loansService.getAvgLiquidationsTotalValue(cauldronId, network, assetType);
    }

    public getLiquadationsChangeList({ cauldronId, network, assetType, group }: GetFeesChanges) {
        return this.loansService.getLiquadationsChangeList(cauldronId, network, assetType, group);
    }

    public getLiquadationsValueChangeList({ cauldronId, network, assetType, group }: GetFeesChanges) {
        return this.loansService.getLiquadationsValueChangeList(cauldronId, network, assetType, group);
    }

    public getLiquadationsAvgValueChangeList({ cauldronId, network, assetType, group }: GetFeesChanges) {
        return this.loansService.getLiquadationsAvgValueChangeList(cauldronId, network, assetType, group);
    }

    public getMimPrice(): Observable<string> {
        const mimContract = this.blockchainService.getMimPriceContract();
        return from(mimContract.latestAnswer()).pipe(map((price) => utils.formatUnits(price, 8)));
    }

    public loansAtRisk({ cauldronId, network, assetType, pagination }: GetLoansAtRiskDto) {
        return this.accountsService.getLoansAtRisk(cauldronId, network, assetType, pagination);
    }

    public liquidationsAccount({ cauldronId, network, assetType, pagination, account }: GetLiquidationsAccountDto) {
        return this.loansService.getLiquidatidLoans(account, cauldronId, network, assetType, pagination);
    }
}
