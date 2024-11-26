import {
  EventBookNotification,
  EventHoldNotification,
} from "@/constants/enums/eventNotification";

export const parseLogsEvent = (eventName: string): string => {
  switch (eventName) {
    // EventBookNotification cases
    case EventBookNotification.Created:
      return "Booking created";
    case EventBookNotification.Updated:
      return "Booking updated";
    case EventBookNotification.Cancelled:
      return "Booking cancelled";
    case EventBookNotification.HostAccepted:
      return "Host accepted the booking";
    case EventBookNotification.HostRejected:
      return "Host rejected the booking";
    case EventBookNotification.SellerTransferred:
      return "Seller transferred the booking";
    case EventBookNotification.HostReceived:
      return "Host received the booking";
    case EventBookNotification.HostDontReceived:
      return "Host did not receive the booking";
    case EventBookNotification.CustomerCheckin:
      return "Customer checked in";
    case EventBookNotification.CustomerCheckout:
      return "Customer checked out";

    case EventBookNotification.SystemCancelled:
      return "Booking system cancelled";

    // EventHoldNotification cases
    case EventHoldNotification.Created:
      return "Hold created";
    case EventHoldNotification.HostAccepted:
      return "Host accepted the hold";
    case EventHoldNotification.HostRejected:
      return "Host rejected the hold";
    case EventHoldNotification.Cancelled:
      return "Hold cancelled";

    // Default case
    default:
      return "Unknown event";
  }
};
