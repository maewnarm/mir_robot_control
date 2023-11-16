import { Card, Empty } from "antd"
import { Collapse } from "antd"
import { TaskHistory } from "@/constants/interface"
import { useSelectedTaskStore } from "@/store/selectedTask.store"

const { Panel } = Collapse

interface ActiveTasksProps {
  data: TaskHistory[] | []
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ data }) => {
  const setTaskHistory = useSelectedTaskStore().setTaskHistory

  return (
    <Collapse accordion className="mb-6">
      <Panel header="Active Tasks" key="1">
        <div className="overflow-y-auto h-[30vh]">
          {data?.length > 0 ? (
            data.map((task, index) => (
              <Card
                key={task.id}
                className="cursor-pointer bg-white hover:bg-slate-100 m-5 drop-shadow-md"
                onClick={() => setTaskHistory(data[index])}
              >
                <p>Task Name: {task.part_model}</p>
              </Card>
            ))
          ) : (
            <div>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{marginTop:"5rem"}} />
            </div>
          )}
        </div>
      </Panel>
    </Collapse>
  )
}

export default ActiveTasks
