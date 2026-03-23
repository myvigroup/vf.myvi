'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export type AuthState = {
  error?: string
  success?: boolean
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-Mail und Passwort sind erforderlich.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Ungültige Anmeldedaten.' }
  }

  redirect('/dashboard')
}

export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const code = formData.get('invitation_code') as string

  if (!name || !email || !password || !code) {
    return { error: 'Alle Felder sind erforderlich.' }
  }

  if (password.length < 8) {
    return { error: 'Passwort muss mindestens 8 Zeichen lang sein.' }
  }

  // Admin-Client für RLS-freie Abfragen (User ist noch nicht eingeloggt)
  const adminClient = createAdminClient()

  // Einladungscode prüfen
  const { data: invitation, error: codeError } = await adminClient
    .from('invitation_codes')
    .select('*')
    .eq('code', code)
    .eq('aktiv', true)
    .single()

  if (codeError || !invitation) {
    return { error: 'Ungültiger Einladungscode.' }
  }

  if (invitation.max_uses > 0 && invitation.used_count >= invitation.max_uses) {
    return { error: 'Einladungscode wurde bereits zu oft verwendet.' }
  }

  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    return { error: 'Einladungscode ist abgelaufen.' }
  }

  // User bei Supabase Auth registrieren
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, invitation_code: code },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (!authData.user) {
    return { error: 'Registrierung fehlgeschlagen.' }
  }

  // Profil in public.users anlegen (admin client wegen RLS)
  const { error: profileError } = await adminClient.from('users').insert({
    id: authData.user.id,
    email,
    name,
    rolle: 'berater',
    invitation_code: code,
  })

  if (profileError) {
    return { error: 'Profil konnte nicht erstellt werden.' }
  }

  // Einladungscode used_count hochzählen
  await adminClient
    .from('invitation_codes')
    .update({ used_count: invitation.used_count + 1 })
    .eq('id', invitation.id)

  redirect('/dashboard')
}

export async function resetPassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Bitte E-Mail-Adresse eingeben.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://vf.myvi.de'}/auth/reset`,
  })

  if (error) {
    return { error: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.' }
  }

  return { success: true }
}

export async function updatePassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const passwordConfirm = formData.get('password_confirm') as string

  if (!password || !passwordConfirm) {
    return { error: 'Bitte beide Felder ausfüllen.' }
  }

  if (password.length < 8) {
    return { error: 'Passwort muss mindestens 8 Zeichen lang sein.' }
  }

  if (password !== passwordConfirm) {
    return { error: 'Passwörter stimmen nicht überein.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'Passwort konnte nicht geändert werden.' }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
