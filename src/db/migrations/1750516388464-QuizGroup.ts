import { MigrationInterface, QueryRunner } from 'typeorm';

export class QuizGroup1750516388464 implements MigrationInterface {
  name = 'QuizGroup1750516388464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "quiz_group" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "title" VARCHAR NOT NULL,
        "duration" INT NOT NULL,
        "order" INT NOT NULL DEFAULT 0
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "quiz"
      ADD COLUMN "quiz_group_id" uuid,
      ADD COLUMN "order" INT NOT NULL DEFAULT 0,
      ADD CONSTRAINT "FK_33d6da0a57133d2405a96b5c1f3"
        FOREIGN KEY ("quiz_group_id") REFERENCES "quiz_group"("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "quiz"
      DROP CONSTRAINT "FK_33d6da0a57133d2405a96b5c1f3",
      DROP COLUMN "quiz_group_id",
      DROP COLUMN "order"
    `);

    await queryRunner.query(`DROP TABLE "quiz_group"`);
  }
}
