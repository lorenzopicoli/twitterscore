// First stage of processing. We get data from twitter and just format it in a better way

import { UsageCount } from './UsageCount'
import Session from './Session'
import { Moment } from 'moment'

// No big analysis were made
export default interface UserData {
  username: string
  texts: UsageCount
  mentionedUsers: UsageCount
  hashtags: UsageCount
  sessions: Session[]
  timeBetweenTweets: number[]
  firstTweetDate: Moment | null
  lastTweetDate: Moment | null
  retweetsCount: number
  retweetedUsers: UsageCount
  tweetsCount: number
}
