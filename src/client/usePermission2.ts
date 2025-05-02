'use client'

import { useEffect, useState } from 'react'
import { mockUser } from '@/config/dev-user'

export function usePermission() {
  const [user, setUser] = useState<{ role?: string; permissions?: string[] }>({})

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      setUser(mockUser)
    } else {
      // TODO: แก้ภายหลังให้ดึงจาก Supabase session จริง
      setUser({})
    }
  }, [])

  const hasRole = (role: string) => user?.role === role
  const hasPermission = (perm: string) => user?.permissions?.includes(perm)

  return { user, hasRole, hasPermission }
}
