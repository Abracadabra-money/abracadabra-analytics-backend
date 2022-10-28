import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolUpdate1633090152784 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${POOLS_TABLE_NAME} ADD "ltv" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "ltv" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "ltv" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "interest" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "interest" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "interest" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "liquidation_fee" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "liquidation_fee" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "liquidation_fee" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "borrow_fee" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "borrow_fee" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "borrow_fee" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "ltv";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "interest";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "liquidation_fee";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "borrow_fee";
        `);
    }
}
