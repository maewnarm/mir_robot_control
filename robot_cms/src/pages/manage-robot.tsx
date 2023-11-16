import type { NextPage } from 'next'
import HeaderSideBarLayout from '@/components/HeaderSideBarLayout'
import RobotListTable from '@/components/robot-list-table'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()

  return (
    <HeaderSideBarLayout>
      <div className="flex-grow bg-white p-8">
        <RobotListTable
          onEdit={(e) => {
            router.push(`/edit-robot/${e.id}`)
          }}
        />
      </div>
    </HeaderSideBarLayout>
  )
}

export default Home
