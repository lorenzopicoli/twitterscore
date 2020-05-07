import { UserAnalysis } from '../../interfaces/UserAnalysis'
import Score from '../../interfaces/Score'
import lodash from 'lodash'
const maxScore = 100
const minScore = -100
const withinLimits = (x: number): number => Math.min(Math.max(minScore, x), maxScore)

const averageTimeBetweenTweetsEq = (x: number): number => withinLimits((600 * (x - 82)) / x)
const hashtagsPerTweetEq = (x: number): number => withinLimits(100 - 4000 * Math.pow(x, 2))
const hashtagsUniqueEq = (x: number): number => withinLimits(100 - Math.pow(x, 2))
const hashtagsTotalEq = (x: number): number => withinLimits(100 - Math.pow(x, 2))
const mentionedUsersTotalEq = (x: number): number => withinLimits(100 - Math.pow(x - 150, 2) / 80)
const wordsTotalEq = (x: number): number => withinLimits(-310 + x * 0.9)
const finalScoreEq = (params: number[]): number => lodash.sum(params) / params.length

export const calculateUserScore = (data: UserAnalysis): Score => {
  const { mentionedUsers, hashtags, sessions, words } = data

  const averageTimeBetweenTweetsScore =
    sessions.averageTimeBetweenTweets !== 0 ? averageTimeBetweenTweetsEq(sessions.averageTimeBetweenTweets) : minScore
  const hashtagsPerTweetScore = hashtagsPerTweetEq(hashtags.perTweetCount)
  const hashtagsUniqueScore = hashtagsUniqueEq(hashtags.uniqueCount)
  const hashtagsTotalScore = hashtagsTotalEq(hashtags.totalCount)
  const mentionedUsersTotalScore = mentionedUsersTotalEq(mentionedUsers.totalCount)
  const wordsTotalUniqueScore = wordsTotalEq(words.uniqueCount)
  const totalScore = finalScoreEq([
    averageTimeBetweenTweetsScore,
    (hashtagsPerTweetScore + hashtagsUniqueScore + hashtagsTotalScore) / 3,
    mentionedUsersTotalScore,
    wordsTotalUniqueScore
  ])

  return {
    uniqueWords: wordsTotalUniqueScore,
    mentionedUsers: mentionedUsersTotalScore,
    hashtagsCount: hashtagsTotalScore,
    hashtagsUnique: hashtagsUniqueScore,
    hashtagsPerTweet: hashtagsPerTweetScore,
    averageTimeBetweenTweets: averageTimeBetweenTweetsScore,
    total: totalScore
  }
}
