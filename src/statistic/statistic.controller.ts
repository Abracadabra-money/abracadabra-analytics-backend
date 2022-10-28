import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetFeesChanges } from './dto/get-fees-changes.dto';
import { GetFeesEarnedDto } from './dto/get-fees-earned.dto';
import { GetFeesDto } from './dto/get-fees.dto';
import { GetLiquidationsAccountDto } from './dto/get-liquidations-account.dto';
import { GetLoansAtRiskDto } from './dto/get-loans-at-risk.dto';
import { StatisticHandler } from './statistic.handler';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
    constructor(private readonly statisticHandler: StatisticHandler) {}

    @Get('tvl')
    public globalTvl() {
        return this.statisticHandler.globalTvl();
    }

    @Post('fees-earned')
    public getFeesEarned(@Body() body: GetFeesEarnedDto) {
        return this.statisticHandler.getFeesEarned(body);
    }

    @Get('mim-circulation')
    public getMimInCirculation() {
        return this.statisticHandler.getMimInCirculation();
    }

    @Post('fees')
    public getTotalFees(@Body() body: GetFeesChanges) {
        return this.statisticHandler.getTotalFees(body);
    }

    @Post('fees/changes')
    public getTotalFeesGeneratedChangesList(@Body() dto: GetFeesChanges) {
        return this.statisticHandler.getTotalFeesGeneratedChangesList(dto);
    }

    @Post('tvl')
    public getTvl(@Body() body: GetFeesDto) {
        return this.statisticHandler.getTvl(body);
    }

    @Post('mim-borrowed')
    public getMimBorrowed(@Body() body: GetFeesChanges) {
        return this.statisticHandler.getMimBorrowed(body);
    }

    @Post('collateraled')
    public getCollateraled(@Body() body: GetFeesChanges) {
        return this.statisticHandler.getCollateraled(body);
    }

    @Post('loans/total-open')
    public getLoansTotalOpen(@Body() body: GetFeesDto) {
        return this.statisticHandler.getLoansTotalOpen(body);
    }

    @Post('loans/size')
    public getLoansLoanSize(@Body() body: GetFeesDto) {
        return this.statisticHandler.getLoansLoanSize(body);
    }

    @Post('loans/changes')
    public getLoansOpenChangesList(@Body() dto: GetFeesChanges) {
        return this.statisticHandler.getLoansOpenChangesList(dto);
    }

    @Post('liquidations/total-number')
    public getLiquidationsTotalNumber(@Body() dto: GetFeesDto) {
        return this.statisticHandler.getLiquidationsTotalNumber(dto);
    }

    @Post('liquidations/total-value')
    public getLiquidationsTotalValue(@Body() dto: GetFeesDto) {
        return this.statisticHandler.getLiquidationsTotalValue(dto);
    }

    @Post('liquidations/total-avg-value')
    public getAvgLiquidationsTotalValue(@Body() dto: GetFeesDto) {
        return this.statisticHandler.getAvgLiquidationsTotalValue(dto);
    }

    @Post('liquidations/total-number/changes')
    public getLiquadationsChangeList(@Body() dto: GetFeesChanges) {
        return this.statisticHandler.getLiquadationsChangeList(dto);
    }

    @Post('liquidations/total-value/changes')
    public getLiquadationsValueChangeList(@Body() dto: GetFeesChanges) {
        return this.statisticHandler.getLiquadationsValueChangeList(dto);
    }

    @Post('liquidations/total-avg-value/changes')
    public getLiquadationsAvgValueChangeList(@Body() dto: GetFeesChanges) {
        return this.statisticHandler.getLiquadationsAvgValueChangeList(dto);
    }

    @Get('prices/mim')
    public getMimPrice() {
        return this.statisticHandler.getMimPrice();
    }

    @Post('liquidations/loans-at-risk')
    public loansAtRisk(@Body() dto: GetLoansAtRiskDto) {
        return this.statisticHandler.loansAtRisk(dto);
    }

    @Post('liquidations/account')
    public liquidationsAccount(@Body() dto: GetLiquidationsAccountDto) {
        return this.statisticHandler.liquidationsAccount(dto);
    }
}
