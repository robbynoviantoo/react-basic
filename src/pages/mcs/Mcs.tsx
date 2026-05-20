import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";

import { getMcs } from "./api";
import { useMcsColumns } from "./McsColumns";
import McsFilters from "./McsFilters";
import McsPagination from "./McsPagination";
import McsTable from "./McsTable";

const Mcs = () => {
  useEffect(() => {
    document.title = "Daftar MCS";
  }, []);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: mcsResponse,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "mcs",
      pagination.pageIndex,
      pagination.pageSize,
      globalFilter,
      kategoriFilter,
      statusFilter,
    ],
    queryFn: () =>
      getMcs({
        page: pagination.pageIndex + 1,
        q: globalFilter,
        kategori: kategoriFilter,
        status: statusFilter,
        per_page: pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const mcs = mcsResponse?.data ?? [];
  const isInitialLoading = !mcsResponse && isFetching;
  const columns = useMcsColumns();

  const table = useReactTable({
    data: mcs,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: mcsResponse?.last_page ?? -1,
    rowCount: mcsResponse?.total ?? 0,
  });

  const resetToFirstPage = () => {
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));
  };

  return (
    <main className="min-h-screen bg-muted/30 py-10">
      <section className="mx-auto mt-15 max-w-9/10 rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Daftar MCS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ambil dari QIP Apps
          </p>
        </div>

        <McsFilters
          globalFilter={globalFilter}
          kategoriFilter={kategoriFilter}
          statusFilter={statusFilter}
          onGlobalFilterChange={(value) => {
            setGlobalFilter(value);
            resetToFirstPage();
          }}
          onKategoriFilterChange={(value) => {
            setKategoriFilter(value);
            resetToFirstPage();
          }}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            resetToFirstPage();
          }}
        />

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </div>
        ) : (
          <>
            <McsTable
              table={table}
              columnsLength={columns.length}
              isInitialLoading={isInitialLoading}
              isFetching={isFetching}
            />

            {!isInitialLoading ? (
              <McsPagination table={table} total={mcsResponse?.total ?? 0} />
            ) : null}
          </>
        )}
      </section>
    </main>
  );
};

export default Mcs;
