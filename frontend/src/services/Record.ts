import { axiosAuthRequest, axiosHeadersRequest } from "./axios";
import { RecordDetailType } from "@/store/Record/RecordDetail";

// 산책목록 조회
export const getRecords = async() => {
  const res = await axiosAuthRequest.get("/api/main/trails/records")
  return res.data.data.trailsRecords;
}

// 산책기록 상세 조회
export const getRecordDetail = async (id:string|undefined) => {
  const res = await axiosAuthRequest.get(`/api/main/trails/${id}/records`)
  return res.data.data;
}

// 캘린더 - 산책기록 날짜
export const getRecordDate = async (year:number, month:number) => {
  const res = await axiosAuthRequest.get(`/api/main/calendar/records?year=${year}&month=${month}`)
  return res.data.data.trailsRecords;
}

// 공개 비공개 토글
export const updatePublic = async (id:string|undefined, isPublic:boolean) => {
  const res = await axiosAuthRequest.put(`/api/main/trails/${id}/public`, {"public":isPublic});
  return res;
}

// 기록 수정
export const updateRecord = async (id:string|undefined, form:FormData) => {
  // console.log(form)
  const res = await axiosHeadersRequest.put(`/api/main/trails/${id}/record`, form);
  return res;
}

// 기록 수정
export const updateRecord2 = async (id:string|undefined, record:RecordDetailType) => {
  const data = new FormData();
  data.append("memo", record.memo)
  data.append("starRanking", record.starRanking.toString())
  data.append("trailsImg", record.trailsImg)
  data.append("trailsName", record.trailsName)

  console.log(data)

  const res = await axiosHeadersRequest.put(`/api/main/trails/${id}/record`, data);
  // const res = await axiosHeadersRequest.put(`/api/main/trails/${id}/record`, data);
  return res;
}