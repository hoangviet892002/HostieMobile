import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  error_code: string | null;
}
interface IHold {
  residence_id: number;
  checkin: string;
  checkout: string;
}
interface IPrice {
  residence_ids: number[];
  checkin: string;
  checkout: string;
}
interface IBooked {
  paid_amount: number;
  residence_id: number;
  checkin: string;
  checkout: string;
}
const holdBookingApi = async (booking: IHold): Promise<InfoResponse<any>> => {
  return await axiosCore.post(endPoint.booking.hold, booking);
};

const bookingApi = async (booking: IBooked): Promise<InfoResponse<any>> => {
  return await axiosCore.post(endPoint.booking.book, booking);
};

const getPrice = async (data: IPrice): Promise<InfoResponse<any>> => {
  return await axiosCore.post(`${endPoint.booking.getPrice}`, data);
};

const getHoldsForHostApi = async (page: number): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.booking.getHoldsForHost(page)}`);
};

const getBooksForHostApi = async (page: number): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.booking.getBooksForHost(page)}`);
};
const acceptHoldApi = async (data: any): Promise<InfoResponse<any>> => {
  return await axiosCore.post(`${endPoint.booking.acceptHold}`, data);
};
export {
  holdBookingApi,
  getPrice,
  bookingApi,
  getHoldsForHostApi,
  getBooksForHostApi,
  acceptHoldApi,
};
