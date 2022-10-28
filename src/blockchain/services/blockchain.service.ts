import { Injectable } from '@nestjs/common';
import { InjectEthersProvider, Log, StaticJsonRpcProvider, TransactionResponse } from 'nestjs-ethers';

import { CauldronVer } from '../../pools/dao/pools.entity';
import {
    CauldronV1Contract,
    CauldronV1Contract__factory,
    CauldronV2Contract,
    CauldronV2Contract__factory,
    BentoboxContract,
    BentoboxContract__factory,
    MimTimeLpContract,
    MimTimeLpContract__factory,
    MimPrice,
    MimPrice__factory,
} from '../../typechain';

import { Networks } from '../constants';

@Injectable()
export class BlockchainService {
    constructor(
        @InjectEthersProvider('eth')
        private readonly ethProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('bsc')
        private readonly bscProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('ftm')
        private readonly ftmProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('avax')
        private readonly avaxProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('arb')
        private readonly arbProvider: StaticJsonRpcProvider,

        @InjectEthersProvider('eth-archive')
        private readonly ethArchiveProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('bsc-archive')
        private readonly bscArchiveProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('ftm-archive')
        private readonly ftmArchiveProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('avax-archive')
        private readonly avaxArchiveProvider: StaticJsonRpcProvider,
        @InjectEthersProvider('arb-archive')
        private readonly arbArchiveProvider: StaticJsonRpcProvider,
    ) {}

    public getProvider(network: Networks, archive = false): StaticJsonRpcProvider {
        if (network === Networks.MAINNET) return archive ? this.ethArchiveProvider : this.ethProvider;
        if (network === Networks.BINANCE) return archive ? this.bscArchiveProvider : this.bscProvider;
        if (network === Networks.FANTOM) return archive ? this.ftmArchiveProvider : this.ftmProvider;
        if (network === Networks.AVALANCHE) return archive ? this.avaxArchiveProvider : this.avaxProvider;
        if (network === Networks.ARBITRUM) return archive ? this.arbArchiveProvider : this.arbProvider;

        throw new Error(`${network} provider not implemented`);
    }

    public getCauldron(address: string, network: Networks, ver: CauldronVer, archive?: boolean): CauldronV1Contract | CauldronV2Contract {
        const provider = this.getProvider(network, archive);

        switch (ver) {
            default: {
                throw Error('Cauldron not not supported');
            }
            case CauldronVer.V1: {
                return CauldronV1Contract__factory.connect(address, provider);
            }
            case CauldronVer.V2: {
                return CauldronV2Contract__factory.connect(address, provider);
            }
        }
    }

    public getBentobox(address: string, network: Networks): BentoboxContract {
        const provider = this.getProvider(network);
        return BentoboxContract__factory.connect(address, provider);
    }

    public async getContractLogs(address: string, network: Networks, from: number, to: number): Promise<Log[]> {
        const provider = this.getProvider(network, true);
        return provider.getLogs({ fromBlock: from, toBlock: to, address });
    }

    public async getBlockTimestamp(network: Networks, blockNumber: number): Promise<number> {
        const provider = this.getProvider(network);
        const block = await provider.getBlock(blockNumber);
        const { timestamp } = block;
        return timestamp;
    }

    public async getTransaction(network: Networks, txHash: string): Promise<TransactionResponse> {
        const provider = this.getProvider(network);
        return provider.getTransaction(txHash);
    }

    public getLpContract(address: string, network: Networks): MimTimeLpContract {
        const provider = this.getProvider(network);
        return MimTimeLpContract__factory.connect(address, provider);
    }

    public getMimPriceContract(): MimPrice {
        const address = '0x7A364e8770418566e3eb2001A96116E6138Eb32F';
        return MimPrice__factory.connect(address, this.ethProvider);
    }
}
