import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolUpdate1631778843152 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TYPE network_enum ADD VALUE '56';
            ALTER TYPE network_enum ADD VALUE '250';
            ALTER TYPE network_enum ADD VALUE '43114';
            ALTER TYPE network_enum ADD VALUE '42161';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            UPDATE ${POOLS_TABLE_NAME} SET "network" = '0' WHERE "network" = '56';
            UPDATE ${POOLS_TABLE_NAME} SET "network" = '0' WHERE "network" = '250';
            UPDATE ${POOLS_TABLE_NAME} SET "network" = '0' WHERE "network" = '43114';
            UPDATE ${POOLS_TABLE_NAME} SET "network" = '0' WHERE "network" = '42161';

            ALTER TABLE ${POOLS_TABLE_NAME} ALTER COLUMN network DROP DEFAULT;

            CREATE TYPE network_enum_new AS ENUM ('0', '1');
            ALTER TABLE ${POOLS_TABLE_NAME} ALTER COLUMN network TYPE network_enum_new USING network::text::network_enum_new;
            DROP TYPE network_enum;
            
            ALTER TYPE network_enum_new RENAME TO network_enum;
            
            ALTER TABLE ${POOLS_TABLE_NAME} ALTER COLUMN network SET DEFAULT('0');
        `);
    }
}
