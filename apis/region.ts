import { RegionType } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
}

//region
const getProvinces = async (): Promise<InfoResponse<RegionType[]>> => {
  return await axiosCore.get(endPoint.region.getProvinces);
};

const getDistricts = async (
  provinceCode: string
): Promise<InfoResponse<RegionType[]>> => {
  return await axiosCore.get(endPoint.region.getDistricts(provinceCode));
};
const getWards = async (
  districtCode: string
): Promise<InfoResponse<RegionType[]>> => {
  return await axiosCore.get(endPoint.region.getWards(districtCode));
};

export { getProvinces, getDistricts, getWards };
