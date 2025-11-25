import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateUserNameToFirstLast1732540000000
  implements MigrationInterface
{
  name = 'MigrateUserNameToFirstLast1732540000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns firstName and lastName
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "firstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastName" character varying`,
    );

    // Copy existing data from "name" into firstName and lastName
    // Split at first space: everything before = firstName, everything after = lastName
    await queryRunner.query(`
      UPDATE "users" 
      SET 
        "firstName" = COALESCE(split_part("name", ' ', 1), ''),
        "lastName" = COALESCE(
          CASE
            WHEN position(' ' in "name") > 0 
            THEN substring("name" from position(' ' in "name") + 1)
            ELSE ''
          END,
          ''
        )
      WHERE "name" IS NOT NULL
    `);

    // Set NOT NULL constraint (safe because we populated above)
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL`,
    );

    // Drop old "name" column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate name column and populate from firstName + ' ' + lastName
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "name" character varying`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "name" = CONCAT("firstName", ' ', "lastName")`,
    );

    // Drop firstName/lastName columns
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName"`,
    );
  }
}
