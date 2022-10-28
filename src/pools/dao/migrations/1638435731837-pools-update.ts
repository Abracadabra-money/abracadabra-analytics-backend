import { MigrationInterface, QueryRunner } from 'typeorm';

import { POOLS_TABLE_NAME } from '../pools.entity';

export class PoolsUpdate1638435731837 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${POOLS_TABLE_NAME} ADD "maximum_collateral_ratio_percent" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "maximum_collateral_ratio_percent" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "maximum_collateral_ratio_percent" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "interest_percent" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "interest_percent" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "interest_percent" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "liquidation_fee_percent" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "liquidation_fee_percent" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "liquidation_fee_percent" SET NOT NULL;

            ALTER TABLE ${POOLS_TABLE_NAME} ADD "borrow_fee_percent" float8;
            UPDATE "${POOLS_TABLE_NAME}" SET "borrow_fee_percent" = 0;
            ALTER TABLE "${POOLS_TABLE_NAME}" ALTER COLUMN "borrow_fee_percent" SET NOT NULL;

            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '0.5', liquidation_fee_percent = '5', borrow_fee_percent = '0.5' WHERE address = '0xC89958B03A55B5de2221aCB25B58B89A000215E6';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '5', liquidation_fee_percent = '10', borrow_fee_percent = '1' WHERE address = '0x35fA7A723B3B39f15623Ff1Eb26D8701E7D6bB21';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '3', liquidation_fee_percent = '8', borrow_fee_percent = '0.5' WHERE address = '0x0a1e6a80E93e62Bd0D3D3BFcF4c362C40FB1cF3D';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '1', liquidation_fee_percent = '8', borrow_fee_percent = '0.5' WHERE address = '0x2450Bf8e625e98e14884355205af6F97E3E68d07';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '30', interest_percent = '5.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '1' WHERE address = '0x56984F04d2d04B2F63403f0EbeDD3487716bA49d';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '3', liquidation_fee_percent = '5', borrow_fee_percent = '0.5' WHERE address = '0x3b63f81Ad1fc724E44330b4cf5b5B6e355AD964B';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '3', liquidation_fee_percent = '8', borrow_fee_percent = '0.5' WHERE address = '0x95cCe62C3eCD9A33090bBf8a9eAC50b699B54210';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '1', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0x3cfed0439ab822530b1ffbd19536d897ef30d2a2';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '80', interest_percent = '2', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0xed745b045f9495b8bfc7b58eea8e0d0597884e12';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '3.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.05' WHERE address = '0x8E45Af6743422e488aFAcDad842cE75A09eaEd34';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '50', interest_percent = '1.8', liquidation_fee_percent = '7.5', borrow_fee_percent = '0.05' WHERE address = '0xd4357d43545F793101b592bACaB89943DC89d11b';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '3', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0xF8049467F3A9D50176f4816b20cDdd9bB8a93319';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '2', liquidation_fee_percent = '10', borrow_fee_percent = '0.5' WHERE address = '0x692CF15F80415D83E8c0e139cAbcDA67fcc12C90';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '1.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.05' WHERE address = '0xbb02A884621FB8F5BFd263A67F58B65df5b090f3';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '1.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.05' WHERE address = '0x6Ff9061bB8f97d948942cEF376d98b51fA38B91f';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '80', interest_percent = '0', liquidation_fee_percent = '7.5', borrow_fee_percent = '0.05' WHERE address = '0x920d9bd936da4eafb5e25c6bdc9f6cb528953f9f';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '0.8', liquidation_fee_percent = '3', borrow_fee_percent = '0.05' WHERE address = '0x551a7CfF4de931F32893c928bBc3D25bF1Fc5147';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '1.5', liquidation_fee_percent = '7', borrow_fee_percent = '0.05' WHERE address = '0xebfde87310dc22404d918058faa4d56dc4e93f0a';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '5.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '1' WHERE address = '0x003d5a75d284824af736df51933be522de9eed0f';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '0.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0x0bca8ebcb26502b013493bf8fe53aa2b1ed401c1';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '0.8', liquidation_fee_percent = '3', borrow_fee_percent = '0.05' WHERE address = '0x6cbAFEE1FaB76cA5B5e144c43B3B50d42b7C8c8f';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '0.5', liquidation_fee_percent = '5', borrow_fee_percent = '0.5' WHERE address = '0x98a84eff6e008c5ed0289655ccdca899bcb6b99f';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '3.5', liquidation_fee_percent = '5', borrow_fee_percent = '0.5' WHERE address = '0x4EAeD76C3A388f4a841E9c765560BBe7B3E4B3A0';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '3.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0x7b7473a76d6ae86ce19f7352a1e89f6c9dc39020';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '1.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.05' WHERE address = '0xFFbF4892822e0d552CFF317F65e1eE7b5D3d9aE6';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '50', interest_percent = '4', liquidation_fee_percent = '4', borrow_fee_percent = '0.5' WHERE address = '0xc1879bf24917ebE531FbAA20b0D05Da027B592ce';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '80', interest_percent = '1', liquidation_fee_percent = '7.5', borrow_fee_percent = '0.5' WHERE address = '0x05500e2ee779329698df35760bedcaac046e7c27';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '80', interest_percent = '0.5', liquidation_fee_percent = '10', borrow_fee_percent = '0.5' WHERE address = '0x3410297D89dCDAf4072B805EFc1ef701Bb3dd9BF';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '92', interest_percent = '1.5', liquidation_fee_percent = '4', borrow_fee_percent = '1' WHERE address = '0x6371EfE5CD6e3d2d7C477935b7669401143b7985';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '92', interest_percent = '1.5', liquidation_fee_percent = '4', borrow_fee_percent = '1' WHERE address = '0x257101F20cB7243E2c7129773eD5dBBcef8B34E0';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '80', interest_percent = '0.5', liquidation_fee_percent = '10', borrow_fee_percent = '0.5' WHERE address = '0xCfc571f3203756319c231d3Bc643Cee807E74636';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '2', liquidation_fee_percent = '5', borrow_fee_percent = '0.5' WHERE address = '0xbc36FdE44A7FD8f545d459452EF9539d7A14dd63';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '2.5', liquidation_fee_percent = '5', borrow_fee_percent = '1' WHERE address = '0x59E9082E068Ddb27FC5eF1690F9a9f22B32e573f';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '0.5', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0x35a0Dd182E4bCa59d5931eae13D0A2332fA30321';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '75', interest_percent = '2', liquidation_fee_percent = '7.5', borrow_fee_percent = '0.5' WHERE address = '0x9617b633EF905860D919b88E1d9d9a6191795341';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '70', interest_percent = '6', liquidation_fee_percent = '12.5', borrow_fee_percent = '0.5' WHERE address = '0x252dCf1B621Cc53bc22C256255d2bE5C8c32EaE4';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '90', interest_percent = '0.5', liquidation_fee_percent = '4', borrow_fee_percent = '0.5' WHERE address = '0x806e16ec797c69afa8590a55723ce4cc1b54050e';
            UPDATE ${POOLS_TABLE_NAME} SET maximum_collateral_ratio_percent = '85', interest_percent = '0.5', liquidation_fee_percent = '5', borrow_fee_percent = '0.5' WHERE address = '0xc319eea1e792577c319723b5e60a15da3857e7da';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "maximum_collateral_ratio_percent";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "interest_percent";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "liquidation_fee_percent";
            ALTER TABLE ${POOLS_TABLE_NAME} DROP "borrow_fee_percent";
        `);
    }
}
