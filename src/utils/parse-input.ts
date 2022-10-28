import { Transaction } from 'ethers';

import { CauldronV2Contract__factory } from '../typechain';

export const parseInput = (tx: Transaction) => {
    const inter = CauldronV2Contract__factory.createInterface();
    return inter.parseTransaction({ data: tx.data, value: tx.value });
};
