export type McsData = {
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

export type McsResponse = {
  current_page: number;
  data: McsData[];
  last_page: number;
  per_page: number;
  total: number;
};

export type McsParams = {
  page?: number;
  status?: string;
  kategori?: string;
  q?: string;
  per_page?: number;
};
