import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOANS_TABLE_NAME } from '../loans.entity';

export class LoansUpdate1666306363041 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "liquidation_price" numeric;
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "repaid" text;
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "repaid_usd" numeric;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "liquidation_price";
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "repaid";
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "repaid_usd";
        `);
    }
}
