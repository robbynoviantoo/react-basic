import { useEffect } from "react";
import Barcode from "react-barcode";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { NavLink, useParams } from "react-router";

import { Button } from "@/components/ui/button";

type McsData = {
  id: number;
  name: string;
  kategori: string;
  barcode: string;
  status: string;
  no_id_qip: string;
  no_id_dev: string;
  season: string | null;
  nama_model: string;
  warna: string;
  artikel: string;
  gender: string;
  size: string;
  factory: string;
  no_rak: string;
  current_borrower_name: string | null;
};

const getMcsDetail = async (id: string): Promise<McsData> => {
  const response = await fetch(`http://localhost/api/mcs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 86|E2FEGXeqokpPxgtHT1H22lrjWc2QuuSAG4KwHKVM5aec2305`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil detail MCS");
  }

  const result = await response.json();

  return "data" in result ? result.data : result;
};

const McsDetail = () => {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Detail MCS";
  }, []);

  const {
    data: mcs,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["mcs-detail", id],
    queryFn: () => getMcsDetail(id as string),
    enabled: Boolean(id),
  });

  return (
    <main className="min-h-screen bg-muted/30 py-10">
      <section className="mx-auto mt-15 max-w-4xl rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detail MCS</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              ID: {id}
            </p>
          </div>
          <Button variant="outline" asChild>
            <NavLink to="/mcs">Kembali</NavLink>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" />
            <span>Mengambil detail mcs...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Terjadi kesalahan"}
          </div>
        ) : mcs ? (
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="flex items-center justify-center rounded-lg border p-4">
              <Barcode
                value={mcs.no_id_qip}
                width={1.5}
                height={60}
                fontSize={12}
                margin={0}
              />
            </div>

            <div className="grid gap-3 text-sm">
              {[
                ["Nama", mcs.name],
                ["Kategori", mcs.kategori],
                ["Status", mcs.status],
                ["Artikel", mcs.artikel],
                ["Code QIP", mcs.no_id_qip],
                ["Code Dev", mcs.no_id_dev],
                ["Season", mcs.season ?? "-"],
                ["Nama Model", mcs.nama_model],
                ["Warna", mcs.warna],
                ["Gender", mcs.gender],
                ["Size", mcs.size],
                ["Factory", mcs.factory],
                ["No Rak", mcs.no_rak],
                ["Peminjam", mcs.current_borrower_name ?? "-"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-3">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default McsDetail;
