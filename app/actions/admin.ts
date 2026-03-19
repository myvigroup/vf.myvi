'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AdminState = {
  error?: string
  success?: boolean
}

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('rolle')
    .eq('id', user.id)
    .single()

  if (profile?.rolle !== 'admin') return null
  return supabase
}

// ── User-Verwaltung ──

export async function updateUserRole(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Keine Berechtigung.' }

  const userId = formData.get('user_id') as string
  const rolle = formData.get('rolle') as string

  if (!['berater', 'firmenberater', 'admin'].includes(rolle)) {
    return { error: 'Ungültige Rolle.' }
  }

  const { error } = await supabase
    .from('users')
    .update({ rolle })
    .eq('id', userId)

  if (error) return { error: 'Rolle konnte nicht aktualisiert werden.' }
  return { success: true }
}

export async function updateUserStatus(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Keine Berechtigung.' }

  const userId = formData.get('user_id') as string
  const status = formData.get('status') as string

  if (!['aktiv', 'inaktiv', 'gesperrt'].includes(status)) {
    return { error: 'Ungültiger Status.' }
  }

  const { error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', userId)

  if (error) return { error: 'Status konnte nicht aktualisiert werden.' }
  return { success: true }
}

// ── Einladungscodes ──

export async function createInvitationCode(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Keine Berechtigung.' }

  const code = formData.get('code') as string
  const label = formData.get('label') as string
  const max_uses = parseInt(formData.get('max_uses') as string) || 1
  const expires_at = formData.get('expires_at') as string

  if (!code?.trim()) {
    return { error: 'Code ist erforderlich.' }
  }

  const { error } = await supabase.from('invitation_codes').insert({
    code: code.trim().toUpperCase(),
    label: label || null,
    max_uses,
    expires_at: expires_at || null,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Dieser Code existiert bereits.' }
    return { error: 'Code konnte nicht erstellt werden.' }
  }

  return { success: true }
}

export async function toggleCodeStatus(
  _prevState: AdminState,
  formData: FormData
): Promise<AdminState> {
  const supabase = await verifyAdmin()
  if (!supabase) return { error: 'Keine Berechtigung.' }

  const codeId = formData.get('code_id') as string
  const aktiv = formData.get('aktiv') === 'true'

  const { error } = await supabase
    .from('invitation_codes')
    .update({ aktiv: !aktiv })
    .eq('id', codeId)

  if (error) return { error: 'Status konnte nicht geändert werden.' }
  return { success: true }
}
