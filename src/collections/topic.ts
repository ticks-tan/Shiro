import type { TopicRawModel } from '~/models/db.raw'

import { Collection } from './helper/collection'

export class TopicCollection extends Collection<TopicRawModel> {
  static shared = new TopicCollection()
}
