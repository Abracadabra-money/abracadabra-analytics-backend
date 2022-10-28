import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { LoansEntity } from '../../loans/dao/loans.entity';
import { PoolsEntity } from '../../pools/dao/pools.entity';

import { AccountHistoriesEntity } from './account-histories.entity';

export const ACCOUNTS_TABLE_NAME = 'accounts';

@Entity(ACCOUNTS_TABLE_NAME)
export class AccountsEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ nullable: false, length: 42 })
    public address: string;

    @ManyToOne(() => PoolsEntity, (pool) => pool.accounts)
    @JoinColumn()
    public pool: PoolsEntity;

    @OneToOne(() => AccountHistoriesEntity, (history) => history.account)
    @JoinColumn()
    public lastState: AccountHistoriesEntity;

    @OneToMany(() => AccountHistoriesEntity, (history) => history.account)
    public history: AccountHistoriesEntity[];

    @OneToMany(() => LoansEntity, (loan) => loan.account)
    public loans: LoansEntity[];

    @Column({ default: false, nullable: false })
    public softDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;
}
