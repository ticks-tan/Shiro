'use client'

import { createContext, useContextSelector } from 'use-context-selector'
import type { AggregateTop } from '@mx-space/api-client'

const HomePageDataContext = createContext<AggregateTop>(null! as AggregateTop)

export const HomePageDataProvider = ({
  data,
  children,
}: {
  data: AggregateTop
  children: React.ReactNode
}) => {
  return (
    <HomePageDataContext.Provider value={data}>
      {children}
    </HomePageDataContext.Provider>
  )
}

export const useHomePageData = <T = AggregateTop,>(
  selector: (data: AggregateTop) => T,
): T => {
  return useContextSelector(HomePageDataContext, selector)
}
