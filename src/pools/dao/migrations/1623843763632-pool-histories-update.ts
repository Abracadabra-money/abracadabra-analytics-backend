import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';

export class PoolHistoriesUpdate1623843763632 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "block" text;
            UPDATE "${POOL_HISTORIES_TABLE_NAME}" SET "block" = '0';
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ALTER COLUMN "block" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "block";
        `);
    }
}
