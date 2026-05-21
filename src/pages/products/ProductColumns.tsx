import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Product } from "./type";

type ProductColumnsProps = {
  deletingProductId: number | null;
  onDelete: (product: Product) => void;
};

const sortableHeader = (label: string) => {
  return ({ column }: { column: { toggleSorting: (desc?: boolean) => void; getIsSorted: () => false | "asc" | "desc" } }) => {
    const sorted = column.getIsSorted();

    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        {label}
        <span className="text-xs text-muted-foreground">
          {sorted === "asc" ? "ASC" : sorted === "desc" ? "DESC" : ""}
        </span>
      </Button>
    );
  };
};

const useProductColumns = ({ deletingProductId, onDelete }: ProductColumnsProps) => {
  return useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "thumbnail",
        header: "Image",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <img
              src={row.original.thumbnail}
              alt={row.original.title}
              className="size-12 rounded-md border object-cover"
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: sortableHeader("Title"),
        cell: ({ row }) => (
          <div className="mx-auto max-w-64 text-left">
            <p className="font-medium">{row.original.title}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {row.original.description}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: sortableHeader("Category"),
        cell: ({ row }) => (
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {row.original.category}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: sortableHeader("Price"),
        cell: ({ row }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.price),
      },
      {
        accessorKey: "stock",
        header: sortableHeader("Stock"),
        cell: ({ row }) => {
          const stock = row.original.stock;
          const stockClassName =
            stock === 0
              ? "bg-destructive/10 text-destructive"
              : stock <= 10
                ? "bg-yellow-100 text-yellow-800"
                : "bg-emerald-100 text-emerald-800";

          return (
            <span className={`rounded-md px-2 py-1 text-xs font-medium ${stockClassName}`}>
              {stock}
            </span>
          );
        },
      },
      {
        id: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => {
          const product = row.original;
          const isDeleting = deletingProductId === product.id;

          return (
            <div className="flex h-full items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        `https://dummyjson.com/products/${product.id}`,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <ExternalLink />
                    Lihat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 />
                    {isDeleting ? "Menghapus..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [deletingProductId, onDelete],
  );
};

export default useProductColumns;
