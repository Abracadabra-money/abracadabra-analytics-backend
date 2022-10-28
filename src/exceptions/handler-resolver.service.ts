import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { BaseException } from './exceptions';
import { InternalExceptionHandler, HttpExceptionHandler } from './handlers';

export interface ExceptionHandlerInterface {
    handle(exception: any): Observable<void>;
    wrapError(exception: any): BaseException;
}

export interface IsSoughtForExpressionInterface {
    isSoughtForException(exception: any): boolean;
}

@Injectable()
export class HandlerResolverService {
    private readonly handlers: (IsSoughtForExpressionInterface & ExceptionHandlerInterface)[];

    constructor(private readonly internalExceptionHandler: InternalExceptionHandler, private readonly httpExceptionHandler: HttpExceptionHandler) {
        this.handlers = [this.httpExceptionHandler];
    }

    public resolve(exception: Error): ExceptionHandlerInterface {
        const handler = this.handlers.find((h) => h.isSoughtForException(exception));

        if (!handler) {
            return this.internalExceptionHandler;
        }

        return handler;
    }
}
