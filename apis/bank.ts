import { Bank } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";

interface InfoResponse<T> {
  code: number;
  message: string;
  result: T;
  totalElements: number;
  totalPages: number;
}

const getBanksApi = async (): Promise<InfoResponse<Bank[]>> => {
  return await axiosClient.get(endPoint.bank.getBanks);
};

export { getBanksApi };
