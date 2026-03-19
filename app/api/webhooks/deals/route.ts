import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendStatusChangeEmail } from '@/lib/email'

// Power Automate ruft diese Route auf, um Deal-Status zu aktualisieren
// Header: x-api-key: <WEBHOOK_SECRET>
// Body: { sharepoint_id, deal_status, deal_besitzer? }

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { sharepoint_id, deal_status, deal_besitzer } = body

  if (!sharepoint_id || !deal_status) {
    return NextResponse.json(
      { error: 'sharepoint_id und deal_status sind erforderlich.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Deal anhand sharepoint_id finden
  const { data: deal, error: findError } = await supabase
    .from('deals')
    .select('id, deal_status, berater_id, firma_name')
    .eq('sharepoint_id', sharepoint_id)
    .single()

  if (findError || !deal) {
    await logSync(supabase, 'deal-status-update', 'error', sharepoint_id, 'Deal nicht gefunden', body)
    return NextResponse.json({ error: 'Deal nicht gefunden.' }, { status: 404 })
  }

  const oldStatus = deal.deal_status

  // Deal aktualisieren
  const updateData: Record<string, string> = { deal_status }
  if (deal_besitzer) updateData.deal_besitzer = deal_besitzer
  updateData.synced_at = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('deals')
    .update(updateData)
    .eq('id', deal.id)

  if (updateError) {
    await logSync(supabase, 'deal-status-update', 'error', sharepoint_id, updateError.message, body)
    return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  }

  // Aktivität loggen
  await supabase.from('activities').insert({
    deal_id: deal.id,
    typ: 'status_aenderung',
    beschreibung: `Status geändert: ${oldStatus} → ${deal_status}`,
    autor: 'Power Automate',
    quelle: 'sharepoint',
  })

  // E-Mail-Benachrichtigung an Berater
  if (oldStatus !== deal_status) {
    const { data: berater } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', deal.berater_id)
      .single()

    if (berater?.email) {
      await sendStatusChangeEmail({
        to: berater.email,
        beraterName: berater.name,
        firmaName: deal.firma_name,
        oldStatus,
        newStatus: deal_status,
      })
    }
  }

  await logSync(supabase, 'deal-status-update', 'success', sharepoint_id, null, body)

  return NextResponse.json({ success: true, deal_id: deal.id })
}

async function logSync(
  supabase: ReturnType<typeof createAdminClient>,
  flowName: string,
  status: string,
  dealRef: string,
  fehler: string | null,
  payload: unknown
) {
  await supabase.from('sync_log').insert({
    flow_name: flowName,
    status,
    deal_ref: dealRef,
    fehler,
    payload,
  })
}
