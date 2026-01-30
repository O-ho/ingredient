"use client";

import React, { useState } from "react";

interface ColorItem {
  name: string;
  value: string;
  category: string;
  description?: string;
}

const darkModePalette: ColorItem[] = [
  // Background Colors
  {
    name: "background-deep-black",
    value: "#0A0B10",
    category: "Background",
    description: "전체 메인 배경",
  },
  {
    name: "background-surface-dark",
    value: "#161B22",
    category: "Background",
    description: "카드, 위젯, 테이블 본문 배경",
  },
  {
    name: "background-surface-light",
    value: "#1F242C",
    category: "Background",
    description: "테이블 헤더, 입력창 배경",
  },
  // Border Colors
  {
    name: "border-main",
    value: "#30363D",
    category: "Border",
    description: "일반 경계선",
  },
  {
    name: "border-bright",
    value: "#484F58",
    category: "Border",
    description: "호버 시 강조되는 경계선",
  },
  // Brand Colors
  {
    name: "brand-neon-cyan",
    value: "#00F5FF",
    category: "Brand",
    description: "메인 강조색 (네온 사이언)",
  },
  {
    name: "brand-neon-purple",
    value: "#7B61FF",
    category: "Brand",
    description: "서브 강조색 (퍼플)",
  },
  // Text Colors
  {
    name: "text-primary",
    value: "#F0F6FC",
    category: "Text",
    description: "일반 텍스트 (화이트에 가까움)",
  },
  {
    name: "text-secondary",
    value: "#8B949E",
    category: "Text",
    description: "설명, 라벨, 비활성 메뉴",
  },
  {
    name: "text-muted",
    value: "#484F58",
    category: "Text",
    description: "아주 연한 텍스트, 도움말",
  },
  {
    name: "text-placeholder",
    value: "#999ba9",
    category: "Text",
    description: "입력창 placeholder",
  },
  // Status Colors
  {
    name: "status-success",
    value: "#2ECC71",
    category: "Status",
    description: "수익 발생, 투자 정상 가동",
  },
  {
    name: "status-warning",
    value: "#F1C40F",
    category: "Status",
    description: "종목 수 주의 (5종목 근접)",
  },
  {
    name: "status-danger",
    value: "#E74C3C",
    category: "Status",
    description: "투자 중단 (4종목 이하), 오류",
  },
  {
    name: "status-info",
    value: "#3498DB",
    category: "Status",
    description: "단순 정보 알림",
  },
  // Interactive States
  {
    name: "interactive-hover",
    value: "#21262D",
    category: "Interactive",
    description: "호버 시 배경",
  },
  {
    name: "interactive-active",
    value: "#262B33",
    category: "Interactive",
    description: "클릭/활성 상태 배경",
  },
  {
    name: "interactive-focus",
    value: "#00E5F5",
    category: "Interactive",
    description: "포커스 링 색상",
  },
  {
    name: "interactive-disabled",
    value: "#5A5F68",
    category: "Interactive",
    description: "비활성화된 요소",
  },
  {
    name: "interactive-hover-border",
    value: "#00D4E6",
    category: "Interactive",
    description: "호버 시 경계선",
  },
  // Link Colors
  {
    name: "link-default",
    value: "#00F5FF",
    category: "Link",
    description: "기본 링크 색상",
  },
  {
    name: "link-hover",
    value: "#00D4E6",
    category: "Link",
    description: "링크 호버 색상",
  },
  {
    name: "link-visited",
    value: "#7B61FF",
    category: "Link",
    description: "방문한 링크",
  },
  // Overlay & Backdrop
  {
    name: "overlay-backdrop",
    value: "rgba(10, 11, 16, 0.8)",
    category: "Overlay",
    description: "모달 배경 오버레이",
  },
  {
    name: "overlay-light",
    value: "rgba(22, 27, 34, 0.95)",
    category: "Overlay",
    description: "가벼운 오버레이",
  },
  // Additional Brand Colors
  {
    name: "brand-cyan-dark",
    value: "#00D4E6",
    category: "Brand",
    description: "사이언 다크 변형",
  },
  {
    name: "brand-purple-light",
    value: "#8B7AFF",
    category: "Brand",
    description: "퍼플 라이트 변형",
  },
  {
    name: "brand-gradient-mid",
    value: "#3D8BFF",
    category: "Brand",
    description: "그라데이션 중간 색상",
  },
];

