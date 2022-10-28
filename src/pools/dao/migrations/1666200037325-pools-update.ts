import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';
import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolsUpdate1666200037325 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" ADD "last_state_id" uuid;
            ALTER TABLE "${POOLS_TABLE_NAME}" ADD CONSTRAINT "${POOL_HISTORIES_TABLE_NAME}_id_fkey" FOREIGN KEY ("last_state_id") REFERENCES "${POOL_HISTORIES_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" DROP CONSTRAINT "${POOL_HISTORIES_TABLE_NAME}_id_fkey";
            ALTER TABLE "${POOLS_TABLE_NAME}" DROP "last_state_id";
        `);
    }
}
