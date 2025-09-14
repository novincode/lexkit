import DefaultTemplatePageClient from "./page.client";
import { generateDocsMetadata } from "../../../lib/docs-metadata";
import type { Metadata } from "next";

export default function DefaultTemplatePage() {
  return <DefaultTemplatePageClient />;
}

export const metadata: Metadata = generateDocsMetadata(
  "/docs/templates/default",
);
