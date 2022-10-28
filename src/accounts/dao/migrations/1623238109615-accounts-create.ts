import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../../../pools/dao/pools.entity';

import { ACCOUNTS_TABLE_NAME } from '../accounts.entity';

export class AccountsCreate1623238109615 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${ACCOUNTS_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "address" varchar(42) NOT NULL,
                "pool_id" uuid,
                "soft_deleted" bool NOT NULL DEFAULT false,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );

            ALTER TABLE "${ACCOUNTS_TABLE_NAME}" ADD CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "${POOLS_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNTS_TABLE_NAME}" DROP CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey";

            DROP TABLE IF EXISTS "${ACCOUNTS_TABLE_NAME}" CASCADE;
        `);
    }
}
