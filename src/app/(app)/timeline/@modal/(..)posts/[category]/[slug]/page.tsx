/* eslint-disable react/display-name */
'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { PeekModal } from '~/components/modules/peek/PeekModal'
import { PostPreview } from '~/components/modules/peek/PostPreview'
import { DeclarativeModal } from '~/components/ui/modal/stacked/declarative-modal'
import { routeBuilder, Routes } from '~/lib/route-builder'

export default () => {
  const params = useParams<{
    category: string
    slug: string
  }>()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <DeclarativeModal
      open={open}
      title=""
      clickOutsideToDismiss
      onOpenChange={(open) => {
        setOpen(open)
        if (!open) router.back()
      }}
      CustomModalComponent={() => (
        <PeekModal
          to={routeBuilder(Routes.Post, {
            ...params,
          })}
        >
          <PostPreview category={params.category} slug={params.slug} />
        </PeekModal>
      )}
    />
  )
}
