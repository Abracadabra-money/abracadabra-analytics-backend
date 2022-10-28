import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';
import { ACCOUNTS_TABLE_NAME } from '../accounts.entity';

export class AccountUpdate1666199864330 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNTS_TABLE_NAME}" ADD "last_state_id" uuid;
            ALTER TABLE "${ACCOUNTS_TABLE_NAME}" ADD CONSTRAINT "${ACCOUNT_HISTORIES_TABLE_NAME}_id_fkey" FOREIGN KEY ("last_state_id") REFERENCES "${ACCOUNT_HISTORIES_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNTS_TABLE_NAME}" DROP CONSTRAINT "${ACCOUNT_HISTORIES_TABLE_NAME}_id_fkey";
            ALTER TABLE "${ACCOUNTS_TABLE_NAME}" DROP "last_state_id";
        `);
    }
}
