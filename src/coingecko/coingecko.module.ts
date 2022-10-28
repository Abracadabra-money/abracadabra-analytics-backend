import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { CoingeckoClientService } from './services/coingecko-client.service';
import { CoingeckoService } from './services/coingecko-service';
import { CoingeckoStoreService } from './services/coingecko-store.service';

@Global()
@Module({
    imports: [HttpModule],
    providers: [CoingeckoStoreService, CoingeckoClientService, CoingeckoService],
    exports: [CoingeckoService],
})
export class CoingeckoModule {}
