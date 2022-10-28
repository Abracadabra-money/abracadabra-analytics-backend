import { Injectable } from '@nestjs/common';

import { PoolsEntity } from '../dao/pools.entity';
import { toTokenValue } from '../../utils';

@Injectable()
export class PoolTransformerService {
    public toPool(pool: PoolsEntity) {
        return {
            id: pool.id,
            name: pool.name,
            address: pool.address,
            network: pool.network,
            assetType: pool.assetType,
            liquidationFee: pool.liquidationFeePercent,
            borrowFee: pool.borrowFeePercent,
            interest: pool.interestPercent,
            totalBorrowed: pool.lastState ? toTokenValue(parseInt(pool.lastState.totalBorrow), 18): 0,
            totalCollaterel: pool.lastState ? toTokenValue(parseInt(pool.lastState.totalCollateralShare), pool.decimals[0]): 0,
        };
    }
}
