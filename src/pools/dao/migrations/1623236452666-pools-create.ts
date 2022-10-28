import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolsCreate1623236452666 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE network_enum AS ENUM ('0', '1');

            CREATE TABLE "${POOLS_TABLE_NAME}" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "address" varchar(42) NOT NULL,
                "network" network_enum DEFAULT '0',
                "create_block" text NOT NULL,
                "soft_deleted" bool NOT NULL DEFAULT false,
                "created_at" timestamp NOT NULL DEFAULT now(),
                "updated_at" timestamp NOT NULL DEFAULT now(),
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "${POOLS_TABLE_NAME}" CASCADE;
            DROP TYPE network_enum;
        `);
    }
}
