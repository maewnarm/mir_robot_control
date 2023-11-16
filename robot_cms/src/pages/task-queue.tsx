import type { NextPage } from "next"
import HeaderSideBarLayout from "@/components/HeaderSideBarLayout"
import TaskHistoryList from "@/components/task-history-list"
import TaskQueueList from "@/components/task-queue-list"

const TaskTable: NextPage = () => {
  return (
    <HeaderSideBarLayout>
      <div className="flex-grow bg-white px-12 h-[calc(90vh-1rem)] flex flex-col justify-start">
        <div className="queue h-[calc(48%-2rem)] pb-2">
          <p className="text-lg font-bold pb-4 text-xl">Task Queue</p>
          <TaskQueueList />
        </div>
        <div className="history h-[calc(50%-2rem)]">
          <p className="text-lg font-bold pb-4 text-xl">Task History</p>
          <TaskHistoryList />
        </div>
      </div>
    </HeaderSideBarLayout>
  )
}

export default TaskTable
