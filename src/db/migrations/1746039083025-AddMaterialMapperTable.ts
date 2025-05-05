import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaterialMapperTable1746039083025 implements MigrationInterface {
    name = 'AddMaterialMapperTable1746039083025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."material_mapper_material_type_enum" AS ENUM('resource', 'video', 'quiz')`);
        await queryRunner.query(`CREATE TABLE "material_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "material_id" uuid NOT NULL, "material_type" "public"."material_mapper_material_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lesson_id" uuid NOT NULL, CONSTRAINT "PK_92eb44a46c9f3b3aae57526f751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "material_mapper" ADD CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "material_mapper" DROP CONSTRAINT "FK_4b360e5c6ebd70ce196386dbf9e"`);
        await queryRunner.query(`DROP TABLE "material_mapper"`);
        await queryRunner.query(`DROP TYPE "public"."material_mapper_material_type_enum"`);
    }

}
