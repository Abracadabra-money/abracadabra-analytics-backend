import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { INVALID_ARGUMENT_ERRORS } from '../codes/invalid-argument';

export class InvalidArgumentException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || INVALID_ARGUMENT_ERRORS.INVALID_ARGUMENT, HttpStatus.BAD_REQUEST);
    }
}
