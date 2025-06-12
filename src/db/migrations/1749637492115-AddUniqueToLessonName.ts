import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToLessonName1749637492115 implements MigrationInterface {
    name = 'AddUniqueToLessonName1749637492115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "UQ_c60c736b10b5dafeb0923d5c1fc" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "UQ_c60c736b10b5dafeb0923d5c1fc"`);
    }

}
