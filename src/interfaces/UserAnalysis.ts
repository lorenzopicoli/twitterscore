// First stage of processing. We get data from twitter and just format it in a better way

import { UsageCountArray } from './UsageCount'
import { Moment } from 'moment'
import Session from './Session'
import Score from './Score'

// No big analysis were made
export interface UserAnalysis {
  username: string
  firstTweetDate: Moment | null
  lastTweetDate: Moment | null
  tweets: {
    totalCount: number
  }
  retweets: {
    totalCount: number
  }
  retweetedUsers: {
    list: UsageCountArray // Ordered
  }
  words: {
    list: UsageCountArray
    uniqueCount: number
    nonRelevantCount: number
  }
  // ------
  mentionedUsers: {
    list: UsageCountArray // Ordered
    totalCount: number
    uniqueCount: number
  }
  // ------
  hashtags: {
    list: UsageCountArray // Ordered
    totalCount: number
    uniqueCount: number
    perTweetCount: number
  }
  // -----
  sessions: {
    list: Session[] // Ordered
    totalCount: number
    averageTimeBetweenTweets: number
  }
}

export interface ScoredUserAnalysis extends UserAnalysis {
  score: Score
}
