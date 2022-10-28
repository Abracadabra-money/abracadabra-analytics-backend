import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolUpdate1624608533618 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE cauldron_risk_enum AS ENUM ('0', '1', '2');

            ALTER TABLE "${POOLS_TABLE_NAME}" ADD "risk" cauldron_risk_enum DEFAULT '0';
            UPDATE "${POOLS_TABLE_NAME}" SET "risk" = '0';
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "risk" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${POOLS_TABLE_NAME}" DROP "risk";
            
            DROP TYPE cauldron_risk_enum;
        `);
    }
}
