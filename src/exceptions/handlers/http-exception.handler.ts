import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { LoggerService } from '../../logger/logger.service';

import { InternalException, BaseException } from '../exceptions';
import { EXCEPTION_DATA_BY_CODE } from '../exceptions/helpers/get-exception-by-code';
import { ExceptionHandlerInterface } from '../handler-resolver.service';

@Injectable()
export class HttpExceptionHandler implements ExceptionHandlerInterface {
    constructor(private readonly logger: LoggerService) {}

    isSoughtForException(exception: any): boolean {
        const { code: errorCode }: any = exception.response ? exception.response : {};
        return exception instanceof Error && EXCEPTION_DATA_BY_CODE.has(errorCode);
    }

    handle(exception: any): Observable<void> {
        return of(
            this.logger.warning('HTTP exception', {
                error: exception,
            }),
        );
    }

    wrapError(exception: any): BaseException {
        const { code: errorCode }: any = exception.response ? exception.response : {};

        if (EXCEPTION_DATA_BY_CODE.has(errorCode)) {
            return exception;
        }

        return new InternalException();
    }
}
