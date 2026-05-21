import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { deleteProduct, getProducts } from "./api";
import useProductColumns from "./ProductColumns";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import ProductFilter from "./ProductFilter";
import type {
  Product,
  ProductResponse,
  ProductSortField,
  ProductSortOrder,
  ProductStockFilter,
} from "./type";

const Products = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Daftar Produk";
  }, []);

  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<ProductStockFilter>("all");
  const [sortField, setSortField] = useState<ProductSortField>("title");
  const [sortOrder, setSortOrder] = useState<ProductSortOrder>("asc");
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: sortField, desc: sortOrder === "desc" },
  ]);

  const {
    data: productsResponse,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["products", globalFilter],
    queryFn: () => getProducts({ q: globalFilter }),
    placeholderData: keepPreviousData,
  });

  const products = useMemo(
    () => productsResponse?.products ?? [],
    [productsResponse?.products],
  );
  const isInitialLoading = !productsResponse && isFetching;

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onMutate: (id) => {
      setDeletingProductId(id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<ProductResponse>(
        ["products", globalFilter],
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            products: current.products.filter((product) => product.id !== id),
            total: Math.max(0, current.total - 1),
          };
        },
      );

      Swal.fire({
        title: "Produk dihapus",
        text: "DummyJSON mengembalikan status delete berhasil.",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    },
    onError: (mutationError) => {
      Swal.fire({
        title: "Gagal menghapus",
        text:
          mutationError instanceof Error
            ? mutationError.message
            : "Terjadi kesalahan saat menghapus produk.",
        icon: "error",
      });
    },
    onSettled: () => {
      setDeletingProductId(null);
    },
  });

  const resetToFirstPage = useCallback(() => {
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));
  }, []);

  const handleDeleteProduct = useCallback(
    async (product: Product) => {
      const result = await Swal.fire({
        title: "Hapus produk?",
        text: `${product.title} akan dihapus dari daftar produk.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#dc2626",
      });

      if (result.isConfirmed) {
        deleteProductMutation.mutate(product.id);
      }
    },
    [deleteProductMutation],
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock > 10) ||
        (stockFilter === "low-stock" &&
          product.stock > 0 &&
          product.stock <= 10) ||
        (stockFilter === "out-of-stock" && product.stock === 0);

      return matchesCategory && matchesStock;
    });
  }, [categoryFilter, products, stockFilter]);

  const columns = useProductColumns({
    deletingProductId,
    onDelete: handleDeleteProduct,
  });

  // TanStack Table exposes imperative helpers that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: (updater) => {
      setSorting((current) => {
        const next =
          typeof updater === "function" ? updater(current) : updater;
        const primarySort = next[0];

        if (
          primarySort &&
          ["title", "price", "stock", "category"].includes(primarySort.id)
        ) {
          setSortField(primarySort.id as ProductSortField);
          setSortOrder(primarySort.desc ? "desc" : "asc");
        }

        return next;
      });
      resetToFirstPage();
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const syncSort = (field: ProductSortField, order: ProductSortOrder) => {
    setSorting([{ id: field, desc: order === "desc" }]);
    resetToFirstPage();
  };

  const resetFilters = () => {
    setGlobalFilter("");
    setCategoryFilter("");
    setStockFilter("all");
    setSortField("title");
    setSortOrder("asc");
    setSorting([{ id: "title", desc: false }]);
    resetToFirstPage();
  };

  return (
    <main className="min-h-screen bg-muted/30 py-10">
      <section className="mx-auto mt-15 max-w-9/10 rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Daftar Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ambil dari QIP Apps
          </p>
        </div>

        <ProductFilter
          categoryOptions={categoryOptions}
          categoryFilter={categoryFilter}
          globalFilter={globalFilter}
          sortField={sortField}
          sortOrder={sortOrder}
          stockFilter={stockFilter}
          onCategoryFilterChange={(value) => {
            setCategoryFilter(value);
            resetToFirstPage();
          }}
          onGlobalFilterChange={(value) => {
            setGlobalFilter(value);
            resetToFirstPage();
          }}
          onResetFilters={resetFilters}
          onSortFieldChange={(value) => {
            setSortField(value);
            syncSort(value, sortOrder);
          }}
          onSortOrderChange={(value) => {
            setSortOrder(value);
            syncSort(sortField, value);
          }}
          onStockFilterChange={(value) => {
            setStockFilter(value);
            resetToFirstPage();
          }}
        />
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

            {!isInitialLoading ? (
              <ProductPagination
                table={table}
                total={filteredProducts.length}
              />
            ) : null}
          </>
        )}
      </section>
    </main>
  );
};

export default Products;
