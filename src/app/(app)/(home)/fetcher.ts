import { cache } from 'react'

import 'server-only'

import { CacheKeyMap } from '~/constants/keys'
import { onlyGetOrSetCacheInVercelButFallback } from '~/lib/cache'
import { apiClient } from '~/lib/request'

export const fetchHomePageData = cache(async () => {
  const data = await onlyGetOrSetCacheInVercelButFallback(
    CacheKeyMap.AggregateTop,
    async () => {
      return (await apiClient.aggregate.getTop(5)).$serialized
    },
    3600,
  )

  return data
})
