import { defaultLexKitTheme, type LexKitTheme } from "@lexkit/editor";

// The explicit annotation is required: without it TypeScript infers a type that
// references Lexical's internal modules, which can't be named portably when
// Next.js type-checks the build ("inferred type ... cannot be named").
export const defaultTheme: LexKitTheme = {
  ...defaultLexKitTheme,
};
