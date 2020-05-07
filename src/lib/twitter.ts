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

export const fetchUserTweets = async (username: string): Promise<TweetApiResponse[] | null> => {
  const labeledDataCachePath = `./cache/labeledData/${username}.json`
  const cachePath = `./cache/${username}.json`

  try {
    let rawData: string | undefined
    try {
      rawData = fs.readFileSync(labeledDataCachePath, 'utf8')
    } catch (e) {
      rawData = fs.readFileSync(cachePath, 'utf8')
    }

    const tweets = JSON.parse(rawData)
    logger.info(`Using labeled data cache for user ${username}...`)
    return tweets
    // eslint-disable-next-line no-empty
  } catch {}

  logger.info(`Calling twitter api for user ${username}...`)

  /* eslint-disable @typescript-eslint/camelcase */
  const params = {
    screen_name: username,
    count: 200,
    tweet_mode: 'extended'
  }
  /* eslint-enable @typescript-eslint/camelcase */
  try {
    const { data: tweets } = await twitterApi.get(`/statuses/user_timeline.json?${qs.stringify(params)}`)

    fs.writeFileSync(cachePath, JSON.stringify(tweets), {
      encoding: 'utf8',
      flag: 'w'
    })

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
