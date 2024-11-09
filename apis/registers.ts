import { PackageType, RegisterType } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";

interface InfoResponse<T> {
  code: number;
  message: string;
  result: T;
  totalElements: number;
  totalPages: number;
}
const getRegistersApi = async (
  page: number
): Promise<InfoResponse<RegisterType[]>> => {
  return await axiosClient.get(endPoint.registers.getRegisters(page));
};

const postRegisterApi = async (data: any): Promise<InfoResponse<any>> => {
  return await axiosClient.post(endPoint.registers.postRegister, data);
};
export { getRegistersApi, postRegisterApi };
