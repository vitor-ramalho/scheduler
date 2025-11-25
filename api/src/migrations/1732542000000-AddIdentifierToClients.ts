import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdentifierToClients1732542000000
  implements MigrationInterface
{
  name = 'AddIdentifierToClients1732542000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('⬆️  Running migration: AddIdentifierToClients');
    
    // Add identifier column to clients (nullable, unique)
    console.log('   Adding identifier column to clients table...');
    await queryRunner.query(
      `ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "identifier" character varying`,
    );

    // Add unique constraint
    console.log('   Adding unique constraint to identifier column...');
    await queryRunner.query(
      `ALTER TABLE "clients" ADD CONSTRAINT "UQ_clients_identifier" UNIQUE ("identifier")`,
    );
    
    console.log('✅ Migration AddIdentifierToClients completed');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('⬇️  Reverting migration: AddIdentifierToClients');
    
    // Drop unique constraint
    console.log('   Dropping unique constraint from identifier column...');
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT IF EXISTS "UQ_clients_identifier"`,
    );

    // Drop column
    console.log('   Dropping identifier column from clients table...');
    await queryRunner.query(
      `ALTER TABLE "clients" DROP COLUMN IF EXISTS "identifier"`,
    );
    
    console.log('✅ Migration AddIdentifierToClients reverted');
  }
}
