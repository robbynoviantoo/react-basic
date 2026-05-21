import { dummyJsonRequest, toSearchParams } from "./client";
import type { AddCartPayload, CartsResponse, DummyJsonCart } from "../types";

export const getCarts = async (params: { limit?: number; skip?: number } = {}) => {
  const queryString = toSearchParams({
    limit: params.limit ?? 10,
    skip: params.skip ?? 0,
  });

  return dummyJsonRequest<CartsResponse>(`/carts${queryString}`);
};

export const getUserCarts = async (userId: number) => {
  return dummyJsonRequest<CartsResponse>(`/carts/user/${userId}`);
};

export const addCart = async (payload: AddCartPayload) => {
  return dummyJsonRequest<DummyJsonCart>("/carts/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

