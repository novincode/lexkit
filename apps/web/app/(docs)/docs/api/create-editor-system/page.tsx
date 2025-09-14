import CreateEditorSystemPageClient from "./page.client";
import { generateDocsMetadata } from "../../../lib/docs-metadata";
import type { Metadata } from "next";

export default function CreateEditorSystemPage() {
  return <CreateEditorSystemPageClient />;
}

export const metadata: Metadata = generateDocsMetadata(
  "/docs/api/create-editor-system",
);
