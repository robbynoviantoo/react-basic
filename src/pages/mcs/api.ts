import type { McsParams, McsResponse } from "./types";

export const getMcs = async (params?: McsParams): Promise<McsResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  if (params?.status) {
    searchParams.append("status", params.status);
  }

  if (params?.kategori) {
    searchParams.append("kategori", params.kategori);
  }

  if (params?.q) {
    searchParams.append("q", params.q);
  }

  if (params?.per_page) {
    searchParams.append("per_page", params.per_page.toString());
  }

  const response = await fetch(
    `http://localhost/api/mcs?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 86|E2FEGXeqokpPxgtHT1H22lrjWc2QuuSAG4KwHKVM5aec2305`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal mengambil data MCS");
  }

  const result = await response.json();
  return result as McsResponse;
};
