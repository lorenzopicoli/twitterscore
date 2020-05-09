export interface CommandParams {
  command: string
  showRankings?: boolean // Show top 10 interactions, words, etc
  detailed?: boolean // If we should show a full detailed report (mostly used for research)
  username?: string // Username we should search for
  hashtag?: string // Hashtag we should search for
  max?: number // Max users we should analyse (up to 100 for hashtag search)
}

export interface UserCommandParams extends CommandParams {
  report?: boolean // Should we report the user analysis?
}

export interface LabeledDataCommandParams extends CommandParams {
  hashtagPerTweet?: boolean
  hashtagTotalCount?: boolean
  hashtagUniqueCount?: boolean
  wordsUniqueCount?: boolean
  wordsNonRelevant?: boolean
  retweetCount?: boolean
  tweetPerDay?: boolean
  accountAge?: boolean
  troll?: boolean
  bot?: boolean
  legit?: boolean
  mentionedUsersTotalCount?: boolean
  mentionedUsersUniqueCount?: boolean
  sessionAverageTweetTime?: boolean
  score?: boolean
  all?: boolean
}
