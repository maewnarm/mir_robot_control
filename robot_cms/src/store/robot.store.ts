import { create } from "zustand"
import { fetchRobot } from "@/actions/fetch.action"
import { RobotState } from "@/store/interface/store.interface"

export const useRobotStore = create<RobotState>((set) => ({
  robotInfo: [],

  fetchRobot: async () => {
    try {
      const response = await fetchRobot()
      const robotInfo = response.robot_list
      set({ robotInfo  })
    } catch (error) {
      console.log('Error fetching Task Queue: ', error)
    }
  }
}))