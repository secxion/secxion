import { useCallback } from "react";

export const useSecureFetch = () => {
  const fetchData = useCallback(async (url, method = 'GET', options = {}) => {
    const response = await fetch(url, {
      method,
      credentials: "include",
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }, []);

  return fetchData; 
};