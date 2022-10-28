import { Injectable } from '@nestjs/common';
import ErrorStackParser from 'error-stack-parser';
import moment from 'moment';
import { serializeError } from 'serialize-error';
import * as StackTrace from 'stacktrace-js';

import { LogUnit } from './log-unit';

import { LevelEnum } from '../level.enum';

interface Options {
    error?: Error;
    extra?: Record<string, unknown>;
    level: LevelEnum;
    message: string;
}

const severeLogLevels: LevelEnum[] = [LevelEnum.ERROR, LevelEnum.SECURITY, LevelEnum.CRITICAL, LevelEnum.ALERT, LevelEnum.EMERGENCY];

@Injectable()
export class LogUnitFactoryService {
    public create(options: Options): LogUnit {
        const logUnit: LogUnit = {
            date: moment(),
            extra: options.extra,
            level: options.level,
            message: options.message,
        };

        if (options.error) {
            logUnit.error = serializeError(options.error);
        }

        if (options.error || severeLogLevels.includes(options.level)) {
            logUnit.stackTrace = options.error instanceof Error ? ErrorStackParser.parse(options.error) : StackTrace.getSync();
        }

        return logUnit;
    }
}
