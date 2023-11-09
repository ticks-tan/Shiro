import { makeObservable } from 'mobx'
import type { NoteRawModel } from '~/models/db.raw'

import { isClientSide } from '~/lib/env'

import { Store } from './helper/store'

export class NoteCollection extends Store<NoteRawModel> {
  static shared = new NoteCollection()
  constructor() {
    super()
    makeObservable(this, {})
  }

  getNidById(nid: number) {
    return this.find((item) => item.nid === nid)?.id || null
  }
}

declare const window: any
if (isClientSide)
  window.collection = {
    ...window.collection,
    note: NoteCollection.shared,
  }
