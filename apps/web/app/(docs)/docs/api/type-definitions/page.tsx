import TypeDefinitionsPageClient from "./page.client";
import { generateDocsMetadata } from "../../../lib/docs-metadata";
import type { Metadata } from "next";

export default function TypeDefinitionsPage() {
  return <TypeDefinitionsPageClient />;
}

export const metadata: Metadata = generateDocsMetadata(
  "/docs/api/type-definitions",
);
