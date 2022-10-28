import { Errors } from './errors.enum';

export const NOT_FOUND_ERRORS = {
    NOT_FOUND: {
        code: Errors.NOT_FOUND,
        message: 'Not found',
    },

    ACCOUNT_NOT_FOUND: {
        code: Errors.ACCOUNT_NOT_FOUND,
        message: 'Account not found',
    },

    POOL_NOT_FOUND: {
        code: Errors.POOL_NOT_FOUND,
        message: 'Pool not found',
    },

    NETWORK_NOT_FOUND: {
        code: Errors.NETWORK_NOT_FOUND,
        message: "Network doesn't support",
    },
};
