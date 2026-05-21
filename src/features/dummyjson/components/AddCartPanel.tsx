import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { LoaderCircle, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { addCart } from "../api/carts";
import { getProductOptions } from "../api/products";
import type { AddCartPayload } from "../types";

type DraftCartItem = {
  rowId: string;
  productId: number;
  quantity: number;
};

const AddCartPanel = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(1);
  const [items, setItems] = useState<DraftCartItem[]>([
    { rowId: crypto.randomUUID(), productId: 1, quantity: 1 },
  ]);

  const productsQuery = useQuery({
    queryKey: ["dummyjson-product-options"],
    queryFn: getProductOptions,
  });

  const productOptions = useMemo(
    () => productsQuery.data?.products ?? [],
    [productsQuery.data?.products],
  );

  const productIds = useMemo(
    () => productOptions.map((product) => String(product.id)),
    [productOptions],
  );

  const addCartMutation = useMutation({
    mutationFn: addCart,
    onSuccess: (cart) => {
      queryClient.invalidateQueries({ queryKey: ["dummyjson-carts"] });
      Swal.fire({
        title: "Cart dibuat",
        text: `Cart simulasi #${cart.id} dibuat untuk user ${cart.userId}.`,
        icon: "success",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Gagal add cart",
        text: error instanceof Error ? error.message : "Request add cart gagal.",
        icon: "error",
      });
    },
  });

  const updateItem = (rowId: string, patch: Partial<DraftCartItem>) => {
    setItems((current) =>
      current.map((item) =>
        item.rowId === rowId ? { ...item, ...patch } : item,
      ),
    );
  };

  const removeItem = (rowId: string) => {
    setItems((current) => current.filter((item) => item.rowId !== rowId));
  };

  const payload: AddCartPayload = {
    userId,
    products: items
      .filter((item) => item.productId > 0 && item.quantity > 0)
      .map((item) => ({
        id: item.productId,
        quantity: item.quantity,
      })),
  };

  const canSubmit = payload.userId > 0 && payload.products.length > 0;

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">Add Cart</h2>
        <p className="text-sm text-muted-foreground">
          Simulasi POST ke DummyJSON carts/add dengan user dan produk terpilih.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          addCartMutation.mutate(payload);
        }}
      >
        <label className="block max-w-xs space-y-1 text-sm">
          <span className="font-medium">User ID</span>
          <Input
            type="number"
            min={1}
            value={userId}
            onChange={(event) => setUserId(Number(event.target.value))}
          />
        </label>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="w-36">Quantity</TableHead>
              <TableHead className="w-16 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const product = productOptions.find(
                (option) => option.id === item.productId,
              );

              return (
                <TableRow key={item.rowId}>
                  <TableCell>
                    <Combobox
                      items={productIds}
                      value={String(item.productId)}
                      onValueChange={(value) =>
                        updateItem(item.rowId, {
                          productId: Number(value ?? 0),
                        })
                      }
                    >
                      <ComboboxInput
                        className="w-full"
                        disabled={productsQuery.isLoading}
                        placeholder="Pilih produk"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>Produk tidak ditemukan.</ComboboxEmpty>
                        <ComboboxList>
                          {(productId) => {
                            const option = productOptions.find(
                              (candidate) => String(candidate.id) === productId,
                            );

                            return (
                              <ComboboxItem key={productId} value={productId}>
                                {option?.title ?? `Product ${productId}`}
                              </ComboboxItem>
                            );
                          }}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {product ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        #{product.id} - ${product.price}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(item.rowId, {
                          quantity: Number(event.target.value),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.rowId)}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setItems((current) => [
                ...current,
                { rowId: crypto.randomUUID(), productId: 1, quantity: 1 },
              ])
            }
          >
            <Plus />
            Tambah item
          </Button>

          <Button type="submit" disabled={!canSubmit || addCartMutation.isPending}>
            {addCartMutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <ShoppingCart />
            )}
            Add cart
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AddCartPanel;

