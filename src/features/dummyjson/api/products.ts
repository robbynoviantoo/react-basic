import { dummyJsonRequest } from "./client";
import type { ProductsResponse } from "../types";

export const getProductOptions = async () => {
  return dummyJsonRequest<ProductsResponse>(
    "/products?limit=0&select=id,title,price,thumbnail",
  );
};

