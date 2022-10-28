import { addYears, subYears } from 'date-fns';
import moment from 'moment';
import { Between, FindOperator } from 'typeorm';

import { DateFilterDto } from '../common/dao/date-filter.dto';
import { TimePeriod } from '../statistic/constants/time-period.enum';

export interface ITimeReriod {
    from: Date;
    to: Date;
}

export function betweenDates(from?: Date, to?: Date): FindOperator<any> {
    if (from && !to) {
        return Between(new Date(from), addYears(new Date(from), 100));
    }

    if (!from && to) {
        return Between(subYears(new Date(to), 100), new Date(to));
    }

    return Between(new Date(from), new Date(to));
}

export function timePeriods(period: TimePeriod, date: DateFilterDto): ITimeReriod[] {
    const { from, to } = checkDate(date);
    const _from = moment(from);
    const _to = moment(to);

    const times = [];

    const duration = moment.duration(_to.diff(_from));
    const dots = durationByPeriod(duration, period);

    for (let i = 0; i < dots; i++) {
        times.push({
            from: _from.clone().add(i, getUnit(period)).toDate(),
            to: _from
                .clone()
                .add(i + 1, getUnit(period))
                .toDate(),
        });
    }

    return times;
}

export function getUnit(period: TimePeriod) {
    switch (period) {
        default: {
            return 'hour';
        }

        case TimePeriod.DAY: {
            return 'day';
        }

        case TimePeriod.MONTH: {
            return 'month';
        }
    }
}

export function durationByPeriod(duration: moment.Duration, period: TimePeriod): number {
    switch (period) {
        default: {
            return Number(duration.asHours().toFixed(0));
        }

        case TimePeriod.DAY: {
            return Number(duration.asDays().toFixed(0));
        }

        case TimePeriod.MONTH: {
            return Number(duration.asMonths().toFixed(0));
        }
    }
}

export function checkDate(date?: DateFilterDto) {
    let from = moment().add(-1, 'day').toDate();
    let to = moment().toDate();

    if (date) {
        from = new Date(date.from);
        to = new Date(date.to);
    }

    return { from, to };
}
