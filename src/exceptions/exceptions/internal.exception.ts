import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { INTERNAL_ERRORS } from '../codes/internal-error';

export class InternalException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || INTERNAL_ERRORS.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
