# 🛡️ next-rolekit

A lightweight, flexible **Role & Permission Guard** library for **Next.js 15+**  
Supports **App Router**, **Middleware**, **Client/UI protection**, **API routes**, and **Supabase** integration.

---

## ✅ Features

- 🔒 **Middleware-level Guard**: Block access by role/permission before request reaches page
- 👁️ **Client-level Permission UI**: Show/hide components based on user role/permissions
- 🧪 **Dev Mocking via `.env.local`**: Easy mock user injection, no hardcoded values
- 🌐 **Global Config**: Centralized access control rules
- 🪙 **JWT / Cookie Support**: Lightweight token-based identity
- 📦 **Zero runtime dependencies**: Fast, clean, and easy to integrate
- 🧩 **Supabase/Auth-ready**

---

## 📦 Installation

```bash
npm install next-rolekit
```

---

## 🚀 Quick Start

### 1. Define Access Rules

```json
// access.config.json
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
```

---

### 2. Setup Middleware

```ts
// middleware.ts
import accessConfig from './access.config.json'
import { withAccessMiddleware } from 'next-rolekit/server'

export const middleware = withAccessMiddleware(accessConfig, {
  redirectTo: '/unauthorized',
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/protected/:path*'],
}
```

---

### 3. Enable Mocking (Optional)

Add to `.env.local` for local development:

```
DEV_MOCK_ENABLED=true
DEV_MOCK_TYPE=cookie
DEV_MOCK_ID=f3a8c65b-0f4f-4e98-b2d7-a7f0e8db5212
DEV_MOCK_NAME=Admin User
DEV_MOCK_ROLE=admin
DEV_MOCK_PERMISSIONS=create_post,edit_post,delete_post
JWT_SECRET=supersecret
```

---

### 4. Create User Provider

```tsx
// app/UserProvider.tsx
'use client'
import { useEffect, useState } from 'react'
import { UserContext } from 'next-rolekit/client'
import jwtDecode from 'jwt-decode'
import type { User } from 'next-rolekit/config'

export function UserProvider({ children }) {
  const [user, setUser] = useState<User>({ role: undefined, permissions: [] })

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
// Only visible to admins
import { PermissionGuard } from 'next-rolekit/client'

<PermissionGuard role="admin">
  <button>Only Admins see this</button>
</PermissionGuard>
```

---

### 7. Access User Info

```tsx
import { useUser } from 'next-rolekit/client'

const user = useUser()
console.log('User Role:', user.role)
```

---

## 🔍 How It Works

| Layer               | Responsibility                                 |
|--------------------|------------------------------------------------|
| `middleware.ts`     | Guard route access before page render         |
| `getUserFromRequest` | Resolve user via mock or real auth           |
| `UserProvider`      | Reads cookie and injects context              |
| `useUser()`         | Access user info in any client component      |

---

## 🧩 API Summary

- **Middleware**
  ```ts
  withAccessMiddleware(config, { redirectTo?: string })
  ```

- **Client Hooks & Components**
  ```ts
  useUser(): User
  usePermission(): { hasRole: (r) => boolean, hasPermission: (p) => boolean }
  <PermissionGuard role="admin" permission="edit_post">...</PermissionGuard>
  ```

---

## 📁 Project Structure (Suggestion)

```
.
├── access.config.json
├── middleware.ts
├── app/
│   ├── layout.tsx
│   ├── UserProvider.tsx
├── .env.local
```

---

## 📜 License

MIT © [Nuttapong Maneenate](https://github.com/nuttapongdev)
