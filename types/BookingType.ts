export interface BookingType {
  id: number;
  residence_id: number;
  seller_id: number;
  total_amount: number;
  paid_amount: number;
  checkin: string;
  checkout: string;
  total_night: number;
  total_day: number;
  guest_name: null | string;
  guest_phone: null | string;
  host_phone: null | string;
  residence_address: null | string;
  is_host_accept: boolean;
  is_seller_transfer: boolean;
  is_host_receive: boolean;
  status: number;
  created_at: string;
  updated_at: string;
  residence_name: string;
  host_id: number;
  description: null | string;
}
