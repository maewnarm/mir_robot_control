import { Button, Table, Tooltip, Tag, Form, Select } from "antd"
import type { ColumnsType } from "antd/es/table"
import React, { useMemo, useState } from "react"
import { VscDebugRestart } from "react-icons/vsc"
import { TaskHistory } from "@/constants/interface"
import { useTaskHistoryStore } from "@/store/taskHistory.store"
import { RequeueTask } from "@/actions/task.action"
import { useStore } from "@/store"
import { useEffectOnce } from 'usehooks-ts'
import { useTaskQueueStore } from "@/store/taskQueue.store"
import { capitalize } from "@/util/string.util"

const { Option } = Select

const TaskHistoryList: React.FC = () => {
  const { setIsLoading } = useStore()
  const { taskHistories, fetchTaskHistories } = useTaskHistoryStore()
  const { fetchTaskQueues } = useTaskQueueStore() 

  const [selectedFilter, setSelectedValues] = useState<string[]>(["waiting"])

  const handleFilterChange = (selectedValues: string[]) => {
    setSelectedValues(selectedValues)
  }

  const handleDeselect = (deselectedValue: string) => {
    const updatedValues = selectedFilter.filter((value) => value !== deselectedValue)
    setSelectedValues(updatedValues)
  }

  useEffectOnce(() => {
    const intervalId = setInterval(() => {
      fetchTaskHistories()
    }, 5000)

    fetchTaskHistories()

    return () => clearInterval(intervalId)
  })

  async function doRequeueTask(task: TaskHistory) {
    try {
      setIsLoading(true, 'Requeuing task...')
      await RequeueTask(task)
      await fetchTaskQueues()
      await fetchTaskHistories()
    } finally {
      setIsLoading(false)
    }
  }

  const taskQueueColumns: ColumnsType<TaskHistory> = [
    {
      title: "ID",
      dataIndex: "id",
      width: "2.5rem",
    },
    {
      title: "Line ID",
      dataIndex: "line_id",
      width: "2.5rem",
    },
    {
      title: "Part Model",
      dataIndex: "part_model",
      width: "2.5rem",
    },
    {
      title: "Box Model",
      dataIndex: "box_model",
      width: "2.5rem",
    },
    {
      title: "Robot ID",
      dataIndex: "robot_id",
      width: "2rem",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "2rem",
      render: (_, record, index) => {
        const status = taskHistories[index].status ?? 'Unknown'
        return <div className="font-bold">
          { capitalize(status) }
        </div>
      }
    },
    {
      title: "Start Time",
      dataIndex: "start",
      width: "2rem",
    },
    {
      title: "Finish Time",
      dataIndex: "finish",
      width: "2rem",
    },
    {
      title: "Duration (second)",
      dataIndex: "duration_ms",
      width: "2rem",
      render: (_, record, index) => {
        const duration_ms = taskHistories[index].duration_ms ?? 0
        return <div>
          { duration_ms !== 0 ? parseFloat(`${duration_ms / 1000}`).toFixed(0): '' }
        </div>
      }
    },
    {
      title: "Action",
      dataIndex: "Action",
      width: "2rem",
      render: (_, record, index) => {
        const status = taskHistories[index].status
        const isWaiting = status.includes("waiting")

        return (
          <div className="flex justify-center">
            {isWaiting ? (
              <>
                <Tooltip title="Re-Queue" className="drop-shadow-md m-0.5">
                  <Button
                    type="primary"
                    icon={<VscDebugRestart />}
                    onClick={() => {
                      doRequeueTask(record)
                    }}
                  />
                </Tooltip>
              </>
            ) : (
              <></>
            )}
          </div>
        )
      },
    },
  ]

  const filteredTaskHistories = useMemo(() => {
    if (selectedFilter.length === 0) {
      return taskHistories
    }

    return taskHistories.filter((record) =>
      selectedFilter.some((filter) => 
        record.status.toLowerCase().includes(filter.toLowerCase())
      )
    )
  }, [selectedFilter, taskHistories])

  const enableScroll = taskHistories.length > 3

  return (
    <>
      {taskHistories?.length > 0 ? (
        <Table
          title={() => (
            <Form.Item
              name="select-multiple"
              label="Task Status"
              rules={[{ message: 'Filter', type: 'array' }]}
              initialValue={'waiting'}
            >
              <Select mode="multiple" placeholder="Please select favourite colors" value={selectedFilter} onChange={handleFilterChange} onDeselect={handleDeselect} defaultValue={['waiting']}>
                <Option value="aborted">Aborted</Option>
                <Option value="done">Done</Option>
                <Option value="executing">Executing</Option>
                <Option value="incompleted">Incompleted</Option>
                <Option value="paused">Paused</Option>
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="waiting">Waiting</Option>
              </Select>
            </Form.Item>
          )}
          columns={taskQueueColumns}
          dataSource={filteredTaskHistories}
          scroll={enableScroll ? { y: 220 } : undefined}
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

export default TaskHistoryList
