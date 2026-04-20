"use client";

import Navbar from "@/components/Navbar";
import { defaultNavigationItems } from "@/lib/archive-data";
import { useYoolaArchiveDataQuery } from "@/lib/yoola-query";

export default function YoolaNavigationShell() {
  const archiveQuery = useYoolaArchiveDataQuery();

  return (
    <Navbar
      brand={archiveQuery.data?.profile.brand ?? "YOOLA"}
      items={archiveQuery.data?.navigationItems ?? defaultNavigationItems}
    />
  );
}
