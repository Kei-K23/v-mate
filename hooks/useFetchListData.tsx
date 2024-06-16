import { useEffect, useState } from "react";

type UseFetchListDataType<T> = {
  fn: () => Promise<T[]>;
};

export default function useFetchListData<T>({ fn }: UseFetchListDataType<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fn();

      setData(res);
    } catch (e: any) {
      // TODO: handle error properly
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshFn = () => fetchData();

  return { data, isLoading, refreshFn };
}
