import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface KeyButtonConfig {
  width: number
  height: number
  fontSize: number
}

interface KeyButtonContextType {
  config: KeyButtonConfig
  setConfig: (config: KeyButtonConfig) => void
}

const defaultConfig: KeyButtonConfig = {
  width: 48,
  height: 48,
  fontSize: 20
}

const KeyButtonContext = createContext<KeyButtonContextType | undefined>(undefined)

export function KeyButtonProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<KeyButtonConfig>(defaultConfig)

  return (
    <KeyButtonContext.Provider value={{ config, setConfig }}>
      {children}
    </KeyButtonContext.Provider>
  )
}

export function useKeyButtonConfig() {
  const context = useContext(KeyButtonContext)
  if (context === undefined) {
    throw new Error('useKeyButtonConfig must be used within a KeyButtonProvider')
  }
  return context
}
