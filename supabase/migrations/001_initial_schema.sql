-- ============================================================
-- MYVI Dialog Dashboard — Initiales Datenbankschema
-- ============================================================

-- 1. Users (erweitert auth.users)
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text not null,
  vermittler_nr text,
  rolle       text not null default 'berater'
                check (rolle in ('berater', 'firmenberater', 'admin')),
  status      text not null default 'aktiv'
                check (status in ('aktiv', 'inaktiv', 'gesperrt')),
  invitation_code text,
  created_at  timestamptz not null default now()
);

-- 2. Invitation Codes
create table public.invitation_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  label       text,
  max_uses    int not null default 1,
  used_count  int not null default 0,
  expires_at  timestamptz,
  aktiv       boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 3. Deals
create table public.deals (
  id              uuid primary key default gen_random_uuid(),
  sharepoint_id   text,
  firma_name      text not null,
  kontakt_email   text,
  telefonnummer   text,
  telefonnummer_2 text,
  bereich         text,
  interesse_an    text,
  deal_status     text not null default 'Neu'
                    check (deal_status in (
                      'Neu', 'In Bearbeitung', 'Angebot erstellt',
                      'Gewonnen', 'Verloren', 'Storniert'
                    )),
  berater_id      uuid not null references public.users(id),
  berater_name    text,
  vermittler_nr   text,
  deal_besitzer   text,
  notizen         text,
  erstellt_am     timestamptz not null default now(),
  synced_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 4. Comments
create table public.comments (
  id              uuid primary key default gen_random_uuid(),
  deal_id         uuid not null references public.deals(id) on delete cascade,
  user_id         uuid not null references public.users(id),
  autor_name      text not null,
  autor_rolle     text not null,
  inhalt          text not null,
  quelle          text not null default 'dashboard'
                    check (quelle in ('dashboard', 'sharepoint')),
  sharepoint_sync boolean not null default false,
  created_at      timestamptz not null default now()
);

-- 5. Activities (Audit-Log)
create table public.activities (
  id            uuid primary key default gen_random_uuid(),
  deal_id       uuid not null references public.deals(id) on delete cascade,
  typ           text not null,
  beschreibung  text not null,
  autor         text,
  quelle        text not null default 'dashboard'
                  check (quelle in ('dashboard', 'sharepoint', 'system')),
  created_at    timestamptz not null default now()
);

-- 6. Routing Rules (Bereich → Firmenberater)
create table public.routing_rules (
  id                  uuid primary key default gen_random_uuid(),
  bereich             text not null unique,
  firmenberater_name  text not null,
  firmenberater_email text not null
);

-- 7. Sync Log (Power Automate Flow-Protokoll)
create table public.sync_log (
  id          uuid primary key default gen_random_uuid(),
  flow_name   text not null,
  status      text not null check (status in ('success', 'error', 'pending')),
  deal_ref    text,
  fehler      text,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_deals_berater_id on public.deals(berater_id);
create index idx_deals_status on public.deals(deal_status);
create index idx_comments_deal_id on public.comments(deal_id);
create index idx_activities_deal_id on public.activities(deal_id);
create index idx_sync_log_created on public.sync_log(created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Users
alter table public.users enable row level security;

create policy "Users können eigenes Profil lesen"
  on public.users for select
  using (id = auth.uid());

create policy "Admins können alle User lesen"
  on public.users for select
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

create policy "Admins können User verwalten"
  on public.users for all
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

-- Invitation Codes (nur Admins)
alter table public.invitation_codes enable row level security;

create policy "Admins verwalten Einladungscodes"
  on public.invitation_codes for all
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

create policy "Jeder kann Codes bei Registrierung prüfen"
  on public.invitation_codes for select
  using (true);

-- Deals
alter table public.deals enable row level security;

create policy "Berater sehen nur eigene Deals"
  on public.deals for select
  using (berater_id = auth.uid());

create policy "Berater können Deals erstellen"
  on public.deals for insert
  with check (berater_id = auth.uid());

create policy "Admins sehen alle Deals"
  on public.deals for select
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

-- Comments
alter table public.comments enable row level security;

create policy "Berater sehen Kommentare eigener Deals"
  on public.comments for select
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_id and d.berater_id = auth.uid()
    )
  );

create policy "Berater schreiben Kommentare zu eigenen Deals"
  on public.comments for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.deals d
      where d.id = deal_id and d.berater_id = auth.uid()
    )
  );

create policy "Admins sehen alle Kommentare"
  on public.comments for select
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

-- Activities
alter table public.activities enable row level security;

create policy "Berater sehen Aktivitäten eigener Deals"
  on public.activities for select
  using (
    exists (
      select 1 from public.deals d
      where d.id = deal_id and d.berater_id = auth.uid()
    )
  );

create policy "Admins sehen alle Aktivitäten"
  on public.activities for select
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

create policy "System kann Aktivitäten erstellen"
  on public.activities for insert
  with check (true);

-- Routing Rules (lesbar für alle auth users, verwaltbar nur Admin)
alter table public.routing_rules enable row level security;

create policy "Authentifizierte User können Routing lesen"
  on public.routing_rules for select
  using (auth.uid() is not null);

create policy "Admins verwalten Routing Rules"
  on public.routing_rules for all
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

-- Sync Log (nur Admins + service_role)
alter table public.sync_log enable row level security;

create policy "Admins sehen Sync Logs"
  on public.sync_log for select
  using (
    exists (
      select 1 from public.users u where u.id = auth.uid() and u.rolle = 'admin'
    )
  );

create policy "Service kann Sync Logs schreiben"
  on public.sync_log for insert
  with check (true);

-- ============================================================
-- Updated-at Trigger für Deals
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_deals_updated_at
  before update on public.deals
  for each row execute function public.handle_updated_at();
