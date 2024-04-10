import { LanguageSymbol } from '@/interface'
import storage from '@/utils/storage'
import { createI18n, DefaultLocaleMessageSchema} from 'vue-i18n'

export const languageStorageKey = 'system_language'

const languageSymbol: { [key in string]: LanguageSymbol } = {
  zh: {
    request: 'zh-CN',
    elementPlus: 'zhCn',
    tinymce: 'zh_CN'
  },
  en: {
    request: 'en-US',
    elementPlus: 'en',
    tinymce: 'en_US'
  }
}

export const langs = require.context('./packages', false, /\.ts$/).keys().map((item: string) => {
  const regRes = item.match(/\/(.*)(?=\.ts)/)
  return regRes ? regRes[1] : ''
})

const packages: { [x: string]: DefaultLocaleMessageSchema } = {}

langs.forEach((item: string) => {
  packages[item] = require(`./packages/${item}`).default
})

const I18n = createI18n({
  fallbackLocale: 'zh',
  globalInjection: true,
  legacy: false,
  locale: storage.get(languageStorageKey) || 'zh',
  messages: packages
})

/**
 * 获取个模块语言标识
 * @returns LanguageSymbol
 */
export function getSymbol(): LanguageSymbol {
  return languageSymbol[I18n.global.locale.value] || languageSymbol.zh
}

export const Lang = {
  /**
 * 获取消息文本
 * @param rule 规则
 * @param variables 变量列表
 * @returns string
 */
  message(rule: string, variables: { [key in string]: string } = {}): string {
    return I18n.global.t(`message.${rule}`, variables)
  },
  /**
 * 获取按钮文本
 * @param rule 规则
 * @param variables 变量列表
 * @returns string
 */
  button(rule: string, variables: { [key in string]: string } = {}): string {
    return I18n.global.t(`button.${rule}`, variables)
  },
  /**
 * 获取普通文本
 * @param rule 规则
 * @param variables 变量列表
 * @returns string
 */
  text(rule: string, variables: { [key in string]: string } = {}): string {
    return I18n.global.t(rule, variables)
  },
  /**
 * 获取验证消息
 * @param rule 验证规则
 * @param variables 变量列表
 * @returns string
 */
  validate(rule: string, variables: { [key in string]: string } = {}): string {
    const vars: { [key in string]: string } = {}
    for (const key in variables) {
      vars[key] = I18n.global.t(variables[key])
    }
    return I18n.global.t(`validate.${rule}`, vars)
  }
}

export default I18n
