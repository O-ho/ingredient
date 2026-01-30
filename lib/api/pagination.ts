/** REST API pagination 쿼리 파라미터 */
export interface PaginationParams {
  page: number;
  size: number;
}

/** 기본 pagination (page=1, size=10) */
export const defaultPagination: PaginationParams = {
  page: 1,
  size: 10,
};

/** API 기본 pagination 응답 형태 (백엔드 스펙에 맞게 수정) */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/** PaginationParams → URL searchParams 변환 */
export function toSearchParams(params: PaginationParams): URLSearchParams {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("size", String(params.size));
  return sp;
}

/** URL searchParams → PaginationParams 파싱 (유효하지 않으면 기본값) */
export function parseSearchParams(
  searchParams: URLSearchParams | Readonly<URLSearchParams>
): PaginationParams {
  const pageRaw = searchParams.get("page");
  const sizeRaw = searchParams.get("size");
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const size = Math.min(
    100,
    Math.max(1, parseInt(sizeRaw ?? String(defaultPagination.size), 10) || defaultPagination.size)
  );
  return { page, size };
}

/** baseUrl + pagination 쿼리스트링 반환 */
export function paginatedUrl(
  baseUrl: string,
  params: PaginationParams,
  extra?: Record<string, string>
): string {
  const sp = toSearchParams(params);
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => sp.set(k, v));
  }
  const qs = sp.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}
