import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';

import { networks, Networks } from '../../blockchain/constants';
import { AssetType } from '../../blockchain/contracts/collateral';
import { PaginationDto } from '../../common/dao/pagination.dto';

export class GetLoansAtRiskDto {
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

    @ApiProperty({ required: false, type: () => PaginationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationDto)
    public pagination?: PaginationDto;
}
