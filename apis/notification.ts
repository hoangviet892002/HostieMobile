import { NotificationType } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  error_code: string | null;
}

interface Data {
  notifications: NotificationType[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
const getNotificationApi = async (
  page: number
): Promise<InfoResponse<Data>> => {
  return await axiosCore.get(`${endPoint.notification.getNotification(page)}`);
};
export { getNotificationApi };
