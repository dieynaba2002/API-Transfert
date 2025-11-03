import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from 'src/audit/audit.service';
import { decodeCursor, encodeCursor } from 'src/common/guards/cursor.helper';
import { ProviderSimulator } from './provider.simulator';
import { TransfersRepository } from './transfers.repository';
import { TransferDocument } from './entities/transfer.schema';

@Injectable()
export class TransfersService {
  constructor(
    private repo: TransfersRepository,
    private audit: AuditService,
  ) {}

  private calcFees(amount: number) {
    const raw = amount * 0.008; 
    const fees = Math.ceil(raw);
    const min = 100;
    const max = 1500;
    return Math.min(Math.max(fees, min), max);
  }

  async create(dto: any) {
    const fees = this.calcFees(dto.amount);
    const total = dto.amount + fees;
    const reference = `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const payload = {
      ...dto,
      fees,
      total,
      status: 'PENDING',
      reference,
    };
    const created = await this.repo.create(payload);
    await this.audit.log('TRANSFER_CREATED', {
      id: (created._id as any).toString(),
      reference,
    });
    return created;
  }

  async get(id: string) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException('Transfer not found');
    return t;
  }

  async list(query: any) {
    const limit = Math.min(parseInt(query.limit || '20', 10), 50);
    const filters: any = {};
    if (query.status) filters.status = query.status;
    if (query.channel) filters.channel = query.channel;
    if (query.minAmount)
      filters.amount = {
        ...(filters.amount || {}),
        $gte: Number(query.minAmount),
      };
    if (query.maxAmount)
      filters.amount = {
        ...(filters.amount || {}),
        $lte: Number(query.maxAmount),
      };
    if (query.q)
      filters.$or = [
        { reference: { $regex: query.q, $options: 'i' } },
        { 'recipient.name': { $regex: query.q, $options: 'i' } },
      ];

    const cursor = query.cursor ? decodeCursor(query.cursor) : undefined;
    const items = await this.repo.query(filters, limit, cursor);

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const next = items[limit - 1] as TransferDocument;
      nextCursor = encodeCursor(
        next.createdAt.toISOString(),
        next._id.toString(),
      );
      items.splice(limit);
    }

    return { items, nextCursor };
  }

  async process(id: string) {
    const transfer = await this.repo.findById(id);
    if (!transfer) throw new NotFoundException();
    if (['SUCCESS', 'FAILED', 'CANCELED'].includes(transfer.status))
      throw new ConflictException('Transfer already finalized');

    await this.repo.update(id, { status: 'PROCESSING' });
    await this.audit.log('TRANSFER_PROCESSING', { id });

    const res = await ProviderSimulator.process();
    if (res.success) {
      const updated = await this.repo.update(id, {
        status: 'SUCCESS',
        provider_ref: res.provider_ref,
      });
      await this.audit.log('TRANSFER_SUCCESS', {
        id,
        provider_ref: res.provider_ref,
      });
      return updated;
    } else {
      const updated = await this.repo.update(id, {
        status: 'FAILED',
        error_code: res.error_code,
      });
      await this.audit.log('TRANSFER_FAILED', {
        id,
        error_code: res.error_code,
      });
      return updated;
    }
  }

  async cancel(id: string) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException();
    if (t.status !== 'PENDING')
      throw new ConflictException('Only pending can be canceled');
    const updated = await this.repo.update(id, { status: 'CANCELED' });
    await this.audit.log('TRANSFER_CANCELED', { id });
    return updated;
  }
}
