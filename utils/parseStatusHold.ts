import { StatusHold } from "@/constants/enums/statusHoldEnums";

interface data {
  is_host_accept: boolean;
  status: number;
}

export const parseStatusHold = (data: data) => {
  if (data.is_host_accept === true) {
    return StatusHold.ACCEPT;
  }
  if (data.status === 3) {
    return StatusHold.BOOK;
  }
  if (data.status === 0) {
    return StatusHold.REJECT;
  }
  return StatusHold.WAIT_ACCEPT;
};
