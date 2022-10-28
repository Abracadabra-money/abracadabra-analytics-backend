import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';

import { ColumnNumericTransformer } from '../../utils/column-numeric-transformer';

import { PoolHistoriesEntity } from './pool-histories.entity';
import { PoolsEntity } from './pools.entity';

export const POOL_FEES_EARNED_HISTORIES_TABLE_NAME = 'pool-fees-earned-histories';

@Entity(POOL_FEES_EARNED_HISTORIES_TABLE_NAME)
export class PoolFeesEarnedHistoriesEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => PoolsEntity, (pool) => pool.history)
    @JoinColumn()
    public pool: PoolsEntity;

    @Column('text', { nullable: false })
    public borrowFees: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public borrowFeesUsd: number;

    @Column('text', { nullable: false })
    public interest: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public interestUsd: number;

    @Column('text', { nullable: false })
    public liquidationFee: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public liquidationFeeUsd: number;

    @Column('text', { nullable: false })
    public feeEarnedTotal: string;

    @Column('numeric', { nullable: false, transformer: new ColumnNumericTransformer() })
    public feeEarnedTotalUsd: number;

    @OneToOne(() => PoolHistoriesEntity, (raw) => raw.cache)
    public raw: PoolHistoriesEntity;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    @Column('timestamp', { nullable: false, default: Date.now() })
    public insertedAt: Date;
}
