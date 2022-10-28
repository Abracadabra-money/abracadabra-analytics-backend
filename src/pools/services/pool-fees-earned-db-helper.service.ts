import { Injectable } from '@nestjs/common';

import { CoingeckoCurrency } from '../../coingecko/constants';
import { CoingeckoService } from '../../coingecko/services/coingecko-service';
import { IPoolHistory } from '../../pools-sync/services/pool-sync-task-utils.service';
import { toTokenValue } from '../../utils';

import { PoolFeesEarnedService } from './pool-fees-earned.service';

import { PoolFeesEarnedHistoriesEntity } from '../dao/pool-fees-earned.entity';
import { PoolHistoriesEntity } from '../dao/pool-histories.entity';
import { PoolsEntity } from '../dao/pools.entity';

@Injectable()
export class PoolFeesEarnedDbHelperService {
    constructor(private readonly coingeckoService: CoingeckoService, private readonly poolFeesEarnedService: PoolFeesEarnedService) {}

    public async createPoolFeesEarned(prevAccrueInfo: string, raw: PoolHistoriesEntity, pool: PoolsEntity, state: IPoolHistory): Promise<PoolFeesEarnedHistoriesEntity> {
        const { liquidationFee, borrowFees, interest } = state;

        const mimPrice = await this.coingeckoService.getPrice(CoingeckoCurrency.MIM, raw.createdAt).toPromise();

        const prevAccrueInfoValue = BigInt(prevAccrueInfo);
        const accrueInfoValue = BigInt(raw.accrueInfo);

        const feeEarnedTotal = accrueInfoValue >= prevAccrueInfoValue ? (accrueInfoValue - prevAccrueInfoValue).toString() : accrueInfoValue.toString();

        const liquidationFeeUsd = toTokenValue(Number(liquidationFee), pool.decimals[1]) * Number(mimPrice);

        const feeEarnedTotalUsd = Number(feeEarnedTotal) * Math.pow(10, -18) * Number(mimPrice);

        const borrowFeesUsd = toTokenValue(Number(borrowFees), pool.decimals[1]) * Number(mimPrice);

        const interestUsd = toTokenValue(Number(interest), pool.decimals[1]) * Number(mimPrice);

        const data = {
            borrowFees,
            borrowFeesUsd,
            interest,
            interestUsd,
            liquidationFeeUsd,
            liquidationFee,
            feeEarnedTotal,
            feeEarnedTotalUsd,
            pool,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        };

        return await this.poolFeesEarnedService.create(data);
    }
}
