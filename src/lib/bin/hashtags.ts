import Bluebird from 'bluebird'

import { CommandParams } from '../../interfaces/CommandParams'
import { ScoredUserAnalysis } from '../../interfaces/UserAnalysis'
import * as logger from '../../helpers/logger'
import { handleUserCommand } from './user'
import { fetchHashtagUsers } from '../twitter'
import { analyseAverage } from '../analysis/averageAnalysis'
import averageReport from '../report/averageReport'

export const handleHashtag = async (params: CommandParams): Promise<void> => {
  const { hashtag, max, detailed } = params

  if (!hashtag) {
    logger.error(`Missing hashtag`)
    return
  }

  const users = await fetchHashtagUsers(hashtag, max)
  const results = await Bluebird.map(
    users,
    async (user: string): Promise<ScoredUserAnalysis | null> => {
      // A detailed hashtag command means reporting the users so that's why report = detailed
      // on the other hand we never want a full on detailed report when fetching hashtag data
      // so detailed is always false
      return handleUserCommand({ ...params, username: user, detailed: false, report: detailed })
    },
    { concurrency: 3 }
  )
  const cleanedResults = results.filter((r): r is ScoredUserAnalysis => !!r)
  const averageAnalysis = analyseAverage(cleanedResults)
  averageReport(`️#️⃣ #️⃣ #️⃣  Hashtag analysis - ${hashtag} #️⃣ #️⃣#️⃣ `, averageAnalysis)
}
