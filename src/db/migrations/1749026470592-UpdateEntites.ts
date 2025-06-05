import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntitles1749026470592 implements MigrationInterface {
  name = 'UpdateEntitles1749026470592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roadmap_mapper" DROP CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d"`
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "roadmap_mapper" DROP COLUMN "course_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "courses" ADD "roadmap_id" uuid`);
    await queryRunner.query(
      `ALTER TYPE "public"."material_mapper_material_type_enum" RENAME TO "material_mapper_material_type_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."material_mapper_material_type_enum" AS ENUM('resource', 'video', 'quiz', 'link')`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ALTER COLUMN "material_type" TYPE "public"."material_mapper_material_type_enum" USING "material_type"::"text"::"public"."material_mapper_material_type_enum"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."material_mapper_material_type_enum_old"`
    );
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "type"`);
    await queryRunner.query(
      `CREATE TYPE "public"."resource_type_enum" AS ENUM('resource', 'video', 'quiz', 'link')`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD "type" "public"."resource_type_enum" NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_d2a067ba184302e0f82201df9d3" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap_mapper"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_d2a067ba184302e0f82201df9d3"`
    );
    await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."resource_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "resource" ADD "type" character varying NOT NULL`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."material_mapper_material_type_enum_old" AS ENUM('resource', 'video', 'quiz')`
    );
    await queryRunner.query(
      `ALTER TABLE "material_mapper" ALTER COLUMN "material_type" TYPE "public"."material_mapper_material_type_enum_old" USING "material_type"::"text"::"public"."material_mapper_material_type_enum_old"`
    );
    await queryRunner.query(
      `DROP TYPE "public"."material_mapper_material_type_enum"`
    );
    await queryRunner.query(
      `ALTER TYPE "public"."material_mapper_material_type_enum_old" RENAME TO "material_mapper_material_type_enum"`
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "roadmap_id"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "roadmap_mapper" ADD "course_id" uuid`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_mapper" ADD CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
