import axiosInstance from "@/libs/axios"
import { RobotState, TaskHistoriesState, TaskQueuesState } from "@/store/interface/store.interface"

export async function fetchRobot(): Promise<any> {
  const { data } = await axiosInstance.get<RobotState>('/robot/list')
  return data
}

export async function fetchTaskQueue(): Promise<any> {
  const { data } = await axiosInstance.get<TaskQueuesState>('/task/task_queues')
  return data
}

export async function fetchTaskHistory(): Promise<any> {
  const { data } = await axiosInstance.get<TaskHistoriesState>('/task/task_histories')
  return data
}

export async function fetchTaskHistoryById(id: string): Promise<any> {
  const { data } = await axiosInstance.get<TaskHistoriesState>(`/task/task_history_by_robot_id?robot_id=${id}`)
  return data
}