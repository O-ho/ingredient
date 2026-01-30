import { AxiosRequestConfig } from "axios";
import initialization from "@/lib/api/axiosSetup";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const defaultRequestConfiguration: AxiosRequestConfig = {
  baseURL,
  responseType: "json",
  timeout: 20 * 1000, //20s
};

const axiosInstance = initialization(defaultRequestConfiguration);

const getData = <ReturnType, QueryParamType = unknown>(
  url: string,
  queryParams?: QueryParamType,
  config?: AxiosRequestConfig<unknown> | undefined,
): Promise<ReturnType> => {
  return axiosInstance.get(url, {
    ...config,
    params: queryParams,
  }) as Promise<ReturnType>;
};

const postData = <ReturnType, BodyType>(
  url: string,
  body?: BodyType,
  config?: AxiosRequestConfig<unknown> | undefined,
): Promise<ReturnType> => {
  return axiosInstance.post(url, body, config) as Promise<ReturnType>;
};

const putData = <ReturnType, BodyType>(
  url: string,
  body: BodyType,
  config?: AxiosRequestConfig<unknown> | undefined,
): Promise<ReturnType> => {
  return axiosInstance.put(url, body, config) as Promise<ReturnType>;
};

const patchData = <ReturnType, BodyType>(
  url: string,
  body?: BodyType,
  config?: AxiosRequestConfig<unknown> | undefined,
): Promise<ReturnType> => {
  return axiosInstance.patch(url, body, config) as Promise<ReturnType>;
};

export { getData, postData, putData, patchData, axiosInstance };
