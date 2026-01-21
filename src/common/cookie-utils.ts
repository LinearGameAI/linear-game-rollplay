import { getCookie, setCookie, deleteCookie, hasCookie, OptionsType } from 'cookies-next'

export const cookieUtils = {
  set: <T>(key: string, value: T, options?: OptionsType) => {
    const content = typeof value === 'object' ? JSON.stringify(value) : String(value)
    setCookie(key, content, options)
  },

  get: <T>(key: string, options?: OptionsType): T | undefined => {
    const rawVal = getCookie(key, options)

    if (rawVal === undefined || rawVal === null) return undefined

    try {
      const decoded = decodeURIComponent(String(rawVal))
      if (
        (decoded.startsWith('{') && decoded.endsWith('}')) ||
        (decoded.startsWith('[') && decoded.endsWith(']')) ||
        decoded === 'true' ||
        decoded === 'false'
      ) {
        return JSON.parse(decoded) as T
      }
      return rawVal as unknown as T
    } catch (e) {
      return rawVal as unknown as T
    }
  },

  remove: (key: string) => {
    deleteCookie(key)
  },

  has: async (key: string): Promise<boolean> => {
    return await hasCookie(key)
  }
}
