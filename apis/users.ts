import { LoginResponse, RegisterRequest, SignInRequest } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";

interface UserInfoResponse<T> {
  result: T;
}

//authentication
const registerApi = async (
  payload: RegisterRequest
): Promise<UserInfoResponse<any>> => {
  return await axiosClient.post(endPoint.user.signUp, payload);
};

const signInApi = async (
  payload: SignInRequest
): Promise<UserInfoResponse<LoginResponse>> => {
  return await axiosClient.post(endPoint.user.signIn, payload);
};
export { registerApi, signInApi };
