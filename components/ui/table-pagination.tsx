"use client";

export interface TablePaginationProps {
  /** 현재 페이지 (1-based) */
  page: number;
  /** 페이지 크기 */
  size: number;
  /** 전체 아이템 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 첫 페이지 여부 */
  isFirst?: boolean;
  /** 마지막 페이지 여부 */
  isLast?: boolean;
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void;
  /** 페이지 크기 변경 콜백 */
  onSizeChange?: (size: number) => void;
  /** 페이지 크기 옵션 */
  sizeOptions?: number[];
}

export function TablePagination({
  page,
  size,
  totalElements,
  totalPages,
  isFirst = page === 1,
  isLast = page >= totalPages,
  onPageChange,
  onSizeChange,
  sizeOptions = [10, 20, 50],
}: TablePaginationProps) {
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, totalElements);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <span className="text-sm text-text-muted">
          {totalElements}개 중 {start}~{end} 표시
        </span>
        {onSizeChange && (
          <div className="flex gap-2 items-center text-text-muted text-sm">
            <span>페이지 크기:</span>
            <select
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 rounded bg-bg-elevated border border-border text-text"
            >
              {sizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={isFirst}
          className="px-3 py-2 rounded bg-bg-elevated border border-border text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover transition-colors"
        >
          처음
        </button>
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={isFirst}
          className="px-3 py-2 rounded bg-bg-elevated border border-border text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover transition-colors"
        >
          이전
        </button>
        <span className="px-4 py-2 text-text">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={isLast}
          className="px-3 py-2 rounded bg-bg-elevated border border-border text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover transition-colors"
        >
          다음
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={isLast}
          className="px-3 py-2 rounded bg-bg-elevated border border-border text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover transition-colors"
        >
          마지막
        </button>
      </div>
    </div>
  );
}
