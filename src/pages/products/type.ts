export type Product = {
    id: string
    title: string
    price: number
    stock: number
    category: string
    description: string
    image: string
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