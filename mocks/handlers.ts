import { http, HttpResponse } from "msw";
import type { PaginatedResponse } from "@/lib/api/pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function buildPath(path: string): string {
  const base = API_BASE.replace(/\/$/, "");
  return base ? `${base}${path.startsWith("/") ? path : `/${path}`}` : path;
}

/** Paginated 목 데이터 생성 (공통) */
function createPaginatedMock<T>(
  path: string,
  createItem: (index: number) => T,
  totalCount = 100
) {
  return http.get(buildPath(path), ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const size = Math.min(50, Math.max(1, Number(url.searchParams.get("size")) || 10));
    const totalPages = Math.ceil(totalCount / size);
    const start = (page - 1) * size;
    const content = Array.from({ length: Math.min(size, totalCount - start) }, (_, i) =>
      createItem(start + i)
    );

    const body: PaginatedResponse<T> = {
      content,
      totalElements: totalCount,
      totalPages,
      size,
      number: page - 1,
      first: page === 1,
      last: page >= totalPages,
      empty: content.length === 0,
    };

    return HttpResponse.json({ data: body });
  });
}

/** User 타입 정의 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive" | "pending";
  department: string;
  phone: string;
  joinDate: string;
  lastLogin: string;
  createdAt: string;
}

const departments = ["개발팀", "디자인팀", "마케팅팀", "영업팀", "인사팀"];
const roles: User["role"][] = ["admin", "user", "manager"];
const statuses: User["status"][] = ["active", "inactive", "pending"];

/** /users 목록 (page, size) */
const userHandlers = [
  createPaginatedMock<User>("/users", (i) => {
    const now = new Date();
    const joinDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const lastLogin = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    return {
      id: i + 1,
      name: `사용자 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      department: departments[i % departments.length],
      phone: `010-${String(Math.floor(1000 + Math.random() * 9000))}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      joinDate: joinDate.toISOString().split("T")[0],
      lastLogin: lastLogin.toISOString(),
      createdAt: joinDate.toISOString(),
    };
  }, 150),
];

/** Dashboard 통계 타입 정의 */
export interface DashboardStats {
  members: {
    total: number;
    contracted: number;
  };
  investment: {
    totalAmount: number;
    depositedAmount: number;
  };
  accounts: {
    total: number;
    suspended: number;
  };
}

/** /dashboard/stats 엔드포인트 */
const dashboardHandlers = [
  http.get(buildPath("/dashboard/stats"), () => {
    const stats: DashboardStats = {
      members: {
        total: 1250,
        contracted: 892,
      },
      investment: {
        totalAmount: 15750000000, // 157.5억
        depositedAmount: 12340000000, // 123.4억
      },
      accounts: {
        total: 3420,
        suspended: 156,
      },
    };

    return HttpResponse.json({ data: stats });
  }),
];

export const handlers = [...userHandlers, ...dashboardHandlers];
