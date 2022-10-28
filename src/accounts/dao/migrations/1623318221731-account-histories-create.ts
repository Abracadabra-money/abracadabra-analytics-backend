import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';
import { ACCOUNTS_TABLE_NAME } from '../accounts.entity';

export class AccountHistoriesCreate1623318221731 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "account_id" uuid,
                "borrow_part" text NOT NULL,
                "collateral_share" text NOT NULL,
                "soft_deleted" bool NOT NULL DEFAULT false,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );

            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD CONSTRAINT "${ACCOUNTS_TABLE_NAME}_id_fkey" FOREIGN KEY ("account_id") REFERENCES "${ACCOUNTS_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP CONSTRAINT "${ACCOUNTS_TABLE_NAME}_id_fkey";

            DROP TABLE IF EXISTS "${ACCOUNT_HISTORIES_TABLE_NAME}" CASCADE;
        `);
    }
}
