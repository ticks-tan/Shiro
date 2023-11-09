'use client'

import { enableStaticRendering, observer } from 'mobx-react-lite'

import { NoteCollection } from '~/collections/note'

enableStaticRendering(typeof window === 'undefined')
export default observer(() => {
  return (
    <div className="gird grid-cols-2">
      {[
        [...NoteCollection.shared.values()].map((note) => {
          return <div key={note.id}>{note.title}</div>
        }),

        // [...TopicCollection.shared.values()].map((note) => {
        //   return <div key={note.id}>{note._id}</div>
        // }),
      ]}
    </div>
  )
})
