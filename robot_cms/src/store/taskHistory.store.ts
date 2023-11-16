import { create } from "zustand"
import { fetchTaskHistory, fetchTaskHistoryById } from "@/actions/fetch.action"
import { TaskHistoriesState } from "@/store/interface/store.interface"

export const useTaskHistoryStore = create<TaskHistoriesState>((set) => ({
  taskHistories: [],
  setTaskHistories: (taskHistories) => set({ taskHistories }),
  fetchTaskHistories: async (robot_id?: string) => { 
    try {
      const response = (robot_id) ? await fetchTaskHistoryById(robot_id) : await fetchTaskHistory()

      const taskHistories = response.task_histories
      //console.log(taskHistories)
      set({ taskHistories })
    } catch (error) {
      console.log('Error fetching Task Queue: ', error)
    }
  }
}))