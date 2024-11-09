import { PackageType } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";

interface InfoResponse<T> {
  code: number;
  message: string;
  result: T;
  totalElements: number;
  totalPages: number;
}
const getPackagesApi = async (
  page: number
): Promise<InfoResponse<PackageType[]>> => {
  return await axiosClient.get(endPoint.package.getPackages(page));
};
export { getPackagesApi };
