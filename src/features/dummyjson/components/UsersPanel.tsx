import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowDownAZ, ArrowUpAZ, LoaderCircle, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsers } from "../api/users";
import ResourcePagination from "./ResourcePagination";

const sortFields = ["firstName", "lastName", "email", "age", "role"];
const sortOrders = ["asc", "desc"] as const;

const UsersPanel = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortBy, setSortBy] = useState("firstName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, error, isFetching } = useQuery({
    queryKey: ["dummyjson-users", globalFilter, sortBy, order, pageIndex, pageSize],
    queryFn: () =>
      getUsers({
        q: globalFilter,
        sortBy,
        order,
        limit: pageSize,
        skip: pageIndex * pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const users = data?.users ?? [];

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">
          Get all users, search, pagination, dan sort dari DummyJSON.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Combobox items={sortFields} value={sortBy} onValueChange={(value) => {
            setSortBy(value ?? "firstName");
            setPageIndex(0);
          }}>
            <ComboboxInput className="w-full sm:w-44" placeholder="Sort field" />
            <ComboboxContent>
              <ComboboxEmpty>Field tidak ditemukan.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Combobox items={[...sortOrders]} value={order} onValueChange={(value) => {
            setOrder((value ?? "asc") as "asc" | "desc");
            setPageIndex(0);
          }}>
            <ComboboxInput className="w-full sm:w-40" placeholder="Order" />
            <ComboboxContent>
              <ComboboxEmpty>Order tidak ditemukan.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    <span className="flex items-center gap-2">
                      {item === "asc" ? <ArrowUpAZ /> : <ArrowDownAZ />}
                      {item.toUpperCase()}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <InputGroup className="w-full sm:w-72">
            <InputGroupInput
              value={globalFilter}
              onChange={(event) => {
                setGlobalFilter(event.target.value);
                setPageIndex(0);
              }}
              placeholder="Cari user..."
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setGlobalFilter("");
              setSortBy("firstName");
              setOrder("asc");
              setPageIndex(0);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Gagal mengambil users"}
        </div>
      ) : (
        <div className="relative">
          {isFetching ? (
            <div className="absolute right-3 top-3 z-10 rounded-md border bg-background/90 px-2 py-1 text-muted-foreground shadow-sm">
              <LoaderCircle className="size-4 animate-spin" />
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="size-10 rounded-full border bg-muted"
                      />
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>
                    {user.address.city}, {user.address.stateCode}
                  </TableCell>
                  <TableCell>{user.company.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ResourcePagination
            total={data?.total ?? 0}
            shown={users.length}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageIndexChange={setPageIndex}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
    </section>
  );
};

export default UsersPanel;

