import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCareerPathTable1747767526298 implements MigrationInterface {
    name = 'AddCareerPathTable1747767526298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "career_path" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0e893f9053f1ea01cd33636b1e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "career_path_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "career_path_id" uuid, "roadmap_id" uuid, CONSTRAINT "PK_660bd37be59662e8462f6ea0596" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roadmap" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8652e486587a4e35070c86d2232" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roadmap_mapper" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "roadmap_id" uuid, "course_id" uuid, CONSTRAINT "PK_64ccb4eca9b21b56f6801f12126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD CONSTRAINT "FK_b76a4d8dd4a46b3767ff7da1ad8" FOREIGN KEY ("career_path_id") REFERENCES "career_path"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" ADD CONSTRAINT "FK_4d9bf9f20734d98badee89362e7" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD CONSTRAINT "FK_20f3de532feb872c62dbddb017d" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP CONSTRAINT "FK_20f3de532feb872c62dbddb017d"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP CONSTRAINT "FK_4d9bf9f20734d98badee89362e7"`);
        await queryRunner.query(`ALTER TABLE "career_path_mapper" DROP CONSTRAINT "FK_b76a4d8dd4a46b3767ff7da1ad8"`);
        await queryRunner.query(`DROP TABLE "roadmap_mapper"`);
        await queryRunner.query(`DROP TABLE "roadmap"`);
        await queryRunner.query(`DROP TABLE "career_path_mapper"`);
        await queryRunner.query(`DROP TABLE "career_path"`);
    }

}
