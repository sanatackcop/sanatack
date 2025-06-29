import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCodeLessonsTableAndTestCases1751101853859 implements MigrationInterface {
    name = 'AddCodeLessonsTableAndTestCases1751101853859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_cases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "input" text NOT NULL, "expectedOutput" text NOT NULL, "description" text, "lessonId" uuid NOT NULL, CONSTRAINT "PK_39eb2dc90c54d7a036b015f05c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "code_lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "main_title" character varying(255) NOT NULL, "duration" integer NOT NULL, "data" json NOT NULL, "hint" text, "initialCode" text, CONSTRAINT "PK_04af320c4fac03c2a88bb9c304c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE  "public"."material_mapper_material_type_enum"  ADD VALUE IF NOT EXISTS 'code';`)
        await queryRunner.query(`ALTER TABLE "test_cases" ADD CONSTRAINT "FK_7802833730438517c4dccd296da" FOREIGN KEY ("lessonId") REFERENCES "code_lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_cases" DROP CONSTRAINT "FK_7802833730438517c4dccd296da"`);
        await queryRunner.query(`DROP TABLE "code_lessons"`);
        await queryRunner.query(`DROP TABLE "test_cases"`);
    }

}
