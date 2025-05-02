# 🛡️ next-rolekit

A lightweight, flexible Role & Permission guard library for **Next.js 15+**.

Supports **App Router**, **Middleware**, **Client/UI protection**, **API routes**, and **Supabase** integration.


next-rolekit
Role & Permission Guard Library for Next.js 15+

🗹 Support App Router
🗹 Secure Middleware + Client Context
🗹 Dev-friendly mock config via .env.local
 Supabase / Auth-ready

-----------------------------

Features

- Middleware-level Guard: Block access by role/permission before request reaches page
- Client-level Permission UI: Control visibility of UI based on user role/permissions
- Dev Mocking with .env.local: No need to hardcode mock user
- Global config: Inject once, use everywhere
- JWT / Cookie support
- Zero runtime dependencies

-----------------------------

Installation

npm install next-rolekit

-----------------------------

Usage Overview

1. Create access.config.json

[
  {
    "path": "/admin",
    "roles": ["admin"]
  },
  {
    "path": "/dashboard",
    "permissions": ["view_dashboard"]
  }
]

-----------------------------

2. Setup middleware.ts

import accessConfig from './access.config.json'
import { withAccessMiddleware } from 'next-rolekit/server'

export const middleware = withAccessMiddleware(accessConfig, {
  redirectTo: '/unauthorized'
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/protected/:path*']
}

-----------------------------

3. Enable Mock Dev (optional) in .env.local

DEV_MOCK_ENABLED=true
DEV_MOCK_TYPE=cookie
DEV_MOCK_ID=f3a8c65b-0f4f-4e98-b2d7-a7f0e8db5212
DEV_MOCK_NAME=Admin User
DEV_MOCK_ROLE=admin
DEV_MOCK_PERMISSIONS=create_post,edit_post,delete_post
JWT_SECRET=supersecret

-----------------------------

4. Create UserProvider.tsx

'use client'
import { useEffect, useState } from 'react'
import { UserContext } from 'next-rolekit/client'
import jwtDecode from 'jwt-decode'
import type { User } from 'next-rolekit/config'

export function UserProvider({ children }) {
  const [user, setUser] = useState({ role: undefined, permissions: [] })

  useEffect(() => {
    const cookieMap = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')))
    try {
      if (cookieMap['mock-token']) {
        setUser(jwtDecode(decodeURIComponent(cookieMap['mock-token'])))
      } else if (cookieMap['mock-user']) {
        setUser(JSON.parse(decodeURIComponent(cookieMap['mock-user'])))
      }
    } catch (err) {
      console.error('[UserProvider] Failed to read cookie:', err)
    }
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

-----------------------------

5. Wrap your layout

import { UserProvider } from './UserProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}

-----------------------------

6. Guard UI

import { PermissionGuard } from 'next-rolekit/client'

<PermissionGuard role="admin">
  <button>Only Admins see this</button>
</PermissionGuard>

-----------------------------

7. Use useUser()

import { useUser } from 'next-rolekit/client'

const user = useUser()
console.log('user:', user.role)

-----------------------------

How it works

Layer            Responsibility
--------------   -------------------------------------
middleware.ts     Check access config before render
getUserFromRequest  Resolve user via mock (or real auth)
UserProvider       Read cookie → set user context
useUser()          Access user globally in client

-----------------------------

API Summary

// middleware
withAccessMiddleware(config: AccessConfig, options?: { redirectTo: string })

// client
useUser(): User
usePermission(): { hasRole, hasPermission }
PermissionGuard: ({ role, permission }) => ReactNode

-----------------------------

Access Config Format

type AccessConfig = {
  path: string
  roles?: string[]
  permissions?: string[]
}[]

-----------------------------

Project Structure (Suggestion)

.
├── access.config.json
├── middleware.ts
├── app/
│   ├── layout.tsx
│   ├── UserProvider.tsx
├── .env.local

-----------------------------

License

MIT © Nuttapong Maneenate
