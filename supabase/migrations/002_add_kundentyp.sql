-- Kundentyp-Feld zu Deals hinzufügen
alter table public.deals add column kundentyp text
  check (kundentyp in ('Privatkunde', 'Firmenkunde', 'Mitarbeiterempfehlung'));

-- Bereich-Check entfernen und interesse_an erweitern (freiere Werte)
alter table public.deals drop constraint if exists deals_deal_status_check;
alter table public.deals add constraint deals_deal_status_check
  check (deal_status in (
    'Neu', 'In Bearbeitung', 'Angebot erstellt',
    'Gewonnen', 'Verloren', 'Storniert'
  ));
