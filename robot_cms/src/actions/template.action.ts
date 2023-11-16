import axiosInstance from "@/libs/axios"

export async function fetchTemplate(): Promise<any> {
  const { data } = await axiosInstance.get<any>('template')
  return data
}
