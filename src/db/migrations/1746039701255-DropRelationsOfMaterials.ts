import { MigrationInterface, QueryRunner } from "typeorm";

export class DropRelationsOfMaterials1746039701255 implements MigrationInterface {
    name = 'DropRelationsOfMaterials1746039701255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_b849e2c59fbbf2c19fef6c87a16"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_681441d1bf004fc97e473a3bbbb"`);
        await queryRunner.query(`ALTER TABLE "video_resource" DROP CONSTRAINT "FK_60b754dc06d26cd31da2a529b77"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "lessonId"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "lessonId"`);
        await queryRunner.query(`ALTER TABLE "video_resource" DROP COLUMN "lessonId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_resource" ADD "lessonId" uuid`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD "lessonId" uuid`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "lessonId" uuid`);
        await queryRunner.query(`ALTER TABLE "video_resource" ADD CONSTRAINT "FK_60b754dc06d26cd31da2a529b77" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz" ADD CONSTRAINT "FK_681441d1bf004fc97e473a3bbbb" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_b849e2c59fbbf2c19fef6c87a16" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
