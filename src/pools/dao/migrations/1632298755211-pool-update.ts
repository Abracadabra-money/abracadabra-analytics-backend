import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolUpdate1632298755211 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" DROP "risk";
            DROP TYPE cauldron_risk_enum;

            CREATE TYPE asset_type_enum AS ENUM ('0', '1', '2');

            ALTER TABLE "${POOLS_TABLE_NAME}" ADD "asset_type" asset_type_enum DEFAULT '0';
            UPDATE "${POOLS_TABLE_NAME}" SET "asset_type" = '0';
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "asset_type" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE cauldron_risk_enum AS ENUM ('0', '1', '2');

            ALTER TABLE "${POOLS_TABLE_NAME}" ADD "risk" cauldron_risk_enum DEFAULT '0';
            UPDATE "${POOLS_TABLE_NAME}" SET "risk" = '0';
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "risk" SET NOT NULL;

            ALTER TABLE "${POOLS_TABLE_NAME}" DROP "asset_type";
            DROP TYPE asset_type_enum;
        `);
    }
}
