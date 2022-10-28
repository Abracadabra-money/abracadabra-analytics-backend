import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';

import { AccountsEntity } from '../../accounts/dao/accounts.entity';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { toTokenValue } from '../../utils';

import { GetFeesDto } from '../dto/get-fees.dto';

@Injectable()
export class StatisticHelpersService {
    public poolTvl(pool: PoolsEntity): number {
        const colloratorDecimal = pool.decimals[0];
        if(!pool.lastState) return 0;
        const { totalCollateralShare } = pool.lastState;
        const { exchangeRate } = pool.lastState;

        const tcs = toTokenValue(Number(totalCollateralShare), colloratorDecimal);
        const tPrice = 1 / toTokenValue(Number(exchangeRate), colloratorDecimal);

        return tcs * tPrice;
    }

    public totalBorrowToAmount({ lastState }: PoolsEntity): number {
        if(!lastState) return 0;

        const { totalBorrow } = lastState;
        return toTokenValue(Number(totalBorrow), 18);
    }

    public borrowPartToAmount({ lastState }: AccountsEntity): number {
        if(!lastState) return 0;

        const { borrowPart } = lastState;
        return toTokenValue(Number(borrowPart), 18);
    }

    public totalCollateralShareToAmount({ lastState, decimals }: PoolsEntity): number {
        if(!lastState) return 0;
        
        const { totalCollateralShare, exchangeRate } = lastState;
        const [cauldron] = decimals;
        const tPrice = 1 / toTokenValue(Number(exchangeRate), cauldron);
        return toTokenValue(Number(totalCollateralShare), cauldron) * tPrice;
    }

    public getFeeQuary({ cauldronId, network, assetType }: GetFeesDto) {
        const quary: FindConditions<PoolsEntity> = {};
        if (cauldronId) {
            quary.id = cauldronId;
        }
        if (network) {
            quary.network = network;
        }
        if (assetType) {
            quary.assetType = assetType;
        }
        return quary;
    }
}
