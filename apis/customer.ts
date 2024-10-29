import { Customer } from "@/types";
import { CategoryType } from "@/types/CategoryType";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
}

const getCusomtersApi = async (): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.customer.getAll}`);
};

const postCustomer = async (data: Customer): Promise<InfoResponse<any>> => {
  return await axiosCore.post(endPoint.customer.create, data);
};

const updateCustomer = async (
  id: string,
  data: Customer
): Promise<InfoResponse<any>> => {
  return await axiosCore.put(endPoint.customer.update(id), data);
};

const deleteCustomer = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.delete(endPoint.customer.delete(id));
};

export { getCusomtersApi, postCustomer, updateCustomer, deleteCustomer };
