import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Externe Leads vom mitNORM-Formular oder anderen Quellen empfangen
// Auth: x-api-key Header mit WEBHOOK_SECRET
// POST /api/leads

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON.' }, { status: 400 })
  }

  const firma_name = str(body.firma_name) || str(body.name)
  if (!firma_name) {
    return NextResponse.json(
      { error: 'firma_name oder name ist erforderlich.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Berater per vermittler_nr oder E-Mail zuordnen
  let berater_id: string | null = null
  const berater_name = str(body.berater) || str(body.berater_name)
  const vermittler_nr = str(body.vermittler_nr)

  if (vermittler_nr) {
    const { data: user } = await supabase
      .from('users')
      .select('id, name')
      .eq('vermittler_nr', vermittler_nr)
      .single()
    if (user) berater_id = user.id
  }

  const dealData = {
    firma_name,
    ansprechpartner: str(body.ansprechpartner),
    branche: str(body.branche),
    kontakt_email: str(body.kontakt_email) || str(body.email),
    telefonnummer: str(body.telefonnummer),
    telefonnummer_2: str(body.telefonnummer_2),
    adresse: str(body.adresse),
    rechtsform: str(body.rechtsform),
    interesse_an: str(body.interesse_an),
    kunde_durch: str(body.kunde_durch),
    interesse_an_konkret: str(body.interesse_an_konkret),
    weitere_infos: str(body.weitere_infos),
    kategorie: str(body.kategorie),
    kundentyp: str(body.kundentyp),
    notizen: str(body.notizen),
    berater_id,
    berater_name,
    vermittler_nr,
    bereich: str(body.bereich) || str(body.interesse_an),
    deal_besitzer: str(body.deal_betreuer) || str(body.deal_besitzer),
  }

  const { data: deal, error } = await supabase
    .from('deals')
    .insert(dealData)
    .select('id')
    .single()

  if (error) {
    await logSync(supabase, 'lead-import', 'error', firma_name, error.message, body)
    return NextResponse.json(
      { error: 'Deal konnte nicht erstellt werden.', details: error.message },
      { status: 500 }
    )
  }

  // Aktivität loggen
  await supabase.from('activities').insert({
    deal_id: deal.id,
    typ: 'erstellt',
    beschreibung: `Lead "${firma_name}" über API eingereicht.${berater_name ? ` Berater: ${berater_name}` : ''}`,
    autor: berater_name || 'API',
    quelle: 'system',
  })

  await logSync(supabase, 'lead-import', 'success', deal.id, null, body)

  return NextResponse.json({ success: true, deal_id: deal.id }, { status: 201 })
}

function str(val: unknown): string | null {
  if (val === null || val === undefined || val === '') return null
  return String(val)
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
