import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoansEntity } from './dao/loans.entity';
import { LoansDbHelperService } from './services/loans-db-helper.service';
import { LoansService } from './services/loans-service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([LoansEntity])],
    providers: [LoansService, LoansDbHelperService],
    exports: [LoansService, LoansDbHelperService],
})
export class LoansModule {}
