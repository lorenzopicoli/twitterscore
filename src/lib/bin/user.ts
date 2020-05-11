import { UserCommandParams } from '../../interfaces/CommandParams'
import { ScoredUserAnalysis } from '../../interfaces/UserAnalysis'
import { fetchUserTweets } from '../twitter'
import * as logger from '../../helpers/logger'
import { processTweets, analyseUserData } from '../analysis/userAnalysis'
import { singleUserReport } from '../report/userReport'

export const handleUserCommand = async (params: UserCommandParams): Promise<ScoredUserAnalysis | null> => {
  const { report = false, showRankings = false, detailed = false, username, ignoreCache } = params

  if (!username) {
    logger.error(`Missing username`)
    return null
  }

  const tweets = await fetchUserTweets(username, ignoreCache)
  if (!tweets) {
    logger.error(`Failed to fetch user ${username}`)
    return null
  }
  const userData = processTweets(username, tweets)
  if (!userData) {
    logger.error(`Failed to process user ${username}`)
    return null
  }
  const analysis = analyseUserData(userData)

  if (report) {
    singleUserReport(analysis, { showRankings, detailed })
  }
  return analysis
}
