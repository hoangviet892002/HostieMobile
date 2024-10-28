export const getStatusStyle = (status: string) => {
  switch (status) {
    case "Cancel":
      return {
        icon: "close-circle",
        color: "#E53E3E",
        textColor: "text-red-600",
      };
    case "Wait Accept":
      return {
        icon: "time-outline",
        color: "#ECC94B",
        textColor: "text-yellow-600",
      };
    case "Wait Transfer":
      return {
        icon: "time-outline",
        color: "#ECC94B",
        textColor: "text-yellow-600",
      };
    case "Wait Receive":
      return {
        icon: "time-outline",
        color: "#ECC94B",
        textColor: "text-yellow-600",
      };
    case "Success":
      return {
        icon: "checkmark-circle",
        color: "#38A169",
        textColor: "text-green-600",
      };
    default:
      return {
        icon: "help-circle",
        color: "#A0AEC0",
        textColor: "text-gray-600",
      };
  }
};
