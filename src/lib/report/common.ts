import * as logger from '../../helpers/logger'
import Rgb from '../../interfaces/Rgb'
import lodash from 'lodash'

export const dateFormat = 'DD MMMM YYYY - HH:mm'
export const logSectionTitle = (name: string): void => {
  console.log('')
  logger.section(`- ${name}`)
}

export const logSectionItem = (label: string, value?: string | number, bgColor?: Rgb): void => {
  logger.success(`  - ${label}:`, value ? String(value) : '', bgColor)
}

export const logColoredScore = (label: string, score: number): void => {
  const scoreBgColor: Rgb = {
    red: score >= 0 ? 0 : Math.round(-score * 1.5),
    green: score < 0 ? 0 : Math.round(score * 1.5),
    blue: 10
  }
  logger.success(`  - ${label}:`, lodash.isNil(score) ? '' : String(score), scoreBgColor)
}
