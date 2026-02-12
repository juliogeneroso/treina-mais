import { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  withAuth?: boolean;
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = async <T = unknown>(
    url: string,
    { method = "GET", body, headers, withAuth = false }: RequestOptions = {},
  ): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);

      const finalHeaders: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (headers) {
        Object.assign(finalHeaders, headers);
      }

      if (withAuth) {
        const token = localStorage.getItem("token");
        if (token) {
          finalHeaders.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(`http://localhost:3000${url}`, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { request, isLoading, error };
}
