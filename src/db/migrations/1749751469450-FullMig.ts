import { MigrationInterface, QueryRunner } from "typeorm";

export class FullMig1749751469450 implements MigrationInterface {
    name = 'FullMig1749751469450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "course_id" uuid, "module_id" uuid, CONSTRAINT "PK_876a15993494364709b8953cae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lesson_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "module_id" uuid, "lesson_id" uuid, CONSTRAINT "PK_6498cf1374e85ff6b6998f1ac21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_c60c736b10b5dafeb0923d5c1fc" UNIQUE ("name"), CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."material_mapper_material_type_enum" AS ENUM('resource', 'video', 'quiz', 'link', 'quiz_group')`);
        await queryRunner.query(`CREATE TABLE "material_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "material_id" uuid NOT NULL, "material_type" "public"."material_mapper_material_type_enum" NOT NULL, "lesson_id" uuid NOT NULL, CONSTRAINT "lesson_material_unique" UNIQUE ("lesson_id", "material_id"), CONSTRAINT "PK_92eb44a46c9f3b3aae57526f751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "progress_count" integer NOT NULL, "is_finished" boolean NOT NULL, "cancelledAt" TIMESTAMP, "course_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "description" text, "level" text NOT NULL, "course_info" jsonb, "material_count" integer NOT NULL DEFAULT '0', "isPublished" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roadmap_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "roadmap_id" uuid, "course_id" uuid, CONSTRAINT "PK_64ccb4eca9b21b56f6801f12126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roadmap_enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cancelledAt" TIMESTAMP, "roadmap_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_617f690a10fece19546a856e0e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roadmap" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text, CONSTRAINT "PK_8652e486587a4e35070c86d2232" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "career_path_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order" integer NOT NULL, "career_path_id" uuid, "roadmap_id" uuid, CONSTRAINT "PK_660bd37be59662e8462f6ea0596" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "career_path" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_0e893f9053f1ea01cd33636b1e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "career_enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cancelledAt" TIMESTAMP, "careerpath_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8814f41fd63a7150f5b06bf3d05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "topics" character varying array NOT NULL, "userType" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_98bdbf7b29f00d84d9d5706922" UNIQUE ("user_id"), CONSTRAINT "PK_5aa310bcaefba1f0426a35a15e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "role" character varying NOT NULL DEFAULT 'student', "isActive" boolean NOT NULL DEFAULT false, "isVerify" boolean NOT NULL DEFAULT false, "isPro" boolean NOT NULL DEFAULT false, "phone" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."resource_type_enum" AS ENUM('resource', 'video', 'quiz', 'link')`);
        await queryRunner.query(`CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying, "type" "public"."resource_type_enum" NOT NULL, "url" character varying, "content" text, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question" character varying NOT NULL, "options" jsonb NOT NULL, "correctAnswer" character varying NOT NULL, "explanation" text, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video_resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "youtubeId" character varying NOT NULL, "description" character varying, "duration" integer, CONSTRAINT "PK_60cc887ccc69d83cf28c3dd850e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "to" character varying NOT NULL, "type" character varying NOT NULL, "used" boolean NOT NULL DEFAULT false, "expiration" bigint NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "email" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_295ca261e361fd2fd217754dcac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_mapper" ADD CONSTRAINT "FK_513c030093d355130b16d7420b1" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_mapper" ADD CONSTRAINT "FK_28b7e5479e66d9a8370c8ac618e" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" ADD CONSTRAINT "FK_7aed425e9c03dad73932988f51b" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" ADD CONSTRAINT "FK_8394a3d7fdcc456879bcbdc1957" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_fc17c7e94154a17e767b7674f12" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD CONSTRAINT "FK_20f3de532feb872c62dbddb017d" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD CONSTRAINT "FK_344a0714b536999e87aee7bcc45" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD CONSTRAINT "FK_376ddb88024f8a47437f8816aa9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD CONSTRAINT "FK_b76a4d8dd4a46b3767ff7da1ad8" FOREIGN KEY ("career_path_id") REFERENCES "career_path"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD CONSTRAINT "FK_4d9bf9f20734d98badee89362e7" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD CONSTRAINT "FK_9b68cb9333e7d1d81f23c175a3a" FOREIGN KEY ("careerpath_id") REFERENCES "career_path"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD CONSTRAINT "FK_d89e4c26b62ad568e601317d8e7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_attributes" ADD CONSTRAINT "FK_98bdbf7b29f00d84d9d57069220" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_attributes" DROP CONSTRAINT "FK_98bdbf7b29f00d84d9d57069220"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP CONSTRAINT "FK_d89e4c26b62ad568e601317d8e7"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP CONSTRAINT "FK_9b68cb9333e7d1d81f23c175a3a"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP CONSTRAINT "FK_4d9bf9f20734d98badee89362e7"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP CONSTRAINT "FK_b76a4d8dd4a46b3767ff7da1ad8"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP CONSTRAINT "FK_376ddb88024f8a47437f8816aa9"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP CONSTRAINT "FK_344a0714b536999e87aee7bcc45"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP CONSTRAINT "FK_20f3de532feb872c62dbddb017d"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_fc17c7e94154a17e767b7674f12"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e"`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" DROP CONSTRAINT "FK_8394a3d7fdcc456879bcbdc1957"`);
        await queryRunner.query(`ALTER TABLE "lesson_mapper" DROP CONSTRAINT "FK_7aed425e9c03dad73932988f51b"`);
        await queryRunner.query(`ALTER TABLE "course_mapper" DROP CONSTRAINT "FK_28b7e5479e66d9a8370c8ac618e"`);
        await queryRunner.query(`ALTER TABLE "course_mapper" DROP CONSTRAINT "FK_513c030093d355130b16d7420b1"`);
        await queryRunner.query(`DROP TABLE "attempts"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "video_resource"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`DROP TABLE "resource"`);
        await queryRunner.query(`DROP TYPE "public"."resource_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users_attributes"`);
        await queryRunner.query(`DROP TABLE "career_enrollment"`);
        await queryRunner.query(`DROP TABLE "career_path"`);
        await queryRunner.query(`DROP TABLE "career_path_mapper"`);
        await queryRunner.query(`DROP TABLE "roadmap"`);
        await queryRunner.query(`DROP TABLE "roadmap_enrollment"`);
        await queryRunner.query(`DROP TABLE "roadmap_mapper"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "enrollment"`);
        await queryRunner.query(`DROP TABLE "material_mapper"`);
        await queryRunner.query(`DROP TYPE "public"."material_mapper_material_type_enum"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP TABLE "lesson_mapper"`);
        await queryRunner.query(`DROP TABLE "module"`);
        await queryRunner.query(`DROP TABLE "course_mapper"`);
    }

}
