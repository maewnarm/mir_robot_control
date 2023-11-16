import { TaskQueue, TaskHistory, RobotInfo } from "@/constants/interface"

export interface TaskQueuesState {
  taskQueues: TaskQueue[]

  setTaskQueues: (newTaskQueue: TaskQueue[]) => void
  fetchTaskQueues: () => Promise<void>;
}

export interface TaskHistoriesState {
  taskHistories: TaskHistory[]
  setTaskHistories: (taskHistories : TaskHistory[]) => void
  fetchTaskHistories: (robot_id?: string) => Promise<void>
}

export interface RobotState {
  robotInfo: RobotInfo[]
  fetchRobot: () => Promise<void>
}

export interface SelectedTaskHistoryState {
  taskHistory: TaskHistory | null 
  setTaskHistory: (taskHistory: TaskHistory) => void
}