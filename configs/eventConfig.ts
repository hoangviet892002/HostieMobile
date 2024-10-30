export const eventConfig = [
  // host
  {
    key: "holdRequest",
    log: "host.receive_hold_request",
    notification: {
      title: "Hold Request",
      message: (data: any) =>
        `You have a hold request from residence: ${data.residence_id}`,
      navigateTo: (data: any) => {
        const href = "HoldForHost";
        return {
          href,
          params: data,
        };
      },
    },
  },
  {
    key: "bookingRequest",
    log: "host.receive_booking_request",
    notification: {
      title: "Booking Request",
      message: (data: any) =>
        `Mr/Mrs ${data.seller_id} has requested to book residence: ${data.residence_id}`,
      navigateTo: (data: any) => {
        const href = "BookingDetail";
        const params = `?id=${data.id}`;
        return {
          href: href + params,
          params: { id: data.id },
        };
      },
    },
  },
  {
    key: "sellerTransfer",
    log: "host.receive_seller_transfered",
    notification: {
      title: "Seller Transfer",
      message: (data: any) =>
        `You have a seller transfer from seller ID: ${data.seller_id}`,
      navigateTo: (data: any) => {
        const href = "BookingDetail";
        const params = `?id=${data.id}`;
        return {
          href: href + params,
          params: { data },
        };
      },
    },
  },
  //   seller
  {
    key: "holdAcceptReject",
    log: "seller.receive_hold_accepted_reject",
    notification: {
      title: "Hold Request Update",
      message: (data: any) =>
        `Your hold request has been ${
          data.is_host_accept ? "accepted" : "rejected"
        }`,
      navigateTo: (data: any) => {
        const href = "BookingDetail";
        const params = `?id=${data.id}`;
        return {
          href: href + params,
          params: { data },
        };
      },
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
      navigateTo: (data: any) => {
        const href = "BookingDetail";
        const params = `?id=${data.id}`;
        return {
          href: href + params,
          params: { data },
        };
      },
    },
  },
  {
    key: "hostReceiveTransfer",
    log: "seller.host_receive_transfer",
    notification: {
      title: "Transfer Received",
      message: (data: any) =>
        `You have received a transfer from seller: ${data.seller_id}`,
      navigateTo: (data: any) => {
        const href = "BookingDetail";
        const params = `?id=${data.id}`;
        return {
          href: href + params,
          params: { data },
        };
      },
    },
  },
  {
    key: "hostNotReceiveTransfer",
    log: "seller.host_not_receive_transfer",
    notification: {
      title: "Transfer Not Received",
      message: (data: any) =>
        `You have not received the transfer from seller: ${data.seller_id}`,
      navigateTo: (data: any) => {
        const href = "BookingDetail";
        const params = `?id=${data.id}`;
        return {
          href: href + params,
          params: { data },
        };
      },
    },
  },

  //   common
  {
    key: "RecieveChangeCalendar",
    log: "common.receive_change_calendar",
    notification: {
      title: "Calendar Update",
      message: (data: any) =>
        `The calendar of residence: ${data.residence_id} has been updated`,
      navigateTo: (data: any) => {
        const href = "HoldForHost";
        return {
          href,
          params: { data },
        };
      },
    },
  },
];
