import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_FEES_EARNED_HISTORIES_TABLE_NAME } from '../pool-fees-earned.entity';
import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolFeesEarnedHistoriesCreate1633956116688 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "pool_id" uuid,
                "borrow_fees" text NOT NULL,
                "borrow_fees_usd" numeric NOT NULL,
                "interest" text NOT NULL,
                "interest_usd" numeric NOT NULL,
                "liquidation_fee" text NOT NULL,
                "liquidation_fee_usd" numeric NOT NULL,
                "fee_earned_total" text NOT NULL,
                "fee_earned_total_usd" numeric NOT NULL,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );

            ALTER TABLE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" ADD CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "${POOLS_TABLE_NAME}"("id");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" DROP CONSTRAINT "${POOLS_TABLE_NAME}_id_fkey";

            DROP TABLE IF EXISTS "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}" CASCADE;
        `);
    }
}
