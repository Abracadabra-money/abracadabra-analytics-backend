import { MigrationInterface, QueryRunner } from 'typeorm';

import { LOANS_TABLE_NAME } from '../loans.entity';

export class LoansUpdate1638866069918 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOANS_TABLE_NAME}" ADD "inserted_at" timestamp DEFAULT now();
            UPDATE "${LOANS_TABLE_NAME}" SET "inserted_at" = now();
            ALTER TABLE "${LOANS_TABLE_NAME}" ALTER COLUMN "inserted_at" SET NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE "${LOANS_TABLE_NAME}" DROP "inserted_at";
        `);
    }
}
