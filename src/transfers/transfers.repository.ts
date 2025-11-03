import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transfer, TransferDocument } from './entities/transfer.schema';

@Injectable()
export class TransfersRepository {
  constructor(
    @InjectModel(Transfer.name) private model: Model<TransferDocument>,
  ) {}

  async create(payload: Partial<Transfer>) {
    const doc = new this.model(payload);
    return doc.save();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  async findByReference(ref: string) {
    return this.model.findOne({ reference: ref }).exec();
  }

  async update(id: string, update: Partial<Transfer>) {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async query(filters: any, limit: number, cursor?: any) {
    const query = this.model
      .find(filters)
      .sort({ createdAt: -1 })
      .limit(limit + 1);
    if (cursor) {
      query.where('createdAt').lt(new Date(cursor.date as any) as any);
    }
    const items = await query.exec();
    return items;
  }
}
