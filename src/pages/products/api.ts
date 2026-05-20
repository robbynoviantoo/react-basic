import type { ProductParams, ProductResponse } from "./type";

export const getProducts = async (params?: ProductParams): Promise<ProductResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.limit) {
        searchParams.append("limit", params.limit.toString());
    }

    if (params?.skip) {
        searchParams.append("skip", params.skip.toString());
    }

    if (params?.q) {
        searchParams.append("q", params.q);
    }

    const response = await fetch(
        `https://dummyjson.com/products?${searchParams.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    if (!response.ok) {
        throw new Error("Gagal mengambil data produk");
    }

    const result = await response.json();
    return result as ProductResponse;
}