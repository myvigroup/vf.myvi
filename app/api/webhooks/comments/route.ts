import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Power Automate: Kommentar von SharePoint synchronisieren
// Header: x-api-key: <WEBHOOK_SECRET>
// Body: { sharepoint_id, autor_name, inhalt }

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { sharepoint_id, autor_name, inhalt } = body

  if (!sharepoint_id || !inhalt) {
    return NextResponse.json(
      { error: 'sharepoint_id und inhalt sind erforderlich.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Deal finden
  const { data: deal, error: findError } = await supabase
    .from('deals')
    .select('id, berater_id')
    .eq('sharepoint_id', sharepoint_id)
    .single()

  if (findError || !deal) {
    await supabase.from('sync_log').insert({
      flow_name: 'comment-sync',
      status: 'error',
      deal_ref: sharepoint_id,
      fehler: 'Deal nicht gefunden',
      payload: body,
    })
    return NextResponse.json({ error: 'Deal nicht gefunden.' }, { status: 404 })
  }

  // Kommentar einfügen (user_id = berater_id als Fallback für SharePoint-Kommentare)
  const { error: insertError } = await supabase.from('comments').insert({
    deal_id: deal.id,
    user_id: deal.berater_id,
    autor_name: autor_name || 'Firmenberater',
    autor_rolle: 'firmenberater',
    inhalt,
    quelle: 'sharepoint',
    sharepoint_sync: true,
  })

  if (insertError) {
    await supabase.from('sync_log').insert({
      flow_name: 'comment-sync',
      status: 'error',
      deal_ref: sharepoint_id,
      fehler: insertError.message,
      payload: body,
    })
    return NextResponse.json({ error: 'Kommentar konnte nicht gespeichert werden.' }, { status: 500 })
  }

  // Aktivität loggen
  await supabase.from('activities').insert({
    deal_id: deal.id,
    typ: 'kommentar',
    beschreibung: `Neuer Kommentar von ${autor_name || 'Firmenberater'} (SharePoint).`,
    autor: autor_name || 'Firmenberater',
    quelle: 'sharepoint',
  })

  await supabase.from('sync_log').insert({
    flow_name: 'comment-sync',
    status: 'success',
    deal_ref: sharepoint_id,
    fehler: null,
    payload: body,
  })

  return NextResponse.json({ success: true })
}
