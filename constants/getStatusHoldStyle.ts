import { StatusHold } from "./enums/statusHoldEnums";

export const getStatusHoldStyle = (status: string) => {
  switch (status) {
    case StatusHold.ACCEPT:
      return {
        icon: "checkmark-circle",
        color: "#38A169",
        textColor: "text-green-600",
      };
    case StatusHold.REJECT:
      return {
        icon: "close-circle",
        color: "#E53E3E",
        textColor: "text-red-600",
      };
    case StatusHold.BOOK:
      return {
        icon: "checkmark-circle",
        color: "#38A169",
        textColor: "text-green-600",
      };
    case StatusHold.WAIT_ACCEPT:
      return {
        icon: "time",
        color: "#D69E2E",
        textColor: "text-yellow-600",
      };
    default:
      return {
        icon: "help-circle",
        color: "#A0AEC0",
        textColor: "text-gray-600",
      };
  }
};
