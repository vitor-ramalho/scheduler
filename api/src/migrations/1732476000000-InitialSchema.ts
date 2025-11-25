import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1732476000000 implements MigrationInterface {
  name = 'InitialSchema1732476000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable required extensions
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    // Create organizations table
    await queryRunner.query(`
      CREATE TABLE "organizations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "identifier" character varying,
        "phone" character varying,
        "email" character varying,
        "enabled" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_organizations_name" UNIQUE ("name"),
        CONSTRAINT "UQ_organizations_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_organizations" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "refreshToken" character varying,
        "isActive" boolean NOT NULL DEFAULT false,
        "role" character varying NOT NULL DEFAULT 'USER',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "organizationId" uuid,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create clients table
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "birthDate" TIMESTAMP,
        "cpf" character varying,
        "address" character varying,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "organizationId" uuid NOT NULL,
        CONSTRAINT "PK_clients" PRIMARY KEY ("id")
      )
    `);

    // Create professionals table
    await queryRunner.query(`
      CREATE TABLE "professionals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying,
        "phone" character varying,
        "specialty" character varying,
        "crm" character varying,
        "available" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "organizationId" uuid NOT NULL,
        CONSTRAINT "PK_professionals" PRIMARY KEY ("id")
      )
    `);

    // Create appointments table
    await queryRunner.query(`
      CREATE TABLE "appointments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "status" character varying NOT NULL DEFAULT 'SCHEDULED',
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "clientId" uuid NOT NULL,
        "professionalId" uuid NOT NULL,
        "organizationId" uuid NOT NULL,
        CONSTRAINT "PK_appointments" PRIMARY KEY ("id")
      )
    `);

    // Add foreign keys for users
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "FK_users_organization"
      FOREIGN KEY ("organizationId")
      REFERENCES "organizations"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Add foreign keys for clients
    await queryRunner.query(`
      ALTER TABLE "clients"
      ADD CONSTRAINT "FK_clients_organization"
      FOREIGN KEY ("organizationId")
      REFERENCES "organizations"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Add foreign keys for professionals
    await queryRunner.query(`
      ALTER TABLE "professionals"
      ADD CONSTRAINT "FK_professionals_organization"
      FOREIGN KEY ("organizationId")
      REFERENCES "organizations"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Add foreign keys for appointments
    await queryRunner.query(`
      ALTER TABLE "appointments"
      ADD CONSTRAINT "FK_appointments_client"
      FOREIGN KEY ("clientId")
      REFERENCES "clients"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "appointments"
      ADD CONSTRAINT "FK_appointments_professional"
      FOREIGN KEY ("professionalId")
      REFERENCES "professionals"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "appointments"
      ADD CONSTRAINT "FK_appointments_organization"
      FOREIGN KEY ("organizationId")
      REFERENCES "organizations"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    // Create indexes for better performance
    await queryRunner.query(
      `CREATE INDEX "IDX_users_organization" ON "users" ("organizationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_clients_organization" ON "clients" ("organizationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_clients_email" ON "clients" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_professionals_organization" ON "professionals" ("organizationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_client" ON "appointments" ("clientId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_professional" ON "appointments" ("professionalId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_organization" ON "appointments" ("organizationId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appointments_startDate" ON "appointments" ("startDate")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_appointments_startDate"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_organization"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_professional"`);
    await queryRunner.query(`DROP INDEX "IDX_appointments_client"`);
    await queryRunner.query(`DROP INDEX "IDX_professionals_organization"`);
    await queryRunner.query(`DROP INDEX "IDX_clients_email"`);
    await queryRunner.query(`DROP INDEX "IDX_clients_organization"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_users_organization"`);

    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_professional"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_appointments_client"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_professionals_organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clients" DROP CONSTRAINT "FK_clients_organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_users_organization"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "professionals"`);
    await queryRunner.query(`DROP TABLE "clients"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
  }
}
