import { Metadata } from "next";
import { generateDocsMetadata } from "../../lib/docs-metadata";
import { IntroductionPageClient } from "./page.client";

export const metadata: Metadata = generateDocsMetadata("/docs/introduction");

export default function IntroductionPage() {
  return <IntroductionPageClient />;
}
