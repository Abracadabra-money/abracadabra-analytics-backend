import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, FindConditions } from 'typeorm';

import { Networks } from '../../blockchain/constants';
import { NOT_FOUND_ERRORS } from '../../exceptions/codes';
import { NotFoundException } from '../../exceptions/exceptions';

import { PoolsEntity } from '../dao/pools.entity';

@Injectable()
export class PoolsService {
    constructor(
        @InjectRepository(PoolsEntity)
        private readonly poolsRepository: Repository<PoolsEntity>,
    ) {}

    public read(options?: FindConditions<PoolsEntity>): Promise<PoolsEntity[]> {
        return this.poolsRepository.find({ where: options, relations: ['lastState', 'lastState.cache'] });
    }

    public readByNetwork(network: Networks): Promise<PoolsEntity[]> {
        return this.poolsRepository.find({ network });
    }

    public findOne(address: string): Promise<PoolsEntity> {
        return this.poolsRepository.findOne({ address: ILike(`%${address}%`) });
    }

    public readOne(options?: FindConditions<PoolsEntity>): Promise<PoolsEntity> {
        return this.poolsRepository.findOne(options);
    }

    public async readOrFaild(address: string): Promise<PoolsEntity> {
        const pool = await this.findOne(address);

        if (!pool) {
            throw new NotFoundException(NOT_FOUND_ERRORS.POOL_NOT_FOUND);
        }

        return pool;
    }

    public async getAddresses(network: Networks): Promise<string[]> {
        const pools = await this.poolsRepository.find({ where: { network }, select: ['address'] });
        return pools.map(({ address }) => address.toLocaleLowerCase());
    }

    public updateOne(where: Partial<PoolsEntity>, doc: Partial<PoolsEntity>) {
        return this.poolsRepository.update(where, doc);
    }
}
