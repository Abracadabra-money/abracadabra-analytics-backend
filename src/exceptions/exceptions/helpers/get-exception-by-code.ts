import { HttpStatus } from '@nestjs/common';

import { InternalException, InvalidArgumentException, NotFoundException, PermissionDeniedException, UnauthenticatedException, AlreadyExistsException } from '..';
import { ALREADY_EXIST_ERRORS } from '../../codes/already-exists';
import { INTERNAL_ERRORS } from '../../codes/internal-error';
import { INVALID_ARGUMENT_ERRORS } from '../../codes/invalid-argument';
import { NOT_FOUND_ERRORS } from '../../codes/not-found';
import { PERMISSION_DENIED_ERRORS } from '../../codes/permission-denied';
import { UNAUTHENTICATED_ERRORS } from '../../codes/unauthenticated';

import { BaseException, ErrorCode } from '../base.exception';

export interface ExceptionClassType {
    buildErrorCode(errorCode: ErrorCode, status: HttpStatus): ErrorCode;
    new (errorCode: ErrorCode, status: HttpStatus): BaseException;
}

type ExceptionDataByCode = [ErrorCode, ExceptionClassType];
type ExceptionCodeRecord = Readonly<[number, ExceptionDataByCode]>;

function toExceptionCodesRecords(errorCodes: { [errorCode: string]: ErrorCode }, exceptionClass: ExceptionClassType): ExceptionCodeRecord[] {
    return Object.values(errorCodes).map((errorCode) => [errorCode.code, [errorCode, exceptionClass]]);
}

// Store only exception class to wrap error by code inside handler
export const EXCEPTION_DATA_BY_CODE: Readonly<Map<number, ExceptionDataByCode>> = new Map([
    ...toExceptionCodesRecords(INVALID_ARGUMENT_ERRORS, InvalidArgumentException),
    ...toExceptionCodesRecords(NOT_FOUND_ERRORS, NotFoundException),
    ...toExceptionCodesRecords(PERMISSION_DENIED_ERRORS, PermissionDeniedException),
    ...toExceptionCodesRecords(UNAUTHENTICATED_ERRORS, UnauthenticatedException),
    ...toExceptionCodesRecords(INTERNAL_ERRORS, InternalException),
    ...toExceptionCodesRecords(ALREADY_EXIST_ERRORS, AlreadyExistsException),
]);
