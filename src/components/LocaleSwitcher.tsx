'use client'

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "../i18n/navigation"

//语言选择
export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newlocale: string) => {
    if (newlocale !== locale) {
      router.push(pathname, { locale: newlocale })
    }
  }
  return (
    <select value={locale} onChange={(e) => switchLocale(e.target.value)}>
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  )
}
