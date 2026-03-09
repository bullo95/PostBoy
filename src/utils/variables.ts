import { Environment } from '../types'

export const replaceVariables = (text: string, environment: Environment | null): string => {
  if (!environment) return text

  let result = text
  Object.entries(environment.variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  })

  return result
}

export const extractVariables = (text: string): string[] => {
  const regex = /{{([^}]+)}}/g
  const matches = text.matchAll(regex)
  return Array.from(matches, (m) => m[1])
}

export const hasVariables = (text: string): boolean => {
  return /{{[^}]+}}/.test(text)
}
