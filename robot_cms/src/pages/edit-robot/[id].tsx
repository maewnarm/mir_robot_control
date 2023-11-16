import { useRouter } from "next/router"
import React, { useEffect } from "react"
import HeaderSideBarLayout from "@/components/HeaderSideBarLayout"
import ActiveTask from "@/components/active-tasks"
import CompletedTasks from "@/components/completed-tasks"
import RobotStatus from "@/components/robot-status"
import { TaskHistory } from "@/constants/interface"
import { useTaskHistoryStore } from "@/store/taskHistory.store"
import { fetchTaskHistoryById } from "@/actions/fetch.action"

const EditRobot = () => {
  const router = useRouter()
  const robotId = String(router.query.id)

  const taskHistories = useTaskHistoryStore().taskHistories

  function filterByStatusPrefix(array: TaskHistory[], statusesToFilter: string[]): TaskHistory[] {
    return array.filter((task) => {
      for (const status of statusesToFilter) {
        if (task.status.startsWith(status)) {
          return true
        }
      }
      return false
    })
  }

  const activeTask = filterByStatusPrefix(taskHistories, ["not_stated", "processing"])
  const endedTask = filterByStatusPrefix(taskHistories, ["incompleted", "done"])

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTaskHistoryById(robotId)
    }, 5000)

    return () => clearInterval(intervalId)
  })

  return (
    <HeaderSideBarLayout>
      <div className="w-full bg-white px-6 pt-4">
        <div className="text-4xl flex mb-2">
          <p className="font-bold">Robot Name </p>
          : {robotId}
        </div>
        <div className="robot-info flex flex-row">
          <div className="task-list w-8/12 flex-col h-full flex justify-between ">
            <ActiveTask data={activeTask} />
            <CompletedTasks data={endedTask} />
          </div>
          <RobotStatus />
        </div>
      </div>
    </HeaderSideBarLayout>
  )
}

export default EditRobot
