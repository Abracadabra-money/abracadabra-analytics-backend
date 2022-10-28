import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from './accounts/accounts.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { redisOptions } from './env';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { HealthModule } from './health/health.module';
import { LoansModule } from './loans/loans.module';
import { LoggerModule } from './logger/logger.module';
import { PoolsSyncModule } from './pools-sync/pools-sync.module';
import { PoolsModule } from './pools/pools.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
    imports: [
        ExceptionsModule,
        LoggerModule,
        TypeOrmModule.forRoot(),
        RedisModule.forRoot(redisOptions),
        PoolsModule,
        AccountsModule,
        ScheduleModule.forRoot(),
        StatisticModule,
        CoingeckoModule,
        PoolsSyncModule,
        LoansModule,
        HealthModule,
        BlockchainModule,
    ],
})
export class AppModule {}
