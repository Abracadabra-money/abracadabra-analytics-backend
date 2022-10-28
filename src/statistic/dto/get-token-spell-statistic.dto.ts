import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { DateFilterDto } from '../../common/dao/date-filter.dto';

import { TimePeriod } from '../constants/time-period.enum';

export class GetTokenSpellStatisticDto {
    @ApiProperty({ type: () => DateFilterDto, required: false })
    @IsOptional()
    public date?: DateFilterDto;

    @ApiProperty({
        description: 'Group data for time period (1 - hour, 2 - day, 3 - month)',
        enum: [TimePeriod.HOUR, TimePeriod.DAY, TimePeriod.MONTH],
        required: false,
        default: TimePeriod.HOUR,
    })
    @IsOptional()
    @IsEnum(TimePeriod)
    public period?: TimePeriod;
}
