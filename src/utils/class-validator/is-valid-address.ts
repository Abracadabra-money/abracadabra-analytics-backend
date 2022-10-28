import { isAddress } from 'web3-utils';

import { ValidatorType, wrapValidator } from './validator.wrapper';

export function IsValidAddress(): ValidatorType {
    return wrapValidator('isValidAddress', (value) => isAddress(value), { message: () => 'Invalid address' });
}
