export function hasPermission(user: { role?: string; permissions?: string[] }, required: string) {
    return user?.permissions?.includes(required)
  }
  