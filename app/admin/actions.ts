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
