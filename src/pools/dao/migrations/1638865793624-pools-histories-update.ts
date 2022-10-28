import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';

export class PoolHistoriesUpdate1638865793624 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD "inserted_at" timestamp DEFAULT now();
            UPDATE "${POOL_HISTORIES_TABLE_NAME}" SET "inserted_at" = now();
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ALTER COLUMN "inserted_at" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP "inserted_at";
        `);
    }
}
