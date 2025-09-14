import { Metadata } from "next";
import { generateDocsMetadata } from "../../lib/docs-metadata";
import { InstallationPageClient } from "./page.client";

export const metadata: Metadata = generateDocsMetadata("/docs/installation");

export default function InstallationPage() {
  return <InstallationPageClient />;
}
