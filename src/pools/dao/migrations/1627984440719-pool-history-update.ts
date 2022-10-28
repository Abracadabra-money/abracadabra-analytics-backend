import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';

export class PoolsHistoriesUpdate1627984440719 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "underwater_price";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "underwater_price" float8;
            UPDATE "${POOL_HISTORIES_TABLE_NAME}" SET "underwater_price" = 0;
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ALTER COLUMN "underwater_price" SET NOT NULL;
        `);
    }
}
