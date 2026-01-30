"use client";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type {
  TooltipContentProps,
  PieLabelRenderProps,
  PieSectorShapeProps,
} from "recharts";
import type {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

const COLORS = {
  primary: "#00F5FF",
  secondary: "#7B61FF",
  success: "#00E676",
  warning: "#FFB800",
  danger: "#FF3D71",
  muted: "#6B7280",
};

/** 다크/라이트 공통 대비 확보 툴팁 스타일 */
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#1F242C",
    border: "1px solid #484F58",
    borderRadius: "8px",
    color: "#F0F6FC",
    padding: "10px 14px",
  },
  labelStyle: { color: "#F0F6FC" },
  itemStyle: { color: "#F0F6FC" },
} as const;

type ChartTooltipProps = TooltipContentProps<ValueType, NameType> & {
  formatter?: (value: number) => string;
  labelSuffix?: string;
};

function ChartTooltip({
  active,
  payload,
  formatter,
  labelSuffix = "",
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  const value = typeof entry?.value === "number" ? entry.value : 0;
  const displayValue =
    formatter?.(value) ??
    (typeof value === "number" ? value.toLocaleString() : String(value ?? ""));

  return (
    <div
      className="rounded-lg border px-3.5 py-2.5 shadow-lg"
      style={{
        backgroundColor: TOOLTIP_STYLE.contentStyle.backgroundColor,
        borderColor: TOOLTIP_STYLE.contentStyle.border,
        color: TOOLTIP_STYLE.contentStyle.color,
      }}
    >
      <div
        className="text-sm font-medium"
        style={{ color: TOOLTIP_STYLE.labelStyle.color }}
      >
        {entry?.name ?? ""}
      </div>
      <div
        className="mt-0.5 text-sm"
        style={{ color: TOOLTIP_STYLE.itemStyle.color }}
      >
        {displayValue}
        {labelSuffix}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isPending, error } = useDashboardStats();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">
          에러: {String(error)}
        </div>
      </div>
    );
  }

  if (isPending || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-muted">로딩 중...</div>
      </div>
    );
  }

  // 회원 데이터
  const memberData = [
    {
      name: "계약 회원",
      value: data.members.contracted,
      color: COLORS.primary,
    },
    {
      name: "미계약 회원",
      value: data.members.total - data.members.contracted,
      color: COLORS.muted,
    },
  ];

  // 투자금액 데이터
  const investmentData = [
    {
      name: "투자금액",
      value: data.investment.depositedAmount,
      color: COLORS.success,
    },
    {
      name: "대기 자금",
      value: data.investment.totalAmount - data.investment.depositedAmount,
      color: COLORS.warning,
    },
  ];

  // 계좌 데이터
  const accountData = [
    {
      name: "운용중 계좌",
      value: data.accounts.total - data.accounts.suspended,
      color: COLORS.secondary,
    },
    {
      name: "운용중지 계좌",
      value: data.accounts.suspended,
      color: COLORS.danger,
    },
  ];

  // 금액 포맷팅 함수
  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    }
    return value.toLocaleString();
  };

  // 커스텀 라벨 (PieLabel 타입: (props: PieLabelRenderProps) => ReactNode)
  const renderCustomLabel = (props: PieLabelRenderProps): string => {
    const percent = props.percent ?? 0;
    return `${(percent * 100).toFixed(1)}%`;
  };

  // Cell 대체: shape prop으로 섹터별 fill 적용 (Recharts 4.0 대비)
  const renderPieShape = (props: PieSectorShapeProps) => (
    <Sector
      {...props}
      fill={props.fill ?? (props as { color?: string }).color ?? "#808080"}
    />
  );

  return (
    <div className="min-h-screen p-8 bg-bg-base">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">대시보드</h1>
          <p className="text-text-muted">주요 지표 현황</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 회원 통계 */}
          <div className="bg-bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-text mb-1">
                회원 현황
              </h2>
              <p className="text-sm text-text-muted">
                전체 {data.members.total.toLocaleString()}명
              </p>
            </div>
            <div className="dashboard-pie-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={memberData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    shape={renderPieShape}
                  />
                  <Tooltip
                    content={(props) => (
                      <ChartTooltip
                        {...props}
                        formatter={(v) => (v ?? 0).toLocaleString()}
                        labelSuffix="명"
                      />
                    )}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-text-muted">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">계약 회원</span>
                <span className="font-semibold text-text">
                  {data.members.contracted.toLocaleString()}명
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-text-muted">미계약 회원</span>
                <span className="font-semibold text-text">
                  {(
                    data.members.total - data.members.contracted
                  ).toLocaleString()}
                  명
                </span>
              </div>
            </div>
          </div>

          {/* 투자금액 통계 */}
          <div className="bg-bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-text mb-1">
                투자금액 현황
              </h2>
              <p className="text-sm text-text-muted">
                총 {formatCurrency(data.investment.totalAmount)}원
              </p>
            </div>
            <div className="dashboard-pie-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={investmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    shape={renderPieShape}
                  />
                  <Tooltip
                    content={(props) => (
                      <ChartTooltip
                        {...props}
                        formatter={(v) =>
                          formatCurrency(typeof v === "number" ? v : 0)
                        }
                        labelSuffix="원"
                      />
                    )}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-text-muted">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">예치 금액</span>
                <span className="font-semibold text-text">
                  {formatCurrency(data.investment.depositedAmount)}원
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-text-muted">미예치 금액</span>
                <span className="font-semibold text-text">
                  {formatCurrency(
                    data.investment.totalAmount -
                      data.investment.depositedAmount,
                  )}
                  원
                </span>
              </div>
            </div>
          </div>

          {/* 계좌 통계 */}
          <div className="bg-bg-surface border border-border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-text mb-1">
                계좌 현황
              </h2>
              <p className="text-sm text-text-muted">
                전체 {data.accounts.total.toLocaleString()}개
              </p>
            </div>
            <div className="dashboard-pie-chart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accountData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    shape={renderPieShape}
                  />
                  <Tooltip
                    content={(props) => (
                      <ChartTooltip
                        {...props}
                        formatter={(v) => (v ?? 0).toLocaleString()}
                        labelSuffix="개"
                      />
                    )}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-text-muted">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">운용중 계좌</span>
                <span className="font-semibold text-text">
                  {(
                    data.accounts.total - data.accounts.suspended
                  ).toLocaleString()}
                  개
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-text-muted">운용중지 계좌</span>
                <span className="font-semibold text-text">
                  {data.accounts.suspended.toLocaleString()}개
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
