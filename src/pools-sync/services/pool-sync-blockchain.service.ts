import { Injectable } from '@nestjs/common';
import { BigNumber, Log, LogDescription, TransactionResponse } from 'nestjs-ethers';

import { Networks } from '../../blockchain/constants';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { CauldronVer } from '../../pools/dao/pools.entity';
import { CauldronV2Contract__factory } from '../../typechain';
import { stringEquals } from '../../utils';

type EventLog = Log & LogDescription;

export interface IBlockData {
    readonly blockNumber: number;
    readonly timestamp: Date;
    readonly txs: ICauldronTx[];
}

export interface ICauldronTx {
    readonly logs: EventLog[];
    readonly tx: TransactionResponse;
}

@Injectable()
export class PoolSyncBlockchainService {
    constructor(private readonly blockchainService: BlockchainService) {}

    public async getCauldronChangeData(address: string, network: Networks, from: number, to: number): Promise<IBlockData[]> {
        const cauldronInterface = CauldronV2Contract__factory.createInterface();
        const logs = await this.blockchainService.getContractLogs(address, network, from, to);
        const data: { [key: number]: IBlockData } = {};

        for (const log of logs) {
            const eventLog = { ...log, ...cauldronInterface.parseLog(log) };

            if (data[eventLog.blockNumber]) {
                const blockTxs = data[eventLog.blockNumber].txs;
                const index = blockTxs.findIndex(({ tx }) => stringEquals(tx.hash, eventLog.transactionHash));
                if (index !== -1) {
                    data[eventLog.blockNumber].txs[index].logs.push(eventLog);
                } else {
                    const tx = await this.blockchainService.getTransaction(network, log.transactionHash);
                    data[eventLog.blockNumber].txs.push({ tx, logs: [eventLog] });
                }
            } else {
                const tx = await this.blockchainService.getTransaction(network, log.transactionHash);
                const blockTime = await this.blockchainService.getBlockTimestamp(network, tx.blockNumber);
                const timestamp = new Date(Number(blockTime) * 1000);
                data[eventLog.blockNumber] = { blockNumber: tx.blockNumber, timestamp, txs: [{ tx, logs: [eventLog] }] };
            }
        }

        return Object.values(data);
    }

    public async getFeesEarned(address: string, network: Networks, ver: CauldronVer, blockNumber: number): Promise<BigNumber> {
        const cauldron = this.blockchainService.getCauldron(address, network, ver, true);
        const { feesEarned } = await cauldron.accrueInfo({ blockTag: blockNumber });
        return feesEarned;
    }

    public async accountBorrow(cauldronAddress: string, ver: CauldronVer, network: Networks, account: string, blockNumber: number): Promise<BigNumber[]> {
        const cauldron = this.blockchainService.getCauldron(cauldronAddress, network, ver, true);
        return Promise.all([blockNumber - 1, blockNumber].map((blockTag) => cauldron.userBorrowPart(account, { blockTag })));
    }

    public async accountCollateral(cauldronAddress: string, ver: CauldronVer, network: Networks, account: string, blockNumber: number): Promise<BigNumber[]> {
        const cauldron = this.blockchainService.getCauldron(cauldronAddress, network, ver, true);
        return Promise.all([blockNumber - 1, blockNumber].map((blockTag) => cauldron.userCollateralShare(account, { blockTag })));
    }
}
