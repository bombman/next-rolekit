import { NextResponse, NextRequest } from 'next/server'
import { getUserFromRequest } from './getUser'
import { injectAccessConfig } from '../config/config-store'
import { canAccessPath } from '../core/utils'
import { SignJWT } from 'jose'
import type { AccessConfig, User } from '../config/types'

type Options = {
  redirectTo?: string
}

const debug = process.env.DEBUG_MODE === 'true'

export function getMockUserFromEnv(): User {
  const id = process.env.DEV_MOCK_ID
  const name = process.env.DEV_MOCK_NAME
  const role = process.env.DEV_MOCK_ROLE
  const permissions = (process.env.DEV_MOCK_PERMISSIONS || '')
    .split(',')
    .map(p => p.trim())
    .filter(Boolean)

  return { id, name, role, permissions }
}

export function withAccessMiddleware(config: AccessConfig, options: Options = {}) {
  injectAccessConfig(config)

  return async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname
    const res = NextResponse.next()

    if (debug) console.log('[middleware] Incoming request:', pathname)

    let user: User = await getUserFromRequest(req)

    if (process.env.DEV_MOCK_ENABLED === 'true') {
      const mockUser = getMockUserFromEnv()
      user = mockUser

      if (debug) console.log('[middleware] Using mock user from .env:', mockUser)

      if (process.env.DEV_MOCK_TYPE === 'jwt') {
        const token = await new SignJWT(mockUser)
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('1h')
          .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'default'))

        res.cookies.set('mock-token', token, { httpOnly: false })
        if (debug) console.log('[middleware] Set mock-token (JWT)')
      } else {
        res.cookies.set('mock-user', JSON.stringify(mockUser), { httpOnly: false })
        if (debug) console.log('[middleware] Set mock-user (plain cookie)')
      }
    }

    if (debug) console.log('[middleware] Final user:', user)

    const allowed = canAccessPath(pathname, user)

    if (debug) console.log('[middleware] Access allowed:', allowed)

    if (!allowed) {
      if (debug) console.warn('[middleware] Access denied. Redirecting...')
      return NextResponse.redirect(new URL(options.redirectTo || '/unauthorized', req.url))
    }

    return res
  }
}
