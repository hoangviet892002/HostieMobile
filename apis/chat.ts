import { ConversationType } from "@/types/ConversationType";
import { MessageType } from "@/types/MessageType";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  error_code: string | null;
}

interface Data<T> {
  result: T;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

const getConversationsApi = async (
  page: number
): Promise<InfoResponse<Data<ConversationType[]>>> => {
  return await axiosCore.get(`${endPoint.chat.getConversations}?page=${page}`);
};

const getMessagesApi = async (
  id: string,
  page: number
): Promise<InfoResponse<Data<MessageType[]>>> => {
  return await axiosCore.get(
    `${endPoint.chat.getMessages(id)}?page=${page}&page_size=20`
  );
};

const chatApi = async (data: FormData) => {
  return await axiosCore.post(endPoint.chat.chat, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export { getConversationsApi, getMessagesApi, chatApi };
