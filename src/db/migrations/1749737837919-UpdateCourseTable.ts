import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCourseTable1749737837919 implements MigrationInterface {
  name = 'UpdateCourseTable1749737837919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD "course_info" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "material_count" integer NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP COLUMN "material_count"`
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "course_info"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD "tags" jsonb`);
  }
}
