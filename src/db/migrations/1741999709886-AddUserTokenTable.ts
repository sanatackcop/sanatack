import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTokenTable1741999709886 implements MigrationInterface {
    name = 'AddUserTokenTable1741999709886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "refreshToken" character varying, "lastLoginAt" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "role" character varying NOT NULL DEFAULT 'student', "isActive" boolean NOT NULL DEFAULT false, "isVerify" boolean NOT NULL DEFAULT false, "isPro" boolean NOT NULL DEFAULT false, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
    }

}
