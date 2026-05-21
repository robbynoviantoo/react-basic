export type ApiListParams = {
  limit?: number;
  skip?: number;
  q?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export type DummyJsonUser = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  university: string;
  role: "admin" | "moderator" | "user";
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
  };
};

export type UsersResponse = {
  users: DummyJsonUser[];
  total: number;
  skip: number;
  limit: number;
};

export type LoginPayload = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type AuthUser = DummyJsonUser & {
  accessToken?: string;
  refreshToken?: string;
};

export type LoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type CartProduct = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal?: number;
  discountedPrice?: number;
  thumbnail: string;
};

export type DummyJsonCart = {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
};

export type CartsResponse = {
  carts: DummyJsonCart[];
  total: number;
  skip: number;
  limit: number;
};

export type AddCartPayload = {
  userId: number;
  products: {
    id: number;
    quantity: number;
  }[];
};

export type ProductOption = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export type ProductsResponse = {
  products: ProductOption[];
  total: number;
  skip: number;
  limit: number;
};

