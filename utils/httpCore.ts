import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endPoint, coreURL } from "./endPoint";

interface Response {
  result: any;
}

const defaultHeader = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

let isRefreshing = false;
let failedQueue: any = [];

//
const processQueue = (error: any, token: string | null | undefined = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

//
const axiosCore = axios.create({
  baseURL: coreURL,
  timeout: 10000,
});

//
axiosCore.interceptors.request.use(async (request) => {
  const session = await AsyncStorage.getItem("session");
  if (session) {
    const sessionData = JSON.parse(session);
    request.headers.Authorization = `Bearer ${sessionData.token}`;
  }
  return request;
});

const handleResponse = (res: AxiosResponse) => {
  if (res && res.data) {
    return res.data;
  }
  return res;
};
const handleError = (error: { response: { data: any } }) => {
  try {
    const { data } = error.response;
    return data;
  } catch (error) {
    console.log("error", error);
    // clear session
    // AsyncStorage.removeItem("session");
    return { result: null, message: "Server error" };
  }
};
axiosCore.interceptors.response.use(
  (response) => {
    return handleResponse(response);
  },
  (error) => {
    return handleError(error);
  }
);

export default axiosCore;
