import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository, Any } from 'typeorm';

import { DateFilterDto } from '../../common/dao/date-filter.dto';
import { betweenDates, checkDate } from '../../utils/timestamp';

import { AccountHistoriesEntity } from '../dao/account-histories.entity';
import { AccountsEntity } from '../dao/accounts.entity';

@Injectable()
export class AccountHistoryService {
    constructor(
        @InjectRepository(AccountHistoriesEntity)
        private readonly accountHistoriesRepository: Repository<AccountHistoriesEntity>,
    ) {}

    public create(doc: Partial<AccountHistoriesEntity>): Promise<AccountHistoriesEntity> {
        const created = this.accountHistoriesRepository.create(doc);
        return this.accountHistoriesRepository.save(created);
    }

    public readOne(partial: Partial<AccountHistoriesEntity>) {
        return this.accountHistoriesRepository.findOne({ where: partial, relations: ['cache'] });
    }

    public async getAccountAndHistory(account: AccountsEntity, date?: DateFilterDto) {
        let history = await this.getHistoryDate(account, date);
        history = await this.checkForEmpty(account, history, date);
        return { account, history };
    }

    private async checkForEmpty(account: AccountsEntity, history: AccountHistoriesEntity[], date?: DateFilterDto) {
        if (history.length === 0) {
            const { from } = checkDate(date);

            const query: FindConditions<AccountHistoriesEntity> = { account, createdAt: betweenDates(null, from) };

            const lastHistory = await this.getLastHistory(query);

            if (lastHistory) {
                lastHistory.createdAt = new Date(from.getTime() + 10);
                lastHistory.copy = true;
                history.push(lastHistory);
            }
        }

        return history;
    }

    public getHistoryDate(account: AccountsEntity, date?: DateFilterDto) {
        const { from, to } = checkDate(date);
        const query: FindConditions<AccountHistoriesEntity> = { account, createdAt: betweenDates(from, to) };

        return this.accountHistoriesRepository.find({ where: query, order: { createdAt: -1 } });
    }

    public async getLastHistory(partial: FindConditions<AccountHistoriesEntity>) {
        const history = await this.accountHistoriesRepository.find({ where: partial, take: 1, order: { insertedAt: -1 } });
        return history[0];
    }

    public updateOne(where: Partial<AccountHistoriesEntity>, doc: Partial<AccountHistoriesEntity>) {
        return this.accountHistoriesRepository.update(where, doc);
    }

    public getAllLiqudate(account: AccountsEntity[], blockNumber: string) {
        const accountIds = account.map((a) => a.id);
        return this.accountHistoriesRepository.find({ where: { account: Any(accountIds), blockNumber, isLiquidated: true } });
    }

    public delete(account: AccountsEntity) {
        return this.accountHistoriesRepository.delete({ account });
    }
}
