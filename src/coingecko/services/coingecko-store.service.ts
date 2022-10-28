import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CoingeckoStoreService {
    constructor(private readonly redisService: RedisService) {}

    public getPrice(currency: string, date: Date): Promise<string | null> {
        const key = this.createKey(currency, `crypto-price-${date}`);
        return this.redisService.getClient().get(key);
    }

    public setPrice(currency: string, date: Date, price: string): Promise<'OK'> {
        const key = this.createKey(currency, `crypto-price-${date}`);
        return this.redisService.getClient().set(key, price);
    }

    private createKey(currency: string, key: string) {
        return `${currency}-${key}`;
    }
}
