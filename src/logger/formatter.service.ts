import { Injectable } from '@nestjs/common';

import { LogUnit } from './log-unit/log-unit';

@Injectable()
export class FormatterService {
    public format(logUnit: LogUnit): string {
        return JSON.stringify(logUnit);
    }
}
