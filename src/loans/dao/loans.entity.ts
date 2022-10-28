import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';

import { AccountHistoriesEntity } from '../../accounts/dao/account-histories.entity';
import { AccountsEntity } from '../../accounts/dao/accounts.entity';
import { PoolsEntity } from '../../pools/dao/pools.entity';
import { ColumnNumericTransformer } from '../../utils/column-numeric-transformer';

import { LoanOpenStatus, LoanStatus, NewLoanOpened, LiquidationStatus } from '../constants';

export const LOANS_TABLE_NAME = 'loans';

@Entity(LOANS_TABLE_NAME)
export class LoansEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => PoolsEntity, (pool) => pool.loans)
    @JoinColumn()
    public pool: PoolsEntity;

    @ManyToOne(() => AccountsEntity, (account) => account.loans)
    @JoinColumn()
    public account: AccountsEntity;

    @Column('text', { nullable: false })
    public collateralised: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public collateralisedUsd: number;

    @Column('text', { nullable: false })
    public mimBorrowed: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public mimBorrowedUsd: number;

    @Column('enum', {
        enum: LoanStatus,
        nullable: false,
        default: LoanStatus.UNKNOW,
    })
    public loanStatus: LoanStatus;

    @Column('enum', {
        enum: NewLoanOpened,
        nullable: false,
        default: NewLoanOpened.UNKNOW,
    })
    public newLoanOpened: NewLoanOpened;

    @OneToOne(() => AccountHistoriesEntity, (raw) => raw.cache)
    public raw: AccountHistoriesEntity;

    @Column('enum', {
        enum: LoanOpenStatus,
        nullable: false,
        default: LoanOpenStatus.UNKNOW,
    })
    public loanOpenStatus: LoanOpenStatus;

    @Column('enum', {
        enum: LiquidationStatus,
        nullable: false,
        default: LiquidationStatus.UNKNOW,
    })
    public liquidationStatus: LiquidationStatus;

    @Column('text', { nullable: true })
    public liquidationAmount: string;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public liquidationAmountUsd: number;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public liquidationPrice: number;

    @Column('text', { nullable: true })
    public repaid: string;

    @Column('numeric', { nullable: true, transformer: new ColumnNumericTransformer() })
    public repaidUsd: number;

    @Column('decimal', { nullable: false })
    public ltv: number;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    @Column('timestamp', { nullable: false, default: Date.now() })
    public insertedAt: Date;
}
