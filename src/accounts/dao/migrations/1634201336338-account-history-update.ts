import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOANS_TABLE_NAME } from '../../../loans/dao/loans.entity';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';

export class AccountHistoryUpdate1634201336338 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "cache_id" uuid;
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD CONSTRAINT "${LOANS_TABLE_NAME}_id_fkey" FOREIGN KEY ("cache_id") REFERENCES "${LOANS_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP CONSTRAINT "${LOANS_TABLE_NAME}_id_fkey";
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "cache_id";
        `);
    }
}
