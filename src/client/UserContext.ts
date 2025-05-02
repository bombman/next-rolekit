'use client'
import { createContext, useContext } from 'react'
import type { User } from '@/config/types'

export const UserContext = createContext<User | null>(null)

export const useUser = () => {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error('useUser must be used within a <UserContext.Provider>')
  }
  return user
}
