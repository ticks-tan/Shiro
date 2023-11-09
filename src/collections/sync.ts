import { makeAutoObservable } from 'mobx'
import type { NoteRawModel, TopicRawModel } from '~/models/db.raw'
import type { SyncCollectionData } from './helper/syncing'

import { streamSyncableData } from './helper/syncing'
import { NoteCollection } from './note'
import { TopicCollection } from './topic'

class SyncStore {
  constructor() {
    makeAutoObservable(this)
  }

  isSyncing = false
  isReady = false

  async buildCollection() {
    this.isSyncing = true
    await streamSyncableData({
      onData: this.handleData,
      onFail: (error) => {
        this.isSyncing = false
      },
    })

    this.isSyncing = false
    this.isReady = true
  }

  handleData(data: SyncCollectionData) {
    data.data.id = data.data._id
    switch (data.type) {
      case 'note': {
        const noteStore = NoteCollection.shared
        noteStore.add(data.data as NoteRawModel)
        break
      }
      case 'topic': {
        const topicStore = TopicCollection.shared
        topicStore.add(data.data as TopicRawModel)
        break
      }
    }
  }
}

export const syncHelper = new SyncStore()
