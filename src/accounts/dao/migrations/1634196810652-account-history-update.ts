import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';

export class AccountHistoryUpdate1634196810652 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "block_number" text;
            UPDATE "${ACCOUNT_HISTORIES_TABLE_NAME}" SET "block_number" = '0';
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "block_number" SET NOT NULL;

            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "is_liquidated" bool;
            UPDATE "${ACCOUNT_HISTORIES_TABLE_NAME}" SET "is_liquidated" = false;
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "is_liquidated" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "block_number";
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "is_liquidated";
        `);
    }
}
