import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCourseProgress1745510805070 implements MigrationInterface {
    name = 'AddTableCourseProgress1745510805070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "progress" integer NOT NULL, "cancelledAt" TIMESTAMP NOT NULL DEFAULT now(), "course_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_eadd1b31d44023e533eb847c4f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD CONSTRAINT "FK_468b14b39d8428b77d8630bd5cc" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD CONSTRAINT "FK_85392161b4c16580b3a7d937d94" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_progress" DROP CONSTRAINT "FK_85392161b4c16580b3a7d937d94"`);
        await queryRunner.query(`ALTER TABLE "course_progress" DROP CONSTRAINT "FK_468b14b39d8428b77d8630bd5cc"`);
        await queryRunner.query(`DROP TABLE "course_progress"`);
    }

}
