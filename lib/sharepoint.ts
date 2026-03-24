import { Client } from "@microsoft/microsoft-graph-client"
import type { SharePointDeal, DealComment } from "./types"

const SITE_ID = process.env.SHAREPOINT_SITE_ID
const LIST_ID = process.env.SHAREPOINT_LIST_ID

// Use mock data when Azure AD credentials are not configured
const USE_MOCK = !process.env.AZURE_AD_CLIENT_ID || !process.env.AZURE_AD_TENANT_ID

// --- App-Only Token (Client Credentials Flow) ---

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAppToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 300_000) {
    return cachedToken.token
  }

  const tenantId = process.env.AZURE_AD_TENANT_ID!
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.AZURE_AD_CLIENT_ID!,
    client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
    scope: "https://graph.microsoft.com/.default",
  })

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to get app token: ${res.status} ${text}`)
  }

  const data = await res.json()

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.token
}

function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    },
  })
}

// --- Mock Data (removed once Azure AD is configured) ---

const MOCK_DEALS: SharePointDeal[] = [
  {
    id: "1",
    Title: "Müller Maschinenbau GmbH",
    Berater: "l.jacob@myvi.de",
    deal_status: "In Bearbeitung",
    Interesse_an: "Betriebliche Altersvorsorge",
    Bereich: "Industrie",
    Deal_Besitzer: "Thomas Weber",
    Notizen: "Erstgespräch am 15.03. war sehr positiv. Geschäftsführer interessiert sich für bAV-Modell mit Entgeltumwandlung für 45 Mitarbeiter. Folge-Termin vereinbart.",
    Aktivitaeten: "",
    Created: "2026-03-10T09:15:00Z",

    Status_beauftragt: "Nein",
  },
  {
    id: "2",
    Title: "Schmidt & Partner Steuerberatung",
    Berater: "l.jacob@myvi.de",
    deal_status: "Neu",
    Interesse_an: "Krankenversicherung",
    Bereich: "Dienstleistung",
    Deal_Besitzer: "Sandra Klein",
    Notizen: "",
    Aktivitaeten: "",
    Created: "2026-03-18T14:30:00Z",
    Status_beauftragt: "Nein",
  },
  {
    id: "3",
    Title: "AutoHaus Bergmann",
    Berater: "l.jacob@myvi.de",
    deal_status: "Gewonnen",
    Interesse_an: "Fuhrparkversicherung",
    Bereich: "Automotive",
    Deal_Besitzer: "Thomas Weber",
    Notizen: "Vertrag über Fuhrpark (12 Fahrzeuge) abgeschlossen. Jährliches Volumen ca. 18.000€.",
    Aktivitaeten: "",
    Created: "2026-02-20T10:00:00Z",
    Status_beauftragt: "Ja",
  },
  {
    id: "4",
    Title: "Bäckerei Hofmann KG",
    Berater: "l.jacob@myvi.de",
    deal_status: "Angebot erstellt",
    Interesse_an: "Betriebliche Altersvorsorge",
    Bereich: "Handwerk",
    Deal_Besitzer: "Sandra Klein",
    Notizen: "Angebot für bAV mit 22 Mitarbeitern erstellt. Wartet auf Rückmeldung des Inhabers.",
    Aktivitaeten: "",
    Created: "2026-03-05T11:45:00Z",
    Status_beauftragt: "Nein",
  },
  {
    id: "5",
    Title: "TechVision AG",
    Berater: "l.jacob@myvi.de",
    deal_status: "Verloren",
    Interesse_an: "Cyber-Versicherung",
    Bereich: "IT",
    Deal_Besitzer: "Thomas Weber",
    Notizen: "Haben sich für einen anderen Anbieter entschieden.",
    Aktivitaeten: "",
    Created: "2026-01-15T08:20:00Z",
    Status_beauftragt: "Nein",
  },
  {
    id: "6",
    Title: "Logistik Werner GmbH",
    Berater: "l.jacob@myvi.de",
    deal_status: "In Bearbeitung",
    Interesse_an: "Transportversicherung",
    Bereich: "Logistik",
    Deal_Besitzer: "Sandra Klein",
    Notizen: "Bestandsaufnahme der aktuellen Policen läuft. Termin für Vergleichsangebot am 28.03.",
    Aktivitaeten: "",
    Created: "2026-03-12T16:00:00Z",
    Status_beauftragt: "Nein",
  },
]

// --- Deals fetching with server-side cache ---

import { unstable_cache } from "next/cache"

async function fetchAllDealsFromSharePoint(): Promise<SharePointDeal[]> {
  const token = await getAppToken()

  let allItems: SharePointDeal[] = []
  let url = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/lists/${LIST_ID}/items?$expand=fields&$top=200`

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`SharePoint fetch failed: ${response.status}`)
      break
    }

    const data = await response.json()
    const items = (data.value ?? []).map(mapItem)
    allItems = allItems.concat(items)
    url = data["@odata.nextLink"] ?? ""
  }

  // Don't cache empty results (likely an error)
  if (allItems.length === 0) {
    throw new Error("No deals fetched from SharePoint - skipping cache")
  }

  return allItems
}

