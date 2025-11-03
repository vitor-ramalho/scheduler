import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnabledToOrganizations1698750000000
  implements MigrationInterface
{
  name = 'AddEnabledToOrganizations1698750000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename isActive to enabled and change default to false
    await queryRunner.query(`
      ALTER TABLE "organizations" 
      RENAME COLUMN "isActive" TO "enabled"
    `);

    // Update default value to false
    await queryRunner.query(`
      ALTER TABLE "organizations" 
      ALTER COLUMN "enabled" SET DEFAULT false
    `);

    // Set all existing organizations to disabled by default
    await queryRunner.query(`
      UPDATE "organizations" SET "enabled" = false WHERE "enabled" = true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to isActive with default true
    await queryRunner.query(`
      ALTER TABLE "organizations" 
      ALTER COLUMN "enabled" SET DEFAULT true
    `);

    await queryRunner.query(`
      ALTER TABLE "organizations" 
      RENAME COLUMN "enabled" TO "isActive"
    `);
  }
}
