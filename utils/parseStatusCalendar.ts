import {
  CalendarColor,
  StatusCalendar,
} from "@/constants/enums/statusCalendarEnums";

export const parseStatusCalendar = (color: string) => {
  switch (color) {
    case CalendarColor.BOOKING:
      return StatusCalendar.BOOKING;
    case CalendarColor.HOLD:
      return StatusCalendar.HOLD;
    case CalendarColor.DISABLED:
      return StatusCalendar.DISABLED;
    case CalendarColor.AVAILABLE:
      return StatusCalendar.AVAILABLE;
    case CalendarColor.PENDINGBOOKING:
      return StatusCalendar.PENDINGBOOKING;
    case CalendarColor.PENDINGHOLD:
      return StatusCalendar.PENDINGHOLD;
    default:
      return StatusCalendar.AVAILABLE;
  }
};
