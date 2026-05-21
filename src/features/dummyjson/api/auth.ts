import { dummyJsonRequest } from "./client";
import type { AuthUser, LoginPayload, LoginResponse } from "../types";

export const loginUser = async (payload: LoginPayload) => {
  return dummyJsonRequest<LoginResponse>("/user/login", {
    method: "POST",
    body: JSON.stringify({
      username: payload.username,
      password: payload.password,
      expiresInMins: payload.expiresInMins ?? 30,
    }),
  });
};

export const getAuthUser = async (token: string) => {
  return dummyJsonRequest<AuthUser>("/user/me", {
    method: "GET",
    token,
    credentials: "include",
  });
};

