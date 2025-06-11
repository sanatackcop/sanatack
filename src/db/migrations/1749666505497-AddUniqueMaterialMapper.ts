import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueMaterialMapper1749666505497 implements MigrationInterface {
    name = 'AddUniqueMaterialMapper1749666505497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD CONSTRAINT "lesson_material_unique" UNIQUE ("lesson_id", "material_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP CONSTRAINT "lesson_material_unique"`);
    }

}
