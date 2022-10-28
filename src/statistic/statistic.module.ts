import { Module } from '@nestjs/common';

import { StatisticHelpersService } from './services/statistic-helpers.service';
import { StatisticTransformerService } from './services/statistic-transformer.service';
import { StatisticService } from './services/statistic.service';
import { StatisticController } from './statistic.controller';
import { StatisticHandler } from './statistic.handler';

@Module({
    controllers: [StatisticController],
    providers: [StatisticHandler, StatisticService, StatisticTransformerService, StatisticHelpersService],
})
export class StatisticModule {}
