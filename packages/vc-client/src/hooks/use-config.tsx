import { useState } from "react";
import axios from "axios";
import { API_PATH } from "@/helpers/constants";
import { AdminModules } from "@/types/acapyApi/acapyInterface";
import { fetchList } from "./utils";

const useConfig = () => {
  const [acapyPlugins, setAcapyPlugins] = useState<AdminModules[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const proxyPath = (p: string) => {
    if (config) {
      let pp = config.frontend.tenantProxyPath;
      if (pp.endsWith("/")) {
        pp = pp.slice(0, -1);
      }
      if (!p.startsWith("/")) {
        p = `/${p}`;
      }
      return `${pp}${p}`;
    } else {
      return p;
    }
  };

  const load = async () => {
    console.log("> config.load");
    setConfig(null);
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(API_PATH.CONFIG);
      setConfig(res.data);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.log("< config.load");
    if (error) {
      throw error;
    }
    return config;
  };

  const getPluginList = async () => {
    return fetchList(
      API_PATH.SERVER_PLUGINS,
      acapyPlugins,
      setAcapyPlugins,
      setError,
      setLoading
    );
  };

  return {
    acapyPlugins,
    config,
    loading,
    error,
    load,
    proxyPath,
    getPluginList,
  };
};

export default useConfig;
