"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import {
  parseSearchParams,
  type PaginationParams,
} from "@/lib/api/pagination";
import type { User } from "@/mocks/handlers";

const statusColors: Record<User["status"], string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const roleColors: Record<User["role"], string> = {
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  user: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const roleLabels: Record<User["role"], string> = {
  admin: "관리자",
  manager: "매니저",
  user: "사용자",
};

const statusLabels: Record<User["status"], string> = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
};

export default function UserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams]
  );

  const updateUrl = (next: PaginationParams) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(next.page));
    sp.set("size", String(next.size));
    router.replace(`${pathname}?${sp.toString()}`);
  };

  /** URL에 검색어(q) 반영 (검색 시 페이지는 1로) */
  const searchQuery = searchParams.get("q") ?? "";
  const setSearchInUrl = (q: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (q) {
      sp.set("q", q);
      sp.set("page", "1");
    } else {
      sp.delete("q");
    }
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const { data, isPending, error } = usePaginatedQuery<User>({
    path: "/users",
    params,
  });

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue<number>()}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "이름",
        size: 120,
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "이메일",
        size: 200,
        cell: ({ getValue }) => (
          <span className="text-sm text-text-muted">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "역할",
        size: 100,
        cell: ({ getValue }) => {
          const role = getValue<User["role"]>();
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}
            >
              {roleLabels[role]}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "상태",
        size: 100,
        cell: ({ getValue }) => {
          const status = getValue<User["status"]>();
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
              {statusLabels[status]}
            </span>
          );
        },
      },
      {
        accessorKey: "department",
        header: "부서",
        size: 120,
      },
      {
        accessorKey: "phone",
        header: "연락처",
        size: 130,
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "joinDate",
        header: "입사일",
        size: 110,
        cell: ({ getValue }) => (
          <span className="text-sm">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "lastLogin",
        header: "마지막 로그인",
        size: 160,
        cell: ({ getValue }) => {
          const date = new Date(getValue<string>());
          return (
            <span className="text-sm text-text-muted">
              {date.toLocaleString("ko-KR")}
            </span>
          );
        },
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">
          에러: {String(error)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">
            사용자 관리
          </h1>
          <p className="text-text-muted">
            전체 {data?.totalElements ?? 0}명의 사용자
          </p>
        </div>

        {/* DataTable */}
        <DataTable<User>
          data={data?.content ?? []}
          columns={columns}
          isLoading={isPending}
          searchable={true}
          searchPlaceholder="이름, 이메일, 부서 검색..."
          sortable={true}
          emptyMessage="사용자가 없습니다."
          searchQuery={searchQuery}
          onSearchSubmit={setSearchInUrl}
        />

        {/* Pagination */}
        {data && (
          <div className="mt-6">
            <TablePagination
              page={params.page}
              size={params.size}
              totalElements={data.totalElements}
              totalPages={data.totalPages}
              isFirst={data.first}
              isLast={data.last}
              onPageChange={(page) => updateUrl({ ...params, page })}
              onSizeChange={(size) => updateUrl({ page: 1, size })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
