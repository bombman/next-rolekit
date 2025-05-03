# 🛡️ next-rolekit

A lightweight, flexible **Role & Permission Guard** library for **Next.js 15+**  
Supports **App Router**, **Middleware**, **Client/UI protection**, **API routes**, and **Supabase** (soon).

---

## ✅ Features

- 🔒 **Middleware Guard** – Block access by role/permission before route loads
- 👁️ **Client-side Permission UI** – Show/hide components by user role/permissions
- 🧪 **Dev Mocking via `.env.local`** – Fast local testing without auth setup
- 🌐 **Central Access Config** – Easy to manage and share rules
- 🍪 **Cookie / JWT-based identity** – No auth provider lock-in
- 🧩 **Supabase-ready (soon)**
- 🛠️ **No runtime dependencies**

---

## 📦 Install

```bash
npm install next-rolekit
```

---

## 🚀 Quick Start

### 1. Define Access Rules

```json
// access.config.json
[
  { "path": "/admin", "roles": ["admin"] },
  { "path": "/dashboard", "permissions": ["view_dashboard"] }
]
```

---

### 2. Add Middleware

```ts
// middleware.ts
import accessConfig from './access.config.json'
import { withAccessMiddleware } from 'next-rolekit/server'

export const middleware = withAccessMiddleware(accessConfig, {
  redirectTo: '/unauthorized',
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
```

---

### 3. Enable Mocking (Optional, Dev Only)

```env
# .env.local
DEV_MOCK_ENABLED=true
DEV_MOCK_TYPE=cookie
DEV_MOCK_ID=abc-123
DEV_MOCK_NAME=Admin User
DEV_MOCK_ROLE=admin
DEV_MOCK_PERMISSIONS=create_post,edit_post,delete_post
JWT_SECRET=supersecret
DEBUG_MODE=true
```

---

### 4. Create a User Provider

```tsx
// app/UserProvider.tsx
'use client'

import { useEffect, useState } from 'react'
import { UserContext } from 'next-rolekit/client'
import jwtDecode from 'jwt-decode'
import type { User } from 'next-rolekit/config'

export function UserProvider({ children }) {
  const [user, setUser] = useState<User>({
    id: undefined,
    name: 'Unknown',
    role: undefined,
    permissions: [],
  })

  useEffect(() => {
    const cookies = Object.fromEntries(document.cookie.split('; ').map(c => c.split('=')))
    try {
      if (cookies['mock-token']) {
        setUser(jwtDecode(decodeURIComponent(cookies['mock-token'])))
      } else if (cookies['mock-user']) {
        setUser(JSON.parse(decodeURIComponent(cookies['mock-user'])))
      }
    } catch (err) {
      console.error('[UserProvider] Failed to parse user:', err)
    }
  }, [])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
```

---

### 5. Wrap Your Layout

```tsx
// app/layout.tsx
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
```

---

### 6. Guard UI Components

```tsx
import { PermissionGuard } from 'next-rolekit/client'

<PermissionGuard role="admin" fallback="hide">
  <button>+ Create</button>
</PermissionGuard>

<PermissionGuard permission="edit_post" fallback={<p>❌ No access</p>}>
  <Editor />
</PermissionGuard>

<PermissionGuard role="admin" redirectTo="/unauthorized">
  <DashboardPage />
</PermissionGuard>
```

---

### 7. Access User Info

```tsx
import { useUser } from 'next-rolekit/client'

const user = useUser()
console.log('Role:', user.role)
console.log('Permissions:', user.permissions)
```

---

## 🔍 Internals

| Layer              | Purpose                                  |
|-------------------|-------------------------------------------|
| `middleware.ts`   | Pre-route access control (role/perm)      |
| `getUserFromRequest` | Load user from cookie or JWT            |
| `UserProvider`    | Injects user into React Context           |
| `useUser()`       | Get current user anywhere (client-side)   |
| `PermissionGuard` | Show/hide/redirect components safely      |

---

## 🧩 API Summary

```ts
// Server
withAccessMiddleware(config, { redirectTo?: string })

// Client
useUser(): User
usePermission(): {
  hasRole: (r: string) => boolean
  hasPermission: (p: string) => boolean
}

<PermissionGuard
  role="admin"
  permission="edit_post"
  fallback="hide"
  redirectTo="/unauthorized"
/>
```

---

## 🗂 Suggested Project Structure

```
.
├── access.config.json
├── middleware.ts
├── app/
│   ├── layout.tsx
│   ├── UserProvider.tsx
├── lib/
│   ├── usePermission.ts
├── .env.local
```

---

## 📄 License

MIT © [Nuttapong Maneenate](https://github.com/bombman)