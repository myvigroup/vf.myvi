'use server'

import { requireAdmin } from '@/lib/auth-guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleUserStatus(userId: string, newStatus: string) {
  await requireAdmin()

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('users')
    .update({ status: newStatus })
    .eq('id', userId)

  if (error) {
    throw new Error(`Fehler beim Aktualisieren des Status: ${error.message}`)
  }

  revalidatePath('/admin/berater')
}

export async function createInvitationCode(
  code: string,
  label: string,
  maxUses: number,
  expiresAt: string | null
) {
  await requireAdmin()

  const supabase = createAdminClient()

  const { error } = await supabase.from('invitation_codes').insert({
    code,
    label: label || null,
    max_uses: maxUses,
    used_count: 0,
    aktiv: true,
    expires_at: expiresAt || null,
  })

  if (error) {
    throw new Error(`Fehler beim Erstellen des Codes: ${error.message}`)
  }

  revalidatePath('/admin/einladungen')
}

export async function deactivateCode(codeId: string) {
  await requireAdmin()

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('invitation_codes')
    .update({ aktiv: false })
    .eq('id', codeId)

  if (error) {
    throw new Error(`Fehler beim Deaktivieren des Codes: ${error.message}`)
  }

  revalidatePath('/admin/einladungen')
}

export async function importBerater(
  rows: { name: string; email: string; vermittlerNr: string | null }[]
) {
  await requireAdmin()

  const supabase = createAdminClient()
  let imported = 0
  let skipped = 0

  for (const row of rows) {
    if (!row.email) {
      skipped++
      continue
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', row.email.toLowerCase())
      .maybeSingle()

    if (existing) {
      skipped++
      continue
    }

    // Create auth user first via admin API, then insert into users table
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: row.email.toLowerCase(),
      email_confirm: false,
      user_metadata: { name: row.name },
    })

    if (authError || !authUser.user) {
      skipped++
      continue
    }

    const { error } = await supabase.from('users').insert({
      id: authUser.user.id,
      email: row.email.toLowerCase(),
      name: row.name || row.email,
      vermittler_nr: row.vermittlerNr || null,
      rolle: 'berater',
      status: 'eingeladen',
    })

    if (error) {
      skipped++
    } else {
      imported++
    }
  }

  revalidatePath('/admin/berater')

  return { imported, skipped }
}

export async function bulkInvite(userIds: string[]) {
  await requireAdmin()

  const supabase = createAdminClient()

  // Fetch users to get emails
  const { data: users } = await supabase
    .from('users')
    .select('id, email, name')
    .in('id', userIds)

  if (!users || users.length === 0) {
    return { sent: 0 }
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY
  const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? 'digitalmarketing@myvi.de'
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dialoge.myvi.de'

  let sent = 0

  for (const user of users) {
    if (!BREVO_API_KEY) {
      console.log('[E-Mail] Kein BREVO_API_KEY — Einladung übersprungen:', user.email)
      sent++
      continue
    }

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'MYVI Dialog', email: FROM_EMAIL },
          to: [{ email: user.email }],
          subject: 'Einladung zum MYVI Dialog Dashboard',
          textContent: `Hallo ${user.name},\n\nSie wurden zum MYVI Dialog Dashboard eingeladen.\n\nBitte registrieren Sie sich unter:\n${APP_URL}/register\n\nIhr MYVI Team`,
        }),
      })

      if (res.ok) {
        sent++
        // Update status to eingeladen
        await supabase
          .from('users')
          .update({ status: 'eingeladen' })
          .eq('id', user.id)
      }
    } catch (error) {
      console.error(`Einladung an ${user.email} fehlgeschlagen:`, error)
    }
  }

  revalidatePath('/admin/berater')

  return { sent }
}

export async function bulkDeactivate(userIds: string[]) {
  await requireAdmin()

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('users')
    .update({ status: 'inaktiv' })
    .in('id', userIds)

  if (error) {
    throw new Error(`Fehler beim Deaktivieren: ${error.message}`)
  }

  revalidatePath('/admin/berater')

  return { deactivated: userIds.length }
}
