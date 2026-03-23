'use server'

import { createClient } from '@/lib/supabase/server'
import { addComment, getDealById } from '@/lib/sharepoint'
import { revalidatePath } from 'next/cache'

export type CommentState = {
  error?: string
  success?: boolean
}

export async function submitComment(
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    return { error: 'Nicht angemeldet.' }
  }

  const dealId = formData.get('dealId') as string
  const comment = (formData.get('comment') as string)?.trim()

  if (!dealId || !comment) {
    return { error: 'Bitte Kommentar eingeben.' }
  }

  // Security: verify this deal belongs to the user
  const deal = await getDealById(dealId)
  if (!deal || deal.Berater.toLowerCase() !== user.email.toLowerCase()) {
    return { error: 'Zugriff verweigert.' }
  }

  // Get user name from Supabase profile
  const { data: profile } = await supabase
    .from('users')
    .select('name')
    .eq('id', user.id)
    .single()

  const beraterName = profile?.name ?? user.email

  const success = await addComment(dealId, comment, beraterName)

  if (!success) {
    return { error: 'Kommentar konnte nicht gespeichert werden. Power Automate Flow ist noch nicht konfiguriert.' }
  }

  revalidatePath(`/dashboard/${dealId}`)
  return { success: true }
}
