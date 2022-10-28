import { ArgumentMetadata, Injectable, ValidationPipe, Optional, ValidationPipeOptions } from '@nestjs/common';

import { DtoExceptionFactory } from './dto-exception-factory';

const DEFAULT_OPTIONS = {
    transform: true,
    exceptionFactory: DtoExceptionFactory,
    validationError: {
        target: false,
        value: false,
    },
};

@Injectable()
export class DtoValidationPipe extends ValidationPipe {
    constructor(@Optional() options?: ValidationPipeOptions) {
        super({
            ...DEFAULT_OPTIONS,
            ...(options || {}),
        });
    }

    public transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        return super.transform(value, metadata);
    }
}
