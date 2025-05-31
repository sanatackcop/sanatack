import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserToken1748691822527 implements MigrationInterface {
    name = 'AddUserToken1748691822527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "course_mapper" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "roadmap" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "roadmap" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "career_path" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "career_path" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "video_resource" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "course_mapper" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "course_mapper" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_resource" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "video_resource" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "module" ALTER COLUMN "description" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" ALTER COLUMN "description" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "video_resource" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "video_resource" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "career_path" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "career_path" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "course_mapper" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "course_mapper" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "video_resource" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "course_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
