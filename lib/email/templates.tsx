import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
} from "@react-email/components"
import * as React from "react"

const BRAND_COLOR = "#30bcdf"
const TEXT_COLOR = "#1E293B"
const MUTED_COLOR = "#64748B"
const BG_COLOR = "#F8FAFC"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vf.myvi.de"

function Layout({ children, footer }: { children: React.ReactNode; footer: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: BG_COLOR, fontFamily: "'Inter', -apple-system, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
          {/* Header */}
          <Section style={{ marginBottom: 32 }}>
            <Img
              src={`${APP_URL}/logo.png`}
              alt="MYVI Dialog"
              height={28}
              style={{ marginBottom: 16 }}
            />
            <Hr style={{ borderColor: BRAND_COLOR, borderWidth: 2, margin: 0 }} />
          </Section>

          {/* Content */}
          <Section style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: "32px 28px",
            border: "1px solid #E2E8F0",
          }}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: 24, textAlign: "center" as const }}>
            <Text style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
              {footer}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: BRAND_COLOR,
        color: "#ffffff",
        borderRadius: 6,
        padding: "12px 24px",
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
        display: "inline-block",
      }}
    >
      {children}
    </Button>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    "Neu": { bg: "#EEF2FF", color: "#4338CA" },
    "In Bearbeitung": { bg: "#FFF4E5", color: "#B45309" },
    "Angebot erstellt": { bg: "#EDF1F5", color: "#0E7490" },
    "Gewonnen": { bg: "#E6F9F1", color: "#15803D" },
    "Verloren": { bg: "#FEF2F2", color: "#B91C1C" },
  }
  const c = colors[status] ?? { bg: "#F1F5F9", color: "#64748B" }
  return (
    <span style={{
      backgroundColor: c.bg,
      color: c.color,
      fontSize: 12,
      fontWeight: 700,
      padding: "4px 10px",
      borderRadius: 12,
      display: "inline-block",
    }}>
      {status}
    </span>
  )
}

// --- MAIL 1: Deal Confirmation ---

export function DealConfirmationEmail({
  firmaName,
  dealId,
}: {
  firmaName: string
  dealId: string
}) {
  return (
    <Layout footer="MYVI Dialog · MYVI Dialog Berater-Portal">
      <Text style={{ fontSize: 20, fontWeight: 600, color: TEXT_COLOR, margin: "0 0 8px" }}>
        Deal eingereicht
      </Text>
      <Text style={{ fontSize: 14, color: MUTED_COLOR, margin: "0 0 24px", lineHeight: "1.6" }}>
        Dein Kontakt <strong style={{ color: TEXT_COLOR }}>{firmaName}</strong> wurde
        erfolgreich eingereicht. Der Deal liegt jetzt bei unserem Firmenberater-Team.
      </Text>
      <PrimaryButton href={`${APP_URL}/dashboard/${dealId}`}>
        Deal im Dashboard ansehen
      </PrimaryButton>
    </Layout>
  )
}

// --- MAIL 2: Comment Notification to Firmenberater ---

export function CommentNotificationEmail({
  beraterName,
  firmaName,
  kommentar,
  sharepointId,
}: {
  beraterName: string
  firmaName: string
  kommentar: string
  sharepointId: string
}) {
  const spUrl = `https://mitnorm.sharepoint.com/sites/MYVIDialoge/Lists/Dealliste%20MYVI%20Dialoge/DispForm.aspx?ID=${sharepointId}`

  return (
    <Layout footer="MYVI Dialog · Internes Firmenberater-Benachrichtigungssystem">
      <Text style={{ fontSize: 20, fontWeight: 600, color: TEXT_COLOR, margin: "0 0 8px" }}>
        Neuer Kommentar
      </Text>
      <Text style={{ fontSize: 14, color: MUTED_COLOR, margin: "0 0 16px", lineHeight: "1.6" }}>
        <strong style={{ color: TEXT_COLOR }}>{beraterName}</strong> hat einen Kommentar
        zu <strong style={{ color: TEXT_COLOR }}>{firmaName}</strong> hinterlassen:
      </Text>

      {/* Comment Box */}
      <Section style={{
        backgroundColor: "#F8FAFC",
        borderRadius: 8,
        padding: "16px 20px",
        marginBottom: 24,
        borderLeft: `3px solid ${BRAND_COLOR}`,
      }}>
        <Text style={{ fontSize: 14, color: TEXT_COLOR, margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" as const }}>
          {kommentar}
        </Text>
      </Section>

      <PrimaryButton href={spUrl}>
        In SharePoint ansehen
      </PrimaryButton>
    </Layout>
  )
}

// --- MAIL 3: Activity Notification to Berater ---

export function ActivityNotificationEmail({
  firmaName,
  beschreibung,
  dealId,
  dealStatus,
}: {
  firmaName: string
  beschreibung: string
  dealId: string
  dealStatus: string
}) {
  return (
    <Layout footer="MYVI Dialog · MYVI Dialog Berater-Portal">
      <Text style={{ fontSize: 20, fontWeight: 600, color: TEXT_COLOR, margin: "0 0 8px" }}>
        Update zu deinem Deal
      </Text>
      <Text style={{ fontSize: 14, color: MUTED_COLOR, margin: "0 0 16px", lineHeight: "1.6" }}>
        Es gibt eine neue Aktivität zu deinem eingereichten Kontakt{" "}
        <strong style={{ color: TEXT_COLOR }}>{firmaName}</strong>:
      </Text>

      {/* Activity Box */}
      <Section style={{
        backgroundColor: "#F8FAFC",
        borderRadius: 8,
        padding: "16px 20px",
        marginBottom: 16,
        borderLeft: `3px solid ${BRAND_COLOR}`,
      }}>
        <Text style={{ fontSize: 14, color: TEXT_COLOR, margin: 0, lineHeight: "1.6", whiteSpace: "pre-wrap" as const }}>
          {beschreibung}
        </Text>
      </Section>

      <Text style={{ fontSize: 13, color: MUTED_COLOR, margin: "0 0 24px" }}>
        Aktueller Status: <StatusBadge status={dealStatus} />
      </Text>

      <PrimaryButton href={`${APP_URL}/dashboard/${dealId}`}>
        Deal ansehen
      </PrimaryButton>
    </Layout>
  )
}
