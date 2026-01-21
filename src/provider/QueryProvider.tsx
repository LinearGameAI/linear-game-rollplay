'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // 使用 useState 确保 QueryClient 只创建一次
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 默认配置
            staleTime: 60 * 1000, // 1分钟
            retry: 1, // 失败重试1次
            refetchOnWindowFocus: false // 窗口聚焦时不自动重新获取
          },
          mutations: {
            retry: 0 // mutation 不重试
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
