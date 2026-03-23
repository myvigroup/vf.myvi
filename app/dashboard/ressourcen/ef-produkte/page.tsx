import { FaqAccordion } from '@/components/FaqAccordion'

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  users: <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
  message: <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  trending: <Icon d="M23 6l-9.5 9.5-5-5L1 18" />,
  euro: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M7 12h6M7 9h8M7 15h8" /></svg>,
  target: <Icon d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z" />,
}

const PRODUCTS = [
  {
    nr: 1,
    title: 'Photovoltaik & Wärmepumpe Privathaushalt',
    color: '#f97316',
    items: [
      {
        frage: 'Für wen geeignet?',
        antwort: 'Alle privaten Haushalte bzw. Eigentümer, die Strom verbrauchen und/oder aktuell mit Öl oder Gas heizen.',
        icon: ICONS.users,
      },
      {
        frage: 'Wie ansprechen?',
        antwort: '„Haben Sie schon einmal darüber nachgedacht, sich unabhängig von Energieversorgern zu machen?"\n„Sind Sie auch von steigenden Strom-/Gaskosten betroffen?"',
        icon: ICONS.message,
      },
      {
        frage: 'Was bringt dem Interessenten das?',
        antwort: 'Kosteneinsparungen über die nächsten 20 Jahre von mehreren Tausend Euro.',
        icon: ICONS.trending,
      },
      {
        frage: 'Was kostet das?',
        antwort: 'PV: Wegfall von 19% MwSt.\nWärmepumpe: Bis zu 70% Förderung (max. 21.000€) beim Tausch der alten Gas-/Ölheizung.',
        icon: ICONS.euro,
      },
      {
        frage: 'Was bringt mir das als Tippgeber?',
        antwort: 'Ca. 300–500€ pro Abschluss.',
        icon: ICONS.target,
      },
    ],
  },
  {
    nr: 2,
    title: 'Strom-/Gaseinkauf am SPOT-Markt',
    color: '#3b82f6',
    items: [
      {
        frage: 'Für wen geeignet?',
        antwort: 'Alle privaten und gewerblichen Kunden ab 80.000 kWh Verbrauch von Strom oder Gas pro Jahr.',
        icon: ICONS.users,
      },
      {
        frage: 'Wie ansprechen?',
        antwort: '„Wie organisieren Sie momentan Ihren Energieeinkauf?"\n„Mit welcher Strategie kaufen Sie momentan Ihren Strom und/oder Gas ein?"',
        icon: ICONS.message,
      },
      {
        frage: 'Was bringt dem Interessenten das?',
        antwort: 'Im Schnitt 30% Kostenersparnis pro Jahr — meist mehrere Tausend Euro.',
        icon: ICONS.trending,
      },
      {
        frage: 'Was kostet das?',
        antwort: 'Nichts. Prüfung, Termin und Abwicklung sind vollständig kostenfrei.',
        icon: ICONS.euro,
      },
      {
        frage: 'Was bringt mir das als Tippgeber?',
        antwort: 'Ca. 1.200€ je 1 Mio. kWh Strom oder Gas pro Jahr — wiederkehrend.',
        icon: ICONS.target,
      },
    ],
  },
  {
    nr: 3,
    title: 'Gewerbe Photovoltaik Pacht',
    color: '#22c55e',
    items: [
      {
        frage: 'Für wen geeignet?',
        antwort: 'Privat- und Gewerbekunden mit Dachfläche ab 500qm — am besten über 1.000qm.',
        icon: ICONS.users,
      },
      {
        frage: 'Wie ansprechen?',
        antwort: '„Verdienen Sie mit Ihrer Dachfläche schon Geld?"\n„Nutzen Sie schon die Möglichkeit einer kostenlosen PV-Anlage + Pachtzahlung?"',
        icon: ICONS.message,
      },
      {
        frage: 'Was bringt dem Interessenten das?',
        antwort: 'Mindestens 5-stellige Pachtzahlung + ca. 30% niedrigere Stromkosten + Imagegewinn durch Nachhaltigkeit.',
        icon: ICONS.trending,
      },
      {
        frage: 'Was kostet das?',
        antwort: 'Nichts. Planung, Prüfung und Ausführung vollständig kostenfrei.',
        icon: ICONS.euro,
      },
      {
        frage: 'Was bringt mir das als Tippgeber?',
        antwort: 'Ca. 1.000€ pro 1.000qm Dachfläche die umgesetzt wird.',
        icon: ICONS.target,
      },
    ],
  },
  {
    nr: 4,
    title: 'Großraumspeicher',
    color: '#eab308',
    items: [
      {
        frage: 'Für wen geeignet?',
        antwort: 'Privat- oder Gewerbekunden mit mind. 50–100qm freier Fläche in Halle oder Grundstück, 200m Abstand zum nächsten Wohngebäude.',
        icon: ICONS.users,
      },
      {
        frage: 'Wie ansprechen?',
        antwort: '„Haben Sie eine ungenutzte Fläche auf Ihrem Grundstück oder in einer Halle mit mindestens 50–100qm und 200m Abstand zum nächsten Wohngebäude?"',
        icon: ICONS.message,
      },
      {
        frage: 'Was bringt dem Interessenten das?',
        antwort: '2.000–4.000€ pro Speicher (1MW) pro Jahr — für 15 Jahre Laufzeit.',
        icon: ICONS.trending,
      },
      {
        frage: 'Was kostet das?',
        antwort: 'Nichts. Prüfung, Planung, Projektierung, Wartung und Versicherung komplett kostenfrei.',
        icon: ICONS.euro,
      },
      {
        frage: 'Was bringt mir das als Tippgeber?',
        antwort: 'Ca. 3.000€ pro Speicher (1MW) der installiert wird.',
        icon: ICONS.target,
      },
    ],
  },
]

export default function EFProduktePage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(249,115,22,0.12)',
            color: '#f97316',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            letterSpacing: '0.03em',
            marginBottom: 12,
          }}
        >
          Energy & Finance
        </span>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--g900)', marginBottom: 6 }}>
          Top Produkte 2026
        </h1>
        <p style={{ fontSize: 15, color: '#94a3b8' }}>
          FAQ für Berater & Tippgeber – alle wichtigen Infos auf einen Blick
        </p>
      </div>

      {/* Product Sections */}
      {PRODUCTS.map((product) => (
        <div key={product.nr} style={{ marginBottom: 48 }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              paddingBottom: 12,
              borderBottom: `2px solid ${product.color}`,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: `${product.color}26`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 700,
                color: product.color,
                flexShrink: 0,
              }}
            >
              {product.nr}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--g900)' }}>
              {product.title}
            </h2>
          </div>

          <FaqAccordion items={product.items} accentColor={product.color} />
        </div>
      ))}
    </div>
  )
}
