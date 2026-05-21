const DUMMYJSON_BASE_URL = "https://dummyjson.com";

type RequestOptions = RequestInit & {
  token?: string | null;
};

export const dummyJsonRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${DUMMYJSON_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    const message =
      typeof result?.message === "string"
        ? result.message
        : "DummyJSON request failed";

    throw new Error(message);
  }

  return result as T;
};

export const toSearchParams = (
  params: Record<string, string | number | undefined>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

