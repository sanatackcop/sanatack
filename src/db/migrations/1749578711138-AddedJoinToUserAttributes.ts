import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedJoinToUserAttributes1749578711138
  implements MigrationInterface
{
  name = 'AddedJoinToUserAttributes1749578711138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_attributes" ADD "user_id" uuid`
    );
    await queryRunner.query(
      `ALTER TABLE "users_attributes" ADD CONSTRAINT "UQ_98bdbf7b29f00d84d9d57069220" UNIQUE ("user_id")`
    );
    await queryRunner.query(
      `ALTER TABLE "users_attributes" ADD CONSTRAINT "FK_98bdbf7b29f00d84d9d57069220" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_attributes" DROP CONSTRAINT "FK_98bdbf7b29f00d84d9d57069220"`
    );
    await queryRunner.query(
      `ALTER TABLE "users_attributes" DROP CONSTRAINT "UQ_98bdbf7b29f00d84d9d57069220"`
    );
    await queryRunner.query(
      `ALTER TABLE "users_attributes" DROP COLUMN "user_id"`
    );
  }
}
