import { Global, Module } from '@nestjs/common';
import { EthersModule } from 'nestjs-ethers';

import { ethersModules } from './constants';
import { BlockchainService } from './services/blockchain.service';

@Global()
@Module({
    imports: [...ethersModules.map((config) => EthersModule.forRoot(config))],
    providers: [BlockchainService],
    exports: [BlockchainService],
})
export class BlockchainModule {}
