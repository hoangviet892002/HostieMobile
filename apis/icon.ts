import { CategoryType } from "@/types/CategoryType";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
}

//icon
const getIcons = async (): Promise<InfoResponse<CategoryType[]>> => {
  return await axiosCore.get(endPoint.icon.getIcons);
};

export { getIcons };
