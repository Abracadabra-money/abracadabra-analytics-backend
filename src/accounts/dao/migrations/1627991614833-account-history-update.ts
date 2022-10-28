import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';

export class AccountHistoryUpdate1627991614833 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "prew_borrow_part" text;
            UPDATE "${ACCOUNT_HISTORIES_TABLE_NAME}" SET "prew_borrow_part" = '0';
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "prew_borrow_part" SET NOT NULL;
            
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "prew_collateral_share" text;
            UPDATE "${ACCOUNT_HISTORIES_TABLE_NAME}" SET "prew_collateral_share" = '0';
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "prew_collateral_share" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "prew_borrow_part";
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "prew_collateral_share";
        `);
    }
}
