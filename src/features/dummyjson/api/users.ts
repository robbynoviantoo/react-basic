import { dummyJsonRequest, toSearchParams } from "./client";
import type { ApiListParams, UsersResponse } from "../types";

export const getUsers = async (params: ApiListParams = {}) => {
  const q = params.q?.trim();
  const queryString = toSearchParams({
    limit: params.limit ?? 10,
    skip: params.skip ?? 0,
    sortBy: params.sortBy,
    order: params.order,
    q,
  });

  return dummyJsonRequest<UsersResponse>(
    q ? `/users/search${queryString}` : `/users${queryString}`,
  );
};

