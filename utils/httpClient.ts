import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endPoint, baseURL } from "./endPoint";

interface Response {
  result: any;
}

const defaultHeader = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  Accept: "application/json",
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
const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

//
axiosClient.interceptors.request.use(async (request) => {
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
    // clear session
    // AsyncStorage.removeItem("session");
    return { result: null, message: "Server error" };
  }
};
axiosClient.interceptors.response.use(
  (response) => {
    return handleResponse(response);
  },
  (error) => {
    console.log("error", error);
    // AsyncStorage.removeItem("session");
    return handleError(error);
  }
);

export default axiosClient;
