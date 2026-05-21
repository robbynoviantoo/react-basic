export type Product = {
    id: number
    title: string
    price: number
    stock: number
    category: string
    description: string
    thumbnail: string
}

export type ProductResponse = {
    products: Product[],
    total: number,
    skip: number,
    limit: number
}

export type ProductParams = {
    limit?: number
    skip?: number
    q?: string
}

export type ProductStockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock"

export type ProductSortField = "title" | "price" | "stock" | "category"

export type ProductSortOrder = "asc" | "desc"
