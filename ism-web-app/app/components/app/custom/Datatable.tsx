import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import parse from "html-react-parser";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
  pagination: any;
  defaultSort: any;
  footerData?: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  tableData = [],
  pagination,
  defaultSort,
  footerData,
  className,
}: DataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useSearchParams();
  const pageNumber = pagination.page;
  const pageLength = pagination.length;
  const totalCount = pagination.totalCount;
  const orderBy = queryParams.get("orderBy");
  const orderDir = queryParams.get("orderDir");
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: defaultSort.id,
      desc: defaultSort.desc,
    },
  ]);
  const table = useReactTable({
    data: tableData,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    state: {
      sorting,
    },
  });
  const [onLoad, setOnLoad] = useState(true);
  useEffect(() => {
    if (!onLoad) {
      navigate(
        {
          search: setSearchParamsString(searchParams, {
            orderBy: sorting[0].id,
            orderDir: sorting[0].desc ? "desc" : "asc",
          }),
        },
        { preventScrollReset: true }
      );
    }
    setOnLoad(false);
  }, [sorting]);

  const [searchParams] = useSearchParams();
  return (
    <div>
      <div className={`rounded-md border ${className}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {footerData && parse(footerData)}
      </div>

      <div className="flex justify-end space-x-2 py-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pageNumber} of{" "}
              {Math.ceil(totalCount > 0 ? totalCount / pageLength : 1)}
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to={{
                  search: setSearchParamsString(searchParams, {
                    page: 1,
                  }),
                }}
                preventScrollReset
                prefetch="intent"
              >
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={pageNumber <= 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronFirst className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                to={{
                  search: setSearchParamsString(searchParams, {
                    page: pageNumber <= 1 ? 1 : +pageNumber - 1,
                  }),
                }}
                preventScrollReset
                prefetch="intent"
              >
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={pageNumber <= 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                to={{
                  search: setSearchParamsString(searchParams, {
                    page:
                      pageNumber >= Math.ceil(totalCount / pageLength)
                        ? Math.ceil(totalCount / pageLength)
                        : +pageNumber + 1,
                  }),
                }}
                preventScrollReset
                prefetch="intent"
              >
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={pageLength * pageNumber >= totalCount}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                to={{
                  search: setSearchParamsString(searchParams, {
                    page:Math.ceil(totalCount > 0 ? totalCount / pageLength : 1),
                  }),
                }}
                preventScrollReset
                prefetch="intent"
              >
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={pageLength * pageNumber >= totalCount}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function setSearchParamsString(
  searchParams: URLSearchParams,
  changes: Record<string, string | number | undefined>
) {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === "") {
      newSearchParams.delete(key);
      continue;
    }
    newSearchParams.set(key, String(value));
  }
  // Print string manually to avoid over-encoding the URL
  // Browsers are ok with $ nowadays
  // optional: return newSearchParams.toString()
  return Array.from(newSearchParams.entries())
    .map(([key, value]) =>
      value ? `${key}=${encodeURIComponent(value)}` : key
    )
    .join("&");
}
