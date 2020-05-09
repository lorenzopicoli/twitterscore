import { ScoredUserAnalysis } from '../../interfaces/UserAnalysis'
import * as logger from '../../helpers/logger'
import { logSectionTitle, logSectionItem, logColoredScore, dateFormat } from './common'
import Rgb from '../../interfaces/Rgb'

const scoreReport = (analysis: ScoredUserAnalysis): void => {
  const { score } = analysis
  logSectionTitle('Score')
  logSectionItem('User score', score.total)
  logSectionItem('Words (unique)', score.uniqueWords)
  logSectionItem('Interacted users (total)', score.mentionedUsers)
  logSectionItem('Hashtags (total)', score.hashtagsCount)
  logSectionItem('Hashtags (unique)', score.hashtagsUnique)
  logSectionItem('Hashtags (per tweet)', score.hashtagsPerTweet)
  logSectionItem('Sessions (average time between tweets)', score.averageTimeBetweenTweets)
}

const generalReport = (analysis: ScoredUserAnalysis): void => {
  const { username, tweets, firstTweetDate, lastTweetDate, score, accountAge } = analysis

  logSectionTitle('General')
  logSectionItem('Analysed user', username)
  logColoredScore('Score', score.total)
  logSectionItem('Account age', `${accountAge} days`)
  logSectionItem('Number of tweets analysed', tweets.totalCount)
  logSectionItem('Average tweet count per day', tweets.averagePerDay)
  logSectionItem('Date of first tweet analysed', firstTweetDate?.format(dateFormat) ?? 'Never')
  logSectionItem('Date of last tweet analysed', lastTweetDate?.format(dateFormat) ?? 'Never')
}

const mentionedUsersReport = (analysis: ScoredUserAnalysis): void => {
  const { mentionedUsers, retweets } = analysis

  logSectionTitle('Interactions')
  logSectionItem('Number of user interactions (mentioning a user)', mentionedUsers.totalCount)
  logSectionItem('Number of retweets', retweets.totalCount)
}

const hashtagsReport = (analysis: ScoredUserAnalysis): void => {
  const { hashtags } = analysis

  logSectionTitle('Hashtag usage')
  logSectionItem('Number of hashtags used', hashtags.totalCount)
  logSectionItem('Number of unique hashtags used', hashtags.uniqueCount)
  logSectionItem('Average of hashtag per tweet', hashtags.perTweetCount)
}

const sessionsReport = (analysis: ScoredUserAnalysis): void => {
  const { sessions } = analysis

  logSectionTitle('Sessions (a session is recorded every time a tweet is made after 10min of the previous one)')
  logSectionItem('Number of sessions', sessions.totalCount)
  logSectionItem(
    'Average time between tweets in sessions (with more than 1 tweet)',
    `${sessions.averageTimeBetweenTweets} seconds`
  )
}

const wordsReport = (analysis: ScoredUserAnalysis): void => {
  const { words } = analysis
  logSectionTitle('Word usage')
  logSectionItem('Number of unique words used (with filter)', words.uniqueCount)
  logSectionItem('Number of non relevant words used (with duplicates)', words.nonRelevantCount)
}

export const singleUserReport = (
  analysis: ScoredUserAnalysis,
  params: { showRankings: boolean; detailed: boolean }
): void => {
  const { mentionedUsers, hashtags, words, retweetedUsers } = analysis

  // General
  logger.title(`📊📊 Account analysis 📊📊`)
  generalReport(analysis)
  scoreReport(analysis)
  mentionedUsersReport(analysis)
  hashtagsReport(analysis)
  sessionsReport(analysis)
  wordsReport(analysis)

  if (params.showRankings) {
    logger.title(`🏆🏆 Rankings 🏆🏆`)
    logSectionTitle('Top 10 mentioned users')
    mentionedUsers.list.slice(0, 10).map((u) => logSectionItem(u.id, `${u.count}x`))

    logSectionTitle('Top 10 retweeted users')
    retweetedUsers.list.slice(0, 10).map((u) => logSectionItem(u.id, `${u.count}x`))

    logSectionTitle('Top 10 most used hashtags')
    hashtags.list.slice(0, 10).map((u) => logSectionItem(u.id, `${u.count}x`))

    logSectionTitle('Top 50 most used words')
    words.list.slice(0, 50).map((u) => {
      const id = u.id === '&#non-relevant-word&#' ? 'Palavras normais (conectivos, etc)' : u.id
      logSectionItem(id, `${u.count}x`)
    })
  }

  if (params.detailed) {
    logger.title(`Detailed`)
    logSectionTitle('Mentioned users')
    mentionedUsers.list.map((u) => logSectionItem(u.id, `${u.count}x`))

    logSectionTitle('Retweeted users')
    retweetedUsers.list.map((u) => logSectionItem(u.id, `${u.count}x`))

    logSectionTitle('Used hashtags')
    hashtags.list.map((u) => logSectionItem(u.id, `${u.count}x`))

    logSectionTitle('Used words')
    words.list.map((u) => {
      const id = u.id === '&#non-relevant-word&#' ? 'Palavras normais (conectivos, etc)' : u.id
      logSectionItem(id, `${u.count}x`)
    })
  }
}

export const labeledDataReport = (title: string, data: { label: string; value: number; bgColor?: Rgb }[]): void => {
  logger.title(title)
  data
    .sort((d1, d2) => d2.value - d1.value)
    .map(({ label, value, bgColor }) => {
      logger.success(`  - ${label}:`, String(value), bgColor)
    })
}
