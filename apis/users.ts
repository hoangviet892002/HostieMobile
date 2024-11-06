import { LoginResponse, RegisterRequest, SignInRequest } from "@/types";
import { endPoint } from "@/utils/endPoint";
import axiosClient from "@/utils/httpClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const getMyInfoApi = async () => {
  return await axiosClient.get(endPoint.user.info);
};

const getMyBankAccountsApi = async () => {
  return await axiosClient.get(endPoint.user.getBanks);
};
const refreshTokenApi = async (token: string) => {
  return await axiosClient.post(endPoint.user.refreshToken, {
    token: token,
  });
};
export {
  registerApi,
  signInApi,
  getMyInfoApi,
  getMyBankAccountsApi,
  refreshTokenApi,
};
