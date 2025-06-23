import { MigrationInterface, QueryRunner } from "typeorm";

export class LessonDelete1750674908389 implements MigrationInterface {
    name = 'LessonDelete1750674908389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e"`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
