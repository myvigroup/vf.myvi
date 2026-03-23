import { render } from "@react-email/components"
import {
  DealConfirmationEmail,
  CommentNotificationEmail,
  ActivityNotificationEmail,
} from "./templates"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "dialoge@myvi.de"
const FROM_NAME = "MYVI Dialog"

async function sendEmail(to: string, subject: string, html: string) {
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set")
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
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error(`Brevo email failed: ${res.status} ${text}`)
  }
}

/**
 * MAIL 1: Bestätigung an den VF-Berater nach Deal-Einreichung
 */
export async function sendDealConfirmation(
  beraterEmail: string,
  dealId: string,
  firmaName: string
) {
  try {
    const html = await render(
      DealConfirmationEmail({ firmaName, dealId })
    )
    await sendEmail(
      beraterEmail,
      `Dein Deal wurde eingereicht – ${firmaName}`,
      html
    )
  } catch (error) {
    console.error("Email sendDealConfirmation failed:", error)
  }
}

/**
 * MAIL 2: Benachrichtigung an Firmenberater wenn VF-Berater kommentiert
 */
export async function sendCommentNotificationToFB(
  fbEmail: string,
  beraterName: string,
  firmaName: string,
  kommentar: string,
  sharepointId: string
) {
  try {
    const html = await render(
      CommentNotificationEmail({ beraterName, firmaName, kommentar, sharepointId })
    )
    await sendEmail(
      fbEmail,
      `Neuer Kommentar von ${beraterName} – ${firmaName}`,
      html
    )
  } catch (error) {
    console.error("Email sendCommentNotificationToFB failed:", error)
  }
}

/**
 * MAIL 3: Benachrichtigung an VF-Berater wenn Firmenberater Aktivität einträgt
 */
export async function sendActivityNotificationToBerater(
  beraterEmail: string,
  firmaName: string,
  beschreibung: string,
  dealId: string,
  dealStatus: string
) {
  try {
    const html = await render(
      ActivityNotificationEmail({ firmaName, beschreibung, dealId, dealStatus })
    )
    await sendEmail(
      beraterEmail,
      `Update zu deinem Deal – ${firmaName}`,
      html
    )
  } catch (error) {
    console.error("Email sendActivityNotificationToBerater failed:", error)
  }
}
