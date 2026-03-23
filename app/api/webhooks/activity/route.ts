import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendActivityNotificationToBerater } from "@/lib/email/resend"

/**
 * POST /api/webhooks/activity
 *
 * Called by Power Automate when a Firmenberater adds an activity in SharePoint.
 * Sends an email notification to the VF Berater.
 *
 * Body: {
 *   berater_email: string   // VF Berater email (from SharePoint BeraterE-Mail field)
 *   firma_name: string      // Company name
 *   beschreibung: string    // Activity description
 *   deal_id: string         // SharePoint item ID
 *   deal_status: string     // Current deal status
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const apiKey = request.headers.get("x-api-key")
    if (apiKey !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { berater_email, firma_name, beschreibung, deal_id, deal_status } = body

    if (!berater_email || !firma_name || !beschreibung || !deal_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Look up berater in Supabase to get their email (in case we need to verify)
    const supabase = createAdminClient()
    const { data: user } = await supabase
      .from("users")
      .select("email, name")
      .eq("email", berater_email)
      .single()

    const targetEmail = user?.email ?? berater_email

    // Send notification email (fire-and-forget)
    await sendActivityNotificationToBerater(
      targetEmail,
      firma_name,
      beschreibung,
      deal_id,
      deal_status ?? "Unbekannt"
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook activity error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
