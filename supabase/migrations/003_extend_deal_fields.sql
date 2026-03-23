-- ============================================================
-- Deals-Tabelle um SharePoint-Felder erweitern
-- ============================================================

-- Neue Felder
alter table public.deals add column if not exists ansprechpartner text;
alter table public.deals add column if not exists branche text;
alter table public.deals add column if not exists adresse text;
alter table public.deals add column if not exists rechtsform text;
alter table public.deals add column if not exists kunde_durch text;
alter table public.deals add column if not exists interesse_an_konkret text;
alter table public.deals add column if not exists weitere_infos text;
alter table public.deals add column if not exists kategorie text;
alter table public.deals add column if not exists verlustgrund text;

-- Bearbeitungsstatus pro Bereich
alter table public.deals add column if not exists status_ef text;
alter table public.deals add column if not exists status_ki_hochschulen text;
alter table public.deals add column if not exists status_wp text;
alter table public.deals add column if not exists status_ki text;
alter table public.deals add column if not exists status_iws text;
alter table public.deals add column if not exists status_gewerbesach text;
alter table public.deals add column if not exists status_mitarbeiterempfehlung text;
alter table public.deals add column if not exists status_mn_privat text;

-- berater_id nullable machen (externe Leads haben keinen Dashboard-User)
alter table public.deals alter column berater_id drop not null;

-- RLS-Policy für API-Zugriff (service_role kann alles, wird über admin client genutzt)
-- Existierende Policies reichen aus, da der API-Endpoint den adminClient (service_role) nutzt.
