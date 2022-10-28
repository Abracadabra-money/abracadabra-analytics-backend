import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolUpdate1625211886399 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" ADD "decimals" text;
            UPDATE "${POOLS_TABLE_NAME}" SET "decimals" = '[0,18]';
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "decimals" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" DROP "decimals";
        `);
    }
}
