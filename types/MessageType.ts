export interface messageFile {
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: string;
  file_original_name: string;
}

export interface MessageType {
  sender_id: number;
  message: string;
  created_at: string;

  files: messageFile[];
}
