import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProfessionalRelation1732025000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove the unique constraint on professionalId
    await queryRunner.query(`
      ALTER TABLE "appointments" 
      DROP CONSTRAINT IF EXISTS "REL_9daaaa6d5ad58d503555ad554c"
    `);

    // Recreate the index without unique constraint if needed
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_appointments_professional" 
      ON "appointments" ("professionalId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to unique constraint (for rollback)
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_appointments_professional"
    `);

    await queryRunner.query(`
      ALTER TABLE "appointments" 
      ADD CONSTRAINT "REL_9daaaa6d5ad58d503555ad554c" 
      UNIQUE ("professionalId")
    `);
  }
}
