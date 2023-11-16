import { create } from "zustand"
import { fetchTaskQueue } from "@/actions/fetch.action"
import { TaskQueuesState } from "@/store/interface/store.interface"

export const useTaskQueueStore = create<TaskQueuesState>((set) => ({
  taskQueues: [],
  setTaskQueues: (taskQueues) => set({ taskQueues }),
  
  fetchTaskQueues: async () => {
    try {
      const response = await fetchTaskQueue()
      const taskQueues = response.task_queues
      set({ taskQueues })
    } catch (error) {
      console.log('Error fetching Task Queue: ', error) 
    }
  }
}))