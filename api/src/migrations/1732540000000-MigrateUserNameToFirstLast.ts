import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateUserNameToFirstLast1732540000000 implements MigrationInterface {
  name = 'MigrateUserNameToFirstLast1732540000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "firstName" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "lastName" character varying`);

    // Copy existing data from "name" into firstName (full name) and leave lastName null
    // If a space exists, try to split into first and rest
    await queryRunner.query(`UPDATE "users" SET "firstName" = split_part("name", ' ', 1), "lastName" = (
      CASE
        WHEN position(' ' in "name") > 0 THEN substring("name" from position(' ' in "name") + 1)
        ELSE ''
      END
    ) WHERE "name" IS NOT NULL`);

    // Make columns non-nullable with sensible defaults if desired
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL`);

    // Drop old "name" column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate name column and populate from firstName + ' ' + lastName
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "name" character varying`);
    await queryRunner.query(`UPDATE "users" SET "name" = CONCAT("firstName", ' ', "lastName")`);

    // Drop firstName/lastName columns
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName"`);
  }
}
