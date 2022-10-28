import { EthersModuleOptions } from 'nestjs-ethers';

import { ETH_RPC, BSC_RPC, FTM_RPC, AVAX_RPC, ARB_RPC, ETH_ARCHIVE_RPC, BSC_ARCHIVE_RPC, FTM_ARCHIVE_RPC, AVAX_ARCHIVE_RPC, ARB_ARCHIVE_RPC } from '../env';

export enum Networks {
    UNKNOW = 0,
    MAINNET = 1,
    BINANCE = 56,
    FANTOM = 250,
    AVALANCHE = 43114,
    ARBITRUM = 42161,
}

export const ethersModules: EthersModuleOptions[] = [
    { token: 'eth', network: Networks.MAINNET, useDefaultProvider: false, custom: ETH_RPC },
    { token: 'bsc', network: Networks.BINANCE, useDefaultProvider: false, custom: BSC_RPC },
    { token: 'ftm', network: Networks.FANTOM, useDefaultProvider: false, custom: FTM_RPC },
    { token: 'avax', network: Networks.AVALANCHE, useDefaultProvider: false, custom: AVAX_RPC },
    { token: 'arb', network: Networks.ARBITRUM, useDefaultProvider: false, custom: ARB_RPC },

    { token: 'eth-archive', network: Networks.MAINNET, useDefaultProvider: false, custom: ETH_ARCHIVE_RPC },
    { token: 'bsc-archive', network: Networks.BINANCE, useDefaultProvider: false, custom: BSC_ARCHIVE_RPC },
    { token: 'ftm-archive', network: Networks.FANTOM, useDefaultProvider: false, custom: FTM_ARCHIVE_RPC },
    { token: 'avax-archive', network: Networks.AVALANCHE, useDefaultProvider: false, custom: AVAX_ARCHIVE_RPC },
    { token: 'arb-archive', network: Networks.ARBITRUM, useDefaultProvider: false, custom: ARB_ARCHIVE_RPC },
];

export const networks = [Networks.MAINNET, Networks.FANTOM, Networks.ARBITRUM, Networks.AVALANCHE, Networks.BINANCE];
