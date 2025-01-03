import { useState } from "react";
import axios from "axios";
import { API_PATH } from "@/helpers/constants";
import useConfig from "@/hooks/use-config";

const useToken = () => {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const config = useConfig();

  const login = async (
    username: string,
    password: string,
    isApiKey: boolean
  ) => {
    console.log("> token.load");
    const payload: any = isApiKey
      ? { api_key: password }
      : { wallet_key: password };
    setTokenState(null);
    setError(null);
    setLoading(true);

    const url = config.proxyPath(
      isApiKey
        ? API_PATH.MULTITENANCY_TENANT_TOKEN(username)
        : API_PATH.MULTITENANCY_WALLET_TOKEN(username)
    );

    try {
      const res = await axios.post(url, payload);
      console.log(res);
      setTokenState(res.data.token);
      if (res.data.token) localStorage.setItem("token", res.data.token);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }

    console.log("< token.load");

    if (error) {
      throw error;
    }

    return token;
  };

  const clearToken = () => {
    console.log("> clearToken");
    setTokenState(null);
    localStorage.removeItem("token");
    console.log("< clearToken");
  };

  const setToken = (newToken: string) => {
    console.log("> setToken");
    setTokenState(newToken);
    console.log("< setToken");
  };

  return { token, loading, error, clearToken, setToken, login };
};

export default useToken;
