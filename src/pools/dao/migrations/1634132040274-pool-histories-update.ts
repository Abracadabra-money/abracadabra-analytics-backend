import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_FEES_EARNED_HISTORIES_TABLE_NAME } from '../pool-fees-earned.entity';
import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';

export class PoolHistoriesUpdate1634132040274 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "cache_id" uuid;
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD CONSTRAINT "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}_id_fkey" FOREIGN KEY ("cache_id") REFERENCES "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP CONSTRAINT "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}_id_fkey";
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "cache_id";
        `);
    }
}
