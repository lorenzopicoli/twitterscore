import axios from 'axios'
import qs from 'querystring'
import lodash from 'lodash'
import fs from 'fs'

import * as logger from '../helpers/logger'
import { TweetApiResponse, SearchApiResponseStatus } from '../interfaces/TwitterApi'

const twitterApi = axios.create({
  baseURL: 'https://api.twitter.com/1.1',
  headers: {
    Authorization: process.env.TWITTER_TOKEN
  }
})
const labeledDataCachePath = (username: string): string => `./cache/labeledData/${username}.json`
const cachePath = (username: string): string => `./cache/${username}.json`

export const getCachedTweets = (username: string): { tweets?: TweetApiResponse[]; path?: string } => {
  try {
    const labeledDataCache = labeledDataCachePath(username)
    const cache = cachePath(username)
    let rawData: string | undefined
    let path: string
    try {
      rawData = fs.readFileSync(labeledDataCache, 'utf8')
      path = labeledDataCache
    } catch (e) {
      rawData = fs.readFileSync(cache, 'utf8')
      path = cache
    }

    const tweets = JSON.parse(rawData)
    logger.info(`Using labeled data cache for user ${username}...`)
    return { tweets: tweets as TweetApiResponse[], path }
    // eslint-disable-next-line no-empty
  } catch {}

  return {}
}

export const cacheTweets = (username: string, tweets: TweetApiResponse[]): TweetApiResponse[] => {
  const { tweets: previouslyCached, path } = getCachedTweets(username)

  const allTweets = lodash.uniqBy([...tweets, ...(previouslyCached || [])], (t1) => t1.id_str)
  fs.writeFileSync(path || cachePath(username), JSON.stringify(allTweets), {
    encoding: 'utf8',
    flag: 'w'
  })
  return allTweets
}

export const fetchUserTweets = async (username: string, ignoreCache = false): Promise<TweetApiResponse[] | null> => {
  if (!ignoreCache) {
    const cacheData = getCachedTweets(username)
    if (cacheData.tweets) {
      return cacheData.tweets as TweetApiResponse[]
    }
  }

  logger.info(`Calling twitter api for user ${username}...`)

  /* eslint-disable @typescript-eslint/camelcase */
  const params = {
    screen_name: username,
    count: 200,
    tweet_mode: 'extended'
  }
  /* eslint-enable @typescript-eslint/camelcase */
  try {
    const { data: response } = await twitterApi.get(`/statuses/user_timeline.json?${qs.stringify(params)}`)

    const tweets = cacheTweets(username, response)

    return tweets
  } catch (e) {
    logger.warning(`Failed to fetch ${username}`, e)
    return null
  }
}

export const fetchHashtagUsers = async (hashtag: string, max = 100): Promise<string[]> => {
  /* eslint-disable @typescript-eslint/camelcase */
  const params = {
    q: hashtag,
    result_type: 'recent',
    count: max
  }
  /* eslint-enable @typescript-eslint/camelcase */

  logger.info(`Calling twitter api for hashtag ${hashtag}...`)
  const { data } = await twitterApi(`/search/tweets.json?${qs.stringify(params)}`)
  const statuses = data.statuses as SearchApiResponseStatus[]
  const usernames = statuses.map((s) => s.user.screen_name)

  logger.info(`Found users that tweeted hashtags ${hashtag}: ${usernames.join(', ')}`)
  return lodash.uniq(usernames)
}
