// Neuen Deal an Power Automate senden, der ihn in SharePoint anlegt
// Power Automate HTTP-Trigger-URL wird als Env-Variable konfiguriert

export async function syncNewDealToSharePoint(deal: {
  id: string
  firma_name: string
  kontakt_email: string | null
  telefonnummer: string | null
  telefonnummer_2: string | null
  bereich: string | null
  interesse_an: string | null
  berater_name: string | null
  vermittler_nr: string | null
  notizen: string | null
  erstellt_am: string
}) {
  const flowUrl = process.env.POWER_AUTOMATE_NEW_DEAL_URL

  if (!flowUrl) {
    console.log('[SharePoint-Sync] Kein POWER_AUTOMATE_NEW_DEAL_URL — Sync übersprungen')
    return null
  }

  const response = await fetch(flowUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dashboard_id: deal.id,
      firma_name: deal.firma_name,
      kontakt_email: deal.kontakt_email,
      telefonnummer: deal.telefonnummer,
      telefonnummer_2: deal.telefonnummer_2,
      bereich: deal.bereich,
      interesse_an: deal.interesse_an,
      berater_name: deal.berater_name,
      vermittler_nr: deal.vermittler_nr,
      notizen: deal.notizen,
      erstellt_am: deal.erstellt_am,
    }),
  })

  if (!response.ok) {
    console.error('[SharePoint-Sync] Fehler:', response.status, await response.text())
    return null
  }

  // Power Automate gibt die SharePoint-ID zurück
  const result = await response.json().catch(() => null)
  return result?.sharepoint_id ?? null
}

// Kommentar an Power Automate senden
export async function syncCommentToSharePoint(comment: {
  deal_sharepoint_id: string
  autor_name: string
  inhalt: string
}) {
  const flowUrl = process.env.POWER_AUTOMATE_COMMENT_URL

  if (!flowUrl) {
    console.log('[SharePoint-Sync] Kein POWER_AUTOMATE_COMMENT_URL — Sync übersprungen')
    return
  }

  const response = await fetch(flowUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  })

  if (!response.ok) {
    console.error('[SharePoint-Sync] Kommentar-Fehler:', response.status, await response.text())
  }
}
