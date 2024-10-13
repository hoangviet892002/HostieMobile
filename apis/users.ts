import { RegisterRequest } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";

interface UserInfoResponse {
  result: any;
}

//authentication
const registerApi = async (
  payload: RegisterRequest
): Promise<UserInfoResponse> => {
  return await axiosClient.post(endPoint.user.signUp, payload);
};
export { registerApi };
