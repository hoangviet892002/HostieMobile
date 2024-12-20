import {
  EventBookNotification,
  EventHoldNotification,
} from "@/constants/enums/eventNotification";

export interface BookDetailNotification {
  id: number;
  residence_id: number;
  seller_id: number;
  total_amount: number;
  paid_amount: number;
  checkin: string;
  checkout: string;
  total_nights: number;
  total_days: number;
  hold_residence_id: null | number;
  guest_name: string;
  guest_phone: string;
  host_phone: null | string;
  residence_address: null | string;
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  is_customer_checkin: boolean;
  is_customer_checkout: boolean;
  description: string;
  status: number;
  expire: string;
  bank_account_id: number;
  guest_count: number;
  bank_account_holder: string;
  bank_account_no: string;
  bank_id: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}
export interface HoldDetailNotification {
  id: number;
  residence_id: number;
  residence_name: string;
  host_id: number;
  seller_id: number;
  seller_name: string;
  seller_avatar: string;
  checkin: string;
  checkout: string;
  total_nights: number;
  total_days: number;
  is_host_accept: boolean;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}
export interface NotificationType {
  id: number;
  event_type_id: number;
  event_code: EventBookNotification | EventHoldNotification;
  user_id: number;
  entity_type_code: "bookings" | "hold";
  entity_id: number;
  is_read: boolean;
  read_at: null | string;
  delivered_at: null | string;
  status: number;
  created_at: string;
  updated_at: string;
  entity_details: BookDetailNotification | HoldDetailNotification;
}
