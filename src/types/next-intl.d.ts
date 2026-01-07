
// global.d.ts 或者 src/types/next-intl.d.ts
type Messages = typeof import('../messages/zh.json'); // 引入你的主语言包

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {
  }
}
declare module 'next-intl' {
  export default interface AppConfig {
    Messages: IntlMessages;
  }
}
export {};