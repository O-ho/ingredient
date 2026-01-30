import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { LocalStorageKey } from "@/constants/LocalStoragekeys";

const onFulfilled = (response: AxiosResponse) => {
  return response.data.data;
};
const onRejected = (error: unknown) => {
  return Promise.reject(error);
};
const initialization = (config: AxiosRequestConfig) => {
  const axiosInstance = axios.create(config);
  axiosInstance.interceptors.request.use(
    (existedConfig: InternalAxiosRequestConfig) => {
      let accessToken = null;
      if (typeof window !== "undefined") {
        accessToken =
          localStorage.getItem(LocalStorageKey.ACCESS_TOKEN) || null;
      }

      const newConfig = { ...existedConfig };
      if (accessToken) {
        newConfig.headers.Authorization = `Bearer ${accessToken}`;
      }
      return newConfig;
    },
  );
  axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  return axiosInstance;
};
export default initialization;
