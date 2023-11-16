import { ILayoutState } from "@/store/interface/layout.interface"
import { LayoutSlice } from "@/store/slices/layout.slice"
import { create } from "zustand"

export const useStore = create<ILayoutState>((...args) => ({
  ...LayoutSlice(...args)
}))
