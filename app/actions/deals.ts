'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { syncNewDealToSharePoint, syncCommentToSharePoint } from '@/lib/sharepoint-sync'
import { sendNewDealNotification } from '@/lib/email'

export type DealState = {
  error?: string
  success?: boolean
}

export async function createDeal(
  _prevState: DealState,
  formData: FormData
): Promise<DealState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht authentifiziert.' }

  const { data: profile } = await supabase
    .from('users')
    .select('name, vermittler_nr')
    .eq('id', user.id)
    .single()

  const firma_name = formData.get('firma_name') as string
  const kontakt_email = formData.get('kontakt_email') as string
  const telefonnummer = formData.get('telefonnummer') as string
  const telefonnummer_2 = formData.get('telefonnummer_2') as string
  const bereich = formData.get('bereich') as string
  const interesse_an = formData.get('interesse_an') as string
  const kundentyp = formData.get('kundentyp') as string
  const notizen = formData.get('notizen') as string

  if (!firma_name) {
    return { error: 'Name/Firmenname ist erforderlich.' }
  }

  const berater_name = profile?.name ?? user.email ?? 'Unbekannt'

  const { data: deal, error } = await supabase
    .from('deals')
    .insert({
      firma_name,
      kontakt_email: kontakt_email || null,
      telefonnummer: telefonnummer || null,
      telefonnummer_2: telefonnummer_2 || null,
      bereich: bereich || null,
      interesse_an: interesse_an || null,
      kundentyp: kundentyp || null,
      notizen: notizen || null,
      berater_id: user.id,
      berater_name: berater_name,
      vermittler_nr: profile?.vermittler_nr ?? null,
    })
    .select('*')
    .single()

  if (error || !deal) {
    return { error: 'Deal konnte nicht erstellt werden.' }
  }

  // Aktivität loggen
  await supabase.from('activities').insert({
    deal_id: deal.id,
    typ: 'erstellt',
    beschreibung: `Deal "${firma_name}" wurde eingereicht.`,
    autor: berater_name,
    quelle: 'dashboard',
  })

  // SharePoint-Sync (async, blockiert nicht den User)
  syncNewDealToSharePoint(deal).then(async (sharepointId) => {
    if (sharepointId) {
      await supabase
        .from('deals')
        .update({ sharepoint_id: sharepointId, synced_at: new Date().toISOString() })
        .eq('id', deal.id)
    }
  }).catch(console.error)

  // Firmenberater per Routing benachrichtigen
  if (bereich) {
    const { data: route } = await supabase
      .from('routing_rules')
      .select('firmenberater_name, firmenberater_email')
      .eq('bereich', bereich)
      .single()

    if (route?.firmenberater_email) {
      sendNewDealNotification({
        to: route.firmenberater_email,
        firmenberaterName: route.firmenberater_name,
        firmaName: firma_name,
        beraterName: berater_name,
        bereich,
      }).catch(console.error)
    }
  }

  redirect(`/dashboard/deals/${deal.id}`)
}

export async function addComment(
  _prevState: DealState,
  formData: FormData
): Promise<DealState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nicht authentifiziert.' }

  const { data: profile } = await supabase
    .from('users')
    .select('name, rolle')
    .eq('id', user.id)
    .single()

  const deal_id = formData.get('deal_id') as string
  const inhalt = formData.get('inhalt') as string

  if (!inhalt?.trim()) {
    return { error: 'Kommentar darf nicht leer sein.' }
  }

  const { error } = await supabase.from('comments').insert({
    deal_id,
    user_id: user.id,
    autor_name: profile?.name ?? user.email ?? 'Unbekannt',
    autor_rolle: profile?.rolle ?? 'berater',
    inhalt: inhalt.trim(),
    quelle: 'dashboard',
  })

  if (error) {
    return { error: 'Kommentar konnte nicht gespeichert werden.' }
  }

  const autorName = profile?.name ?? user.email ?? 'Unbekannt'

  // Aktivität loggen
  await supabase.from('activities').insert({
    deal_id,
    typ: 'kommentar',
    beschreibung: `Neuer Kommentar von ${autorName}.`,
    autor: autorName,
    quelle: 'dashboard',
  })

  // Kommentar nach SharePoint synchronisieren
  const { data: deal } = await supabase
    .from('deals')
    .select('sharepoint_id')
    .eq('id', deal_id)
    .single()

  if (deal?.sharepoint_id) {
    syncCommentToSharePoint({
      deal_sharepoint_id: deal.sharepoint_id,
      autor_name: autorName,
      inhalt: inhalt.trim(),
    }).catch(console.error)
  }

  return { success: true }
}
