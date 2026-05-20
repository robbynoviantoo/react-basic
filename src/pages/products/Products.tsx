import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import { getProducts } from "./api";
import ProductColumns from "./ProductColumns";
import ProductTable from "./ProductTable";


const Products = () => {
  useEffect(() => {
    document.title = "Daftar Produk";
  }, []);

  const { data: productsResponse, error, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      getProducts({
      }),
    placeholderData: keepPreviousData,
  });
  const products = productsResponse?.products ?? [];
  console.log(productsResponse);
  const isInitialLoading = !productsResponse && isFetching;
  const columns = ProductColumns();

  const table = useReactTable({
    data: products,
    columns,
    state: {
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <main className="min-h-screen bg-muted/30 py-10">
      <section className="mx-auto mt-15 max-w-9/10 rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Daftar Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ambil dari QIP Apps
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </div>
        ) : (
          <>
            <ProductTable
              table={table}
              columnsLength={columns.length}
              isInitialLoading={isInitialLoading}
              isFetching={isFetching}
            />

          </>
        )}
      </section>
    </main>
  )
}

export default Products
