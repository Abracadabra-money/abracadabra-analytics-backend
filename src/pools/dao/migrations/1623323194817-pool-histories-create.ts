import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';
import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolHistoriesCreate1623323194817 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${POOL_HISTORIES_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "pool_id" uuid,
                "exchange_rate" text NOT NULL,
                "total_borrow" text NOT NULL,
                "total_collateral_share" text NOT NULL,
                "accrue_info" text NOT NULL,
                "soft_deleted" bool NOT NULL DEFAULT false,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );

            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" ADD CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "${POOLS_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_HISTORIES_TABLE_NAME}" DROP CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey";

            DROP TABLE IF EXISTS "${POOL_HISTORIES_TABLE_NAME}" CASCADE;
        `);
    }
}
