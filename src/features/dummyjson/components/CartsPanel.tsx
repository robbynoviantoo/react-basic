import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LoaderCircle, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getCarts, getUserCarts } from "../api/carts";
import ResourcePagination from "./ResourcePagination";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const CartsPanel = () => {
  const [userIdFilter, setUserIdFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const userId = Number(userIdFilter);
  const isUserFilterActive = Number.isInteger(userId) && userId > 0;

  const { data, error, isFetching } = useQuery({
    queryKey: ["dummyjson-carts", userIdFilter, pageIndex, pageSize],
    queryFn: () =>
      isUserFilterActive
        ? getUserCarts(userId)
        : getCarts({ limit: pageSize, skip: pageIndex * pageSize }),
    placeholderData: keepPreviousData,
  });

  const carts = data?.carts ?? [];

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Carts</h2>
        <p className="text-sm text-muted-foreground">
          Get all carts, get carts by user, dan ringkasan produk di tiap cart.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="w-full sm:w-72">
          <InputGroupInput
            type="number"
            min={1}
            value={userIdFilter}
            onChange={(event) => {
              setUserIdFilter(event.target.value);
              setPageIndex(0);
            }}
            placeholder="Filter user ID..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setUserIdFilter("");
            setPageIndex(0);
          }}
        >
          Reset
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Gagal mengambil carts"}
        </div>
      ) : (
        <div className="relative">
          {isFetching ? (
            <div className="absolute right-3 top-3 z-10 rounded-md border bg-background/90 px-2 py-1 text-muted-foreground shadow-sm">
              <LoaderCircle className="size-4 animate-spin" />
            </div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Discounted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart) => (
                <TableRow key={cart.id}>
                  <TableCell className="font-medium">#{cart.id}</TableCell>
                  <TableCell>User {cart.userId}</TableCell>
                  <TableCell>
                    <div className="max-w-96 whitespace-normal">
                      {cart.products.slice(0, 3).map((product) => (
                        <span
                          key={product.id}
                          className="mr-1 inline-flex rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {product.title} x{product.quantity}
                        </span>
                      ))}
                      {cart.products.length > 3 ? (
                        <span className="text-xs text-muted-foreground">
                          +{cart.products.length - 3} lainnya
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{cart.totalQuantity}</TableCell>
                  <TableCell>{formatCurrency(cart.total)}</TableCell>
                  <TableCell>{formatCurrency(cart.discountedTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!isUserFilterActive ? (
            <ResourcePagination
              total={data?.total ?? 0}
              shown={carts.length}
              pageIndex={pageIndex}
              pageSize={pageSize}
              onPageIndexChange={setPageIndex}
              onPageSizeChange={setPageSize}
            />
          ) : (
            <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">
              Menampilkan {carts.length} cart untuk user {userId}.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default CartsPanel;

