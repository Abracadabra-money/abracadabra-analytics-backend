import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOANS_TABLE_NAME } from '../../../loans/dao/loans.entity';

import { ACCOUNT_HISTORIES_TABLE_NAME } from '../account-histories.entity';

export class ClearAccountsCache1634655561538 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DELETE FROM "${ACCOUNT_HISTORIES_TABLE_NAME}";
            DELETE FROM "${LOANS_TABLE_NAME}";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            
        `);
    }
}
