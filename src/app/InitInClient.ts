'use client'

import { useEffect } from 'react'
import { cheatVueDevtools } from 'bypass-vue-devtools'

import { syncHelper } from '~/collections/sync'

import { init } from './init'

init()

export const InitInClient = () => {
  useEffect(() => {
    cheatVueDevtools()

    syncHelper.buildCollection()
  }, [])
  return null
}
