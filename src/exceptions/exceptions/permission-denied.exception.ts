import { HttpStatus } from '@nestjs/common';

import { BaseException, ErrorCodeType } from './base.exception';

import { PERMISSION_DENIED_ERRORS } from '../codes/permission-denied';

export class PermissionDeniedException extends BaseException {
    constructor(customCode?: ErrorCodeType) {
        super(customCode || PERMISSION_DENIED_ERRORS.PERMISSION_DENIED, HttpStatus.FORBIDDEN);
    }
}
