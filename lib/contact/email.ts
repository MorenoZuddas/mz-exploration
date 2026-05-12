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

function getSiteUrl(): string {
  return process.env.SITE_URL?.trim().replace(/\/$/, '') || '';
}

// ─── Template admin (notifica interna) ───────────────────────────────────────

function buildAdminHtml(submission: ContactSubmission, receivedAt: Date): string {
  const siteUrl = getSiteUrl();
  const encodedSubject = encodeURIComponent(`Re: ${submission.subject}`);
  const dateStr = receivedAt.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = receivedAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:28px 36px 24px;">
            ${siteUrl
              ? `<a href="${siteUrl}" style="text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;">MZ EXPLORATION</a>`
              : `<span style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;">MZ EXPLORATION</span>`
            }
            <h1 style="margin:10px 0 4px;font-size:20px;font-weight:700;color:#f8fafc;">✉️ Nuovo messaggio ricevuto</h1>
            <p style="margin:0;font-size:13px;color:#94a3b8;">Qualcuno ti ha scritto dal form di contatto</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px 36px;">

            <!-- Data e ora -->
            <p style="margin:0 0 24px;font-size:13px;color:#64748b;">
              📅 <strong style="color:#0f172a;">${dateStr}</strong> alle <strong style="color:#0f172a;">${timeStr}</strong>
            </p>

            <!-- Da -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0 0 3px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Da</p>
                  <p style="margin:0 0 6px;font-size:14px;color:#0f172a;">Nome: <strong>${escapeHtml(submission.name)}</strong></p>
                  <p style="margin:0;font-size:14px;color:#0f172a;">E-mail: <a href="mailto:${escapeHtml(submission.email)}" style="color:#0ea5e9;text-decoration:none;"><strong>${escapeHtml(submission.email)}</strong></a></p>
                </td>
              </tr>
            </table>

            <!-- Oggetto -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0 0 3px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Oggetto</p>
                  <p style="margin:0;font-size:15px;font-weight:500;color:#0f172a;">${escapeHtml(submission.subject)}</p>
                </td>
              </tr>
            </table>

            <!-- Messaggio -->
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Messaggio</p>
            <div style="background:#f8fafc;border-left:4px solid #0f172a;border-radius:0 10px 10px 0;padding:16px 20px;font-size:15px;line-height:1.8;color:#334155;white-space:pre-wrap;">${escapeHtml(submission.message)}</div>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td align="center">
                  <a href="mailto:${escapeHtml(submission.email)}?subject=${encodedSubject}" style="display:inline-block;background:#0f172a;color:#f8fafc;text-decoration:none;font-size:14px;font-weight:600;padding:13px 30px;border-radius:8px;">
                    Rispondi a ${escapeHtml(submission.name)} →
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Form di contatto · MZ Exploration</p>
                  ${submission.userAgent ? `<p style="margin:3px 0 0;font-size:11px;color:#cbd5e1;" title="${escapeHtml(submission.userAgent)}">🌐 ${escapeHtml(submission.userAgent).substring(0, 50)}${submission.userAgent.length > 50 ? '…' : ''}</p>` : ''}
                </td>
                ${siteUrl ? `<td align="right"><a href="${siteUrl}" style="font-size:12px;color:#0ea5e9;text-decoration:none;">Vai al sito →</a></td>` : ''}
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}


// ─── Template utente (conferma automatica) ────────────────────────────────────

function buildUserHtml(submission: ContactSubmission, receivedAt: Date): string {
  const siteUrl = getSiteUrl();
  const dateStr = receivedAt.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = receivedAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:28px 36px 24px;">
            ${siteUrl
              ? `<a href="${siteUrl}" style="text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;">MZ EXPLORATION</a>`
              : `<span style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#38bdf8;">MZ EXPLORATION</span>`
            }
            <h1 style="margin:10px 0 4px;font-size:20px;font-weight:700;color:#f8fafc;">✅ Messaggio ricevuto</h1>
            <p style="margin:0;font-size:13px;color:#94a3b8;">Grazie per averci contattato, ${escapeHtml(submission.name)}.</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px 36px;">

            <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
              Abbiamo ricevuto il tuo messaggio il <strong>${dateStr}</strong> alle <strong>${timeStr}</strong> e ti risponderemo il prima possibile.
            </p>

            <!-- Data e ora -->
            <p style="margin:0 0 24px;font-size:13px;color:#64748b;">
              📅 <strong style="color:#0f172a;">${dateStr}</strong> alle <strong style="color:#0f172a;">${timeStr}</strong>
            </p>

            <!-- Da -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0 0 3px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Da</p>
                  <p style="margin:0 0 6px;font-size:14px;color:#0f172a;">Nome: <strong>${escapeHtml(submission.name)}</strong></p>
                  <p style="margin:0;font-size:14px;color:#0f172a;">E-mail: <a href="mailto:${escapeHtml(submission.email)}" style="color:#0ea5e9;text-decoration:none;"><strong>${escapeHtml(submission.email)}</strong></a></p>
                </td>
              </tr>
            </table>

            <!-- Oggetto -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0 0 3px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Oggetto</p>
                  <p style="margin:0;font-size:15px;font-weight:500;color:#0f172a;">${escapeHtml(submission.subject)}</p>
                </td>
              </tr>
            </table>

            <!-- Messaggio -->
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Messaggio</p>
            <div style="background:#f8fafc;border-left:4px solid #0f172a;border-radius:0 10px 10px 0;padding:16px 20px;font-size:15px;line-height:1.8;color:#334155;white-space:pre-wrap;">${escapeHtml(submission.message)}</div>

            ${siteUrl ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
              <tr>
                <td align="center">
                  <a href="${siteUrl}" style="display:inline-block;background:#0f172a;color:#f8fafc;text-decoration:none;font-size:14px;font-weight:600;padding:13px 30px;border-radius:8px;">
                    ← Torna su MZ Exploration
                  </a>
                </td>
              </tr>
            </table>` : ''}

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 36px;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Questa è una conferma automatica — non rispondere a questa email.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

// ─── Funzione principale ──────────────────────────────────────────────────────

export async function sendContactNotification(submission: ContactSubmission): Promise<ContactEmailResult> {
  const receivedAt = new Date();
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

  const plainTextAdmin = [
    'Nuovo messaggio dal form di contatto',
    '',
    `Nome: ${submission.name}`,
    `Email: ${submission.email}`,
    `Oggetto: ${submission.subject}`,
    '',
    'Messaggio:',
    submission.message,
    submission.userAgent ? `\nUser agent: ${submission.userAgent}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const plainTextUser = [
    `Ciao ${submission.name},`,
    '',
    'Abbiamo ricevuto il tuo messaggio e ti risponderemo il prima possibile.',
    '',
    `Oggetto: ${submission.subject}`,
    '',
    'Il tuo messaggio:',
    submission.message,
    '',
    '---',
    'Questa è una conferma automatica — non rispondere a questa email.',
  ].join('\n');

  try {
    await transporter.verify();

    // Mail all'admin
    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: submission.email,
      subject: `Nuovo contatto: ${submission.subject}`,
      text: plainTextAdmin,
      html: buildAdminHtml(submission, receivedAt),
    });

    // Mail di conferma all'utente
    await transporter.sendMail({
      from: fromAddress,
      to: submission.email,
      subject: `Abbiamo ricevuto il tuo messaggio — ${submission.subject}`,
      text: plainTextUser,
      html: buildUserHtml(submission, receivedAt),
    });

    return { status: 'sent' };
  } catch (error) {
    const reason = formatSmtpError(error);
    return { status: 'failed', reason };
  }
}