export interface PolicyType {
  policy: string;
  files: file[] | null;
}

interface file {
  id: number;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
  original_name: string;
  status: number;
  created_at: string;
  updated_at: string;
}
