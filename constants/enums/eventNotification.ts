export enum EventBookNotification {
  Created = "BOOKING_CREATED",
  Updated = "BOOKING_UPDATED",
  Cancelled = "BOOKING_CANCELLED",
  HostAccepted = "HOST_ACCEPTED_BOOKING",
  HostRejected = "HOST_REJECTED_BOOKING",
  SellerTransferred = "SELLER_TRANSFERRED",
  HostReceived = "HOST_RECEIVED",
  HostDontReceived = "HOST_DONT_RECEIVED",
  CustomerCheckin = "CUSTOMER_CHECKIN",
  CustomerCheckout = "CUSTOMER_CHECKOUT",
  SystemCancelled = "BOOKING_SYSTEM_CANCELLED",
}
export enum EventHoldNotification {
  Created = "HOLD_CREATED",
  HostAccepted = "HOST_ACCEPTED_HOLD",
  HostRejected = "HOST_REJECTED_HOLD",
  Cancelled = "HOLD_CANCELLED",
}
