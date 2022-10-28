import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { IsValidAddress } from '../../utils/class-validator';

import { GetLoansAtRiskDto } from './get-loans-at-risk.dto';

export class GetLiquidationsAccountDto extends GetLoansAtRiskDto {
    @ApiProperty({ required: true, type: String, description: 'Account address' })
    @IsString()
    @Length(42, 42)
    @IsValidAddress()
    public account: string;
}
