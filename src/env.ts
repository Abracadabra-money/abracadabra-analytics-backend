import { join } from 'path';

import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

const { env } = process;

// App
export const APP_PORT = parseInt(env.APP_PORT);

// Logger
export const LOG_FOLDER_PATH = join(process.cwd(), '/logs');

// Database
export const { DB_HOST } = env;
export const DB_PORT = parseInt(env.DB_PORT);
export const { DB_USER } = env;
export const { DB_PASSWORD } = env;
export const { DB_NAME } = env;
export const DB_SSL = env.DB_USE_SSL !== '0' ? { rejectUnauthorized: env.DB_REJECT_UNAUTHORIZED !== '0' } : null;

// Filestore
export const FILE_FOLDER_PATH = join(process.cwd(), '/uploads');

// Blockchain
export const { ETHERSCAN_API_KEY } = env;
export const { ETH_RPC, BSC_RPC, FTM_RPC, AVAX_RPC, ARB_RPC, ETH_ARCHIVE_RPC, BSC_ARCHIVE_RPC, FTM_ARCHIVE_RPC, AVAX_ARCHIVE_RPC, ARB_ARCHIVE_RPC } = env;

export const LOGS_SYNC_STEP = 2000;

// Redis
export const redisOptions: RedisModuleOptions = {
    config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
    },
};

// Zapper
export const { ZAPPER_API_KEY } = env;
