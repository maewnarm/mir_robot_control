// import axiosInstance from "@/lib/axios";
// import { _5M1ESettingStore } from "@/store/5m1e-setting.store";
// import { I5M1ESystemSettingResponse, I5M1EReportSettingResponse } from "@/types/5m1e-setting.type";

// export async function fetch5M1EReportSetting(): Promise<I5M1EReportSettingResponse> {
//   const { setReportSetting } = _5M1ESettingStore.getState();
//   const { data } = await axiosInstance.get<I5M1EReportSettingResponse>(`static/5m1e/report`);

//   setReportSetting(data);
//   // console.log("report", data);

//   return data;
// }

// export async function fetch5M1ESystemSetting(): Promise<I5M1ESystemSettingResponse> {
//   const { setSystemSetting } = _5M1ESettingStore.getState();
//   const { data } = await axiosInstance.get<I5M1ESystemSettingResponse>(`static/5m1e/settings`);

//   setSystemSetting(data);
//   // console.log("system", data);

//   return data;
// }