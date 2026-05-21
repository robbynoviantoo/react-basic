import type { ProductParams, ProductResponse } from "./type";

export const getProducts = async (params?: ProductParams): Promise<ProductResponse> => {
    const searchParams = new URLSearchParams();
    const q = params?.q?.trim();

    if (params?.limit) {
        searchParams.append("limit", params.limit.toString());
    }

    if (params?.skip) {
        searchParams.append("skip", params.skip.toString());
    }

    if (q) {
        searchParams.append("q", q);
    }

    const endpoint = q
        ? "https://dummyjson.com/products/search"
        : "https://dummyjson.com/products";

    const response = await fetch(
        `${endpoint}?limit=0&${searchParams.toString()}`,
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

export const deleteProduct = async (id: number) => {
    const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Gagal menghapus produk");
    }

    return response.json();
}
