import { action, computed, makeObservable, observable, toJS } from 'mobx'

import { Collection } from './collection'

export class Store<
  T extends {
    id: string
    created: string
  },
> extends Collection<T> {
  constructor() {
    super()

    makeObservable(this, {
      data: observable,
      set: action,
      delete: action,

      clear: action,
      add: action,
      remove: action,
      addAndPatch: action,

      size: computed,
    })
  }

  get raw() {
    return toJS(this.data)
  }

  add(id: string, data: T | T[]): this
  add(data: T | T[]): this
  add(...args: any[]): this {
    const add = (id: string, data: T | T[]) => {
      if (Array.isArray(data)) {
        data.forEach((d) => {
          this.add(d)
        })
        return
      }
      this.set(id, { ...data })
    }

    if (typeof args[0] === 'string') {
      const id = args[0]
      const data = args[1]
      add(id, data)
    } else {
      const data = args[0]
      add(data.id, data)
    }

    return this
  }

  // same as add, but ignores `undefined`
  addAndPatch(data: T | T[]): this {
    if (Array.isArray(data)) {
      data.forEach((d) => {
        this.addAndPatch(d)
      })
      return this
    }
    if (this.has(data.id)) {
      const exist = this.get(data.id)
      this.set(data.id, { ...exist, ...data })
    } else {
      this.set(data.id, data)
    }
    return this
  }

  remove(id: string): this {
    this.delete(id)
    return this
  }

  values() {
    return this.data.values()
  }

  keys() {
    return this.data.keys()
  }

  ids() {
    return this.data.keys()
  }

  [Symbol.iterator]() {
    return this.data.values()
  }
}
