import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolsUpdate1638788055634 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${POOLS_TABLE_NAME} ADD "can_sync" bool;
            UPDATE "${POOLS_TABLE_NAME}" SET "can_sync" = true;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "can_sync" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "full_re_sync" bool;
            UPDATE "${POOLS_TABLE_NAME}" SET "full_re_sync" = false;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "full_re_sync" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "can_sync";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "full_re_sync";
        `);
    }
}
