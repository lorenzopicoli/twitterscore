import chalk, { Chalk } from 'chalk'
import moment from 'moment'
import lodash from 'lodash'
import Rgb from '../interfaces/Rgb'

const { IS_DEBUG } = process.env

const now = (): string => moment().format('HH:mm:ss')

export const warning = (message: string, details?: string): void => {
  const time = chalk.white(`${now()} - `)
  const styledMessage = chalk.yellow(message)
  console.log(time + styledMessage)
  if (details) {
    console.log(details)
  }
}
export const title = (message: string): void => {
  const separator = `====================================================================================`
  console.log('')
  console.log(separator)
  console.log(chalk.bold(message))
  console.log(separator)
  console.log('')
}
export const section = (message: string): void => {
  console.log(`${chalk.inverse.bold(message)}`)
}
export const debug = (message: string): void => {
  if (!IS_DEBUG) {
    return
  }
  const time = chalk.white(`${now()} - `)
  const styledMessage = chalk.magenta(` ${message}`)
  console.log(time + styledMessage)
}

export const info = (message: string): void => console.log(chalk.blue(` ${message}`))
export const error = (message: string): void => {
  const time = chalk.white(`${now()} - `)
  const styledMessage = chalk.redBright(` ${message}`)
  console.log(time + styledMessage)
}
export const success = (title: string, message: string, bgColor?: Rgb): void => {
  let chalkInstance: Chalk = chalk
  if (bgColor) {
    chalkInstance = chalkInstance.bgRgb(bgColor.red, bgColor.green, bgColor.blue)
  }
  const styledTitle = lodash.isNil(title) ? '' : chalk.magenta(title)
  const styledMessage = lodash.isNil(message) ? '' : chalk.white(` ${message}`)
  console.log(chalkInstance.white(styledTitle + styledMessage))
}
