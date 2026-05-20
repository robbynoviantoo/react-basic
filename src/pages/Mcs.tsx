import { Fragment, useEffect, useMemo, useState } from "react";
import Barcode from "react-barcode";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LoaderCircle, SearchIcon } from "lucide-react";

type McsData = {
  id: number;
  name: string;
  kategori: string;
  barcode: string;
  status: string;
  no_id_qip: string;
  no_id_dev: string;
  season: string | null;
  nama_model: string;
  warna: string;
  artikel: string;
  gender: string;
  size: string;
  factory: string;
  no_rak: string;
  current_borrower_name: string | null;
};

type McsResponse = {
  current_page: number;
  data: McsData[];
  last_page: number;
  per_page: number;
  total: number;
};

type McsParams = {
  page?: number;
  status?: string;
  kategori?: string;
  q?: string;
  per_page?: number;
};

const kategoriOptions = ["QIP", "DEV", "INC", "PPIC"];
const statusOptions = ["available", "borrowed", "expired"];

const getMcs = async (params?: McsParams): Promise<McsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.status) {
    searchParams.append("status", params.status);
  }

  if (params?.kategori) {
    searchParams.append("kategori", params.kategori);
  }

  if (params?.q) {
    searchParams.append("q", params.q);
  }

  if (params?.per_page) {
    searchParams.append("per_page", params.per_page.toString());
  }

  const response = await fetch(
    `http://localhost/api/mcs?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 86|E2FEGXeqokpPxgtHT1H22lrjWc2QuuSAG4KwHKVM5aec2305`,
      },
    },
  );

  console.log("Status:", response.status);

  if (!response.ok) {
    throw new Error("Gagal mengambil data MCS");
  }

  const result = await response.json();
  return result as McsResponse;
};

const Mcs = () => {
  useEffect(() => {
    document.title = "Home";
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

  const columns = useMemo<ColumnDef<McsData>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Nama",
      },
      {
        accessorKey: "kategori",
        header: "Kategori",
      },
      {
        accessorKey: "artikel",
        header: "Artikel",
      },
      {
        id: "barcode",
        accessorKey: "no_id_qip",
        header: "Barcode",
        cell: (info) => (
          <div className="flex w-full justify-center">
            <Barcode
              value={String(info.getValue() ?? "")}
              width={1.5}
              height={50}
              fontSize={10}
              margin={0}
            />
          </div>
        ),
      },
      {
        accessorKey: "no_id_qip",
        header: "Code",
      },
      {
        accessorKey: "nama_model",
        header: "Nama Model",
      },
      {
        accessorKey: "current_borrower_name",
        header: "Peminjam",
        cell: (info) => info.getValue() ?? "-",
      },
    ],
    [],
  );

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

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageNumbers = useMemo(() => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, index) => index);
    }

    const start = Math.max(0, currentPage - 2);
    const end = Math.min(pageCount - 1, currentPage + 2);
    const pages = new Set([0, pageCount - 1]);

    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, pageCount]);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto mt-15 max-w-9/10 rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Daftar MCS</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ambil dari QIP Apps
          </p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Combobox
              items={kategoriOptions}
              value={kategoriFilter || null}
              onValueChange={(value) => {
                setKategoriFilter(value ?? "");
                table.setPageIndex(0);
              }}
            >
              <ComboboxInput placeholder="Select a category" showClear />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Combobox
              items={statusOptions}
              value={statusFilter || null}
              onValueChange={(value) => {
                setStatusFilter(value ?? "");
                table.setPageIndex(0);
              }}
            >
              <ComboboxInput placeholder="Select a status" showClear />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <InputGroup className="mb-4 max-w-sm">
            <InputGroupInput
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
                table.setPageIndex(0);
              }}
              placeholder="Search..."
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </div>
        ) : (
          <>
            <div className="relative">
              {isFetching && !isInitialLoading ? (
                <div className="absolute right-3 top-3 z-10 rounded-md border bg-background/90 px-2 py-1 text-muted-foreground shadow-sm">
                  <LoaderCircle className="size-4 animate-spin" />
                </div>
              ) : null}

              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {isInitialLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center text-muted-foreground"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <LoaderCircle className="size-5 animate-spin" />
                          <span>Mengambil data mcs...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Data tidak ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {!isInitialLoading ? (
              <div className="mt-5 flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  Menampilkan{" "}
                  <span className="font-medium text-foreground">
                    {table.getRowModel().rows.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium text-foreground">
                    {mcsResponse?.total ?? 0}
                  </span>{" "}
                  data
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    Per halaman
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(event) => {
                        table.setPageSize(Number(event.target.value));
                      }}
                      className="h-8 rounded-md border bg-background px-2 text-foreground"
                    >
                      {[5, 10, 20].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          text="Sebelumnya"
                          className={
                            !table.getCanPreviousPage()
                              ? "pointer-events-none opacity-50"
                              : undefined
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            table.previousPage();
                          }}
                        />
                      </PaginationItem>

                      {pageNumbers.map((index, itemIndex) => (
                        <Fragment key={index}>
                          {itemIndex > 0 &&
                          index - pageNumbers[itemIndex - 1] > 1 ? (
                            <PaginationItem>
                              <span className="flex h-9 items-center px-3 text-sm text-muted-foreground">
                                ...
                              </span>
                            </PaginationItem>
                          ) : null}
                          <PaginationItem key={index}>
                            <PaginationLink
                              href="#"
                              isActive={
                                index === table.getState().pagination.pageIndex
                              }
                              onClick={(event) => {
                                event.preventDefault();
                                table.setPageIndex(index);
                              }}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        </Fragment>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          text="Berikutnya"
                          className={
                            !table.getCanNextPage()
                              ? "pointer-events-none opacity-50"
                              : undefined
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            table.nextPage();
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
};

export default Mcs;