const lightModePalette: ColorItem[] = [
  // Background Colors
  {
    name: "background-deep-black",
    value: "#FFFFFF",
    category: "Background",
    description: "전체 메인 배경",
  },
  {
    name: "background-surface-dark",
    value: "#F8F9FA",
    category: "Background",
    description: "카드, 위젯, 테이블 본문 배경",
  },
  {
    name: "background-surface-light",
    value: "#F1F3F5",
    category: "Background",
    description: "테이블 헤더, 입력창 배경",
  },
  // Border Colors
  {
    name: "border-main",
    value: "#D1D5DB",
    category: "Border",
    description: "일반 경계선",
  },
  {
    name: "border-bright",
    value: "#9CA3AF",
    category: "Border",
    description: "호버 시 강조되는 경계선",
  },
  // Brand Colors
  {
    name: "brand-neon-cyan",
    value: "#00D4E6",
    category: "Brand",
    description: "메인 강조색 (네온 사이언)",
  },
  {
    name: "brand-neon-purple",
    value: "#6B5CE6",
    category: "Brand",
    description: "서브 강조색 (퍼플)",
  },
  // Text Colors
  {
    name: "text-primary",
    value: "#111827",
    category: "Text",
    description: "일반 텍스트 (다크 그레이)",
  },
  {
    name: "text-secondary",
    value: "#6B7280",
    category: "Text",
    description: "설명, 라벨, 비활성 메뉴",
  },
  {
    name: "text-muted",
    value: "#9CA3AF",
    category: "Text",
    description: "아주 연한 텍스트, 도움말",
  },
  {
    name: "text-placeholder",
    value: "#9CA3AF",
    category: "Text",
    description: "입력창 placeholder",
  },
  // Status Colors
  {
    name: "status-success",
    value: "#10B981",
    category: "Status",
    description: "수익 발생, 투자 정상 가동",
  },
  {
    name: "status-warning",
    value: "#F59E0B",
    category: "Status",
    description: "종목 수 주의 (5종목 근접)",
  },
  {
    name: "status-danger",
    value: "#EF4444",
    category: "Status",
    description: "투자 중단 (4종목 이하), 오류",
  },
  {
    name: "status-info",
    value: "#3B82F6",
    category: "Status",
    description: "단순 정보 알림",
  },
  // Interactive States
  {
    name: "interactive-hover",
    value: "#F3F4F6",
    category: "Interactive",
    description: "호버 시 배경",
  },
  {
    name: "interactive-active",
    value: "#E5E7EB",
    category: "Interactive",
    description: "클릭/활성 상태 배경",
  },
  {
    name: "interactive-focus",
    value: "#00D4E6",
    category: "Interactive",
    description: "포커스 링 색상",
  },
  {
    name: "interactive-disabled",
    value: "#D1D5DB",
    category: "Interactive",
    description: "비활성화된 요소",
  },
  {
    name: "interactive-hover-border",
    value: "#00B8CC",
    category: "Interactive",
    description: "호버 시 경계선",
  },
  // Link Colors
  {
    name: "link-default",
    value: "#00D4E6",
    category: "Link",
    description: "기본 링크 색상",
  },
  {
    name: "link-hover",
    value: "#00B8CC",
    category: "Link",
    description: "링크 호버 색상",
  },
  {
    name: "link-visited",
    value: "#6B5CE6",
    category: "Link",
    description: "방문한 링크",
  },
  // Overlay & Backdrop
  {
    name: "overlay-backdrop",
    value: "rgba(255, 255, 255, 0.8)",
    category: "Overlay",
    description: "모달 배경 오버레이",
  },
  {
    name: "overlay-light",
    value: "rgba(248, 249, 250, 0.95)",
    category: "Overlay",
    description: "가벼운 오버레이",
  },
  // Additional Brand Colors
  {
    name: "brand-cyan-dark",
    value: "#00B8CC",
    category: "Brand",
    description: "사이언 다크 변형",
  },
  {
    name: "brand-purple-light",
    value: "#8B7AFF",
    category: "Brand",
    description: "퍼플 라이트 변형",
  },
  {
    name: "brand-gradient-mid",
    value: "#3B82F6",
    category: "Brand",
    description: "그라데이션 중간 색상",
  },
];

const PalettePage = () => {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const currentPalette = mode === "dark" ? darkModePalette : lightModePalette;
  const bgColor = mode === "dark" ? "#0A0B10" : "#FFFFFF";
  const textPrimary = mode === "dark" ? "#F0F6FC" : "#111827";
  const textSecondary = mode === "dark" ? "#8B949E" : "#6B7280";
  const textMuted = mode === "dark" ? "#6B7280" : "#4B5563"; // 더 진한 색상으로 변경하여 가독성 향상
  const borderColor = mode === "dark" ? "#30363D" : "#D1D5DB";
  const borderHover = mode === "dark" ? "#484F58" : "#9CA3AF";
  const cardBg = mode === "dark" ? "#161B22" : "#F8F9FA";
  const glowColor = mode === "dark" ? "#00F5FF" : "#00D4E6";
  const successColor = mode === "dark" ? "#2ECC71" : "#10B981";

  const copyToClipboard = async (value: string, name: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedColor(name);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const categories = Array.from(
    new Set(currentPalette.map((color) => color.category)),
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: textPrimary }}
            >
              Color Palette
            </h1>
            <p style={{ color: textSecondary }}>
              색상을 클릭하면 해시값이 클립보드에 복사됩니다.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {categories.map((category) => {
            const categoryColors = currentPalette.filter(
              (color) => color.category === category,
            );

            return (
              <div key={category}>
                <h2
                  className="text-2xl font-semibold mb-4 pb-2"
                  style={{
                    color: textPrimary,
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryColors.map((color) => (
                    <div
                      key={color.name}
                      className="group cursor-pointer rounded-lg overflow-hidden transition-all hover:shadow-lg"
                      style={{
                        border: `1px solid ${borderColor}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = borderHover;
                        e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}33`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                      onClick={() => copyToClipboard(color.value, color.name)}
                    >
                      <div
                        className="h-24 w-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="p-4" style={{ backgroundColor: cardBg }}>
                        <div className="flex items-center justify-between mb-2">
                          <h3
                            className="font-semibold text-sm"
                            style={{ color: textPrimary }}
                          >
                            {color.name}
                          </h3>
                          {copiedColor === color.name && (
                            <span
                              className="text-xs font-medium"
                              style={{ color: successColor }}
                            >
                              복사됨!
                            </span>
                          )}
                        </div>
                        <p
                          className="text-xs mb-2 font-mono"
                          style={{ color: textSecondary }}
                        >
                          {color.value}
                        </p>
                        {color.description && (
                          <p
                            className="text-xs"
                            style={{ color: textSecondary }}
                          >
                            {color.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PalettePage;
