export interface Calendar {
  residence_id: number;
  booking_id: number | null;
  price: number;
  date: string;
  is_booked: boolean;
  waiting_down_payment: boolean;
  start_point: boolean;
  middle_point: boolean;
  end_point: boolean;
  avatar_seller: null;
  background_color: string;
  booking_status: string | null;
  seller_username: null | string;
  seller_id: null | number;
  host_id?: number | null;
  community_id?: number;
  residence_type_id?: number;
  disabled: boolean;
  hold_id: number | null;
}
