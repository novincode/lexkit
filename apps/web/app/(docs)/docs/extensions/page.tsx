import { Metadata } from "next";
import { generateDocsMetadata } from "../../lib/docs-metadata";
import ExtensionsPageClient from "./page.client";

export const metadata: Metadata = generateDocsMetadata(
  "/docs/extensions/create",
);

export default function ExtensionsPage() {
  return <ExtensionsPageClient />;
}
