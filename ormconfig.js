const { SnakeNamingStrategy } = require('typeorm-naming-strategies');

const options = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['./*/dao/*', './src/*/dao/*'],
    autoLoadEntities: false,
    logging: process.env.DB_ENABLE_LOGGING !== '0' || false,
    namingStrategy: new SnakeNamingStrategy(),
    migrations: ['./**/dao/migrations/*.ts'],
    cli: { migrationsDir: 'migrations' },
};

if (process.env.DB_USE_SSL !== '0') {
    options.ssl = {
        rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED !== '0',
    };
}

module.exports = options;
