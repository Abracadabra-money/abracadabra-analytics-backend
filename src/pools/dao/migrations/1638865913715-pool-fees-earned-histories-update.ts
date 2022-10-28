import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_FEES_EARNED_HISTORIES_TABLE_NAME } from '../pool-fees-earned.entity';

export class PoolFeesEarnedHistoriesUpdate1638865913715 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" ADD "inserted_at" timestamp DEFAULT now();
            UPDATE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" SET "inserted_at" = now();
            ALTER TABLE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" ALTER COLUMN "inserted_at" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" DROP "inserted_at";
        `);
    }
}
