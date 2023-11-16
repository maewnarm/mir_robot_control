export interface ILayoutState {
  isLoading: boolean
  loadingDescription: string
  setIsLoading: (isLoading: boolean, loadingDescription?: string) => void
}
