import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { KeyRound, LoaderCircle, LogIn, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getAuthUser, loginUser } from "../api/auth";

const ACCESS_TOKEN_STORAGE_KEY = "dummyjson_access_token";

const AuthPanel = () => {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? "",
  );

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  }, [accessToken]);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      setAccessToken(result.accessToken);
      Swal.fire({
        title: "Login berhasil",
        text: `Selamat datang, ${result.firstName}.`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Login gagal",
        text: error instanceof Error ? error.message : "Credential tidak valid.",
        icon: "error",
      });
    },
  });

  const authUserQuery = useQuery({
    queryKey: ["dummyjson-auth-user", accessToken],
    queryFn: () => getAuthUser(accessToken),
    enabled: Boolean(accessToken),
  });

  const authUser = authUserQuery.data;

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Auth</h2>
        <p className="text-sm text-muted-foreground">
          Login user dan get current authenticated user memakai access token.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <form
          className="space-y-3 rounded-lg border bg-muted/20 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            loginMutation.mutate({ username, password });
          }}
        >
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Username</span>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="emilys"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Password</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="emilyspass"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
              Login
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!accessToken}
              onClick={() => authUserQuery.refetch()}
            >
              <UserRoundCheck />
              Get auth user
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={!accessToken}
              onClick={() => setAccessToken("")}
            >
              Clear token
            </Button>
          </div>
        </form>

        <div className="rounded-lg border p-4">
          {authUserQuery.isFetching ? (
            <div className="flex h-full min-h-36 items-center justify-center gap-2 text-muted-foreground">
              <LoaderCircle className="size-5 animate-spin" />
              Mengambil auth user...
            </div>
          ) : authUser ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img
                src={authUser.image}
                alt={`${authUser.firstName} ${authUser.lastName}`}
                className="size-20 rounded-xl border bg-muted"
              />
              <div className="min-w-0">
                <p className="text-lg font-semibold">
                  {authUser.firstName} {authUser.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{authUser.email}</p>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <span className="rounded-md bg-muted px-2 py-1">
                    Role: {authUser.role}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-1">
                    Username: {authUser.username}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-1">
                    City: {authUser.address.city}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-1">
                    Company: {authUser.company.name}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-36 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <KeyRound className="size-8" />
              <p className="text-sm">
                Login dulu untuk menyimpan token, lalu data auth user akan muncul di sini.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthPanel;

