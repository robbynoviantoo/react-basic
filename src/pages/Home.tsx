import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
  }
}

const getUsers = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")

  if (!response.ok) {
    throw new Error("Gagal mengambil data user")
  }

  return response.json() as Promise<User[]>
}

const Home = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const {
    data: users = [],
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama",
      },
      {
        accessorKey: "username",
        header: "Username",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Telepon",
      },
      {
        accessorKey: "company.name",
        header: "Perusahaan",
        cell: ({ row }) => row.original.company.name,
      },
      {
        accessorKey: "website",
        header: "Website",
        cell: ({ row }) => (
          <a
            href={`https://${row.original.website}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {row.original.website}
          </a>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: users,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto mt-15 max-w-7xl rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Contoh API Table + Query Cache
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Daftar User</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Data ini diambil dari JSONPlaceholder, lalu dirender memakai
            shadcn/ui Table, TanStack React Table, dan TanStack Query untuk
            caching.
          </p>
          {isFetching && !isLoading ? (
            <p className="mt-2 text-xs font-medium text-primary">
              Sedang refresh data di background...
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Mengambil data user...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

            <div className="mt-5 flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan{" "}
                <span className="font-medium text-foreground">
                  {table.getRowModel().rows.length}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">
                  {users.length}
                </span>{" "}
                data
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  Per halaman
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(event) => {
                      table.setPageSize(Number(event.target.value))
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
                          event.preventDefault()
                          table.previousPage()
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: table.getPageCount() }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={index === table.getState().pagination.pageIndex}
                          onClick={(event) => {
                            event.preventDefault()
                            table.setPageIndex(index)
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
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
                          event.preventDefault()
                          table.nextPage()
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        )}
      </section>

    </main>
  )
}

export default Home
