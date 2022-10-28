import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { GetFeesDto } from './get-fees.dto';

export class GetFeesChanges extends GetFeesDto {
    @ApiProperty({
        required: false,
        enum: ['cauldron', 'asset', 'network'],
    })
    @IsOptional()
    @IsString()
    @IsIn(['cauldron', 'asset', 'network'])
    public group?: 'cauldron' | 'asset' | 'network';
}
