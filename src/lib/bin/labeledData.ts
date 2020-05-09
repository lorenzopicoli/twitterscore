import Bluebird from 'bluebird'

import { LabeledDataCommandParams } from '../../interfaces/CommandParams'
import { ScoredUserAnalysis } from '../../interfaces/UserAnalysis'
import { handleUserCommand } from './user'
import { hashtagBots, trollUsers, legitUsers } from '../../labeledData'
import { labeledDataReport } from '../report/userReport'

const getUsersAnalysis = async (
  usernames: string[],
  params: LabeledDataCommandParams
): Promise<ScoredUserAnalysis[]> => {
  const { detailed } = params

  return (
    await Bluebird.map(
      usernames,
      async (user: string): Promise<ScoredUserAnalysis | null> => {
        // A detailed labeled data command means reporting the users so that's why report = detailed
        // on the other hand we never want a full on detailed report when fetching hashtag data
        // so detailed is always false
        return handleUserCommand({
          ...params,
          username: user,
          detailed: false,
          report: detailed
        })
      },
      // Concurrency can be high here as we'll be getting data from cache and we won't hit twitter at any point
      { concurrency: 50 }
    )
  ).filter((u): u is ScoredUserAnalysis => !!u)
}

export const handleLabeledData = async (params: LabeledDataCommandParams): Promise<void> => {
  const {
    hashtagPerTweet,
    hashtagTotalCount,
    hashtagUniqueCount,
    wordsUniqueCount,
    wordsNonRelevant,
    mentionedUsersTotalCount,
    mentionedUsersUniqueCount,
    sessionAverageTweetTime,
    score,
    retweetCount,
    tweetPerDay,
    accountAge,
    troll,
    bot,
    legit,
    all
  } = params

  const legitUsersAnalysis = await getUsersAnalysis(legitUsers, params)
  const trollUsersAnalysis = await getUsersAnalysis(trollUsers, params)
  const hashtagBotsAnalysis = await getUsersAnalysis(hashtagBots, params)
  // Check if no filter was sent
  const noFilters = !troll && !bot && !legit
  const allLabeledUsers = [
    ...(noFilters || legit
      ? legitUsersAnalysis.map((u) => ({ ...u, label: u.username, bgColor: { red: 0, green: 64, blue: 30 } }))
      : []),
    ...(noFilters || troll
      ? trollUsersAnalysis.map((u) => ({ ...u, label: u.username, bgColor: { red: 115, green: 65, blue: 0 } }))
      : []),
    ...(noFilters || bot
      ? hashtagBotsAnalysis.map((u) => ({ ...u, label: u.username, bgColor: { red: 100, green: 0, blue: 0 } }))
      : [])
  ]

  if (hashtagPerTweet || all) {
    labeledDataReport(
      'Hashtags per tweet labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.hashtags.perTweetCount }))
    )
    labeledDataReport(
      'Hashtags per tweet calculated score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.hashtagsPerTweet }))
    )
  }

  if (hashtagTotalCount || all) {
    labeledDataReport(
      'Hashtags unique count labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.hashtags.totalCount }))
    )
    labeledDataReport(
      'Hashtags total count calculated score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.hashtagsCount }))
    )
  }

  if (hashtagUniqueCount || all) {
    labeledDataReport(
      'Hashtags unique count labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.hashtags.uniqueCount }))
    )
    labeledDataReport(
      'Hashtags unique count calculated score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.hashtagsUnique }))
    )
  }

  if (wordsNonRelevant || all) {
    labeledDataReport(
      'Non relevant words usage labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.words.nonRelevantCount }))
    )
  }

  if (wordsUniqueCount || all) {
    labeledDataReport(
      'Unique words usage labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.words.uniqueCount }))
    )
    labeledDataReport(
      'Unique words words usage score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.uniqueWords }))
    )
  }

  if (mentionedUsersTotalCount || all) {
    labeledDataReport(
      'Mentioned users labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.mentionedUsers.totalCount }))
    )
    labeledDataReport(
      'Mentioned users score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.mentionedUsers }))
    )
  }

  if (mentionedUsersUniqueCount || all) {
    labeledDataReport(
      'Mentioned users (unique) labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.mentionedUsers.uniqueCount }))
    )
  }

  if (sessionAverageTweetTime || all) {
    labeledDataReport(
      'Average time between tweets labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.sessions.averageTimeBetweenTweets }))
    )
    labeledDataReport(
      'Average time between tweets score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.averageTimeBetweenTweets }))
    )
  }

  if (tweetPerDay || all) {
    labeledDataReport(
      'Average tweet count per day labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.tweets.averagePerDay }))
    )
  }

  if (accountAge || all) {
    labeledDataReport(
      'Account age labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.accountAge }))
    )
  }

  if (retweetCount || all) {
    labeledDataReport(
      'Retweets count labeled data analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.tweets.totalCount }))
    )
  }

  if (score || all) {
    labeledDataReport(
      'Score analysis',
      allLabeledUsers.map((u) => ({ label: u.label, bgColor: u.bgColor, value: u.score.total }))
    )
  }
}
