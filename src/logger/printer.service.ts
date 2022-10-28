import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PrinterService {
    private readonly logger = new Logger(PrinterService.name);

    public print(log: string): void {
        this.logger.debug(log);
    }
}
