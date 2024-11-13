export interface messageFile {
  file_path: string;
  file_name: string;
  file_type: "image";
  file_size: string;
  file_original_name: string;
}

export interface MessageType {
  id: number;
  uuid: string;
  group_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  status: number;
  created_at: string;
  updated_at: string;
  sender_avatar: string;
  sender_name: string;
  files: messageFile[];
}
