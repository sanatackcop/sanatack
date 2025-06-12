import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTokensEntity1749637386237 implements MigrationInterface {
    name = 'RemoveTokensEntity1749637386237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "description" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "order" integer NOT NULL`);
    }

}
