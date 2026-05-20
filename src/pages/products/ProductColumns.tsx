import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { Product } from "./type";

const ProductColumns = () => {
  return useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
    ],
    [],
  );
};

export default ProductColumns;
