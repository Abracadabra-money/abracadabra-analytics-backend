import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNTS_TABLE_NAME } from '../../../accounts/dao/accounts.entity';
import { POOLS_TABLE_NAME } from '../../../pools/dao/pools.entity';

import { LOANS_TABLE_NAME } from '../loans.entity';

export class LoansCreate1633954430159 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE loan_status_enum AS ENUM ('0', '1', '2');
            CREATE TYPE new_loan_opened_enum AS ENUM ('0', '1', '2');
            CREATE TYPE loan_open_status_enum AS ENUM ('0', '1', '2');

            CREATE TABLE "${LOANS_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "pool_id" uuid,
                "account_id" uuid,
                "collateralised" text NOT NULL,
                "collateralised_usd" numeric NOT NULL,
                "mim_borrowed" text NOT NULL,
                "mim_borrowed_usd" numeric NOT NULL,
                "loan_status" loan_status_enum DEFAULT '0',
                "new_loan_opened" new_loan_opened_enum DEFAULT '0',
                "loan_open_status" loan_open_status_enum DEFAULT '0',
                "ltv" decimal DEFAULT '0',
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );

            ALTER TABLE "${LOANS_TABLE_NAME}" ADD CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "${POOLS_TABLE_NAME}"("id");
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD CONSTRAINT "${ACCOUNTS_TABLE_NAME}_id_fkey" FOREIGN KEY ("account_id") REFERENCES "${ACCOUNTS_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey";
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP CONSTRAINT "${ACCOUNTS_TABLE_NAME}_id_fkey";

            DROP TABLE IF EXISTS "${LOANS_TABLE_NAME}" CASCADE;
            DROP TYPE loan_status_enum;
            DROP TYPE new_loan_opened_enum;
            DROP TYPE loan_open_status_enum;
        `);
    }
}
