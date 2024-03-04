import { FriendScreen, NoteScreen, PostScreen } from './components'
import { Hero } from './components.server'
import { HomePageDataProvider } from './data-provider'
import { fetchHomePageData } from './fetcher'

export const revalidate = 3600
export default async function Home() {
  const data = await fetchHomePageData()

  return (
    <HomePageDataProvider data={data}>
      <div>
        <Hero />

        <PostScreen />

        <NoteScreen />
        <FriendScreen />
      </div>
    </HomePageDataProvider>
  )
}
