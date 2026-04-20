"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useInfiniteVisibleCount({
  pageSize,
  resetKey,
  totalCount,
}: {
  pageSize: number;
  resetKey: string;
  totalCount: number;
}) {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(pageSize, totalCount));
  const lastResetKeyRef = useRef(resetKey);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastResetKeyRef.current = resetKey;
    setVisibleCount(Math.min(pageSize, totalCount));
  }, [pageSize, resetKey, totalCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((current) =>
      current >= totalCount ? current : Math.min(totalCount, current + pageSize),
    );
  }, [pageSize, totalCount]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visibleCount >= totalCount) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, totalCount, visibleCount]);

  return {
    hasMore: visibleCount < totalCount,
    sentinelRef,
    visibleCount,
  };
}
