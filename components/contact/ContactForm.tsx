'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { contactSchema, type ContactFormData } from '@/lib/contact/schema';

export function ContactForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    setServerMessage(null);
    setIsSuccess(false);

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { status?: string; message?: string };

    if (!response.ok || payload.status !== 'success') {
      setServerMessage(payload.message ?? 'Invio non riuscito.');
      return;
    }

    setIsSuccess(true);
    setServerMessage(payload.message ?? 'Richiesta ricevuta. Ti ricontatto appena possibile.');
    reset({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium text-slate-700 dark:text-slate-200">Nome</label>
          <Input id="contact-name" placeholder="Il tuo nome" {...register('name')} aria-invalid={Boolean(errors.name)} />
          {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
          <Input id="contact-email" type="email" placeholder="nome@email.com" {...register('email')} aria-invalid={Boolean(errors.email)} />
          {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700 dark:text-slate-200">Oggetto</label>
        <Input id="contact-subject" placeholder="Di cosa vuoi parlare?" {...register('subject')} aria-invalid={Boolean(errors.subject)} />
        {errors.subject ? <p className="text-xs text-red-600">{errors.subject.message}</p> : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-slate-700 dark:text-slate-200">Messaggio</label>
        <textarea
          id="contact-message"
          rows={6}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Scrivi qui il tuo messaggio..."
          {...register('message')}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? <p className="text-xs text-red-600">{errors.message.message}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" tone="blue" disabled={isSubmitting}>
          {isSubmitting ? 'Invio...' : 'Invia messaggio'}
        </Button>
        {serverMessage ? (
          <p className={`text-sm ${isSuccess ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600'}`}>{serverMessage}</p>
        ) : null}
      </div>
    </form>
  );
}





