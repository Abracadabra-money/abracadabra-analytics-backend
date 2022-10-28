import { Module, Scope } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ExceptionsFilter } from './exceptions-filter.filter';
import { HandlerResolverService } from './handler-resolver.service';
import { InternalExceptionHandler, HttpExceptionHandler } from './handlers';

import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [LoggerModule],
    providers: [
        {
            provide: APP_FILTER,
            scope: Scope.REQUEST,
            useClass: ExceptionsFilter,
        },
        HandlerResolverService,
        InternalExceptionHandler,
        HttpExceptionHandler,
    ],
})
export class ExceptionsModule {}
