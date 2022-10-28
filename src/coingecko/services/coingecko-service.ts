import { Injectable } from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { CoingeckoClientService } from './coingecko-client.service';
import { CoingeckoStoreService } from './coingecko-store.service';

import { CoingeckoCurrency } from '../constants';

@Injectable()
export class CoingeckoService {
    constructor(private readonly coingeckoStoreService: CoingeckoStoreService, private readonly coingeckoClientService: CoingeckoClientService) {}

    public getPrice(currency: CoingeckoCurrency, date: Date): Observable<string> {
        return from(this.coingeckoStoreService.getPrice(currency, date)).pipe(
            mergeMap((price) => {
                if (price && Number(price) !== 0) {
                    return of(price);
                }

                return this.coingeckoClientService.getPrice(currency, date);
            }),
        );
    }
}
