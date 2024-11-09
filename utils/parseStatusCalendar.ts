interface data {
  is_booked: boolean;
  waiting_down_payment: boolean;
  disabled: boolean;
  middle_point: boolean;
  booking_status: number;
}
export const parseStatusCalendar = (data: data) => {
  if (data.is_booked === true) {
    return "booked";
  }
  if (data.waiting_down_payment === true) {
    return "waiting_down_payment";
  }
  if (data.disabled === true) {
    return "disabled";
  }
  if (data.middle_point === true) {
    return "middle_point";
  }
  if (data.booking_status === 1) {
    return "waiting_accept";
  }
  if (data.booking_status === 2) {
    return "accept";
  }
  if (data.booking_status === 3) {
    return "reject";
  }
  return "empty";
};
