import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnrollmentTable1745779688646 implements MigrationInterface {
    name = 'AddEnrollmentTable1745779688646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cancelledAt" TIMESTAMP, "course_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_progress" DROP COLUMN "cancelledAt"`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_fc17c7e94154a17e767b7674f12" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_fc17c7e94154a17e767b7674f12"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_dd1ce01d1164c8bbdda052ced74"`);
        await queryRunner.query(`ALTER TABLE "course_progress" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "course_progress" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "course_progress" ADD "cancelledAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "enrollment"`);
    }

}
