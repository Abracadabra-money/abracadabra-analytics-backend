import * as moment from 'moment';
import { ErrorObject } from 'serialize-error';
import * as StackTrace from 'stacktrace-js';

import { LevelEnum } from '../level.enum';

export interface LogUnit {
    date: moment.Moment;
    error?: ErrorObject;
    extra: Record<string, unknown>;
    level: LevelEnum;
    message: string;
    stackTrace?: StackTrace.StackFrame[];
}
