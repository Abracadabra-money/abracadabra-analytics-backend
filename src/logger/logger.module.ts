import { Global, Module } from '@nestjs/common';

import { FormatterService } from './formatter.service';
import { LogUnitFactoryService } from './log-unit/log-unit-factory.service';
import { LoggerService } from './logger.service';
import { PrinterService } from './printer.service';

const PROVIDERS = [LoggerService, FormatterService, LogUnitFactoryService, PrinterService];

@Global()
@Module({
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class LoggerModule {}
