// 'use client'

// import { usePermission } from './usePermission'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'

// type Props = {
//   role?: string
//   permission?: string
//   children: React.ReactNode
//   fallback?: React.ReactNode
//   redirectTo?: string
// }

// export function PermissionGuard({
//   role,
//   permission,
//   children,
//   fallback = null,
//   redirectTo = '/unauthorized',
// }: Props) {
//   const router = useRouter()
//   const { hasRole, hasPermission, user } = usePermission()
//   const [checked, setChecked] = useState(false)

//   const allowed =
//     (role && hasRole(role)) ||
//     (permission && hasPermission(permission)) ||
//     (!role && !permission)

//   useEffect(() => {
//     // ✅ รอให้ user โหลดก่อน redirect
//     if (user.role !== undefined) {
//       if (!allowed && redirectTo) {
//         router.replace(redirectTo)
//       }
//       setChecked(true)
//     }
//   }, [allowed, redirectTo, router, user.role])

//   if (!checked) return null // 🔄 รอโหลด user ก่อน
//   if (!allowed) return fallback

//   return <>{children}</>
// }

'use client'

import { usePermission } from './usePermission'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  role?: string
  permission?: string
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string | null
}

export function PermissionGuard({
  role,
  permission,
  children,
  fallback = null,
  redirectTo, // ✅ ไม่มี default!
}: Props) {
  const router = useRouter()
  const { hasRole, hasPermission, user } = usePermission()
  const [checked, setChecked] = useState(false)

  const isReady = typeof user?.role === 'string' && Array.isArray(user?.permissions)

  const allowed =
    (role && hasRole(role)) ||
    (permission && hasPermission(permission)) ||
    (!role && !permission)

  useEffect(() => {
    if (!isReady) return

    if (!allowed && redirectTo) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[PermissionGuard] ❌ Access denied. user.role=${user.role}, redirecting to ${redirectTo}`
        )
      }
      router.replace(redirectTo)
    }

    setChecked(true)
  }, [allowed, redirectTo, router, isReady, user.role])

  if (!isReady || !checked) return null
  if (!allowed) {
    if (fallback === 'hide') return null
    return fallback ?? null
  }

  return <>{children}</>
}
