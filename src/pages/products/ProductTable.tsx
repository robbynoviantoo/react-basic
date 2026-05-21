import { flexRender, type Table as ReactTable } from "@tanstack/react-table";

import { LoaderCircle } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Product } from "./type";

type ProductTableProps = {
  table: ReactTable<Product>;
  columnsLength: number;
  isInitialLoading: boolean;
  isFetching: boolean;
};

const ProductTable = ({
  table,
  isInitialLoading,
  isFetching,
  columnsLength,
}: ProductTableProps) => {
  return (
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
                colSpan={columnsLength}
                className="h-32 text-center text-muted-foreground"
              >
                <div className="flex items-center justify-center gap-2">
                  <LoaderCircle className="size-5 animate-spin" />
                  <span>Mengambil data produk...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="align-middle text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsLength}
                className="h-24 text-center text-muted-foreground"
              >
                Data tidak ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
