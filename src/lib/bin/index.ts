import { handleUserCommand } from './user'
import minimist from 'minimist'
import * as logger from '../../helpers/logger'
import { handleHashtag } from './hashtags'
import { handleLabeledData } from './labeledData'
import { LabeledDataCommandParams, UserCommandParams, CommandParams } from '../../interfaces/CommandParams'

export const run = async (): Promise<void> => {
  const args = minimist(process.argv.slice(2))
  if (Object.keys(args).length < 2) {
    logger.warning('It looks like you forgot to pass params')
  }
  const { c: command, ...rest } = args

  const commandArgs = rest as unknown

  switch (command) {
    case 'user': {
      handleUserCommand(commandArgs as UserCommandParams)
      return
    }
    case 'hashtag': {
      handleHashtag(commandArgs as CommandParams)
      return
    }
    case 'labeledData': {
      handleLabeledData(commandArgs as LabeledDataCommandParams)
      return
    }
    default:
      logger.error('Invalid command')
      break
  }
}
