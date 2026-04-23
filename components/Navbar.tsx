"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLightbox } from "@/components/LightboxContext";
import type { YoolaNavigationItem } from "@/lib/archive-data";

type NavbarProps = {
  cmsHref: string;
  items: YoolaNavigationItem[];
};

const NAVBAR_EXPAND_DELAY_MS = 70;
const NAVBAR_COLLAPSE_DELAY_MS = 180;
const NAVBAR_POST_NAV_CHECK_DELAY_MS = 260;

export default function Navbar({ cmsHref, items }: NavbarProps) {
  const pathname = usePathname();
  const { isOpen } = useLightbox();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const expandTimeoutRef = useRef<number | null>(null);
  const collapseTimeoutRef = useRef<number | null>(null);
  const postNavTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current !== null) {
        window.clearTimeout(expandTimeoutRef.current);
      }
      if (collapseTimeoutRef.current !== null) {
        window.clearTimeout(collapseTimeoutRef.current);
      }
      if (postNavTimeoutRef.current !== null) {
        window.clearTimeout(postNavTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    if (expandTimeoutRef.current !== null) {
      window.clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }

    if (collapseTimeoutRef.current !== null) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }

    if (postNavTimeoutRef.current !== null) {
      window.clearTimeout(postNavTimeoutRef.current);
      postNavTimeoutRef.current = null;
    }

    setIsFocused(false);

    postNavTimeoutRef.current = window.setTimeout(() => {
      const navHovered = navRef.current?.matches(":hover") ?? false;

      if (!navHovered) {
        setIsHovered(false);
      }

      postNavTimeoutRef.current = null;
    }, NAVBAR_POST_NAV_CHECK_DELAY_MS);
  }, [isDesktop, pathname]);

  if (isOpen) {
    return null;
  }

  const activeItem =
    items.find((item) =>
      item.path === "/"
        ? pathname === "/"
        : pathname === item.path || pathname.startsWith(`${item.path}/`),
    ) ?? items[0];
  const isExpanded = isHovered || isFocused;
  const showExpandedLayer = !isDesktop || isExpanded;
  const showSummaryLayer = isDesktop && !isExpanded;

  const clearHoverTimers = () => {
    if (expandTimeoutRef.current !== null) {
      window.clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }

    if (collapseTimeoutRef.current !== null) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }

    if (postNavTimeoutRef.current !== null) {
      window.clearTimeout(postNavTimeoutRef.current);
      postNavTimeoutRef.current = null;
    }
  };

  const scheduleExpand = () => {
    if (!isDesktop) {
      return;
    }

    if (collapseTimeoutRef.current !== null) {
      window.clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }

    if (isHovered) {
      return;
    }

    expandTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(true);
      expandTimeoutRef.current = null;
    }, NAVBAR_EXPAND_DELAY_MS);
  };

  const scheduleCollapse = () => {
    if (!isDesktop) {
      setIsHovered(false);
      return;
    }

    if (expandTimeoutRef.current !== null) {
      window.clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = null;
    }

    collapseTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(false);
      collapseTimeoutRef.current = null;
    }, NAVBAR_COLLAPSE_DELAY_MS);
  };

  const collapseNow = () => {
    clearHoverTimers();
    setIsHovered(false);
    setIsFocused(false);
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      onMouseEnter={scheduleExpand}
      onMouseLeave={scheduleCollapse}
      onFocusCapture={() => {
        clearHoverTimers();
        setIsHovered(true);
        setIsFocused(true);
      }}
      onBlurCapture={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        ) {
          return;
        }

        setIsFocused(false);
        collapseNow();
      }}
      className={`pointer-events-none fixed top-5 left-1/2 z-50 w-[min(calc(100%-1.5rem),72rem)] -translate-x-1/2 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExpanded ? "md:w-[min(calc(100%-1.5rem),72rem)]" : "md:w-[11.25rem]"
      }`}
    >
      <div
        className={`yoola-nav-shell pointer-events-auto px-3 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isExpanded ? "md:px-4 md:py-3" : "md:px-2 md:py-2"
        } ${isExpanded ? "yoola-nav-shell-expanded" : "yoola-nav-shell-collapsed"}`}
      >
        <div className={`relative ${isExpanded ? "md:h-[4.15rem]" : "md:h-[2.6rem]"}`}>
          <motion.div
            animate={{
              opacity: showSummaryLayer ? 1 : 0,
              scale: showSummaryLayer ? 1 : 0.96,
              y: showSummaryLayer ? 0 : -10,
            }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="yoola-nav-summary hidden items-center justify-between gap-3 md:flex"
            style={{
              pointerEvents: showSummaryLayer ? "auto" : "none",
            }}
          >
            <div className="yoola-nav-summary-pill">
              <span className="yoola-nav-summary-value">{activeItem?.name}</span>
            </div>
          </motion.div>

          <motion.div
            animate={{
              opacity: showExpandedLayer ? 1 : 0,
              scale: showExpandedLayer ? 1 : 0.98,
              y: showExpandedLayer ? 0 : 14,
            }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 md:absolute md:inset-0 md:gap-0"
            style={{
              pointerEvents: showExpandedLayer ? "auto" : "none",
            }}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="yoola-nav-frame flex flex-1 items-center justify-center gap-1 overflow-x-auto px-1 md:gap-2">
                {items.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? pathname === "/"
                      : pathname === item.path || pathname.startsWith(`${item.path}/`);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`yoola-nav-link font-display text-sm font-black tracking-[0.08em] uppercase transition-all md:text-[1.15rem] ${
                        isActive
                          ? "yoola-nav-link-active text-[#f0edf5]"
                          : "text-white/72 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <a
                href={cmsHref}
                target="_blank"
                rel="noreferrer"
                className="yoola-nav-cms font-display text-center text-sm font-black tracking-[0.12em] uppercase"
              >
                CMS
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
