import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FindConditions, ILike, Repository } from 'typeorm';

import { Networks } from '../../blockchain/constants';
import { AssetType } from '../../blockchain/contracts/collateral';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../common/constants';
import { PaginationDto } from '../../common/dao/pagination.dto';
import { NOT_FOUND_ERRORS } from '../../exceptions/codes';
import { NotFoundException } from '../../exceptions/exceptions';
import { LoanOpenStatus } from '../../loans/constants';
import { PoolsEntity } from '../../pools/dao/pools.entity';

import { AccountsEntity } from '../dao/accounts.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(AccountsEntity)
        private readonly accountRepository: Repository<AccountsEntity>,
    ) {}

    public create(partial: Partial<AccountsEntity>): Promise<AccountsEntity> {
        const create = this.accountRepository.create(partial);
        return this.accountRepository.save(create);
    }

    public findOne(address: string, pool?: PoolsEntity): Promise<AccountsEntity> {
        const quary: any = { address: ILike(`%${address}%`) };

        if (pool) {
            quary.pool = pool;
        }

        return this.accountRepository.findOne(quary);
    }

    public async findOrCreate(address: string, pool: PoolsEntity): Promise<AccountsEntity> {
        const account = await this.findOne(address, pool);

        if (!account) {
            return this.create({ address, pool });
        }

        return account;
    }

    public readMany(options?: FindConditions<AccountsEntity>): Promise<AccountsEntity[]> {
        return this.accountRepository.find({ where: options, relations: ['pool', 'lastState', 'lastState.cache'] });
    }

    public getLoansAtRisk(poolId?: string, network?: Networks, assetType?: AssetType, pagination: PaginationDto = {}) {
        const { pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER } = pagination;

        const qb = this.getAccountsQuaryBuilder();

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
            .orderBy('cache.ltv', 'DESC')
            .getManyAndCount();

        return from(quaryGetMany).pipe(
            map(([accounts, total]) => ({
                accounts,
                pagination: { pageSize, pageNumber, total },
            })),
        );
    }

    public async readOrFaild(address: string, pool?: PoolsEntity): Promise<AccountsEntity> {
        const account = await this.findOne(address, pool);

        if (!account) {
            throw new NotFoundException(NOT_FOUND_ERRORS.ACCOUNT_NOT_FOUND);
        }

        return account;
    }

    public delete(account: AccountsEntity) {
        return this.accountRepository.delete({ id: account.id });
    }

    public updateOne(where: Partial<AccountsEntity>, doc: Partial<AccountsEntity>) {
        return this.accountRepository.update(where, doc);
    }

    public getAccountsWithOpenLoans(cauldronId: string, network: Networks, assetType: AssetType) {
        const qb = this.getAccountsQuaryBuilder()
            .where("account.lastState IS NOT NULL")
            .andWhere('cache.loanOpenStatus = :status', { status: LoanOpenStatus.OPEN });

        if (cauldronId) {
            qb.andWhere('pool.id = :cauldronId', { cauldronId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }
        return qb.getMany();
    }

    public getCountWithOpenLoans(cauldronId: string, network: Networks, assetType: AssetType): Promise<number> {
        const qb = this.getAccountsQuaryBuilder()
            .where("account.lastState IS NOT NULL")
            .andWhere('cache.loanOpenStatus = :status', { status: LoanOpenStatus.OPEN });
        if (cauldronId) {
            qb.andWhere('pool.id = :cauldronId', { cauldronId });
        }

        if (network) {
            qb.andWhere('pool.network = :network', { network });
        }

        if (assetType) {
            qb.andWhere('pool.assetType = :assetType', { assetType });
        }
        return qb.getCount();
    }

    private getAccountsQuaryBuilder() {
        return this.accountRepository
            .createQueryBuilder('account')
            .leftJoinAndSelect('account.pool', 'pool')
            .leftJoinAndSelect('account.lastState', 'lastState')
            .leftJoinAndSelect('lastState.cache', 'cache');
    }
}
