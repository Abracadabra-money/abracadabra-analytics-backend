import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';

import { LoansEntity } from '../../loans/dao/loans.entity';

import { AccountsEntity } from './accounts.entity';

export const ACCOUNT_HISTORIES_TABLE_NAME = 'account-histories';

@Entity(ACCOUNT_HISTORIES_TABLE_NAME)
export class AccountHistoriesEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => AccountsEntity, (account) => account.history)
    @JoinColumn()
    public account: AccountsEntity;

    @Column('text', { nullable: false })
    public borrowPart: string;

    @Column('text', { nullable: false })
    public collateralShare: string;

    @Column('text', { nullable: false })
    public prewBorrowPart: string;

    @Column('text', { nullable: false })
    public prewCollateralShare: string;

    @Column('text', { nullable: false })
    public hash: string;

    @Column({ default: false, nullable: false })
    public isLiquidated: boolean;

    @OneToOne(() => LoansEntity, (cache) => cache.raw)
    @JoinColumn()
    public cache: LoansEntity;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    @Column('timestamp', { nullable: false, default: Date.now() })
    public insertedAt: Date;

    public copy: boolean;
}
