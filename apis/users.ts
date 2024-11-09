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

const postBankAccountApi = async (payload: any, userID: string) => {
  return await axiosClient.post(endPoint.user.postBank(userID), payload);
};
const editBankAccountApi = async (
  payload: any,
  userID: string,
  accountID: string
) => {
  return await axiosClient.put(
    endPoint.user.editBank(userID, accountID),
    payload
  );
};

const deleteBankAccountApi = async (userID: string, accountID: string) => {
  return await axiosClient.delete(endPoint.user.editBank(userID, accountID));
};
export {
  registerApi,
  signInApi,
  getMyInfoApi,
  getMyBankAccountsApi,
  refreshTokenApi,
  postBankAccountApi,
  editBankAccountApi,
  deleteBankAccountApi,
};
