import { loadAccessFromJSON } from './json-adapter'
import { loadAccessFromSupabase } from './supabase-adapter'
import type { AccessConfig } from './types'

export async function loadAccessConfig(): Promise<AccessConfig> {
  const source = process.env.ACCESS_CONFIG_SOURCE || 'json'

  if (source === 'supabase') return await loadAccessFromSupabase()
  return await loadAccessFromJSON()
}
