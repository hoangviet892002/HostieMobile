import { CalendarResponse } from "@/types";
import { PolicyType } from "@/types/PolicyType";
import { ResidencesRequest } from "@/types/request/ResidencesRequest";
import { Residence } from "@/types/response/Residences";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  error_code: string | null;
}

interface Residences {
  residences: Residence[];
  total_pages: number;
}
interface deleteResidence {
  id: string;
}

//residences
const postResidence = async (
  data: ResidencesRequest
): Promise<InfoResponse<any>> => {
  if (data._parts) {
    return await axiosCore.post(endPoint.residences.post, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return await axiosCore.post(endPoint.residences.post, data);
};

const getResidences = async (
  page_size: number,
  page: number,
  search?: string
): Promise<InfoResponse<Residences>> => {
  return await axiosCore.get(endPoint.residences.get(page_size, page + 1));
};
const getResidence = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getResidenceById(id)}`);
};

const getImages = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getImages(id)}`);
};
const getPrice = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getPrice(id)}`);
};
const deleteResidenc = async (
  data: deleteResidence
): Promise<InfoResponse<any>> => {
  console.log(data);
  return await axiosCore.delete(`${endPoint.residences.delete}`, { data });
};

const getCalendarApi = async (
  ids: string,
  time: string
): Promise<InfoResponse<CalendarResponse>> => {
  return await axiosCore.get(`${endPoint.residences.getCalendar(ids, time)}`);
};

const getBlocksApi = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getBlocks(id)}`);
};
const postBlockApi = async (data: any): Promise<InfoResponse<any>> => {
  return await axiosCore.post(`${endPoint.residences.postBlock}`, data);
};
const deleteBlockApi = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.delete(`${endPoint.residences.deleteBlock(id)}`);
};

const getResidencesBySellerApi = async (
  page: number,
  checkin: string,
  checkout: string
): Promise<InfoResponse<any>> => {
  return await axiosCore.get(
    `${endPoint.residences.getResidencesBySeller(page, checkin, checkout)}`
  );
};

const getResidencesByHouseKeeperApi = async (
  page: number
): Promise<InfoResponse<any>> => {
  return await axiosCore.get(
    `${endPoint.residences.getResidencesByHouseKeeper(page)}`
  );
};

const getPolicy = async (id: number): Promise<InfoResponse<PolicyType>> => {
  console.log(`${endPoint.residences.getPolicy(id)}`);
  return await axiosCore.get(`${endPoint.residences.getPolicy(id)}`);
};

export {
  postResidence,
  getResidences,
  getResidence,
  getImages,
  getPrice,
  deleteResidenc,
  getCalendarApi,
  getBlocksApi,
  postBlockApi,
  deleteBlockApi,
  getResidencesBySellerApi,
  getResidencesByHouseKeeperApi,
  getPolicy,
};
