// usePermission.ts
import { useUser } from './UserContext'
import type { User } from '../config/types'

const fallbackUser: User = {
  role: null,
  permissions: []
}

export function usePermission() {
  const user = useUser() ?? fallbackUser

  const hasPermission = (perm: string) =>
    user.permissions?.includes?.(perm) ?? false

  const hasRole = (role: string) =>
    user.role === role

  return { user, hasPermission, hasRole }
}
