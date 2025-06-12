import { MigrationInterface, QueryRunner } from 'typeorm';

export class CrouseProgress1749747214579 implements MigrationInterface {
  name = 'CrouseProgress1749747214579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "progress_count" integer NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "progress_count"`
    );
  }
}
