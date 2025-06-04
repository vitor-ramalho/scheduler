module.exports = {
  type: process.env.TYPEORM_CONNECTION || 'postgres',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'changeme',
  database: process.env.TYPEORM_DATABASE || 'scheduler',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING || false,
  entities: [process.env.TYPEORM_ENTITIES || 'dist/**/*.entity.js'],
  migrations: [process.env.TYPEORM_MIGRATIONS || 'dist/migrations/*.js'],
  migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || 'dist/migrations',
  cli: {
    migrationsDir: 'src/migrations',
  },
};
