import ContributingPageClient from "./page.client";
import { generateDocsMetadata } from "../../lib/docs-metadata";
import type { Metadata } from "next";

export default function ContributingPage() {
  return <ContributingPageClient />;
}

export const metadata: Metadata = generateDocsMetadata(
  "/docs/api/contributing",
);