async function getAllDealsWithFallback(): Promise<SharePointDeal[]> {
  try {
    return await unstable_cache(
      fetchAllDealsFromSharePoint,
      ["sharepoint-deals"],
      { revalidate: 300 }
    )()
  } catch {
    // If cache throws (e.g. empty result), try direct fetch
    try {
      return await fetchAllDealsFromSharePoint()
    } catch {
      console.error("SharePoint fetch failed completely")
      return []
    }
  }
}

export const getAllDeals = getAllDealsWithFallback

/**
 * Returns all deals from SharePoint (or mock data in dev).
 * Used by the admin panel.
 */
export async function getAllDealsAdmin(): Promise<SharePointDeal[]> {
  if (USE_MOCK) {
    return MOCK_DEALS.sort(
      (a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime()
    )
  }

  const allItems = await getAllDeals()
  return allItems.sort(
    (a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime()
  )
}

/**
 * Fetches all deals from the SharePoint list where Berater matches the given email.
 */
export async function getDealsByBerater(email: string): Promise<SharePointDeal[]> {
  if (USE_MOCK) {
    return MOCK_DEALS.filter(d => d.Berater.toLowerCase() === email.toLowerCase())
  }

  const allItems = await getAllDeals()

  return allItems
    .filter(d => d.Berater.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime())
}

/**
 * Fetches a single deal by its SharePoint list item ID.
 * Uses the cached list when available, falls back to direct API call.
 */
export async function getDealById(id: string): Promise<SharePointDeal | null> {
  if (USE_MOCK) {
    return MOCK_DEALS.find(d => d.id === id) ?? null
  }

  // Try cache first
  const allItems = await getAllDeals()
  const cached = allItems.find(d => d.id === id)
  if (cached) return cached

  // Fallback: direct API call for items not in cache
  const token = await getAppToken()

  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/lists/${LIST_ID}/items/${id}?$expand=fields`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      }
    )
    if (!response.ok) return null
    return mapItem(await response.json())
  } catch {
    return null
  }
}

// --- Comments via Power Automate (workaround for app-only token limitation) ---

const PA_GET_COMMENTS_URL = process.env.POWER_AUTOMATE_GET_COMMENTS_URL
const PA_ADD_COMMENT_URL = process.env.POWER_AUTOMATE_ADD_COMMENT_URL

const MOCK_COMMENTS: Record<string, DealComment[]> = {
  "1": [
    {
      id: "c1",
      author: "Mario Schulze",
      text: "@Max Wolf: Termin liegt kommenden Montag um 13:00 Uhr",
      createdAt: "2026-03-18T15:33:00Z",
      isVFBerater: false,
    },
    {
      id: "c2",
      author: "Bastian Friede",
      text: "@Mario Schulze - alles klar, bin dabei",
      createdAt: "2026-03-18T10:44:00Z",
      isVFBerater: false,
    },
  ],
  "4": [
    {
      id: "c3",
      author: "Sandra Klein",
      text: "Angebot wurde an den Inhaber verschickt. Warte auf Rückmeldung.",
      createdAt: "2026-03-20T14:15:00Z",
      isVFBerater: false,
    },
  ],
}

/**
 * Fetches comments for a deal via Power Automate flow.
 * The flow calls SharePoint REST API with user context to read comments.
 */
export async function getComments(dealId: string): Promise<DealComment[]> {
  if (USE_MOCK) {
    return MOCK_COMMENTS[dealId] ?? []
  }

  if (!PA_GET_COMMENTS_URL) {
    console.error("POWER_AUTOMATE_GET_COMMENTS_URL is not set")
    return []
  }

  try {
    const res = await fetch(PA_GET_COMMENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: dealId }),
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Get comments failed: ${res.status} ${await res.text().catch(() => '')}`)
      return []
    }

    const data = await res.json()
    // Power Automate returns array of SharePoint comments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Array.isArray(data) ? data : data.value ?? []).map((c: any) => {
      let text = (c.text ?? "")
        // Decode HTML entities
        .replace(/&#(\d+);/g, (_: string, code: string) => String.fromCharCode(parseInt(code)))
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        // Replace @mention placeholders with actual names
        .replace(/@mention\{(\d+)\}/g, (match: string, idx: string) => {
          return c.mentions?.[parseInt(idx)]?.name ? `@${c.mentions[parseInt(idx)].name}` : match
        })

      // Determine if this comment was written via VF Dashboard (author is "Automation")
      const rawAuthor = c.author?.name ?? "Unbekannt"
      const isFromDashboard = rawAuthor.toLowerCase() === "automation"

      // Extract author from "[Name]: text" prefix if present (VF Berater comments)
      let author = rawAuthor
      const prefixMatch = text.match(/^\[([^\]]+)\]:\s*/)
      if (prefixMatch) {
        author = prefixMatch[1]
        text = text.slice(prefixMatch[0].length)
      } else if (isFromDashboard) {
        author = "MYVI Berater"
      }

      return {
        id: c.id?.toString() ?? "",
        author,
        text,
        createdAt: c.createdDate ?? c.createdAt ?? "",
        isVFBerater: isFromDashboard,
      }
    })
  } catch {
    return []
  }
}

