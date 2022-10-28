import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOL_FEES_EARNED_HISTORIES_TABLE_NAME } from '../pool-fees-earned.entity';
import { POOL_HISTORIES_TABLE_NAME } from '../pool-histories.entity';

export class ClearPoolCache1634723876295 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DELETE FROM "${POOL_HISTORIES_TABLE_NAME}";
            DELETE FROM "${POOL_FEES_EARNED_HISTORIES_TABLE_NAME}";
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            
        `);
    }
}
