import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAttributesTable1750264341355 implements MigrationInterface {
    name = 'UserAttributesTable1750264341355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_attributes" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users_attributes" ADD "organization" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_attributes" DROP COLUMN "organization"`);
        await queryRunner.query(`ALTER TABLE "users_attributes" DROP COLUMN "bio"`);
    }

}
