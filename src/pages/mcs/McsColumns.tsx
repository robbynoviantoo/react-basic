import { useMemo } from "react";
import Barcode from "react-barcode";
import { NavLink } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { McsData } from "./types";

export const useMcsColumns = () => {
  return useMemo<ColumnDef<McsData>[]>(
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
      {
        accessorKey: "no_rak",
        header: "No Rak",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
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
                <DropdownMenuItem asChild>
                  <NavLink to={`/mcs/${row.original.id}`}>Lihat</NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  );
};
