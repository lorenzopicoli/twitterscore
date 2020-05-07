import moment, { Moment } from 'moment'
import { UsageCount, UsageCountArray } from '../interfaces/UsageCount'

export const parseTwitterDate = (date: string): Moment => moment(date, 'ddd MMM DD HH:mm:ss Z YYYY')

export const addUsage = (occurrence: string, obj: UsageCount): UsageCount => {
  return {
    ...obj,
    [occurrence]: (obj[occurrence] || 0) + 1
  }
}

// faster cause it avoids cloning the obj but causes side effects
export const addUsageWithSideEffect = (occurrence: string, obj: UsageCount): UsageCount => {
  obj[occurrence] = (obj[occurrence] || 0) + 1
  return obj
}

export const usageObjToArray = (obj: UsageCount): UsageCountArray => {
  return Object.keys(obj).map((key) => ({
    id: key,
    count: obj[key] || 0
  }))
}
