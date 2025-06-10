import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthUpdate1749551322404 implements MigrationInterface {
    name = 'AuthUpdate1749551322404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_d2a067ba184302e0f82201df9d3"`);
        await queryRunner.query(`CREATE TABLE "users_attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "topics" character varying array NOT NULL, "userType" character varying NOT NULL, CONSTRAINT "PK_5aa310bcaefba1f0426a35a15e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "to" character varying NOT NULL, "type" character varying NOT NULL, "used" boolean NOT NULL DEFAULT false, "expiration" bigint NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_91fef5ed60605b854a2115d2410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "email" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_295ca261e361fd2fd217754dcac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "roadmap_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD "course_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" ADD CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP CONSTRAINT "FK_43c8c9eaef3aab28a806282e22d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roadmap_mapper" DROP COLUMN "course_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "roadmap_id" uuid`);
        await queryRunner.query(`DROP TABLE "attempts"`);
        await queryRunner.query(`DROP TABLE "otps"`);
        await queryRunner.query(`DROP TABLE "users_attributes"`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_d2a067ba184302e0f82201df9d3" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap_mapper"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
