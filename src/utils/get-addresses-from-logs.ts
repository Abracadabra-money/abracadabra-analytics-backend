import { Log } from 'nestjs-ethers';

import { CauldronV2Contract__factory } from '../typechain';

export const getAddressesFromLogs = (logs: Log[]): string[] => {
    const inter = CauldronV2Contract__factory.createInterface();
    const addresses = [];

    const parsedLogs = logs.map((log) => inter.parseLog(log));

    for (const { name, args } of parsedLogs) {
        if (['LogBorrow', 'LogRemoveCollateral'].includes(name)) {
            addresses.push(args.from);
        }

        if (['LogAddCollateral', 'LogRepay'].includes(name)) {
            addresses.push(args.to);
        }
    }

    return [...new Set(addresses)];
};
