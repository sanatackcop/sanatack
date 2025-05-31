import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionAndTagsToCourseAndModules1748600526738
  implements MigrationInterface
{
  name = 'AddDescriptionAndTagsToCourseAndModules1748600526738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "module" ADD "description" character varying NOT NULL DEFAULT ''`
    );
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "tags"`);
    await queryRunner.query(
      `ALTER TABLE "courses" ADD "tags" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "courses" ADD "tags" jsonb`);
    await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "description"`);
  }
}
