import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ['en', 'zh'], //支持的语言
  defaultLocale: 'en', //默认语言
  localePrefix: 'as-needed', //是否需要前缀
})
