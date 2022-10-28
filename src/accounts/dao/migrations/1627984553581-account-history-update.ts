import { MigrationInterface, QueryRunner } from 'typeorm';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';

export class AccountHistoryUpdate1627984553581 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" DROP "liquiation_price";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ADD "liquiation_price" text;
            UPDATE "${ACCOUNT_HISTORIES_TABLE_NAME}" SET "liquiation_price" = '0';
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "liquiation_price" SET NOT NULL;
            ALTER TABLE "${ACCOUNT_HISTORIES_TABLE_NAME}" ALTER COLUMN "liquiation_price" TYPE float8 USING "liquiation_price"::double precision;
        `);
    }
}
