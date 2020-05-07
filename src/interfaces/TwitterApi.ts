export interface TwitterUserApiResponse {
  name: string
  screen_name: string
}

export interface TweetApiResponse {
  entities?: { user_mentions?: TwitterUserApiResponse[]; hashtags?: { text: string }[] }
  full_text?: string
  user?: TwitterUserApiResponse
  created_at?: string
  retweeted_status?: { user?: TwitterUserApiResponse }
}

export interface SearchApiResponseStatus {
  user: TwitterUserApiResponse
}
