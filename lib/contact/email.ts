import nodemailer from 'nodemailer';

type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
  userAgent?: string | null;
};

export type ContactEmailResult =
  | { status: 'sent' }
  | { status: 'disabled'; reason: string }
  | { status: 'missing-config'; reason: string }
  | { status: 'failed'; reason: string };

type SmtpError = Error & {
  code?: string;
  response?: string;
  responseCode?: number;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getPort(): number {
  const rawPort = Number.parseInt(process.env.EMAIL_PORT || '587', 10);
  return Number.isNaN(rawPort) ? 587 : rawPort;
}

function getFromAddress(): string | null {
  const host = process.env.EMAIL_HOST?.trim().toLowerCase() || '';
  const user = process.env.EMAIL_USER?.trim() || '';
  const configuredFrom = process.env.EMAIL_FROM?.trim() || '';

  // Gmail in genere accetta invio solo dall'account autenticato.
  if (host.includes('gmail.com')) {
    return user || null;
  }

  return configuredFrom || user || null;
}

function formatSmtpError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Unknown email transport error';
  }

  const smtpError = error as SmtpError;
  const details = [smtpError.code, smtpError.responseCode ? String(smtpError.responseCode) : null, smtpError.response]
    .filter(Boolean)
    .join(' | ');

  return details ? `${smtpError.message} (${details})` : smtpError.message;
}

function getConfigIssues(): string[] {
  const issues: string[] = [];

  if (!process.env.EMAIL_HOST?.trim()) issues.push('EMAIL_HOST');
  if (!process.env.EMAIL_USER?.trim()) issues.push('EMAIL_USER');
  if (!process.env.EMAIL_PASSWORD?.trim()) issues.push('EMAIL_PASSWORD');
  if (!process.env.ADMIN_EMAIL?.trim()) issues.push('ADMIN_EMAIL');
  if (!getFromAddress()) issues.push('EMAIL_FROM');

  return issues;
}

export async function sendContactNotification(submission: ContactSubmission): Promise<ContactEmailResult> {
  if (process.env.NOTIFY_EMAIL === 'false') {
    return { status: 'disabled', reason: 'Email notifications disabled by NOTIFY_EMAIL=false.' };
  }

  const issues = getConfigIssues();
  if (issues.length > 0) {
    return {
      status: 'missing-config',
      reason: `Missing email configuration: ${issues.join(', ')}`,
    };
  }

  const port = getPort();
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const fromAddress = getFromAddress();
  const adminEmail = process.env.ADMIN_EMAIL?.trim();

  if (!fromAddress || !adminEmail) {
    return {
      status: 'missing-config',
      reason: 'Email sender or recipient address is not configured.',
    };
  }

  const userAgentLine = submission.userAgent ? `\nUser agent: ${submission.userAgent}` : '';
  const plainText = [
    'Nuovo messaggio dal form di contatto',
    '',
    `Nome: ${submission.name}`,
    `Email: ${submission.email}`,
    `Oggetto: ${submission.subject}`,
    '',
    'Messaggio:',
    submission.message,
    userAgentLine,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">Nuovo messaggio dal form di contatto</h2>
      <p><strong>Nome:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p>
      <p><strong>Oggetto:</strong> ${escapeHtml(submission.subject)}</p>
      <p><strong>Messaggio:</strong></p>
      <div style="white-space: pre-wrap; border-left: 4px solid #2563eb; padding-left: 12px; margin: 12px 0 20px;">${escapeHtml(submission.message)}</div>
      ${submission.userAgent ? `<p style="color: #475569;"><strong>User agent:</strong> ${escapeHtml(submission.userAgent)}</p>` : ''}
    </div>
  `;

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: submission.email,
      subject: `Nuovo contatto: ${submission.subject}`,
      text: plainText,
      html,
    });

    return { status: 'sent' };
  } catch (error) {
    const reason = formatSmtpError(error);
    return { status: 'failed', reason };
  }
}

