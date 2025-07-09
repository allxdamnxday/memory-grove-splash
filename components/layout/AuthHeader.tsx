import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import HeaderClient from './HeaderClient'

export default async function AuthHeader() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return <HeaderClient user={error ? null : user} />
}