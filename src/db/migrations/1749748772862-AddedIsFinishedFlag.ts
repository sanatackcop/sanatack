import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedIsFinishedFlag1749748772862 implements MigrationInterface {
  name = 'AddedIsFinishedFlag1749748772862';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" ADD "is_finished" boolean NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enrollment" DROP COLUMN "is_finished"`
    );
  }
}
