import { StatusCalendar, CalendarColor } from "./enums/statusCalendarEnums";

// icon Feather
export const getCalendarStyle = (status: string) => {
  switch (status) {
    case StatusCalendar.BOOKING:
      return {
        color: CalendarColor.BOOKING,
        textColor: "text-red-600",
        icon: "clock", // Updated to correct Feather icon name
      };

    case StatusCalendar.HOLD:
      return {
        color: CalendarColor.HOLD,
        textColor: "text-yellow-600",
        icon: "clock", // Updated to correct Feather icon name
      };

    case StatusCalendar.DISABLED:
      return {
        color: CalendarColor.DISABLED,
        textColor: "text-yellow-600",
        icon: "help-circle", // Correct Feather icon
      };

    // case StatusCalendar.AVAILABLE:
    //   return {
    //     color: CalendarColor.AVAILABLE,
    //     textColor: "text-gray-600",
    //     icon: "check-circle", // Updated to correct Feather icon name
    //   };

    case StatusCalendar.PENDINGBOOKING:
      return {
        color: CalendarColor.PENDINGBOOKING,
        textColor: "text-red-600",
        icon: "clock", // Updated to correct Feather icon name
      };

    case StatusCalendar.PENDINGHOLD:
      return {
        color: CalendarColor.PENDINGHOLD,
        textColor: "text-yellow-600",
        icon: "clock", // Updated to correct Feather icon name
      };

    default:
      return {
        color: CalendarColor.DEFAULT,
        textColor: "text-gray-600",
        icon: "help-circle", // Correct Feather icon
      };
  }
};
