import { appendFileSync, existsSync, mkdirSync } from 'fs';

import { Injectable, OnModuleInit } from '@nestjs/common';
import moment from 'moment';

import { FormatterService } from './formatter.service';
import { LevelEnum } from './level.enum';
import { LogUnitFactoryService } from './log-unit/log-unit-factory.service';
import { PrinterService } from './printer.service';

import { LOG_FOLDER_PATH } from '../env';

export interface ILoggerOptions {
    error?: Error;
    extra?: Record<string, unknown>;
}

@Injectable()
export class LoggerService implements OnModuleInit {
    constructor(private readonly logUnitFactoryService: LogUnitFactoryService, private readonly formatter: FormatterService, private readonly printer: PrinterService) {}

    public async onModuleInit() {
        this.checkFilder();
    }

    private checkFilder(): void {
        const exist = existsSync(LOG_FOLDER_PATH);
        if (!exist) {
            mkdirSync(LOG_FOLDER_PATH);
            this.info('Log folder was created');
        }
    }

    public alert(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.ALERT, options);
    }

    public critical(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.CRITICAL, options);
    }

    public debug(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.DEBUG, options);
    }

    public emergency(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.EMERGENCY, options);
    }

    public error(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.ERROR, options);
    }

    public info(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.INFO, options);
    }

    public notice(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.NOTICE, options);
    }

    public warning(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.WARNING, options);
    }

    public security(message: string, options?: ILoggerOptions): void {
        return this.log(message, LevelEnum.SECURITY, options);
    }

    public log(message: string, level: LevelEnum, options?: ILoggerOptions): void {
        const error = options && options.error;
        const extra = options && options.extra;

        const unit = this.logUnitFactoryService.create({ error, extra, level, message });
        const formattedUnit = this.formatter.format(unit);

        this.checkFilder();
        appendFileSync(`${LOG_FOLDER_PATH}/${moment().format('D-M-YYYY')}.log`, `\r\n${formattedUnit}`);

        this.printer.print(formattedUnit);
    }
}
