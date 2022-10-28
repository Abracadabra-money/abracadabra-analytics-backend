import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository, SelectQueryBuilder } from 'typeorm';

import { Networks } from '../../blockchain/constants';
import { AssetType } from '../../blockchain/contracts/collateral';
import { DateFilterDto } from '../../common/dao/date-filter.dto';
import { betweenDates, checkDate } from '../../utils/timestamp';

import { PoolFeesEarnedHistoriesEntity } from '../dao/pool-fees-earned.entity';
import { PoolsEntity } from '../dao/pools.entity';

@Injectable()
export class PoolFeesEarnedService {
    constructor(
        @InjectRepository(PoolFeesEarnedHistoriesEntity)
        private readonly poolFeesEarnedHistoriesRepository: Repository<PoolFeesEarnedHistoriesEntity>,
    ) {}

    public create(doc: Partial<PoolFeesEarnedHistoriesEntity>): Promise<PoolFeesEarnedHistoriesEntity> {
        const created = this.poolFeesEarnedHistoriesRepository.create(doc);
        return this.poolFeesEarnedHistoriesRepository.save(created);
    }

    public updateOne(where: Partial<PoolFeesEarnedHistoriesEntity>, doc: Partial<PoolFeesEarnedHistoriesEntity>) {
        return this.poolFeesEarnedHistoriesRepository.update(where, doc);
    }

    public getHistoryDate(pool: PoolsEntity, date?: DateFilterDto): Promise<PoolFeesEarnedHistoriesEntity[]> {
        const { from, to } = checkDate(date);
        const query: FindConditions<PoolFeesEarnedHistoriesEntity> = { pool, createdAt: betweenDates(from, to) };

        return this.poolFeesEarnedHistoriesRepository.find({ where: query, order: { createdAt: -1 } });
    }

    public async getPoolAndHistory(pool: PoolsEntity, date?: DateFilterDto) {
        const history = await this.getHistoryDate(pool, date);
        return { pool, history };
    }

    public delete(pool: PoolsEntity) {
        return this.poolFeesEarnedHistoriesRepository.delete({ pool });
    }

    public getTotalFeesGenerated(poolId?: string, network?: Networks, assetType?: AssetType, group?: 'cauldron' | 'asset' | 'network') {
        const qb = this.getPoolFeesEarnedQueryBuilder().select('SUM(pool_fees_earned.feeEarnedTotalUsd) as totalFees').where('pool.softDeleted = false');

        if (!group) {
            qb.addSelect('SUM(pool_fees_earned.borrowFeesUsd) as borrowFees')
                .addSelect('SUM(pool_fees_earned.interestUsd) as interestFees')
                .addSelect('SUM(pool_fees_earned.liquidationFeeUsd) as liquidationFee');
        }
        if (group) {
            if (group === 'asset') {
                qb.groupBy('pool.assetType').addSelect('pool.assetType as assetType');
            }

            if (group === 'cauldron') {
                qb.groupBy('pool').addSelect('pool.id as pool');
            }

            if (group === 'network') {
                qb.groupBy('pool.network').addSelect('pool.network as network');
            }
        }

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return group ? qb.getRawMany() : qb.getRawOne();
    }

    public getTotalFeesGeneratedChangesList(poolId?: string, network?: Networks, assetType?: AssetType, group?: 'cauldron' | 'asset' | 'network') {
        const qb = this.getPoolFeesEarnedQueryBuilder()
            .select("DATE_TRUNC('week', pool_fees_earned.createdAt) AS week")
            .addSelect('SUM(pool_fees_earned.feeEarnedTotalUsd) as totalFees')
            .groupBy('week')
            .orderBy('week', 'ASC');

        if (!group) {
            qb.addSelect('SUM(pool_fees_earned.borrowFeesUsd) as borrowFees')
                .addSelect('SUM(pool_fees_earned.interestUsd) as interestFees')
                .addSelect('SUM(pool_fees_earned.liquidationFeeUsd) as liquidationFee');
        }
        if (group) {
            if (group === 'asset') {
                qb.addGroupBy('pool.assetType').addSelect('pool.assetType as assetType');
            }

            if (group === 'cauldron') {
                qb.addGroupBy('pool').addSelect('pool.id as pool');
            }

            if (group === 'network') {
                qb.addGroupBy('pool.network').addSelect('pool.network as network');
            }
        }

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return qb.getRawMany();
    }

    private getPoolFeesEarnedQueryBuilder(): SelectQueryBuilder<PoolFeesEarnedHistoriesEntity> {
        return this.poolFeesEarnedHistoriesRepository.createQueryBuilder('pool_fees_earned').leftJoinAndSelect('pool_fees_earned.pool', 'pool');
    }
}
