import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';

export class AccountHistoriesUpdate1623838873988 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "hash" text;
            UPDATE "${ACCOUNT_HISTORIES_TABLE_NAME}" SET "hash" = '';
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "hash" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "hash";
        `);
    }
}
