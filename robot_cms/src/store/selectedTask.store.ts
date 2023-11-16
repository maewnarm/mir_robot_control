import { create } from 'zustand'
import { SelectedTaskHistoryState } from '@/store/interface/store.interface'

export const useSelectedTaskStore = create<SelectedTaskHistoryState>((set) => ({
  taskHistory: null,
  setTaskHistory: (newTaskHistories) => set({ taskHistory: newTaskHistories }),
}))

