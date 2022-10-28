import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { NOT_FOUND_ERRORS } from '../codes/not-found';

export class NotFoundException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || NOT_FOUND_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
}
