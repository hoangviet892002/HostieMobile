export interface ConversationType {
  id: number;
  name: string;
  is_personal: boolean;
  status: string;
  users: {
    id: number;
    username: string;
    avatar: string;
  }[];
  created_at: string;
  updated_at: string;
}
