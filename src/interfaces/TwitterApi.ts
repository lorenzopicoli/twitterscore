export interface TwitterUserApiResponse {
  name: string
  screen_name: string
  created_at: string
  statuses_count?: number
}

export interface TweetApiResponse {
  id_str: string
  entities?: { user_mentions?: TwitterUserApiResponse[]; hashtags?: { text: string }[] }
  full_text?: string
  user?: TwitterUserApiResponse
  created_at?: string
  retweeted_status?: { user?: TwitterUserApiResponse }
}

export interface SearchApiResponseStatus {
  user: TwitterUserApiResponse
}
