import * as logger from '../../helpers/logger'
import { logSectionTitle, logSectionItem, logColoredScore } from './common'
import AverageAnalysis, { AverageAnalysisComponent } from '../../interfaces/AverageAnalysis'

const getAverageItem = (item: AverageAnalysisComponent): string =>
  `${item.average.toFixed(2)} ||| (${item.min}/${item.max})`

export default (title: string, analysis: AverageAnalysis): void => {
  const {
    userCount,
    tweetCount,
    mentionedUsers,
    retweets,
    tweets,
    sessions,
    hashtags,
    words,
    score,
    accountAge
  } = analysis

  // General
  logger.title(title)

  logSectionTitle(`ℹ️  ${userCount} users were analysed`)
  logSectionTitle(`ℹ️  ${tweetCount} tweets were analysed`)

  logSectionTitle('📖 General')
  logSectionItem('Average score', getAverageItem(score))
  logSectionItem('Average number of retweets', getAverageItem(retweets.totalCount))
  logSectionItem('Average account age', getAverageItem(accountAge))
  logSectionItem('Average tweet count per day', getAverageItem(tweets.averagePerDay))

  logSectionTitle('🧑 Mentioned users')
  logSectionItem('Average number of unique users mentioned', getAverageItem(mentionedUsers.uniqueCount))
  logSectionItem('Average number of users mentioned', getAverageItem(mentionedUsers.totalCount))

  logSectionTitle('#️⃣  Hashtag usage')
  logSectionItem('Average number of hashtags used', getAverageItem(hashtags.totalCount))
  logSectionItem('Average number of unique hashtags used', getAverageItem(hashtags.uniqueCount))
  logSectionItem(
    'Average of hashtag per tweet (average of the each user average)',
    getAverageItem(hashtags.perTweetCount)
  )

  logSectionTitle('💻 Sessions (a session is recorded every time a tweet is made after 10min of the previous one)')
  logSectionItem('Average number of sessions', getAverageItem(sessions.totalCount))
  logSectionItem(
    'Average time between tweets in sessions (with more than 1 tweet) (seconds)',
    getAverageItem(sessions.averageTimeBetweenTweets)
  )

  logSectionTitle('💬 Word usage')
  logSectionItem('Average number of unique words used (with filter)', getAverageItem(words.uniqueCount))
  logSectionItem('Average number of non relevant words used (with duplicates)', getAverageItem(words.nonRelevantCount))

  logSectionTitle('📊 Scores')
  analysis.users
    .sort((u1, u2) => u2.score.total - u1.score.total)
    .map((u) => logColoredScore(u.username, u.score.total))
}
