import Navbar from "@/components/Navbar";
import { defaultNavigationItems } from "@/lib/archive-data";

const CMS_LIBRARY_PATH = "/7c482562-f5bd-40c5-8dd0-1082414823a1/library";

function isEnabled(value: string | undefined) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function getCmsHref() {
  const devMode = process.env.DEV_MODE ?? process.env.NEXT_PUBLIC_DEV_MODE ?? "";

  return isEnabled(devMode)
    ? `http://localhost:7811${CMS_LIBRARY_PATH}`
    : `https://cms.tuturuuu.com${CMS_LIBRARY_PATH}`;
}

export default function YoolaNavigationShell() {
  return <Navbar cmsHref={getCmsHref()} items={defaultNavigationItems} />;
}
