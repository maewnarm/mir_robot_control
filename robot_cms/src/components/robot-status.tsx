import { FC } from "react"
import { Card, Empty } from "antd"
import { assetUrl } from "@/util/environment"
import { useSelectedTaskStore } from "@/store/selectedTask.store"
import { millisec_to_minute } from "@/functions/unit-transfrom.function"

const RobotStatus: FC = () => {

  const selectedTask = useSelectedTaskStore((state) => state.taskHistory)

  return (
    <div className="robot-status-area w-4/12 ml-4 flex flex-col justify-between">
      <Card title={<h3 className="text-2xl font-bold flex justify-center">Task Info</h3>} bordered={true} className="flex flex-col justify-flex-start drop-shadow-md h-full min-h-[82vh]">
        <div className="flex flex-col justify-around  pt-[10%]">
          {!!selectedTask ? (
            <>
              <img src={assetUrl("/robot.png")} alt="robot-img" />
              <div className="flex flex-row mx-6 justify-between">
                <div className="text-xl font-semibold">
                  <div className="flex mb-6">
                    Task ID:
                    <div className="ml-2">{selectedTask.id}</div>
                  </div>
                  <div className="flex flex-col">
                    Part Model:
                    <div >{selectedTask.part_model}</div>
                  </div>
                </div>
                <div className="text-xl font-semibold">
                  <div className="flex mb-6">
                    Line ID :
                    <div>{selectedTask.line_id}</div>
                  </div>
                  <div className="flex flex-col">
                    Task Status:
                    <div>{selectedTask.status}</div>
                  </div>
                </div>
              </div>
              <p className="text-center font-bold text-4xl mt-8 ">
                Estimate Time: {selectedTask.estimate_time_to_finish_ms == null ? <p>N/A</p> : millisec_to_minute(selectedTask.estimate_time_to_finish_ms)}
              </p>
            </>
          ) : (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 60, display: "flex", justifyContent: "center", marginTop: "40%" }}
              description={<p>Please choose a task from the list on the left to view details.</p>} />
          )}
        </div >
      </Card >
    </div >
  )
}

export default RobotStatus
