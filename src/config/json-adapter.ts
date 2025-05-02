import type { AccessConfig } from './types'
import config from '@/data/access.config.json'

export async function loadAccessFromJSON(): Promise<AccessConfig> {
  return config
}
