import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnrollmentCourseDelete1750673629147 implements MigrationInterface {
  name = 'EnrollmentCourseDelete1750673629147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."material_mapper_material_type_enum" RENAME TO "material_mapper_material_type_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."material_mapper_material_type_enum" AS ENUM('resource', 'video', 'quiz', 'quiz_group', 'link', 'article')`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ALTER COLUMN "material_type" TYPE "public"."material_mapper_material_type_enum" USING "material_type"::"text"::"public"."material_mapper_material_type_enum"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."material_mapper_material_type_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ALTER COLUMN "progress_counter" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ALTER COLUMN "course_id" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ALTER COLUMN "course_id" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ALTER COLUMN "progress_counter" SET DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."material_mapper_material_type_enum_old" AS ENUM('resource', 'video', 'quiz', 'link')`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ALTER COLUMN "material_type" TYPE "public"."material_mapper_material_type_enum_old" USING "material_type"::"text"::"public"."material_mapper_material_type_enum_old"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."material_mapper_material_type_enum"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."material_mapper_material_type_enum_old" RENAME TO "material_mapper_material_type_enum"`
    );
  }
}
