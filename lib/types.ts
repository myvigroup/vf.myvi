export interface SharePointDeal {
  id: string
  Title: string              // Firmenname
  Berater: string            // E-Mail des Beraters
  deal_status: string
  Interesse_an: string
  Bereich: string
  Deal_Besitzer: string      // Firmenberater
  Notizen: string            // Kommentare der Firmenberater
  Aktivitaeten: string       // Aktivitäten-Log
  Created: string
  Status_beauftragt: string
  [key: string]: string      // Index signature for dynamic field access
}

export interface DealComment {
  id: string
  author: string             // Display name
  text: string
  createdAt: string          // ISO date
  isVFBerater: boolean       // true if written from VF Dashboard
}
