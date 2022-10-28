import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { BaseException } from './exceptions';
import { HandlerResolverService } from './handler-resolver.service';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    constructor(private readonly handlerResolverService: HandlerResolverService) {}

    public catch(exception: any, host: ArgumentsHost): Promise<void | Response> {
        const handler = this.handlerResolverService.resolve(exception);
        return handler
            .handle(exception)
            .toPromise()
            .then(() => this.sendError(handler.wrapError(exception), host));
    }

    public sendError(exception: BaseException, host: ArgumentsHost): Response {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const { message, code, desc }: any = exception.getResponse();

        return response.status(status).json({ message, code, desc, path: request.url, timestamp: new Date().toISOString() });
    }
}
