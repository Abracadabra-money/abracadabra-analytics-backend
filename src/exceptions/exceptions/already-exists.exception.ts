import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { ALREADY_EXIST_ERRORS } from '../codes/already-exists';

export class AlreadyExistsException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || ALREADY_EXIST_ERRORS.ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }
}
