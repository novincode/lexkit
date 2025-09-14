import ShadcnTemplatePageClient from "./page.client";
import { generateDocsMetadata } from "../../../lib/docs-metadata";
import type { Metadata } from "next";

export default function ShadcnTemplatePage() {
  return <ShadcnTemplatePageClient />;
}

export const metadata: Metadata = generateDocsMetadata(
  "/docs/templates/shadcn",
);
