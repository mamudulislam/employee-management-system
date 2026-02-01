/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { ApiResponse } from './apiIntegration';
import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
} from './apiIntegration';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useApi = <T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  options: UseApiOptions = {}
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (body?: any, token?: string) => {
      setState({ data: null, loading: true, error: null });

      let response: ApiResponse<T>;

      switch (method) {
        case 'GET':
          response = await apiGet<T>(url, token);
          break;
        case 'POST':
          response = await apiPost<T>(url, body, token);
          break;
        case 'PUT':
          response = await apiPut<T>(url, body, token);
          break;
        case 'PATCH':
          response = await apiPatch<T>(url, body, token);
          break;
        case 'DELETE':
          response = await apiDelete<T>(url, token);
          break;
        default:
          response = { success: false, error: 'Unknown method' };
      }

      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
        options.onSuccess?.(response.data);
      } else {
        const error = response.error || 'An error occurred';
        setState({ data: null, loading: false, error });
        options.onError?.(error);
      }

      return response;
    },
    [url, method, options]
  );

  return {
    ...state,
    execute,
  };
};
