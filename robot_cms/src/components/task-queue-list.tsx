import { Button, Table, Tooltip } from "antd"
import type { ColumnsType } from "antd/es/table"
import React from "react"
import { FiArrowDown, FiArrowUp } from "react-icons/fi"
import { TaskQueue } from "@/constants/interface"
import { useTaskQueueStore } from "@/store/taskQueue.store"
import { SwapTask } from "@/actions/task.action"
import { useStore } from "@/store"
import { useEffectOnce } from 'usehooks-ts'


const TaskQueueList: React.FC = () => {
  const { setIsLoading } = useStore()
  const taskQueues = useTaskQueueStore((state) => state.taskQueues)
  const fetchTaskQueues = useTaskQueueStore((state) => state.fetchTaskQueues)

  useEffectOnce(() => {
    const intervalId = setInterval(() => {
      fetchTaskQueues()
    }, 5000)

    fetchTaskQueues()

    return () => clearInterval(intervalId)
  })

  async function doSwapTask(taskAId: number, taskBId: number) {
    try {
      setIsLoading(true, 'Swaping...')
      await SwapTask(taskAId, taskBId)
      await fetchTaskQueues()
    } finally {
      setIsLoading(false)
    }
  }

  function swapTaskUp(taskId: number) {
    doSwapTask(taskId, taskId - 1)
  }

  function swapTaskDown(taskId: number) {
    doSwapTask(taskId, taskId + 1)
  }

  const taskQueueColumns: ColumnsType<TaskQueue> = [
    {
      title: "ID",
      dataIndex: "id",
      width: "1rem",
    },
    {
      title: "Line ID",
      dataIndex: "line_id",
      width: "1rem",
    },
    {
      title: "Part Model",
      dataIndex: "part_model",
      width: "1rem",
    },
    {
      title: "Box Model",
      dataIndex: "box_model",
      width: "1rem",
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "1rem",
      render: (_, render, index) => {
        const isFirstRow = index === 0
        const isLastRow = index === taskQueues.length - 1
        const isOnlyOne = taskQueues.length == 1

        const taskId = taskQueues?.[index]?.id ?? 0

        return (
          <div className="flex justify-center">
            {isOnlyOne ? (
              <></>
            )
              : isFirstRow ? (
                <Tooltip title="Move Down" className={"drop-shadow-md m-0.5"}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FiArrowDown />}
                    onClick={() => swapTaskDown(taskId)}
                  />
                </Tooltip>
              ) : isLastRow ? (
                <Tooltip title="Move Up" className={"drop-shadow-md m-0.5"}>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FiArrowUp />}
                    onClick={() => swapTaskUp(taskId)}
                  />
                </Tooltip>
              ) : (
                <>
                  <Tooltip title="Move Up" className={"drop-shadow-md m-0.5"}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<FiArrowUp />}
                      onClick={() => swapTaskUp(taskId)}
                    />
                  </Tooltip>
                  <Tooltip title="Move Down" className={"drop-shadow-md m-0.5"}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<FiArrowDown />}
                      onClick={() => swapTaskDown(taskId)}
                    />
                  </Tooltip>
                </>
              )}
          </div>
        )
      },
    },
  ]

  const isShowScroll = taskQueues.length > 3

  return (
    <>
      {taskQueues?.length > 0 ? (
        <Table
          columns={taskQueueColumns}
          dataSource={taskQueues}
          scroll={isShowScroll ? { y: 200 } : undefined}
          bordered={true}
          pagination={false}
          className="h-[calc(50%-2rem)] w-[calc(100%-2rem)]"
        />
      ) : (
        <Table
          columns={taskQueueColumns}
          bordered={true}
          pagination={false}
          className="h-[calc(50%-2rem)] w-[calc(100%-2rem)]"
        />
      )}
    </>
  )
}

export default TaskQueueList
