import { Module } from '@nestjs/common';

import { PoolSyncBlockchainService } from './services/pool-sync-blockchain.service';
import { PoolSyncDbHelperService } from './services/pool-sync-db-helper.service';
import { PoolSyncTaskCreatorService } from './services/pool-sync-task-creator.service';
import { PoolSyncTaskUtilsService } from './services/pool-sync-task-utils.service';
import { PoolSyncTaskService } from './services/pool-sync-task.service';

@Module({
    providers: [PoolSyncTaskService, PoolSyncTaskUtilsService, PoolSyncTaskCreatorService, PoolSyncDbHelperService, PoolSyncBlockchainService],
})
export class PoolsSyncModule {}
