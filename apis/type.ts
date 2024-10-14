import { Type } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
}

//type
const getTypes = async (): Promise<InfoResponse<Type[]>> => {
  return await axiosCore.get(endPoint.type.getTypes);
};

export { getTypes };
