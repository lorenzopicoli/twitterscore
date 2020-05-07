import { Moment } from 'moment'

export default interface Session {
  start: Moment
  end: Moment
  tweetCount: number
  averageTimeBetweenTweets: number
}
