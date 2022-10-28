import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class DateFilterDto {
    @ApiProperty({
        type: Date,
        description: 'Date from',
        example: '2021-11-09T08:25:15.611Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    public from?: Date;

    @ApiProperty({
        type: Date,
        description: 'Date to',
        example: '2021-11-10T08:25:15.617Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    public to?: Date;
}
