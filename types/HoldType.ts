export interface HoldType {
  id: number;
  residence_id: number;
  seller_id: number;
  checkin: string;
  checkout: string;
  total_nights: number;
  total_days: number;
  is_host_accept: boolean;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
  residence_name: string;
  host_id: number;
  seller_name: string;
  seller_avatar: string;
}
