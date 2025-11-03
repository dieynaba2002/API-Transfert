import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from 'src/audit/audit.module';
import { Transfer, TransferSchema } from './entities/transfer.schema';
import { TransfersRepository } from './transfers.repository';

@Module({
  controllers: [TransfersController],
  imports: [
    MongooseModule.forFeature([
      { name: Transfer.name, schema: TransferSchema },
    ]),
    AuditModule,
  ],
  providers: [TransfersService, TransfersRepository],
  exports: [TransfersService],
})
export class TransfersModule {}
