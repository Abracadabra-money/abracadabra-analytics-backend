import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOANS_TABLE_NAME } from '../loans.entity';

export class LoansUpdate1639732613442 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TYPE liquidation_status_enum AS ENUM ('0', '1', '2');
        
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "liquidation_status" liquidation_status_enum DEFAULT '0';
            UPDATE "${LOANS_TABLE_NAME}" SET "liquidation_status" = '0';

            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "liquidation_amount" text;
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "liquidation_amount_usd" numeric;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "liquidation_status";
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "liquidation_amount";
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "liquidation_amount_usd";

            DROP TYPE liquidation_status_enum;
        `);
    }
}
