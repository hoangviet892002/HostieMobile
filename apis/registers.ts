import { PackageType, RegisterType } from "@/types";
import { UpgradePackageType } from "@/types/PackageType";
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

const getMyRegisterApi = async (): Promise<InfoResponse<RegisterType>> => {
  return await axiosClient.get(endPoint.registers.getMyRegister);
};

const getPackageUpgradesApi = async (): Promise<
  InfoResponse<UpgradePackageType[]>
> => {
  return await axiosClient.get(endPoint.registers.getPackageUpgrades);
};
const upGradeResgisterApi = async (data: any): Promise<InfoResponse<any>> => {
  return await axiosClient.put(
    endPoint.registers.upgrade + "?packageId=" + data.packageId
  );
};

export {
  getRegistersApi,
  postRegisterApi,
  getMyRegisterApi,
  getPackageUpgradesApi,
  upGradeResgisterApi,
};
