import { Card, Empty } from "antd"
import { Collapse } from "antd"
import { TaskHistory } from "@/constants/interface"
import { useSelectedTaskStore } from "@/store/selectedTask.store"

const { Panel } = Collapse

interface CompletedTasksProps {
  data: TaskHistory[]
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ data }) => {
  const setTaskHistory = useSelectedTaskStore().setTaskHistory

  return (
    <Collapse accordion >
      <Panel header="Completed Tasks" key="1">
        {data?.length > 0 ?  (
          <div className="overflow-y-auto h-[30vh]">
            <div>
              {data.map((task, index) => (
                <Card key={task.id} className="cursor-pointer bg-white hover:bg-slate-100 m-5 drop-shadow-md" onClick={() => setTaskHistory(data[index])}>
                  <p>Task Name: {task.part_model}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{marginTop:"6rem"}} style={{marginBottom:"6.2rem"}}/>
        )}
      </Panel>
    </Collapse>
  )
}

export default CompletedTasks
