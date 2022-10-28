import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';

export class PoolHistoriesUpdate1634822240855 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "block";
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "soft_deleted";

            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "hash" text;
            UPDATE "${POOL_HISTORIES_TABLE_NAME}" SET "hash" = '';
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ALTER COLUMN "hash" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "block" text;
            UPDATE "${POOL_HISTORIES_TABLE_NAME}" SET "block" = '0';
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ALTER COLUMN "block" SET NOT NULL;

            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "soft_deleted" bool;
            UPDATE "${POOL_HISTORIES_TABLE_NAME}" SET "soft_deleted" = false;
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ALTER COLUMN "soft_deleted" SET NOT NULL;

            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "hash";
        `);
    }
}
