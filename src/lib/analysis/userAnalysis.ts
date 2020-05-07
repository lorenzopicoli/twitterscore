import nonRelevantWordsDic from '../../data/nonRelevantWords'
import lodash from 'lodash'
import moment, { Moment } from 'moment'

import * as logger from '../../helpers/logger'
import { UsageCount } from '../../interfaces/UsageCount'
import Session from '../../interfaces/Session'
import UserData from '../../interfaces/UserData'
import { TweetApiResponse } from '../../interfaces/TwitterApi'
import { usageObjToArray, addUsageWithSideEffect, addUsage, parseTwitterDate } from '../../helpers'
import { ScoredUserAnalysis } from '../../interfaces/UserAnalysis'
import { calculateUserScore } from './score'

const regex = nonRelevantWordsDic.map((word: string): string => `(\\b${word}\\b)`).join('|')

const getWords = (texts: UsageCount): UsageCount => {
  let words: UsageCount = {}
  Object.keys(texts)
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/!/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\?/g, '')
    .replace(/\//g, '')
    .replace(/,/g, '')
    .replace(/-/g, '')
    .replace(/"/g, '')
    .replace(/\./g, '')
    .replace(/\|/g, '')
    .replace(/￣/g, '')
    .replace(/:/g, '')
    .replace(/\n/g, ' ')
    .replace(/[\u2026\u201c\u201d]/g, '')
    .replace(new RegExp(regex, 'gi'), '&#non-relevant-word&#')
    .split(' ')
    .filter((token) => !token.startsWith('@') && !token.startsWith('#') && token !== '')
    .map((token) => {
      words = addUsageWithSideEffect(token.toLowerCase(), words)
    })
  return words
}

export const processTweets = (username: string, tweetsParam: TweetApiResponse[]): UserData | null => {
  const sessionMinDuration = 60 * 10 // seconds
  const tweets = lodash.cloneDeep(tweetsParam)
  // Older to newer
  tweets.reverse()

  const lastTweet = tweets[tweets.length - 1]

  const firstTweetDate = tweets[0]?.created_at ? parseTwitterDate(tweets[0].created_at) : null
  const lastTweetDate = lastTweet?.created_at ? parseTwitterDate(lastTweet.created_at) : null
  const sessions: Session[] = []
  const timeBetweenTweets: number[] = []
  let texts: UsageCount = {} // Texts used in tweets
  let mentionedUsers: UsageCount = {}
  let retweetedUsers: UsageCount = {}
  let hashtags: UsageCount = {}
  let retweetsCount = 0

  // Helper vars
  let previousTweetDate: Moment | null = null
  let currentSessionStart: Moment | null = null
  let numberOfTweetsInSession = 0
  let sumTimeInSession = 0

  tweets.map((tweet) => {
    const { entities, full_text: text, user, created_at: createdAtString, retweeted_status: retweetedStatus } = tweet
    const retweetedUsername = retweetedStatus?.user?.screen_name

    // We don't want to run analysis on retweets so we record it and return early
    if (retweetedUsername) {
      retweetedUsers = addUsage(retweetedUsername, retweetedUsers)
      retweetsCount += 1
      return
    }

    const createdAt = moment(createdAtString, 'ddd MMM DD HH:mm:ss Z YYYY')

    // ====== Sessions ======
    // TODO: I believe the code for session management could be simpler if we had a Sessions class
    numberOfTweetsInSession++
    // Start a session if necessary
    if (!currentSessionStart) {
      currentSessionStart = createdAt
    }

    // If there was a previous tweet we check if we should add the current tweet to session
    // or finish
    if (previousTweetDate) {
      const timeSinceLastTweet = Math.abs(createdAt.diff(previousTweetDate, 'seconds'))
      timeBetweenTweets.push(timeSinceLastTweet)
      if (timeSinceLastTweet < sessionMinDuration) {
        sumTimeInSession += timeSinceLastTweet
      } else {
        sessions.push({
          start: currentSessionStart,
          end: previousTweetDate,
          tweetCount: numberOfTweetsInSession,
          averageTimeBetweenTweets: sumTimeInSession / numberOfTweetsInSession
        })
        numberOfTweetsInSession = 0
        sumTimeInSession = 0
        currentSessionStart = null
      }
      logger.debug(`Time since last tweet: ${timeSinceLastTweet} seconds`)
    }
    previousTweetDate = createdAt

    // ====== Texts ======
    if (text) {
      logger.debug(`User: ${user?.name ?? ''} (${user?.screen_name ?? ''})`)
      logger.debug(`Tweet text: ${text}`)
      texts = addUsage(text, texts)
    }

    // ====== Interactions ======
    if (entities?.user_mentions && entities.user_mentions.length > 0) {
      entities.user_mentions.map((userMentioned) => {
        logger.debug(`Mentioned or retweeted: ${userMentioned.name} (${userMentioned.screen_name})`)
        mentionedUsers = addUsage(userMentioned.screen_name, mentionedUsers)
      })
    }

    // ====== Hashtags ======
    if (entities?.hashtags && entities.hashtags.length > 0) {
      logger.debug(`Used hashtags: ${entities.hashtags.map((hashtag) => `#${hashtag.text}`)}`)
      entities.hashtags.map((hashtag) => {
        hashtags = addUsage(`#${hashtag.text}`, hashtags)
      })
    }

    logger.debug('------------------------------------------------------------')
  })

  const tweetsCount = tweets.length - retweetsCount
  if (tweetsCount < 1) {
    logger.warning(`User ${username} has no tweets (only retweets or nothing at all)`)
    return null
  }

  return {
    username,
    texts,
    mentionedUsers,
    hashtags,
    sessions,
    timeBetweenTweets,
    firstTweetDate,
    lastTweetDate,
    retweetsCount,
    retweetedUsers,
    tweetsCount
  }
}
export const analyseUserData = (data: UserData): ScoredUserAnalysis => {
  const {
    username,
    texts,
    mentionedUsers,
    hashtags,
    sessions,
    retweetedUsers,
    tweetsCount,
    retweetsCount,
    firstTweetDate,
    lastTweetDate
  } = data
  const words = getWords(texts)
  const orderedSessions = lodash.orderBy(sessions, ['nTweets'], ['desc'])
  const orderedRetweetedUsers = lodash.orderBy(usageObjToArray(retweetedUsers), ['count'], ['desc'])

  const orderedMentionedUsers = lodash.orderBy(usageObjToArray(mentionedUsers), ['count'], ['desc'])
  const orderedHashtags = lodash.orderBy(usageObjToArray(hashtags), ['count'], ['desc'])
  const orderedWords = lodash.orderBy(usageObjToArray(words), ['count'], ['desc'])

  const sessionsWithMoreThanOneTweet = sessions.filter((s) => s.tweetCount > 1)
  const totalHashtags = lodash.sumBy(orderedHashtags, 'count')
  const userAnalysis = {
    username,
    firstTweetDate,
    lastTweetDate,
    tweets: {
      totalCount: tweetsCount
    },
    retweets: {
      totalCount: retweetsCount
    },
    retweetedUsers: {
      list: orderedRetweetedUsers
    },
    words: {
      list: orderedWords,
      uniqueCount: orderedWords.length - 1, // remove entry for non relevant words
      nonRelevantCount: words['&#non-relevant-word&#'] || 0
    },
    // ------
    mentionedUsers: {
      list: orderedMentionedUsers,
      totalCount: lodash.sumBy(orderedMentionedUsers, 'count'),
      uniqueCount: orderedMentionedUsers.length
    },
    // ------
    hashtags: {
      list: orderedHashtags,
      totalCount: totalHashtags,
      uniqueCount: orderedHashtags.length,
      perTweetCount: totalHashtags / tweetsCount
    },
    // -----
    sessions: {
      list: orderedSessions,
      totalCount: orderedSessions.length,
      averageTimeBetweenTweets:
        sessionsWithMoreThanOneTweet.length > 0
          ? lodash.sumBy(sessionsWithMoreThanOneTweet, (s) => s.averageTimeBetweenTweets) /
            sessionsWithMoreThanOneTweet.length
          : 0
    }
  }
  return {
    ...userAnalysis,
    score: calculateUserScore(userAnalysis)
  }
}
