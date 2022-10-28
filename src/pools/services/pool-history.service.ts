import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';

import { DateFilterDto } from '../../common/dao/date-filter.dto';
import { PaginationDto } from '../../common/dao/pagination.dto';
import { TimePeriod } from '../../statistic/constants/time-period.enum';
import { betweenDates, checkDate, durationByPeriod, getUnit } from '../../utils/timestamp';

import { PoolHistoriesEntity } from '../dao/pool-histories.entity';
import { PoolsEntity } from '../dao/pools.entity';

@Injectable()
export class PoolHistoryService {
    constructor(
        @InjectRepository(PoolHistoriesEntity)
        private readonly poolHistoriesRepository: Repository<PoolHistoriesEntity>,
    ) {}

    public create(doc: Partial<PoolHistoriesEntity>): Promise<PoolHistoriesEntity> {
        const created = this.poolHistoriesRepository.create(doc);
        return this.poolHistoriesRepository.save(created);
    }

    public getHistory(pool: PoolsEntity, pagination: PaginationDto = {}, date?: DateFilterDto) {
        const { pageSize = 100, pageNumber = 0 } = pagination;

        let query: FindConditions<PoolHistoriesEntity> = { pool };

        if (date) {
            query = Object.assign(query, { createdAt: betweenDates(date.from, date.to) });
        }

        const condition: FindManyOptions<PoolHistoriesEntity> = {
            where: query,
            skip: pageSize * pageNumber,
            take: pageSize,
            order: { createdAt: -1 },
        };

        return from(this.poolHistoriesRepository.findAndCount(condition)).pipe(
            map(([histories, total]) => ({
                histories,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public getHistoryDate(pool: PoolsEntity, date?: DateFilterDto): Promise<PoolHistoriesEntity[]> {
        const { from, to } = checkDate(date);
        const query: FindConditions<PoolHistoriesEntity> = { pool, createdAt: betweenDates(from, to) };

        return this.poolHistoriesRepository.find({ where: query, order: { createdAt: -1 } });
    }

    public async getPoolAndHistory(pool: PoolsEntity, date?: DateFilterDto, period?: TimePeriod) {
        let history = await this.getHistoryDate(pool, date);

        history = await this.checkForEmpty(pool, history, date);

        if (period) {
            history = await this.integrityCheck(pool, history, date, period);
        }

        return { pool, history };
    }

    private async checkForEmpty(pool: PoolsEntity, history: PoolHistoriesEntity[], date?: DateFilterDto) {
        if (history.length === 0) {
            const { from } = checkDate(date);

            const query: FindConditions<PoolHistoriesEntity> = { pool, createdAt: betweenDates(null, from) };

            const lastHistory = await this.getLastHistory(query);

            if (lastHistory) {
                lastHistory.createdAt = new Date(from.getTime() + 10);
                history.push(lastHistory);
            }
        }

        return history;
    }

    private async integrityCheck(pool: PoolsEntity, history: PoolHistoriesEntity[], date?: DateFilterDto, period: TimePeriod = TimePeriod.HOUR) {
        let { from, to } = checkDate(date);

        const fullHistory: PoolHistoriesEntity[] = [];

        const firstHistory = await this.getFirstHistory({ pool });

        if (!firstHistory) {
            return [];
        }

        from = from.getTime() > firstHistory.createdAt.getTime() ? new Date(firstHistory.createdAt) : from;

        const units = getUnit(period);

        for (let i = 0; i < history.length; i++) {
            const _history = history[i];

            if (i === 0) {
                const duration = moment.duration(moment(_history.createdAt).diff(from));
                const value = durationByPeriod(duration, period);

                for (let j = 0; j < Math.abs(value); j++) {
                    fullHistory.push({
                        ..._history,
                        createdAt: moment(from).clone().add(j, units).toDate(),
                    });
                }
            }

            if (i === history.length - 1) {
                const duration = moment.duration(moment(to).diff(_history.createdAt));
                const value = durationByPeriod(duration, period);

                for (let j = 0; j < Math.abs(value); j++) {
                    fullHistory.push({
                        ..._history,
                        createdAt: moment(_history.createdAt).clone().add(j, units).toDate(),
                    });
                }
            }

            const prevHistory = history[i - 1];

            if (prevHistory) {
                const duration = moment.duration(moment(_history.createdAt).diff(moment(prevHistory.createdAt)));
                const value = durationByPeriod(duration, period);

                for (let j = 0; j < Math.abs(value); j++) {
                    fullHistory.push({
                        ..._history,
                        createdAt: moment(prevHistory.createdAt).clone().add(j, units).toDate(),
                    });
                }
            }

            fullHistory.push(_history);
        }

        return fullHistory;
    }

    public async getLastHistory(partial: FindConditions<PoolHistoriesEntity>) {
        const history = await this.poolHistoriesRepository.find({ where: partial, take: 1, order: { insertedAt: -1 } });
        return history[0];
    }

    public async getFirstHistory(partial: FindConditions<PoolHistoriesEntity>) {
        const history = await this.poolHistoriesRepository.find({ where: partial, take: 1, order: { createdAt: 1 } });
        return history[0];
    }

    public readOne(partial: Partial<PoolHistoriesEntity>) {
        return this.poolHistoriesRepository.findOne({ where: partial, relations: ['cache'] });
    }

    public updateOne(where: Partial<PoolHistoriesEntity>, doc: Partial<PoolHistoriesEntity>) {
        return this.poolHistoriesRepository.update(where, doc);
    }

    public delete(pool: PoolsEntity) {
        return this.poolHistoriesRepository.delete({ pool });
    }
}
