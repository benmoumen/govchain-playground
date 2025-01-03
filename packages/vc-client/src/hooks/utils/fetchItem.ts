import { useAcapyApi } from "../use-acapy";
import { AxiosRequestConfig } from "axios";

export async function fetchItem<T>(
  url: string,
  id: string | undefined,
  setError: (error: any) => void,
  setLoading: (loading: boolean) => void,
  params: object = {}
): Promise<T | object | null> {
  const acapyApi = useAcapyApi();
  let dataUrl = url;
  if (id) {
    // Normalize if the caller supplies a trailing slash or not
    dataUrl = `${dataUrl.replace(/\/$/, "")}/${id}`;
  }
  console.log(` > fetchItem(${dataUrl})`);
  setError(null);
  setLoading(true);
  let result = null;

  try {
    const res: AxiosRequestConfig = await acapyApi.getHttp(dataUrl, params);
    if (res?.data?.result) {
      // Some acapy resource item calls put things under "result"
      result = res.data.result;
    } else {
      result = res.data;
    }
    console.log(result);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
  console.log(`< fetchItem(${dataUrl})`);
  if (setError != null) {
    // throw error so $onAction.onError listeners can add their own handler
    throw setError;
  }
  // return data so $onAction.after listeners can add their own handler
  return result;
}
