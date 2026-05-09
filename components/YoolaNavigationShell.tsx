import Navbar from "@/components/Navbar";
import { defaultNavigationItems } from "@/lib/archive-data";

export default function YoolaNavigationShell() {
  return <Navbar adminHref="/admin" items={defaultNavigationItems} />;
}
