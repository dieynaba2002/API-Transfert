import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransferDocument = Transfer &
  Document & {
    _id: Types.ObjectId; 
    createdAt: Date; 
    updatedAt: Date; 
  };
export type TransferStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELED';

@Schema({ timestamps: true })
export class Transfer {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  channel: string;

  @Prop({ required: true, type: Object })
  recipient: { phone: string; name: string };

  @Prop({ default: 'PENDING' })
  status: TransferStatus;

  @Prop({ unique: true })
  reference: string;

  @Prop()
  fees: number;

  @Prop()
  total: number;

  @Prop()
  provider_ref?: string;

  @Prop()
  error_code?: string;

  @Prop({ type: Object })
  metadata?: any;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
