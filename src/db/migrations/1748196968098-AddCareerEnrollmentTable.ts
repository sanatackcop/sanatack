import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCareerEnrollmentTable1748196968098 implements MigrationInterface {
    name = 'AddCareerEnrollmentTable1748196968098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roadmap_enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cancelledAt" TIMESTAMP, "roadmap_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_617f690a10fece19546a856e0e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "career_enrollment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cancelledAt" TIMESTAMP, "careerpath_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8814f41fd63a7150f5b06bf3d05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD CONSTRAINT "FK_344a0714b536999e87aee7bcc45" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" ADD CONSTRAINT "FK_376ddb88024f8a47437f8816aa9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD CONSTRAINT "FK_9b68cb9333e7d1d81f23c175a3a" FOREIGN KEY ("careerpath_id") REFERENCES "career_path"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" ADD CONSTRAINT "FK_d89e4c26b62ad568e601317d8e7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP CONSTRAINT "FK_d89e4c26b62ad568e601317d8e7"`);
        await queryRunner.query(`ALTER TABLE "career_enrollment" DROP CONSTRAINT "FK_9b68cb9333e7d1d81f23c175a3a"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP CONSTRAINT "FK_376ddb88024f8a47437f8816aa9"`);
        await queryRunner.query(`ALTER TABLE "roadmap_enrollment" DROP CONSTRAINT "FK_344a0714b536999e87aee7bcc45"`);
        await queryRunner.query(`DROP TABLE "career_enrollment"`);
        await queryRunner.query(`DROP TABLE "roadmap_enrollment"`);
    }

}
