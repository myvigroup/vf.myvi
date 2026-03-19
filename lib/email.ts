import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'MYVI Dialog <noreply@vf.myvi.de>'

export async function sendStatusChangeEmail({
  to,
  beraterName,
  firmaName,
  oldStatus,
  newStatus,
}: {
  to: string
  beraterName: string
  firmaName: string
  oldStatus: string
  newStatus: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[E-Mail] Kein RESEND_API_KEY — E-Mail übersprungen:', { to, firmaName, newStatus })
    return
  }

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Deal "${firmaName}" — Neuer Status: ${newStatus}`,
    text: `Hallo ${beraterName},

der Status Ihres Deals "${firmaName}" wurde aktualisiert:

  ${oldStatus}  →  ${newStatus}

Schauen Sie im Dashboard nach:
${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Ihr MYVI Team`,
  })
}

export async function sendNewDealNotification({
  to,
  firmenberaterName,
  firmaName,
  beraterName,
  bereich,
}: {
  to: string
  firmenberaterName: string
  firmaName: string
  beraterName: string
  bereich: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[E-Mail] Kein RESEND_API_KEY — E-Mail übersprungen:', { to, firmaName })
    return
  }

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Neuer Deal: "${firmaName}" von ${beraterName}`,
    text: `Hallo ${firmenberaterName},

ein neuer Deal wurde eingereicht:

  Firma: ${firmaName}
  Berater: ${beraterName}
  Bereich: ${bereich || 'Nicht angegeben'}

Bitte prüfen Sie den Deal in der SharePoint-Liste.

Ihr MYVI System`,
  })
}
