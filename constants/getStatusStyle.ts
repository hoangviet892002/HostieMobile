import { StatusBooking } from "./enums/statusBookingEnums";

export const getStatusStyle = (status: string) => {
  switch (status) {
    case StatusBooking.CANCEL:
      return {
        icon: "close-circle",
        color: "#E53E3E",
        textColor: "text-red-600",
      };
    case StatusBooking.WAIT_ACCEPT:
      return {
        icon: "time-outline",
        color: "#ECC94B",
        textColor: "text-yellow-600",
      };
    case StatusBooking.WAIT_TRANSFER:
      return {
        icon: "time-outline",
        color: "#ECC94B",
        textColor: "text-yellow-600",
      };
    case StatusBooking.WAIT_RECEIVE:
      return {
        icon: "time-outline",
        color: "#ECC94B",
        textColor: "text-yellow-600",
      };
    case StatusBooking.SUCCESS:
      return {
        icon: "checkmark-circle",
        color: "#38A169",
        textColor: "text-green-600",
      };
    case StatusBooking.REJECT:
      return {
        icon: "close-circle",
        color: "#E53E3E",
        textColor: "text-red-600",
      };
    default:
      return {
        icon: "help-circle",
        color: "#A0AEC0",
        textColor: "text-gray-600",
      };
  }
};
