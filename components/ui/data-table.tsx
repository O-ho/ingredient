"use client";
"use no memo";

import { useState, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type TableOptions,
  type RowSelectionState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

export interface DataTableProps<TData> {
  /** 테이블에 표시할 데이터 */
  data: TData[];
  /** 컬럼 정의 */
  columns: ColumnDef<TData, unknown>[];
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 검색 가능 여부 */
  searchable?: boolean;
  /** 검색 placeholder */
  searchPlaceholder?: string;
  /** 정렬 가능 여부 */
  sortable?: boolean;
  /** 행 선택 가능 여부 */
  selectable?: boolean;
  /** 선택된 행 변경 콜백 */
  onRowSelectionChange?: (rows: TData[]) => void;
  /** 추가 테이블 옵션 */
  tableOptions?: Partial<TableOptions<TData>>;
  /** 빈 데이터 메시지 */
  emptyMessage?: string;
  /** URL 등 외부에서 제어하는 검색어 (있으면 이 값으로 필터 적용, 새로고침 대응) */
  searchQuery?: string;
  /** 검색 적용 시 호출 (URL 업데이트용) */
  onSearchSubmit?: (query: string) => void;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  searchable = true,
  searchPlaceholder = "검색...",
  sortable = true,
  selectable = false,
  onRowSelectionChange,
  tableOptions,
  emptyMessage = "데이터가 없습니다.",
  searchQuery: searchQueryFromUrl,
  onSearchSubmit,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  /** 입력 중인 검색어 (input value) */
  const [searchInputValue, setSearchInputValue] = useState(
    searchQueryFromUrl ?? "",
  );
  /** 실제 테이블 필터에 적용된 검색어 (엔터/버튼 시에만 반영, 또는 URL searchQuery) */
  const [globalFilter, setGlobalFilter] = useState(searchQueryFromUrl ?? "");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /** URL 검색어가 바뀌면 입력값·필터 동기화 (새로고침 등). URL 제어 시에만 동기화 */
  useEffect(() => {
    if (searchQueryFromUrl === undefined) return;
    const q = searchQueryFromUrl ?? "";
    setSearchInputValue(q);
    setGlobalFilter(q);
  }, [searchQueryFromUrl]);

  const applySearch = useCallback(() => {
    const trimmed = searchInputValue.trim();
    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    } else {
      setGlobalFilter(trimmed);
    }
  }, [searchInputValue, onSearchSubmit]);

  /** 테이블에 적용할 검색어: URL 제어 시 searchQuery, 아니면 내부 globalFilter */
  const appliedFilter =
    searchQueryFromUrl !== undefined ? searchQueryFromUrl : globalFilter;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: appliedFilter,
      rowSelection,
    },
    enableSorting: sortable,
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      if (onRowSelectionChange) {
        const selectedRows = Object.keys(newSelection)
          .filter((key) => newSelection[key])
          .map((key) => data[parseInt(key)]);
        onRowSelectionChange(selectedRows);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...tableOptions,
  });

  return (
    <div className="space-y-4">
      {/* Search: 엔터 또는 검색 버튼 클릭 시에만 필터 적용 */}
      {searchable && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applySearch();
              }
            }}
            className="px-4 py-2 rounded-lg bg-bg-elevated border border-border text-text placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary w-64"
            aria-label="검색"
          />
          <button
            type="button"
            onClick={applySearch}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-bg-base font-medium hover:opacity-90 transition-opacity"
            aria-label="검색"
          >
            <Search className="w-4 h-4" />
            검색
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-elevated">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider transition-colors ${
                        sortable && header.column.getCanSort()
                          ? "cursor-pointer hover:bg-hover"
                          : ""
                      }`}
                      onClick={
                        sortable
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {sortable &&
                          ({
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ??
                            null)}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    로딩 중...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-hover transition-colors ${
                      row.getIsSelected() ? "bg-active" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-text">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
