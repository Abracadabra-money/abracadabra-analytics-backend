import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { UNAVAILABLE_ERRORS } from '../codes/unavailable';

export class UnavailableException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || UNAVAILABLE_ERRORS.UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
