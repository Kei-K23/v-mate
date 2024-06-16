import React, { useEffect, useState } from "react";

type UseFetchDataType<T> = {
  fn: () => Promise<T | T[]>;
  singleFetch?: boolean;
};

export default function useFetchData<T>({
  fn,
  singleFetch,
}: UseFetchDataType<T>) {
  const [data, setData] = useState<T | T[] | undefined>(
    singleFetch ? undefined : []
  );
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
