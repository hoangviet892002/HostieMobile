import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  error_code: string | null;
}
interface IBooked {
  residence_id: number;
  checkin: string;
  checkout: string;
}
const holdBookingApi = async (booking: IBooked): Promise<InfoResponse<any>> => {
  return await axiosCore.post(endPoint.booking.hold, booking);
};
export { holdBookingApi };
