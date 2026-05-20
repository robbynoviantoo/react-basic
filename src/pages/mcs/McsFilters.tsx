import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

import { kategoriOptions, statusOptions } from "./constants";

type McsFiltersProps = {
  globalFilter: string;
  kategoriFilter: string;
  statusFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onKategoriFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
};

const McsFilters = ({
  globalFilter,
  kategoriFilter,
  statusFilter,
  onGlobalFilterChange,
  onKategoriFilterChange,
  onStatusFilterChange,
}: McsFiltersProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Combobox
          items={kategoriOptions}
          value={kategoriFilter || null}
          onValueChange={(value) => onKategoriFilterChange(value ?? "")}
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
          onValueChange={(value) => onStatusFilterChange(value ?? "")}
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
          onChange={(event) => onGlobalFilterChange(event.target.value)}
          placeholder="Search..."
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default McsFilters;
