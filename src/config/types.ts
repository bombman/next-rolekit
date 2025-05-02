export type AccessRule = {
    path: string
    roles?: string[]
    permissions?: string[]
  }
  
  export type AccessConfig = AccessRule[]
  
  export type User = {
    id?: string  
    role?: string | null
    permissions?: string[]
    name?: string
  }
  