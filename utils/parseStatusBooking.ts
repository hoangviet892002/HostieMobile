interface data {
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  status: number;
}

export const parseStatusBooking = (data: data) => {
  if (!data.is_host_accept) {
    return "Wait Accept";
  }
  if (!data.is_seller_transfer) {
    return "Wait Transfer";
  }
  if (!data.is_host_receive) {
    return "Wait Receive";
  }
  if (data.status === 0) {
    return "Cancel";
  }
  return "Success";
};
