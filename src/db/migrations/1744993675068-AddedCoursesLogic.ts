import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCoursesLogic1744993675068 implements MigrationInterface {
  name = 'AddedCoursesLogic1744993675068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quiz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "options" jsonb NOT NULL, "correctAnswer" character varying NOT NULL, "explanation" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" uuid, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "type" character varying NOT NULL, "url" character varying, "content" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" uuid, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "video_resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "youtubeId" character varying NOT NULL, "description" character varying, "duration" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lessonId" uuid, CONSTRAINT "PK_60cc887ccc69d83cf28c3dd850e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "module_id" uuid, "lesson_id" uuid, CONSTRAINT "PK_6498cf1374e85ff6b6998f1ac21" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "course_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "course_id" uuid, "module_id" uuid, CONSTRAINT "PK_876a15993494364709b8953cae4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "level" text NOT NULL, "tags" jsonb, "isPublished" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD CONSTRAINT "FK_681441d1bf004fc97e473a3bbbb" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD CONSTRAINT "FK_b849e2c59fbbf2c19fef6c87a16" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "video_resource" ADD CONSTRAINT "FK_60b754dc06d26cd31da2a529b77" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_mapper" ADD CONSTRAINT "FK_7aed425e9c03dad73932988f51b" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_mapper" ADD CONSTRAINT "FK_8394a3d7fdcc456879bcbdc1957" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_mapper" ADD CONSTRAINT "FK_513c030093d355130b16d7420b1" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_mapper" ADD CONSTRAINT "FK_28b7e5479e66d9a8370c8ac618e" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_mapper" DROP CONSTRAINT "FK_28b7e5479e66d9a8370c8ac618e"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_mapper" DROP CONSTRAINT "FK_513c030093d355130b16d7420b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_mapper" DROP CONSTRAINT "FK_8394a3d7fdcc456879bcbdc1957"`
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_mapper" DROP CONSTRAINT "FK_7aed425e9c03dad73932988f51b"`
    );
    await queryRunner.query(
      `ALTER TABLE "video_resource" DROP CONSTRAINT "FK_60b754dc06d26cd31da2a529b77"`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" DROP CONSTRAINT "FK_b849e2c59fbbf2c19fef6c87a16"`
    );
    await queryRunner.query(
      `ALTER TABLE "quiz" DROP CONSTRAINT "FK_681441d1bf004fc97e473a3bbbb"`
    );
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "course_mapper"`);
    await queryRunner.query(`DROP TABLE "module"`);
    await queryRunner.query(`DROP TABLE "lesson_mapper"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TABLE "video_resource"`);
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`DROP TABLE "quiz"`);
  }
}
