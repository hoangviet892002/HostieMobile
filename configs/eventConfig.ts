export const eventConfig = [
  {
    key: "holdRequest",
    log: "host.receive_hold_request",
    notification: {
      title: "Hold Request",
      message: (data: any) =>
        `You have a hold request from residence: ${data.residence_id}`,
    },
  },
  {
    key: "bookingRequest",
    log: "host.receive_booking_request",
    notification: {
      title: "Booking Request",
      message: (data: any) =>
        `You have a booking request from residence: ${data.residence_id}`,
    },
  },
  {
    key: "sellerTransfer",
    log: "host.receive_seller_transfer",
    notification: {
      title: "Seller Transfer",
      message: (data: any) =>
        `You have a seller transfer from seller ID: ${data.seller_id}`,
    },
  },
  {
    key: "holdAcceptReject",
    log: "seller.receive_hold_accepted_reject",
    notification: {
      title: "Hold Request Update",
      message: (data: any) =>
        `Your hold request has been ${data.accepted ? "accepted" : "rejected"}`,
    },
  },
  {
    key: "bookingAcceptReject",
    log: "seller.receive_booking_accepted_reject",
    notification: {
      title: "Booking Update",
      message: (data: any) =>
        `Your booking request has been ${
          data.accepted ? "accepted" : "rejected"
        }`,
    },
  },
  {
    key: "hostReceiveTransfer",
    log: "seller.host_receive_transfer",
    notification: {
      title: "Transfer Received",
      message: (data: any) =>
        `You have received a transfer from seller: ${data.seller_id}`,
    },
  },
  {
    key: "hostNotReceiveTransfer",
    log: "seller.host_not_receive_transfer",
    notification: {
      title: "Transfer Not Received",
      message: (data: any) =>
        `You have not received the transfer from seller: ${data.seller_id}`,
    },
  },
];
