export interface LoginResponse {
  token: string;
  expiryTime: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  status: null | string;
  urlAvatar: null | string;
}
