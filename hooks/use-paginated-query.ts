"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { PaginationParams, PaginatedResponse } from "@/lib/api/pagination";
import { getData } from "@/lib/api/axios";

export interface UsePaginatedQueryOptions<T, E = unknown>
  extends Omit<
    UseQueryOptions<PaginatedResponse<T>, E, PaginatedResponse<T>>,
    "queryKey" | "queryFn"
  > {
  /** API path (axios baseURL 기준, 예: '/users') */
  path: string;
  params: PaginationParams;
  /** 추가 쿼리 파라미터 (정렬, 필터 등) */
  extraParams?: Record<string, string>;
}

/**
 * REST API pagination (page, size) 기반 useQuery 훅. axios getData 사용.
 * - queryKey: [path, page, size, extraParams]
 * - queryFn: getData(path, { page, size, ...extraParams })
 *
 * @example
 * const [params, setParams] = useState(defaultPagination);
 * const { data, isPending, error } = usePaginatedQuery<User>({
 *   path: '/users',
 *   params,
 *   extraParams: { sort: 'createdAt,desc' },
 * });
 */
export function usePaginatedQuery<T, E = Error>({
  path,
  params,
  extraParams,
  ...queryOptions
}: UsePaginatedQueryOptions<T, E>) {
  const queryParams = {
    page: params.page,
    size: params.size,
    ...(extraParams ?? {}),
  };

  return useQuery<PaginatedResponse<T>, E>({
    queryKey: [path, params.page, params.size, extraParams ?? {}],
    queryFn: () =>
      getData<PaginatedResponse<T>>(path, queryParams),
    ...queryOptions,
  });
}
