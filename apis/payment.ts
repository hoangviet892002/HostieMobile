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
const getURLPaymentApi = async (
  id: number
): Promise<InfoResponse<{ paymentUrl: string }>> => {
  return await axiosClient.get(endPoint.payment.getUrlVnpay(id));
};
export { getURLPaymentApi };
