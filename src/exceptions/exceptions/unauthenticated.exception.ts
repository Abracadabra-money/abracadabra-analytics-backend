import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { UNAUTHENTICATED_ERRORS } from '../codes/unauthenticated';

export class UnauthenticatedException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || UNAUTHENTICATED_ERRORS.UNAUTHENTICATED, HttpStatus.UNAUTHORIZED);
    }
}
