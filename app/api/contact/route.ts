import { NextResponse } from 'next/server';

import { contactSchema } from '@/lib/contact/schema';
import { sendContactNotification } from '@/lib/contact/email';
import { connectToDatabase } from '@/lib/db/connection';
import { ContactMessage } from '@/lib/db/models/ContactMessage';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Dati non validi',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const userAgent = request.headers.get('user-agent') ?? undefined;

    let persistedMessageId: string | null = null;

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const persistedMessage = await ContactMessage.create({
          name,
          email,
          subject,
          message,
          source: 'contact_form',
          status: 'received',
          user_agent: userAgent,
          created_at: new Date(),
          updated_at: new Date(),
        });
        persistedMessageId = persistedMessage._id.toString();
      } catch (dbError) {
        console.warn('Contact message not persisted to MongoDB:', dbError);
      }
    }

    const emailResult = await sendContactNotification({
      name,
      email,
      subject,
      message,
      userAgent,
    });

    if (emailResult.status !== 'sent') {
      console.warn('Contact email notification not sent', {
        status: emailResult.status,
        reason: 'reason' in emailResult ? emailResult.reason : undefined,
        messageId: persistedMessageId,
      });
    }

    if (persistedMessageId) {
      try {
        const update: Record<string, unknown> = { updated_at: new Date() };

        if (emailResult.status === 'sent') {
          update.status = 'email_sent';
          update.email_sent_at = new Date();
          update.email_error = undefined;
        } else if (emailResult.status === 'failed') {
          update.status = 'email_failed';
          update.email_error = emailResult.reason;
        }

        await ContactMessage.findByIdAndUpdate(persistedMessageId, update);
      } catch (updateError) {
        console.warn('Contact message not updated after email attempt:', updateError);
      }
    }

    return NextResponse.json({
      status: 'success',
      message:
        emailResult.status === 'sent'
          ? 'Richiesta ricevuta. Ti ricontatto appena possibile.'
          : 'Richiesta ricevuta. Ho salvato il messaggio e sto verificando la notifica email.',
      email_notification: emailResult.status,
      email_reason:
        emailResult.status === 'failed' || emailResult.status === 'missing-config' || emailResult.status === 'disabled'
          ? emailResult.reason
          : undefined,
    });
  } catch (error) {
    console.error('POST /api/contact error', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Invio non riuscito. Riprova tra poco.',
      },
      { status: 500 }
    );
  }
}





