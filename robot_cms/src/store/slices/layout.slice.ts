import { ILayoutState } from '@/store/interface/layout.interface'
import { StateCreator } from 'zustand'

export const LayoutSlice: StateCreator<ILayoutState> = (set, get) => ({
  isLoading: false,
  loadingDescription: '',
  setIsLoading(isLoading, loadingDescription = '') {
    set({ isLoading, loadingDescription })
  }
})
