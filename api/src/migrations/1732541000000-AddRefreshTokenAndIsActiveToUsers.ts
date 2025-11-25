import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenAndIsActiveToUsers1732541000000
  implements MigrationInterface
{
  name = 'AddRefreshTokenAndIsActiveToUsers1732541000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add refreshToken column (nullable)
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "refreshToken" character varying`,
    );

    // Add isActive column (default false)
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the columns
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "refreshToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "isActive"`,
    );
  }
}
