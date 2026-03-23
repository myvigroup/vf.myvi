import { Resend } from "resend"
import { render } from "@react-email/components"
import {
  DealConfirmationEmail,
  CommentNotificationEmail,
  ActivityNotificationEmail,
} from "./templates"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? "dialoge@myvi.de"

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

    await resend.emails.send({
      from: `MYVI Dialog <${FROM}>`,
      to: beraterEmail,
      subject: `✅ Dein Deal wurde eingereicht – ${firmaName}`,
      html,
    })
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

    await resend.emails.send({
      from: `MYVI Dialog <${FROM}>`,
      to: fbEmail,
      subject: `💬 Neuer Kommentar von ${beraterName} – ${firmaName}`,
      html,
    })
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

    await resend.emails.send({
      from: `MYVI Dialog <${FROM}>`,
      to: beraterEmail,
      subject: `🔔 Update zu deinem Deal – ${firmaName}`,
      html,
    })
  } catch (error) {
    console.error("Email sendActivityNotificationToBerater failed:", error)
  }
}