/**
 * Adds a comment to a deal via Power Automate flow.
 * The flow calls SharePoint REST API with user context to write comments.
 */
export async function addComment(
  dealId: string,
  text: string,
  beraterName: string
): Promise<boolean> {
  if (USE_MOCK) {
    const comments = MOCK_COMMENTS[dealId] ?? []
    comments.unshift({
      id: `c${Date.now()}`,
      author: beraterName,
      text,
      createdAt: new Date().toISOString(),
      isVFBerater: true,
    })
    MOCK_COMMENTS[dealId] = comments
    return true
  }

  if (!PA_ADD_COMMENT_URL) {
    console.error("POWER_AUTOMATE_ADD_COMMENT_URL is not set")
    return false
  }

  try {
    const res = await fetch(PA_ADD_COMMENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: dealId,
        comment: `[${beraterName}]: ${text}`,
      }),
    })

    return res.ok
  } catch {
    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItem(item: any): SharePointDeal {
  const f = item.fields

  // Deal-Betreuer: Lookup field → extract display name
  let dealBesitzer = ""
  const betreuer = f["Deal_x002d_Betreuer"]
  if (Array.isArray(betreuer) && betreuer.length > 0) {
    dealBesitzer = betreuer[0].LookupValue ?? ""
  } else if (f.Betreuer1) {
    dealBesitzer = f.Betreuer1
  }

  return {
    id: item.id,
    Title: f.Title ?? "",
    Berater: f["BeraterE_x002d_Mail"] ?? "",
    deal_status: f.Status ?? "",
    Interesse_an: f["Interessean_x003a_"] ?? "",
    Bereich: f.Branche ?? "",
    Deal_Besitzer: dealBesitzer,
    Notizen: f.Notizen ?? "",
    Aktivitaeten: f["Aktivit_x00e4_ten"] ?? "",
    Created: f["Erstelltam_x003a_"] ?? f.Created ?? "",
    Status_beauftragt: f["bVS_x002d_Bearbeitungsstatus"] ?? "",
  }
}
