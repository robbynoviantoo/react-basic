import { Fragment, useMemo } from "react";
import type { Table } from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { Product } from "./type";

type ProductPaginationProps = {
  table: Table<Product>;
  total: number;
};

const ProductPagination = ({ table, total }: ProductPaginationProps) => {
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
    <div className="mt-5 flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {table.getRowModel().rows.length}
        </span>{" "}
        dari <span className="font-medium text-foreground">{total}</span> data
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
                {itemIndex > 0 && index - pageNumbers[itemIndex - 1] > 1 ? (
                  <PaginationItem>
                    <span className="flex h-9 items-center px-3 text-sm text-muted-foreground">
                      ...
                    </span>
                  </PaginationItem>
                ) : null}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={index === table.getState().pagination.pageIndex}
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
  );
};

export default ProductPagination;
