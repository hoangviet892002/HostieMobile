import { HouseKepperType } from "@/types/HouseKeppertype";
import { AcceptRejectRequest } from "@/types/request/AcceptRejectRequest";
import { RequestType } from "@/types/RequestType";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";
interface InfoResponse<T> {
  code: number;
  message: string;
  result: T;
  totalElements: number;
  totalPages: number;
}

const housekeeperAddResidenceApi = async (
  housekeeperRegistrationCode: string
): Promise<InfoResponse<any>> => {
  return await axiosClient.post(endPoint.housekeeper.addResidence, {
    housekeeperRegistrationCode,
  });
};
const getHouseKepperApprovedResidencesApi = async (
  page: number
): Promise<InfoResponse<HouseKepperType[]>> => {
  return await axiosClient.get(
    `${endPoint.housekeeper.getHouseKepper}?page=${page}`
  );
};
const getHousekeeperRequestsApi = async (
  page: number
): Promise<InfoResponse<RequestType[]>> => {
  return await axiosClient.get(
    `${endPoint.housekeeper.getHousekeeperRequests}?page=${page}&size=10&sort=createdAt&sort=desc`
  );
};

const rejectRequestApi = async (
  data: AcceptRejectRequest
): Promise<InfoResponse<any>> => {
  return await axiosClient.post(endPoint.housekeeper.rejectRequest, data);
};
const approveRequestApi = async (
  data: AcceptRejectRequest
): Promise<InfoResponse<any>> => {
  return await axiosClient.post(endPoint.housekeeper.approveRequest, data);
};
export {
  housekeeperAddResidenceApi,
  getHouseKepperApprovedResidencesApi,
  getHousekeeperRequestsApi,
  rejectRequestApi,
  approveRequestApi,
};
