import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request = context.getArgByIndex(0);
        const start = Date.now();
        return next.handle().pipe(
            tap(() => {
                const ms = Date.now() - start;
                const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
                const host = request.hostname;

                this.logger.verbose(`${host} | ${ip} | ${request.method} ${request.url} - ${ms}ms`);
            }),
        );
    }
}
