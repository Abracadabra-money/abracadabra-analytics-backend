import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountHistoriesEntity } from './dao/account-histories.entity';
import { AccountsEntity } from './dao/accounts.entity';
import { AccountHistoryWrapService } from './services/account-history-wrap.service';
import { AccountHistoryService } from './services/account-history.service';
import { AccountsService } from './services/accounts.service';

import { CoingeckoModule } from '../coingecko/coingecko.module';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AccountsEntity, AccountHistoriesEntity]), CoingeckoModule],
    providers: [AccountsService, AccountHistoryService, AccountHistoryWrapService],
    exports: [AccountsService, AccountHistoryService, AccountHistoryWrapService],
})
export class AccountsModule {}
