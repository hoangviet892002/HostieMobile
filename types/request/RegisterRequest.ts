type SocialUrls = {
  url: string;
  social_name: string;
};

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  retype_password: string;
  social_urls: SocialUrls[];
  reference_code: string | null;
}
