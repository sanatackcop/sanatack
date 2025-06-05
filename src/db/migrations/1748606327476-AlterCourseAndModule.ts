import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCourseAndModule1748606327476 implements MigrationInterface {
  name = 'AlterCourseAndModule1748606327476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "module" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "module" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "module" ADD "description" character varying NOT NULL DEFAULT ''`
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD "tags" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "tags"`);
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "tags" character varying`
    );
    await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "created_at"`);
  }
}
