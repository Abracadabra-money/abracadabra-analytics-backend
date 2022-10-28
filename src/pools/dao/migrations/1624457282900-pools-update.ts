import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolsUpdate1624457282900 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" DROP "create_block";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" ADD "create_block" text;
            UPDATE "${POOLS_TABLE_NAME}" SET "create_block" = '0';
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "create_block" SET NOT NULL;
        `);
    }
}
