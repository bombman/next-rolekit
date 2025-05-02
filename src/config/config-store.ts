import type { AccessConfig } from './types'

let accessConfig: AccessConfig | null = null

export function injectAccessConfig(config: AccessConfig) {
  accessConfig = config
}

export function getAccessConfig(): AccessConfig {
  if (!accessConfig) {
    throw new Error('Access config not injected.')
  }
  return accessConfig
}
