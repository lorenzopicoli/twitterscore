import { ScoredUserAnalysis } from './UserAnalysis'

export interface AverageAnalysisComponent {
  average: number
  max: number
  min: number
}

export default interface AverageAnalysis {
  users: ScoredUserAnalysis[]
  userCount: number
  tweetCount: number
  usernames: string[]
  score: AverageAnalysisComponent
  accountAge: AverageAnalysisComponent
  tweets: {
    // Analysed tweets, not all time tweets
    totalCount: AverageAnalysisComponent
    averagePerDay: AverageAnalysisComponent
  }
  retweets: {
    totalCount: AverageAnalysisComponent
  }
  words: {
    uniqueCount: AverageAnalysisComponent
    nonRelevantCount: AverageAnalysisComponent
  }
  mentionedUsers: {
    totalCount: AverageAnalysisComponent
    uniqueCount: AverageAnalysisComponent
  }
  hashtags: {
    totalCount: AverageAnalysisComponent
    uniqueCount: AverageAnalysisComponent
    perTweetCount: AverageAnalysisComponent
  }
  sessions: {
    totalCount: AverageAnalysisComponent
    averageTimeBetweenTweets: AverageAnalysisComponent
  }
}

export const emptyAverageAnalysis: AverageAnalysis = {
  users: [],
  usernames: [],
  userCount: 0,
  tweetCount: 0,
  accountAge: {
    average: 0,
    max: 0,
    min: 0
  },
  score: {
    average: 0,
    max: 0,
    min: 0
  },
  tweets: {
    totalCount: {
      average: 0,
      max: 0,
      min: 0
    },
    averagePerDay: {
      average: 0,
      max: 0,
      min: 0
    }
  },
  retweets: {
    totalCount: {
      average: 0,
      max: 0,
      min: 0
    }
  },
  words: {
    uniqueCount: {
      average: 0,
      max: 0,
      min: 0
    },
    nonRelevantCount: {
      average: 0,
      max: 0,
      min: 0
    }
  },
  mentionedUsers: {
    totalCount: {
      average: 0,
      max: 0,
      min: 0
    },
    uniqueCount: {
      average: 0,
      max: 0,
      min: 0
    }
  },
  hashtags: {
    totalCount: {
      average: 0,
      max: 0,
      min: 0
    },
    uniqueCount: {
      average: 0,
      max: 0,
      min: 0
    },
    perTweetCount: {
      average: 0,
      max: 0,
      min: 0
    }
  },
  sessions: {
    totalCount: {
      average: 0,
      max: 0,
      min: 0
    },
    averageTimeBetweenTweets: {
      average: 0,
      max: 0,
      min: 0
    }
  }
}
