import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { DateFilterDto } from '../../common/dao/date-filter.dto';

export class GetFeesEarnedDto {
    @ApiProperty({ type: () => DateFilterDto, required: false })
    @IsOptional()
    public date?: DateFilterDto;
}
