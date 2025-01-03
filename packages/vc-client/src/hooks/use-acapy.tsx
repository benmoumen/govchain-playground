import useConfig from "@/hooks/use-config";
import useToken from "@/hooks/use-token";
//import { useTenant } from "@/hooks/useTenant";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const useAcapyApi = () => {
  const { config } = useConfig();
  const { token, clearToken } = useToken();
  //const { clearTenant } = useTenant();

  const acapyApi = axios.create({
    baseURL: config.frontend.tenantProxyPath,
  });

  acapyApi.interceptors.request.use(
    async (dataConfig: any) => {
      // if the consumer provides an auth header (even blank) in options, then use it, otherwise default to the token
      let auth = `Bearer ${token}`;
      const authOverride = dataConfig.headers?.Authorization;
      if (authOverride || authOverride === "") {
        auth = authOverride;
      }

      const result = {
        ...dataConfig,
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          ...dataConfig.headers,
          Authorization: auth,
        },
      };
      return result;
    },
    (error) => {
      console.error("acapyApi.request.error", error);
      return Promise.reject(error);
    }
  );

  acapyApi.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      console.error("acapyApi.response.error", error);
      if (error.response?.status === 401) {
        clearToken();
        //clearTenant();
        return Promise.reject(
          `Unauthorized: ${error.response.data.reason || ""}`
        );
      }
      return Promise.reject(error);
    }
  );

  const callAcapyApi = async (
    url: string,
    method: string,
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return acapyApi({
      method: method.toUpperCase(),
      url,
      ...options,
    });
  };

  const getHttp = async (
    url: string,
    params: unknown = {},
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return callAcapyApi(url, "get", { ...options, params });
  };

  const postHttp = async (
    url: string,
    data: unknown = {},
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return callAcapyApi(url, "post", { data, ...options });
  };

  const updateHttp = async (
    url: string,
    data: unknown = {},
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return callAcapyApi(url, "update", { data, ...options });
  };

  const putHttp = async (
    url: string,
    data: unknown = {},
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return callAcapyApi(url, "put", { data, ...options });
  };

  const patchHttp = async (
    url: string,
    data: unknown = {},
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return callAcapyApi(url, "patch", { data, ...options });
  };

  const deleteHttp = async (
    url: string,
    data: unknown = {},
    options: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    return callAcapyApi(url, "delete", { data, ...options });
  };

  return { getHttp, postHttp, updateHttp, putHttp, patchHttp, deleteHttp };
};
