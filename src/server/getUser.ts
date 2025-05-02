import { mockUser } from '@/config/dev-user'

export async function getUserFromRequest(req: Request) {
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    return mockUser
  }

  // TODO: Supabase integration here (auth helpers)
  return {
    role: undefined,
    permissions: [],
  }
}
