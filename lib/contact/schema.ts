import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Inserisci almeno 2 caratteri').max(80, 'Nome troppo lungo'),
  email: z.string().trim().email('Email non valida').max(120, 'Email troppo lunga'),
  subject: z.string().trim().min(3, 'Oggetto troppo corto').max(120, 'Oggetto troppo lungo'),
  message: z.string().trim().min(10, 'Messaggio troppo corto').max(3000, 'Messaggio troppo lungo'),
});

export type ContactFormData = z.infer<typeof contactSchema>;




