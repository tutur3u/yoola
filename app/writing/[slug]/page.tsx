import WritingCapsulePageClient from "@/components/WritingCapsulePageClient";
import { getLoreCapsule } from "@/lib/archive-data";
import { notFound } from "next/navigation";

export default async function WritingCapsulePage(props: PageProps<"/writing/[slug]">) {
  const { slug } = await props.params;
  const capsule = await getLoreCapsule(slug);

  if (!capsule) {
    notFound();
  }

  return <WritingCapsulePageClient slug={slug} />;
}
