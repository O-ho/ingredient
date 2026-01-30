"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Users,
  Palette,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const MENU_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/user", label: "사용자", icon: Users },
  { href: "/palette", label: "팔레트", icon: Palette },
] as const;

export function SidePanel() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className="flex flex-col border-r border-border bg-bg-surface transition-[width] duration-200 ease-in-out shrink-0"
      style={{ width: expanded ? 240 : 64 }}
      aria-expanded={expanded}
    >
      {/* 상단 접기/펼치기 버튼 */}
      <div className="flex items-center h-[65px] border-b border-border px-3 shrink-0">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-text hover:bg-hover transition-colors"
          aria-label={expanded ? "패널 접기" : "패널 펼치기"}
        >
          {expanded ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeft className="w-5 h-5" />
          )}
        </button>
        {expanded && (
          <span className="ml-2 text-sm font-medium text-text truncate">
            메뉴
          </span>
        )}
      </div>

      {/* 메뉴 목록 */}
      <nav className="flex-1 py-2 overflow-x-hidden" aria-label="사이드 메뉴">
        <ul className="flex flex-col gap-1 px-2">
          {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 h-10 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-hover text-text font-medium"
                      : "text-text-muted hover:bg-hover hover:text-text"
                  } ${expanded ? "min-w-0" : "justify-center px-0"}`}
                  title={!expanded ? label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" aria-hidden />
                  {expanded && (
                    <span className="truncate text-sm">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
