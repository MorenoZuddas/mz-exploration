import mongoose, { Document, Schema } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  source: 'contact_form';
  status: 'received' | 'email_sent' | 'email_failed';
  user_agent?: string;
  email_error?: string;
  email_sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    source: {
      type: String,
      enum: ['contact_form'],
      default: 'contact_form',
      required: true,
    },
    status: {
      type: String,
      enum: ['received', 'email_sent', 'email_failed'],
      default: 'received',
      required: true,
    },
    user_agent: { type: String },
    email_error: { type: String },
    email_sent_at: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

contactMessageSchema.index({ created_at: -1 });
contactMessageSchema.index({ status: 1, created_at: -1 });
contactMessageSchema.index({ email: 1, created_at: -1 });

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema, 'contact_messages');


