import { ValidationError } from '@nestjs/common';

import { INVALID_ARGUMENT_ERRORS } from '../exceptions/codes';
import { InvalidArgumentException } from '../exceptions/exceptions';

const INVALID_ARGUMENT_ERROR_CODE = INVALID_ARGUMENT_ERRORS.INVALID_ARGUMENT.code;
const DEFAULT_ERROR_MESSAGE = INVALID_ARGUMENT_ERRORS.INVALID_ARGUMENT.message;

function validationErrFactory({ property, value, constraints, children }: ValidationError) {
    return {
        property,
        value,
        constraints,
        children: children.map(validationErrFactory),
    };
}

export function DtoExceptionFactory(errors: ValidationError[]): InvalidArgumentException {
    return new InvalidArgumentException({
        code: INVALID_ARGUMENT_ERROR_CODE,
        message: parseErrorMessage(errors[0]),
        desc: errors.map(validationErrFactory),
    });
}

function parseErrorMessage(err: ValidationError): string {
    if (err.constraints) {
        const [message] = Object.values(err.constraints);
        if (message) {
            return message.toString();
        }
    } else {
        // try to get error message from nested DTO errors
        const childErrors = err.children;
        if (Array.isArray(childErrors) && childErrors.length > 0) {
            return parseErrorMessage(childErrors[0]);
        }
    }

    // otherwise returns default error message,
    // if could not parse validation error
    return DEFAULT_ERROR_MESSAGE;
}
