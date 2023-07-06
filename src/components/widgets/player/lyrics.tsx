import { memo, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import type { FC } from 'react'
import type { LyricsContent } from './lyrics-manager'

import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'

import { LyricsManager } from './lyrics-manager'
import { useFetchLyrics } from './use-fetch'

export const Lyrics: FC = () => {
  const playId = useMusicStore((state) => state.playId)
  const lyrics = useFetchLyrics(playId)

  return lyrics ? <LyricsRender lyrics={lyrics} /> : null
}

const LyricsRender: FC<{ lyrics: string }> = memo(({ lyrics }) => {
  const lyricsInstance = useMemo(() => new LyricsManager(lyrics), [lyrics])

  const currentTime = useMusicStore((state) => state.time * 1000)

  const [list, setList] = useState([] as LyricsContent[])

  useEffect(() => {
    const result = lyricsInstance.getCurrentTimeline(currentTime)

    setList((prev) => {
      if (prev[0]?.hms === result[0]?.hms) {
        return prev
      } else {
        return result
      }
    })
  }, [currentTime])

  const classNameMap = useRef([
    '!opacity-0 pointer-events-none',
    'text-gray-1',
    'filter blur-[2px]',
    'filter blur-[4px]',
  ]).current

  return (
    <div className="tablet:hidden absolute left-0 top-0">
      <div className="absolute bottom-2">
        <ul className="text-gray-1 !hover:children:text-shizuku-text !hover:children:filter-none max-w-[250px] pl-2">
          {list.map((item, index) => {
            return (
              <li
                key={item.content}
                data-hms={item.hms}
                className={clsx(
                  'my-2 origin-left scale-100 transform opacity-100 transition-all !duration-500 ease-in-out',
                  classNameMap[index],
                )}
              >
                <BottomToUpTransitionView
                  key={item.hms}
                  timeout={{ enter: 300 }}
                >
                  <p className="truncate">
                    {item.content}
                    <span className="invisible select-none">.</span>
                  </p>
                </BottomToUpTransitionView>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})

LyricsRender.displayName = 'LyricsRender'
