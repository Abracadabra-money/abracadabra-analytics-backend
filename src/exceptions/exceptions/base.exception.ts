import { HttpException, HttpStatus } from '@nestjs/common';

export interface ValidationError {
    /**
     * Object's property that hasn't passed validation.
     */
    property: string;
    /**
     * Value that hasn't passed validation.
     */
    value: any;
    /**
     * Constraints that failed validation with error messages.
     */
    constraints: {
        [type: string]: string;
    };
    /**
     * Contains all nested validation errors of the property.
     */
    children: ValidationError[];
}

export interface ErrorCode {
    code: number;
    message: string;
    desc?: ValidationError[];
}

export type ErrorCodeType = ErrorCode | null;

export class BaseException extends HttpException {
    constructor(errorCode: ErrorCode, status: HttpStatus) {
        super(BaseException.buildErrorCode(errorCode), status);
    }

    public static buildErrorCode(errorCode: ErrorCode): ErrorCode {
        return {
            code: errorCode.code,
            message: errorCode.message,
            desc: errorCode.desc,
        };
    }
}
