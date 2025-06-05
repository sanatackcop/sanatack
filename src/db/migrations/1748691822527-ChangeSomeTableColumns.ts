import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSomeTableColumns1748691822527 implements MigrationInterface {
  name = 'ChangeSomeTableColumns1748691822527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "material_mapper" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" DROP COLUMN IF EXISTS "updatedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_mapper" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_mapper" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN IF EXISTS "updatedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_mapper" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_enrollment" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_enrollment" DROP COLUMN IF EXISTS "updatedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP COLUMN IF EXISTS "updatedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "career_path_mapper" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "career_path" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "career_path" DROP COLUMN IF EXISTS "updatedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "career_enrollment" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "career_enrollment" DROP COLUMN IF EXISTS "updatedAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" DROP COLUMN IF EXISTS "createdAt"`
    );
    await queryRunner.query(
      `ALTER TABLE "video_resource" DROP COLUMN IF EXISTS "createdAt"`
    );

    const tables = [
      'material_mapper',
      'lesson',
      'lesson_mapper',
      'course_mapper',
      'enrollment',
      'roadmap_mapper',
      'roadmap_enrollment',
      'roadmap',
      'career_path_mapper',
      'career_path',
      'career_enrollment',
      'resource',
      'quiz',
      'video_resource',
    ];

    for (const table of tables) {
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT now()`
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
      );
    }

    await queryRunner.query(
      `ALTER TABLE "module" ALTER COLUMN "description" DROP DEFAULT`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "module" ALTER COLUMN "description" SET DEFAULT ''`
    );

    const tables = [
      'video_resource',
      'quiz',
      'resource',
      'career_enrollment',
      'career_path',
      'career_path_mapper',
      'roadmap',
      'roadmap_enrollment',
      'roadmap_mapper',
      'enrollment',
      'course_mapper',
      'lesson_mapper',
      'lesson',
      'material_mapper',
    ];

    for (const table of tables) {
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP COLUMN "updated_at"`
      );
      await queryRunner.query(
        `ALTER TABLE "${table}" DROP COLUMN "created_at"`
      );
    }

    await queryRunner.query(
      `ALTER TABLE "video_resource" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "career_enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "career_enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "career_path" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "career_path" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "career_path_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "course_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }
}
