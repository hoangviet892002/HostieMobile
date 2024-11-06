import { StatusBooking } from "@/constants/enums/statusBookingEnums";

interface data {
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  status: number;
  is_customer_checkin: boolean;
  is_customer_checkout: boolean;
}

export const parseStatusBooking = (data: data) => {
  if (data.status === 0) {
    return StatusBooking.CANCEL;
  }
  if (data.status === 3) {
    return StatusBooking.REJECT;
  }
  if (!data.is_host_accept) {
    return StatusBooking.WAIT_ACCEPT;
  }
  if (!data.is_seller_transfer) {
    return StatusBooking.WAIT_TRANSFER;
  }
  if (!data.is_host_receive) {
    return StatusBooking.WAIT_RECEIVE;
  }
  if (data.is_customer_checkin) {
    return StatusBooking.CHECKIN;
  }
  if (data.is_customer_checkout) {
    return StatusBooking.CHECKOUT;
  }

  return StatusBooking.SUCCESS;
};
