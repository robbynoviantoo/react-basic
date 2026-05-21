import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowDownAZ, ArrowUpAZ, RotateCcw, SearchIcon } from "lucide-react";

import type {
  ProductSortField,
  ProductSortOrder,
  ProductStockFilter,
} from "./type";

const stockOptions: { label: string; value: ProductStockFilter }[] = [
  { label: "Semua stok", value: "all" },
  { label: "Tersedia", value: "in-stock" },
  { label: "Stok rendah", value: "low-stock" },
  { label: "Habis", value: "out-of-stock" },
];

const sortFieldOptions: { label: string; value: ProductSortField }[] = [
  { label: "Nama produk", value: "title" },
  { label: "Harga", value: "price" },
  { label: "Stok", value: "stock" },
  { label: "Kategori", value: "category" },
];

const sortOrderOptions: { label: string; value: ProductSortOrder }[] = [
  { label: "Ascending", value: "asc" },
  { label: "Descending", value: "desc" },
];

type ProductFilterProps = {
  categoryOptions: string[];
  categoryFilter: string;
  globalFilter: string;
  sortField: ProductSortField;
  sortOrder: ProductSortOrder;
  stockFilter: ProductStockFilter;
  onCategoryFilterChange: (value: string) => void;
  onGlobalFilterChange: (value: string) => void;
  onResetFilters: () => void;
  onSortFieldChange: (value: ProductSortField) => void;
  onSortOrderChange: (value: ProductSortOrder) => void;
  onStockFilterChange: (value: ProductStockFilter) => void;
};

const ProductFilter = ({
  categoryOptions,
  categoryFilter,
  globalFilter,
  sortField,
  sortOrder,
  stockFilter,
  onCategoryFilterChange,
  onGlobalFilterChange,
  onResetFilters,
  onSortFieldChange,
  onSortOrderChange,
  onStockFilterChange,
}: ProductFilterProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid gap-2 sm:grid-cols-2 lg:flex">
        <Combobox
          items={categoryOptions}
          value={categoryFilter || null}
          onValueChange={(value) => onCategoryFilterChange(value ?? "")}
        >
          <ComboboxInput
            className="w-full lg:w-52"
            placeholder="Kategori"
            showClear
          />
          <ComboboxContent>
            <ComboboxEmpty>Kategori tidak ditemukan.</ComboboxEmpty>
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
          items={stockOptions.map((item) => item.value)}
          value={stockFilter}
          onValueChange={(value) =>
            onStockFilterChange((value ?? "all") as ProductStockFilter)
          }
        >
          <ComboboxInput className="w-full lg:w-40" placeholder="Stok" />
          <ComboboxContent>
            <ComboboxEmpty>Status stok tidak ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {stockOptions.find((option) => option.value === item)?.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Combobox
          items={sortFieldOptions.map((item) => item.value)}
          value={sortField}
          onValueChange={(value) =>
            onSortFieldChange((value ?? "title") as ProductSortField)
          }
        >
          <ComboboxInput className="w-full lg:w-44" placeholder="Sort by" />
          <ComboboxContent>
            <ComboboxEmpty>Kolom sort tidak ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  {
                    sortFieldOptions.find((option) => option.value === item)
                      ?.label
                  }
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        <Combobox
          items={sortOrderOptions.map((item) => item.value)}
          value={sortOrder}
          onValueChange={(value) =>
            onSortOrderChange((value ?? "asc") as ProductSortOrder)
          }
        >
          <ComboboxInput className="w-full lg:w-40" placeholder="Order" />
          <ComboboxContent>
            <ComboboxEmpty>Urutan tidak ditemukan.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item} value={item}>
                  <span className="flex items-center gap-2">
                    {item === "asc" ? <ArrowUpAZ /> : <ArrowDownAZ />}
                    {
                      sortOrderOptions.find((option) => option.value === item)
                        ?.label
                    }
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <InputGroup className="w-full sm:w-72">
          <InputGroupInput
            value={globalFilter}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            placeholder="Cari produk..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Button type="button" variant="outline" onClick={onResetFilters}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;
