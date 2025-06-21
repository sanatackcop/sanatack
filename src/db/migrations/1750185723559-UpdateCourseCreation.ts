import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCourseCreation1750185723559 implements MigrationInterface {
  name = 'UpdateCourseCreation1750185723559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "video" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "youtubeId" character varying NOT NULL, "description" character varying, "duration" integer, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ADD "material_duration" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD "duration" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "duration" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "description" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "course_info" SET NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "course_info" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "description" DROP NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "duration"`);
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "duration"`);
    await queryRunner.query(
      `ALTER TABLE "material_mapper" DROP COLUMN "material_duration"`
    );
    await queryRunner.query(`DROP TABLE "video"`);
  }
}
