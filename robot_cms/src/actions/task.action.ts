import { TaskHistory, TaskQueue } from "@/constants/interface"
import axiosInstance from "@/libs/axios"

export async function RequeueTask(taskHistory: TaskHistory): Promise<any> {
  const { id, ...rest } = taskHistory

  const { data } = await axiosInstance.post<TaskQueue>('/task/save_task_queue', {...rest})

  return data
}

export async function SwapTask(task1Id: number, task2Id: number): Promise<any> {
  const { data } = await axiosInstance.post<TaskQueue[]>('/task/swap_task_queue', {task1Id, task2Id})
  
  return data
}
