import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';

import { AccountsEntity } from '../../accounts/dao/accounts.entity';
import { Networks } from '../../blockchain/constants';
import { AssetType } from '../../blockchain/contracts/collateral';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../common/constants';
import { PaginationDto } from '../../common/dao/pagination.dto';

import { LoanStatus, NewLoanOpened } from '../constants';
import { LoansEntity } from '../dao/loans.entity';

@Injectable()
export class LoansService {
    constructor(
        @InjectRepository(LoansEntity)
        private readonly loansEntityRepository: Repository<LoansEntity>,
    ) {}

    public create(doc: Partial<LoansEntity>): Promise<LoansEntity> {
        const created = this.loansEntityRepository.create(doc);
        return this.loansEntityRepository.save(created);
    }

    public updateOne(where: Partial<LoansEntity>, doc: Partial<LoansEntity>) {
        return this.loansEntityRepository.update(where, doc);
    }

    public delete(account: AccountsEntity) {
        return this.loansEntityRepository.delete({ account });
    }

    public getLiquidatidLoans(account: string, poolId?: string, network?: Networks, assetType?: AssetType, pagination: PaginationDto = {}) {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER } = pagination;

        const qb = this.getLoanQuaryBuilder().where("account.address ILIKE :account'", { account }).where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED });

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        const quaryGetMany = qb
            .skip(pageSize * pageNumber)
            .take(pageSize)
            .orderBy('loan.createdAt', 'DESC')
            .getManyAndCount();

        return from(quaryGetMany).pipe(
            map(([loans, total]) => ({
                loans,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public getLiquidationsTotalNumber(poolId?: string, network?: Networks, assetType?: AssetType): Observable<number> {
        const qb = this.getLoanQuaryBuilder().where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED });

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return from(qb.getCount());
    }

    public getLiquidationsTotalValue(poolId?: string, network?: Networks, assetType?: AssetType): Observable<number> {
        const qb = this.getLoanQuaryBuilder().where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED });

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        qb.select('SUM(loan.liquidationAmountUsd) as amount');

        return from(qb.getRawOne().then(({ amount }) => amount));
    }

    public getAvgLiquidationsTotalValue(poolId?: string, network?: Networks, assetType?: AssetType): Observable<number> {
        const qb = this.getLoanQuaryBuilder().where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED });

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        qb.select('AVG(loan.liquidationAmountUsd) as amount');

        return from(qb.getRawOne().then(({ amount }) => amount));
    }

    public getLiquadationsChangeList(poolId?: string, network?: Networks, assetType?: AssetType, group?: 'cauldron' | 'asset' | 'network') {
        const qb = this.getLoanQuaryBuilder()
            .where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED })
            .select("DATE_TRUNC('week', loan.createdAt) AS week")
            .addSelect('COUNT(*) as count')
            .groupBy('week')
            .orderBy('week', 'ASC');

        if (group) {
            if (group === 'asset') {
                qb.addGroupBy('pool.assetType').addSelect('pool.assetType as assetType');
            }

            if (group === 'cauldron') {
                qb.addGroupBy('pool').addSelect('pool.id as pool');
            }

            if (group === 'network') {
                qb.addGroupBy('pool.network').addSelect('pool.network as network');
            }
        }

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return qb.getRawMany();
    }

    public getLiquadationsValueChangeList(poolId?: string, network?: Networks, assetType?: AssetType, group?: 'cauldron' | 'asset' | 'network') {
        const qb = this.getLoanQuaryBuilder()
            .where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED })
            .select("DATE_TRUNC('week', loan.createdAt) AS week")
            .addSelect('SUM(loan.liquidationAmountUsd) as amount')
            .groupBy('week')
            .orderBy('week', 'ASC');

        if (group) {
            if (group === 'asset') {
                qb.addGroupBy('pool.assetType').addSelect('pool.assetType as assetType');
            }

            if (group === 'cauldron') {
                qb.addGroupBy('pool').addSelect('pool.id as pool');
            }

            if (group === 'network') {
                qb.addGroupBy('pool.network').addSelect('pool.network as network');
            }
        }

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return qb.getRawMany();
    }

    public getLiquadationsAvgValueChangeList(poolId?: string, network?: Networks, assetType?: AssetType, group?: 'cauldron' | 'asset' | 'network') {
        const qb = this.getLoanQuaryBuilder()
            .where('loan.loanStatus = :loanStatus', { loanStatus: LoanStatus.LIQUIDATED })
            .select("DATE_TRUNC('week', loan.createdAt) AS week")
            .addSelect('AVG(loan.liquidationAmountUsd) as amount')
            .groupBy('week')
            .orderBy('week', 'ASC');

        if (group) {
            if (group === 'asset') {
                qb.addGroupBy('pool.assetType').addSelect('pool.assetType as assetType');
            }

            if (group === 'cauldron') {
                qb.addGroupBy('pool').addSelect('pool.id as pool');
            }

            if (group === 'network') {
                qb.addGroupBy('pool.network').addSelect('pool.network as network');
            }
        }

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return qb.getRawMany();
    }

    public getAccountsWithOpenLoansChangesList(poolId?: string, network?: Networks, assetType?: AssetType, group?: 'cauldron' | 'asset' | 'network') {
        const qb = this.getLoanQuaryBuilder()
            .where('loan.newLoanOpened = :newLoanOpened', { newLoanOpened: NewLoanOpened.NEW_LOAN })
            .select("DATE_TRUNC('week', loan.createdAt) AS week")
            .addSelect('COUNT(*) as count')
            .groupBy('week')
            .orderBy('week', 'ASC');

        if (group) {
            if (group === 'asset') {
                qb.addGroupBy('pool.assetType').addSelect('pool.assetType as assetType');
            }

            if (group === 'cauldron') {
                qb.addGroupBy('pool').addSelect('pool.id as pool');
            }

            if (group === 'network') {
                qb.addGroupBy('pool.network').addSelect('pool.network as network');
            }
        }

        if (poolId) {
            qb.andWhere('pool.id = :poolId', { poolId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }

        return qb.getRawMany();
    }

    private getLoanQuaryBuilder() {
        return this.loansEntityRepository
            .createQueryBuilder('loan')
            .leftJoinAndSelect('loan.pool', 'pool')
            .leftJoinAndSelect('loan.account', 'account')
            .leftJoinAndSelect('loan.raw', 'raw');
    }
}
