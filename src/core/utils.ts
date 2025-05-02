// utils.ts
import type { User } from '@/config/types'
import { getAccessConfig } from '@/config/config-store'

export function canAccessPath(path: string, user: User): boolean {
  const config = getAccessConfig()
  const matched = config.find(rule => path.startsWith(rule.path))
  if (!matched) return true // no rule = allow

  const hasRole = matched.roles?.includes(user.role || '') ?? false
  const hasPermission = matched.permissions?.some(p => user.permissions?.includes(p || '')) ?? false

  return hasRole || hasPermission
}
