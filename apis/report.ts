import { ReportType } from "@/types/ReportType";
import { ReportRequest } from "@/types/request/ReportRequest";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";
interface InfoResponse<T> {
  code: number;
  message: string;
  result: T;
  totalElements: number;
  totalPages: number;
}
const getMyReportsApi = async (
  page: number
): Promise<InfoResponse<ReportType[]>> => {
  return await axiosClient.get(`${endPoint.report.getMyReport}?page=${page}`);
};
const postReportApi = async (
  data: ReportRequest
): Promise<InfoResponse<any>> => {
  return await axiosClient.post(endPoint.report.postReport, data);
};
export { getMyReportsApi, postReportApi };
