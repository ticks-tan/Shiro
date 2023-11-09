type WithAccessors<V> = V & {
  __deleted?: boolean
  __broken?: boolean

  __created: Date
}
type Id = string
export class Collection<
  V extends {
    id: Id
    created: string
  },
> {
  // for mobx
  data: Map<Id, WithAccessors<V>> = new Map()

  find(predicate: (value: V, key: Id, map: Map<Id, V>) => boolean) {
    for (const [key, value] of this.data) {
      if (predicate(value, key, this.data)) return value
    }

    return null
  }

  get size() {
    return this.data.size
  }

  get(id: string) {
    return this.data.get(id)
  }

  set(key: string, value: V): this {
    defineDefaultKeyValue(value, '__deleted', false)
    defineDefaultKeyValue(value, '__broken', false)
    defineDefaultKeyValue(value, '__created', new Date(value.created))
    this.data.set(key, value as any)
    return this
  }

  clear() {
    this.data.clear()
  }

  delete(key: string): boolean {
    return this.data.delete(key)
  }
  get sortedList() {
    return [...this.data.values()].sort((a, b) => {
      return b.__created.getTime() - a.__created.getTime()
    })
  }

  markBroken(id: string) {
    const item = this.data.get(id)
    if (item) {
      item.__broken = true
    }
  }
  add(data: V) {
    this.set(data.id, data)
  }
  update(data: V) {
    this.set(data.id, data)
  }
  remove(id: string) {
    this.delete(id)
  }

  has(id: string) {
    return this.data.has(id)
  }

  static get [Symbol.species]() {
    return Collection
  }

  get [Symbol.toStringTag]() {
    return 'KeyValueCollection'
  }
}

const defineDefaultKeyValue = (target: any, key: string, value: any) => {
  if (key in target) {
    return
  }
  Reflect.defineProperty(target, key, {
    value,
    writable: false,
    enumerable: false,
    configurable: true,
  })
}
