import { cookieUtils } from '../cookie-utils'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const getAppLocale = async () => {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en'
    return locale
  } else {
    return cookieUtils.get<string>('NEXT_LOCALE') || 'en'
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const lang = await getAppLocale()

  const headers = {
    Accept: 'application/json',
    Language: lang,
    ...options.headers
  } as HeadersInit

  //这里的url 如果是http/https开头的，不必拼接baseurl
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `${BASE_URL}${url}`
  }
  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    console.log(response, url)
    throw new Error(`Request failed with status ${response.status}`)
  }

  // Handle void/empty response
  const text = await response.text()
  if (!text) return {} as T

  try {
    return JSON.parse(text)
  } catch {
    return text as unknown as T
  }
}

interface FetcherOptions<B, P> extends Omit<RequestInit, 'body'> {
  method: string
  url: string
  params?: P
  body?: B
}

async function fetcher<T, B = unknown, P = unknown>({
  method,
  url,
  params,
  body,
  signal,
  headers
}: FetcherOptions<B, P>): Promise<T> {
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, String(value))
    })
    if (url.includes('?')) {
      url += `&${searchParams.toString()}`
    } else {
      url += `?${searchParams.toString()}`
    }
  }
  //body如果是stream类型，需要特殊处理
  if (body instanceof ReadableStream) {
    return request<T>(url, {
      method,
      body,
      signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...headers }
    })
  }
  //body如果是FormData类型，需要特殊处理,
  // multipart/form-data; boundary=----WebKitFormBoundaryUem38GqPLNDsJyUm
  if (body instanceof FormData) {
    return request<T>(url, {
      method,
      body,
      signal,
      headers
    })
  }
  return request<T>(url, {
    method,
    body: JSON.stringify(body),
    signal,
    headers: { 'Content-Type': 'application/json', ...headers }
  })
}

export const getFetcher = <T, B = unknown, P = unknown>(options: Omit<FetcherOptions<P, B>, 'method'>) => {
  return fetcher<T, P, B>({ method: 'GET', ...options })
}

export const postFetcher = <T, B = unknown, P = unknown>(options: Omit<FetcherOptions<P, B>, 'method'>) => {
  return fetcher<T, P, B>({ method: 'POST', ...options })
}

export const putFetcher = <T, B = unknown, P = unknown>(options: Omit<FetcherOptions<P, B>, 'method'>) => {
  return fetcher<T, P, B>({ method: 'PUT', ...options })
}

export const deleteFetcher = <T, B = unknown, P = unknown>(options: Omit<FetcherOptions<P, B>, 'method'>) => {
  return fetcher<T, P, B>({ method: 'DELETE', ...options })
}

export const patchFetcher = <T, B = unknown, P = unknown>(options: Omit<FetcherOptions<P, B>, 'method'>) => {
  return fetcher<T, P, B>({ method: 'PATCH', ...options })
}
