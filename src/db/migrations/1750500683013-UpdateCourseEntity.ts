import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCourseEntity1750500683013 implements MigrationInterface {
  name = 'UpdateCourseEntity1750500683013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "progress_count"`
    );
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."resource_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "progress_counter" integer NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "current_material_id" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "enrolledCount" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "completionCount" integer NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "completionCount"`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "enrolledCount"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "current_material_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "progress_counter"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resource_type_enum" AS ENUM('resource', 'video', 'quiz', 'link')`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD "type" "public"."resource_type_enum" NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "progress_count" integer NOT NULL`
    );
  }
}
