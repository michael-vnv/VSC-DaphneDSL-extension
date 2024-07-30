import { readFileSync } from "fs";
import { join } from "path";
import { DocumentUri, documents, wordUnderCursor } from "../../documents";
import { RequestMessage } from "../../server";
import { Position, Range } from "../../types";

type HoverParams = {
  textDocument: { uri: DocumentUri };
  position: Position;
};

type Hover = {
  contents: {
    kind: "markdown";
    value: string;
  };
  range: Range;
};

// file providing trigger events for Hover (function names)
const dictionaryFilePath = join(__dirname, "../../../../daphneData/parsedBuiltins.txt");
const dictionaryContent = readFileSync(dictionaryFilePath, "utf-8");
const dictionaryWords = dictionaryContent.split("\n");

// file providing Hover message content
const inputFilePath = join(__dirname, "../../../../daphneData/Builtins.md");
const fileContent = readFileSync(inputFilePath, "utf-8");
const lines = fileContent.split("\n");


export const hover = (message: RequestMessage): Hover | null => {
  const params = message.params as HoverParams;

  const currentWord = wordUnderCursor(params.textDocument.uri, params.position);

  if (!currentWord) {
    return null;
  }

  if (!dictionaryWords.includes(currentWord.text)) {
    return null;
  }

  // finds only appropriate strings based on syntax of Builtins.md
  const startPatterns = [`- **\`${currentWord.text}\``, `- ***\`${currentWord.text}\``, `| **\`${currentWord.text}\``];
  const startIndex = lines.findIndex((line) => startPatterns.some(pattern => line.includes(pattern)));

  if (startIndex === -1) {
    return null;
  }

  const endIndex = lines.slice(startIndex + 1).findIndex((line) => line.startsWith("- **`") || line.startsWith("##") || line.startsWith("- ***`") || line.startsWith("| **`")) + startIndex + 1;
  const rawDefinition = lines.slice(startIndex, endIndex).join("\n");

  const value =
    `${currentWord.text}\n${"-".repeat(currentWord.text.length)}\n\n` +
    rawDefinition;

  return {
    contents: {
      kind: "markdown",
      value,
    },
    range: currentWord.range,
  };
};