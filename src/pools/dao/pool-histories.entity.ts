import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

import { PoolFeesEarnedHistoriesEntity } from './pool-fees-earned.entity';
import { PoolsEntity } from './pools.entity';

export const POOL_HISTORIES_TABLE_NAME = 'pool-histories';

@Entity(POOL_HISTORIES_TABLE_NAME)
export class PoolHistoriesEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @ManyToOne(() => PoolsEntity, (pool) => pool.history)
    public pool: PoolsEntity;

    @Column('text', { nullable: false })
    public exchangeRate: string;

    @Column('text', { nullable: false })
    public totalBorrow: string;

    @Column('text', { nullable: false })
    public totalCollateralShare: string;

    @Column('text', { nullable: false })
    public accrueInfo: string;

    @OneToOne(() => PoolFeesEarnedHistoriesEntity, (cache) => cache.raw)
    @JoinColumn()
    public cache: PoolFeesEarnedHistoriesEntity;

    @Column('text', { nullable: false })
    public hash: string;

    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt: Date;

    @Column('timestamp', { nullable: false, default: Date.now() })
    public insertedAt: Date;
}
