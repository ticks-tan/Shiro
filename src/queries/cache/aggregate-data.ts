import { cache } from 'react'
import type { AggregateRoot } from '@mx-space/api-client'

import 'server-only'

import { CacheKeyMap } from '~/constants/keys'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { onlyGetOrSetCacheInVercelButFallback } from '~/lib/cache'
import { apiClient } from '~/lib/request'

const key = CacheKeyMap.RootData
export const fetchAggregationData = cache(async () => {
  return onlyGetOrSetCacheInVercelButFallback(
    key,
    async () => {
      attachUAAndRealIp()

      return apiClient.aggregate.getAggregateData('shiro').then(
        (res) =>
          res.$serialized as AggregateRoot & {
            theme: AppThemeConfig
          },
      )
    },
    3600,
  )
})
