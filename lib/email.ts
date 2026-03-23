const BREVO_API_KEY = process.env.BREVO_API_KEY
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? 'digitalmarketing@myvi.de'
const FROM_NAME = 'MYVI Dialog'

async function sendEmail(to: string, subject: string, text: string) {
  if (!BREVO_API_KEY) {
    console.log('[E-Mail] Kein BREVO_API_KEY — E-Mail übersprungen:', { to, subject })
    return
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  })

  if (!res.ok) {
    console.error(`Brevo email failed: ${res.status} ${await res.text().catch(() => '')}`)
  }
}

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
  await sendEmail(
    to,
    `Deal "${firmaName}" — Neuer Status: ${newStatus}`,
    `Hallo ${beraterName},

der Status Ihres Deals "${firmaName}" wurde aktualisiert:

  ${oldStatus}  →  ${newStatus}

Schauen Sie im Dashboard nach:
${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Ihr MYVI Team`
  )
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
  await sendEmail(
    to,
    `Neuer Deal: "${firmaName}" von ${beraterName}`,
    `Hallo ${firmenberaterName},

ein neuer Deal wurde eingereicht:

  Firma: ${firmaName}
  Berater: ${beraterName}
  Bereich: ${bereich || 'Nicht angegeben'}

Bitte prüfen Sie den Deal in der SharePoint-Liste.

Ihr MYVI Team`
  )
}
