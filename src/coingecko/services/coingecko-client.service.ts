import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import moment from 'moment';

import { LoggerService } from '../../logger/logger.service';

import { CoingeckoStoreService } from './coingecko-store.service';

import { CoingeckoCurrency } from '../constants';

@Injectable()
export class CoingeckoClientService {
    constructor(private httpService: HttpService, private readonly coingeckoStoreService: CoingeckoStoreService, private readonly logger: LoggerService) {}

    public async getPrice(currency: CoingeckoCurrency, date: Date): Promise<string> {
        let price = currency === CoingeckoCurrency.MIM ? '1' : '0.00029812';

        try {
            const time = moment(date).format('DD-MM-YYYY');
            const url = `https://api.coingecko.com/api/v3/coins/${currency}/history?date=${time}`;

            const { data } = await this.httpService.get(url).toPromise();

            try {
                price = data.market_data.current_price.usd;
            } catch (error) {
                this.logger.info(`Can't get price from coingecko`, { extra: { currency, date } });
            }
            await this.coingeckoStoreService.setPrice(currency, date, price);

            return price;
        } catch (err) {
            await this.coingeckoStoreService.setPrice(currency, date, price);
            return price;
        }
    }
}
