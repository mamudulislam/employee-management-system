export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
interface RequestConfig extends RequestInit {
  timeout?: number;
}
export const createHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
export const apiRequest = async <T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const timeout = config.timeout || 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    const response = await fetch(fullUrl, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        message: error.message || `HTTP ${response.status}`,
        code: error.code || `HTTP_${response.status}`,
        details: error,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout',
        code: 'TIMEOUT',
      };
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      code: error.code || 'UNKNOWN_ERROR',
    };
  }
};
export const apiGet = <T = any>(
  url: string,
  token?: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'GET',
    headers: createHeaders(token),
    ...config,
  });
};
export const apiPost = <T = any>(
  url: string,
  data: any,
  token?: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(data),
    ...config,
  });
};
export const apiPut = <T = any>(
  url: string,
  data: any,
  token?: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(data),
    ...config,
  });
};

export const apiPatch = <T = any>(
  url: string,
  data: any,
  token?: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'PATCH',
    headers: createHeaders(token),
    body: JSON.stringify(data),
    ...config,
  });
};
export const apiDelete = <T = any>(
  url: string,
  token?: string,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, {
    method: 'DELETE',
    headers: createHeaders(token),
    ...config,
  });
};
// useApi hook is exported from apiIntegration.tsx
export const apiBatchRequest = async <T = any>(
  requests: Array<{
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
  }>,
  token?: string
): Promise<ApiResponse<T[]>> => {
  try {
    const responses = await Promise.all(
      requests.map((req) => {
        switch (req.method || 'GET') {
          case 'POST':
            return apiPost(req.url, req.data, token);
          case 'PUT':
            return apiPut(req.url, req.data, token);
          case 'DELETE':
            return apiDelete(req.url, token);
          case 'GET':
          default:
            return apiGet(req.url, token);
        }
      })
    );

    const allSuccess = responses.every((r) => r.success);
    const data = responses
      .filter((r) => r.success)
      .map((r) => r.data)
      .filter(Boolean) as T[];

    return {
      success: allSuccess,
      data: allSuccess ? data : undefined,
      error: allSuccess ? undefined : 'One or more requests failed',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Batch request failed',
    };
  }
};
export const apiRetry = async <T = any>(
  fn: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  delay = 1000
): Promise<ApiResponse<T>> => {
  let lastError: ApiResponse<T> | null = null;

  for (let i = 0; i < maxRetries; i++) {
    const response = await fn();

    if (response.success) {
      return response;
    }

    lastError = response;

    if (i < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  return lastError || { success: false, error: 'Max retries exceeded' };
};

export default {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiBatchRequest,
  apiRetry,
  createHeaders,
};
