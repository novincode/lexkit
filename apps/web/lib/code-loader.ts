import { getCode } from "./generated/code-registry";

export async function loadExampleCode(exampleName: string) {
  // For backward compatibility, assume exampleName is like 'BasicEditorExample'
  // and try to load the .tsx file
  const tsxFile = `${exampleName}.tsx`;
  const code = getCode(tsxFile);
  if (code) {
    return code;
  }
  throw new Error(`Example ${exampleName} not found`);
}
