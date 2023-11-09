import type {
  CategoryRawModel,
  NoteRawModel,
  PageRawModel,
  PostRawModel,
  TopicRawModel,
} from '~/models/db.raw'

import { apiClient } from '~/lib/request'

type Merge<T, U> = Omit<T, keyof U> & U
export type SyncCollectionData = Merge<
  | {
      type: 'note'
      data: NoteRawModel
    }
  | {
      type: 'post'
      data: PostRawModel
    }
  | {
      type: 'category'
      data: CategoryRawModel
    }
  | {
      type: 'topic'
      data: TopicRawModel
    }
  | {
      type: 'page'
      data: PageRawModel
    },
  {
    checksum: string
  }
>

export async function streamSyncableData({
  onData,
  onDone,
  onFail,
}: {
  onData: (data: SyncCollectionData) => void
  onDone?: () => void
  onFail?: (error: Error) => void
}): Promise<void> {
  const response = await fetch(`${apiClient.endpoint}/sync/collection`)

  if (!response.body) return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let received = ''

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        onDone?.()
        break
      }

      const str = decoder.decode(value, { stream: true })
      received += str

      const lines = received.split('\n')
      received = lines.pop() || '' // 保存最后一个不完整的片段

      lines.forEach((line) => {
        if (line) {
          try {
            const json: SyncCollectionData = JSON.parse(line)
            // 对每个 JSON 对象进行处理

            onData(json)
          } catch (error) {
            console.error('Error parsing JSON line:', error)
          }
        }
      })
    }
  } catch (error) {
    console.error('Stream reading failed:', error)
    onFail?.(error as any)
  } finally {
    reader.releaseLock()
  }
}
