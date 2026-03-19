-- ============================================================
-- Seed: Erster Admin-User + Test-Einladungscode
-- ============================================================
-- HINWEIS: Der Admin-User muss zuerst über Supabase Auth registriert werden.
-- Danach diese Abfrage in der Supabase SQL-Konsole ausführen:

-- 1. Admin-Einladungscode
insert into public.invitation_codes (code, label, max_uses, aktiv)
values ('ADMIN-SETUP', 'Initialer Admin-Zugang', 1, true);

-- 2. Test-Einladungscode für Berater
insert into public.invitation_codes (code, label, max_uses, aktiv)
values ('BERATER-2026', 'Standard Berater-Code', 100, true);

-- 3. Routing Rules (Beispiele)
insert into public.routing_rules (bereich, firmenberater_name, firmenberater_email) values
  ('Energie', 'Max Mustermann', 'max@example.com'),
  ('Versicherung', 'Anna Schmidt', 'anna@example.com'),
  ('Finanzierung', 'Tom Weber', 'tom@example.com'),
  ('Telekommunikation', 'Lisa Müller', 'lisa@example.com'),
  ('Sonstiges', 'Max Mustermann', 'max@example.com');

-- 4. Nach Registrierung des Admin-Users über die App:
--    UPDATE public.users SET rolle = 'admin' WHERE email = 'admin@myvi.de';
