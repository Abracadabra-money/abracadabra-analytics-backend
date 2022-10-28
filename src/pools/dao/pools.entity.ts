import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AccountsEntity } from '../../accounts/dao/accounts.entity';
import { Networks } from '../../blockchain/constants';
import { AssetType } from '../../blockchain/contracts/collateral';
import { LoansEntity } from '../../loans/dao/loans.entity';

import { PoolHistoriesEntity } from './pool-histories.entity';

export const POOLS_TABLE_NAME = 'pools';

export enum CauldronVer {
    UNKNOW,
    V1,
    V2,
}

@Entity(POOLS_TABLE_NAME)
export class PoolsEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: false, length: 255 })
    public name: string;

    @Column({ nullable: false, length: 42 })
    public address: string;

    @Column('enum', {
        enum: Networks,
        nullable: false,
        default: Networks.UNKNOW,
    })
    public network: Networks;

    @OneToMany(() => AccountsEntity, (account) => account.pool)
    public accounts: AccountsEntity[];

    @OneToOne(() => PoolHistoriesEntity, (history) => history.pool)
    @JoinColumn()
    public lastState: PoolHistoriesEntity;

    @OneToMany(() => PoolHistoriesEntity, (history) => history.pool)
    public history: PoolHistoriesEntity[];

    @OneToMany(() => LoansEntity, (loan) => loan.pool)
    public loans: LoansEntity[];

    @OneToMany(() => LoansEntity, (loan) => loan.pool)
    public feesEarnedHistory: LoansEntity[];

    @Column('enum', {
        enum: AssetType,
        nullable: false,
        default: AssetType.UNKNOW,
    })
    public assetType: AssetType;

    @Column('enum', {
        enum: CauldronVer,
        nullable: false,
        default: CauldronVer.UNKNOW,
    })
    public cauldronVer: CauldronVer;

    @Column('text', {
        nullable: false,
        transformer: {
            from: (value: string) => JSON.parse(value),
            to: (array: string[]) => JSON.stringify(array),
        },
    })
    public decimals: number[]; // [colorator, mim]

    @Column('double precision', { nullable: false })
    public ltv: number;

    @Column('double precision', { nullable: false })
    public interest: number;

    @Column('double precision', { nullable: false })
    public liquidationFee: number;

    @Column('double precision', { nullable: false })
    public borrowFee: number;

    @Column('double precision', { nullable: false })
    public maximumCollateralRatioPercent: number;

    @Column('double precision', { nullable: false })
    public interestPercent: number;

    @Column('double precision', { nullable: false })
    public liquidationFeePercent: number;

    @Column('double precision', { nullable: false })
    public borrowFeePercent: number;

    @Column('text', { nullable: false })
    public initialBlock: string;

    @Column({ default: false, nullable: false })
    public softDeleted: boolean;

    @Column({ default: false, nullable: false })
    public canSync: boolean;

    @Column({ default: false, nullable: false })
    public fullReSync: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
