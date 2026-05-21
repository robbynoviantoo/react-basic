import { Button } from "@/components/ui/button";

type ResourcePaginationProps = {
  total: number;
  pageIndex: number;
  pageSize: number;
  shown: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const ResourcePagination = ({
  total,
  pageIndex,
  pageSize,
  shown,
  onPageIndexChange,
  onPageSizeChange,
}: ResourcePaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="mt-5 flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">{shown}</span> dari{" "}
        <span className="font-medium text-foreground">{total}</span> data
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Per halaman
          <select
            value={pageSize}
            onChange={(event) => {
              onPageSizeChange(Number(event.target.value));
              onPageIndexChange(0);
            }}
            className="h-8 rounded-md border bg-background px-2 text-foreground"
          >
            {[5, 10, 20, 30].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pageIndex === 0}
            onClick={() => onPageIndexChange(pageIndex - 1)}
          >
            Sebelumnya
          </Button>
          <span className="min-w-20 text-center text-sm text-muted-foreground">
            {pageIndex + 1} / {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={pageIndex + 1 >= pageCount}
            onClick={() => onPageIndexChange(pageIndex + 1)}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePagination;

