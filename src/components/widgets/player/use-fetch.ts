import { useQuery } from '@tanstack/react-query'

import { apiClient } from '~/lib/request'

const CACHE_KEY_PREFIX = 'kami-netease-lyric-'
export const useFetchLyrics = (id: number) => {
  const { data: lyrics } = useQuery(
    ['lyrics', id],
    async ({ queryKey }) => {
      const [, id] = queryKey
      if (id === 0) {
        return ''
      }

      const fromCache = localStorage.getItem(`${CACHE_KEY_PREFIX}${id}`)
      if (fromCache) {
        return fromCache
      }

      return await apiClient.serverless.proxy.kami.lyrics
        .get<string>({
          params: {
            id,
          },
        })
        .then((res) => {
          localStorage.setItem(`${CACHE_KEY_PREFIX}${id}`, res)
          return res
        })
    },
    {
      enabled: id !== 0,
      refetchInterval: false,
    },
  )

  return lyrics
}
