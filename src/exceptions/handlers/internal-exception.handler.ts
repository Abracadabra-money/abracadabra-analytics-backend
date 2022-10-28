import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { LoggerService } from '../../logger/logger.service';

import { INTERNAL_ERRORS } from '../codes/internal-error';
import { InternalException, BaseException } from '../exceptions';
import { ExceptionHandlerInterface } from '../handler-resolver.service';

@Injectable()
export class InternalExceptionHandler implements ExceptionHandlerInterface {
    constructor(private readonly logger: LoggerService) {}

    public handle(exception: any): Observable<void> {
        return of(
            this.logger.critical('Internal error', {
                error: exception,
            }),
        );
    }

    public wrapError({ message, code }: any = {}): BaseException {
        const { INTERNAL_ERROR } = INTERNAL_ERRORS;
        return new InternalException({ code: code || INTERNAL_ERROR.code, message: message || INTERNAL_ERROR.message });
    }
}
