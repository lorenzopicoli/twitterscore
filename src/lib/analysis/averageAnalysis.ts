import lodash from 'lodash'
import { ScoredUserAnalysis } from '../../interfaces/UserAnalysis'
import AverageAnalysis, { emptyAverageAnalysis } from '../../interfaces/AverageAnalysis'

const averageAndSum = (
  partialAverage: AverageAnalysis,
  userAnalysis: ScoredUserAnalysis,
  path: string,
  totalUsers: number
): number => {
  const averagePath = path + '.average'
  return (lodash.get(partialAverage, averagePath) || 0) + (lodash.get(userAnalysis, path) || 0) / totalUsers
}

const getMax = (partialAverage: AverageAnalysis, userAnalysis: ScoredUserAnalysis, path: string): number => {
  const maxPath = path + '.max'
  return Math.max(lodash.get(userAnalysis, path), lodash.get(partialAverage, maxPath) || 0)
}

const getMin = (partialAverage: AverageAnalysis, userAnalysis: ScoredUserAnalysis, path: string): number => {
  const minPath = path + '.min'
  return Math.min(lodash.get(userAnalysis, path), lodash.get(partialAverage, minPath) || 9999999999)
}

export const averageWithPartial = (
  partialAverage: AverageAnalysis,
  userAnalysis: ScoredUserAnalysis,
  totalUsers: number
): AverageAnalysis => {
  return {
    // TODO: Performance sensitive
    users: [...partialAverage.users, userAnalysis],
    usernames: [...partialAverage.usernames, userAnalysis.username],
    userCount: totalUsers,
    tweetCount: partialAverage.tweetCount + userAnalysis.tweets.totalCount,
    score: {
      average: averageAndSum(partialAverage, userAnalysis, 'score.total', totalUsers),
      max: getMax(partialAverage, userAnalysis, 'score.total'),
      min: getMin(partialAverage, userAnalysis, 'score.total')
    },
    tweets: {
      totalCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'tweets.totalCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'tweets.totalCount'),
        min: getMin(partialAverage, userAnalysis, 'tweets.totalCount')
      }
    },
    retweets: {
      totalCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'retweets.totalCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'retweets.totalCount'),
        min: getMin(partialAverage, userAnalysis, 'retweets.totalCount')
      }
    },
    words: {
      uniqueCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'words.uniqueCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'words.uniqueCount'),
        min: getMin(partialAverage, userAnalysis, 'words.uniqueCount')
      },
      nonRelevantCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'words.nonRelevantCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'words.nonRelevantCount'),
        min: getMin(partialAverage, userAnalysis, 'words.nonRelevantCount')
      }
    },
    mentionedUsers: {
      totalCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'mentionedUsers.totalCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'mentionedUsers.totalCount'),
        min: getMin(partialAverage, userAnalysis, 'mentionedUsers.totalCount')
      },
      uniqueCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'mentionedUsers.uniqueCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'mentionedUsers.uniqueCount'),
        min: getMin(partialAverage, userAnalysis, 'mentionedUsers.uniqueCount')
      }
    },
    hashtags: {
      totalCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'hashtags.totalCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'hashtags.totalCount'),
        min: getMin(partialAverage, userAnalysis, 'hashtags.totalCount')
      },
      uniqueCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'hashtags.uniqueCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'hashtags.uniqueCount'),
        min: getMin(partialAverage, userAnalysis, 'hashtags.uniqueCount')
      },
      perTweetCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'hashtags.perTweetCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'hashtags.perTweetCount'),
        min: getMin(partialAverage, userAnalysis, 'hashtags.perTweetCount')
      }
    },
    sessions: {
      totalCount: {
        average: averageAndSum(partialAverage, userAnalysis, 'sessions.totalCount', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'sessions.totalCount'),
        min: getMin(partialAverage, userAnalysis, 'sessions.totalCount')
      },

      averageTimeBetweenTweets: {
        average: averageAndSum(partialAverage, userAnalysis, 'sessions.averageTimeBetweenTweets', totalUsers),
        max: getMax(partialAverage, userAnalysis, 'sessions.averageTimeBetweenTweets'),
        min: getMin(partialAverage, userAnalysis, 'sessions.averageTimeBetweenTweets')
      }
    }
  }
}

export const analyseAverage = (data: ScoredUserAnalysis[]): AverageAnalysis => {
  const userCount = data.length
  if (userCount < 1) {
    throw "Can't average empty array"
  }

  return data.reduce(
    (partial: AverageAnalysis, user: ScoredUserAnalysis) => averageWithPartial(partial, user, userCount),
    emptyAverageAnalysis
  )
}
