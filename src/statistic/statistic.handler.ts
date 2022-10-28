import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { GetFeesChanges } from './dto/get-fees-changes.dto';
import { GetFeesEarnedDto } from './dto/get-fees-earned.dto';
import { GetFeesDto } from './dto/get-fees.dto';
import { GetLiquidationsAccountDto } from './dto/get-liquidations-account.dto';
import { GetLoansAtRiskDto } from './dto/get-loans-at-risk.dto';
import { StatisticTransformerService } from './services/statistic-transformer.service';
import { StatisticService } from './services/statistic.service';

@Injectable()
export class StatisticHandler {
    constructor(private readonly statisticService: StatisticService, private readonly statisticTransformerService: StatisticTransformerService) {}

    public globalTvl() {
        return this.statisticService.globalTvl();
    }

    public getFeesEarned(dto: GetFeesEarnedDto) {
        return this.statisticService.getFeesEarned(dto.date);
    }

    public getMimInCirculation() {
        return this.statisticService.getMimInCirculation();
    }

    public getTotalFees(dto: GetFeesChanges) {
        return this.statisticService.getTotalFees(dto);
    }

    public getTotalFeesGeneratedChangesList(dto: GetFeesChanges) {
        return this.statisticService.getTotalFeesGeneratedChangesList(dto);
    }

    public getTvl(dto: GetFeesDto) {
        return this.statisticService.getTvl(dto).pipe(map((tvl) => this.statisticTransformerService.toTvl(tvl)));
    }

    public getMimBorrowed({ group, ...dto }: GetFeesChanges) {
        return this.statisticService.getTotalMimBorrower(dto).pipe(map((data) => this.statisticTransformerService.toTotalMimBorrower(data, group)));
    }

    public getCollateraled({ group, ...dto }: GetFeesChanges) {
        return this.statisticService.getTotalCollateral(dto).pipe(map((data) => this.statisticTransformerService.toTotalCollateral(data, group)));
    }

    public getLoansTotalOpen(dto: GetFeesDto) {
        return this.statisticService.getLoansTotalOpen(dto).pipe(map((count) => this.statisticTransformerService.toCount(count)));
    }

    public getLoansLoanSize(dto: GetFeesDto) {
        return this.statisticService.getLoansLoanSize(dto).pipe(map((size) => this.statisticTransformerService.toAmount(size)));
    }

    public getLoansOpenChangesList(dto: GetFeesChanges) {
        return this.statisticService.getLoansOpenChangesList(dto);
    }

    public getLiquidationsTotalNumber(dto: GetFeesDto) {
        return this.statisticService.getLiquidationsTotalNumber(dto).pipe(map((count) => this.statisticTransformerService.toCount(count)));
    }

    public getLiquidationsTotalValue(dto: GetFeesDto) {
        return this.statisticService.getLiquidationsTotalValue(dto).pipe(map((count) => this.statisticTransformerService.toAmount(count)));
    }

    public getAvgLiquidationsTotalValue(dto: GetFeesDto) {
        return this.statisticService.getAvgLiquidationsTotalValue(dto).pipe(map((count) => this.statisticTransformerService.toAmount(count)));
    }

    public getLiquadationsChangeList(dto: GetFeesChanges) {
        return this.statisticService.getLiquadationsChangeList(dto);
    }

    public getLiquadationsValueChangeList(dto: GetFeesChanges) {
        return this.statisticService.getLiquadationsValueChangeList(dto);
    }

    public getLiquadationsAvgValueChangeList(dto: GetFeesChanges) {
        return this.statisticService.getLiquadationsAvgValueChangeList(dto);
    }

    public getMimPrice() {
        return this.statisticService.getMimPrice().pipe(map((price) => this.statisticTransformerService.toPrice(price)));
    }

    public loansAtRisk(dto: GetLoansAtRiskDto) {
        return this.statisticService.loansAtRisk(dto).pipe(map((data) => this.statisticTransformerService.toLoanAtRiskWithPagination(data)));
    }

    public liquidationsAccount(dto: GetLiquidationsAccountDto) {
        return this.statisticService.liquidationsAccount(dto).pipe(map((data) => this.statisticTransformerService.toLiquidationLoanPagination(data)));
    }
}
