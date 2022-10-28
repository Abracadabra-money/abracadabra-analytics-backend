import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { Networks, networks } from '../../blockchain/constants';
import { AssetType } from '../../blockchain/contracts/collateral';

export class GetFeesDto {
    @ApiProperty({
        required: true,
        type: String,
        description: 'Cauldron id',
    })
    @IsOptional()
    @IsUUID('4')
    public cauldronId: string;

    @ApiProperty({
        required: false,
        enum: networks,
        description: 'Network id',
    })
    @IsOptional()
    @IsNumber()
    @IsIn(networks)
    public network?: Networks;

    @ApiProperty({
        required: false,
        enum: [AssetType.STABLE, AssetType.NON_STABLE],
        description: 'Asset type',
    })
    @IsOptional()
    @IsNumber()
    @IsIn([AssetType.STABLE, AssetType.NON_STABLE])
    public assetType?: AssetType;
}
