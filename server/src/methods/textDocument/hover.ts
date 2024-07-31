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
const builtInsListFilePath = join(__dirname, "../../../../daphneData/parsedBuiltins.txt");
const builtInsContent = readFileSync(builtInsListFilePath, "utf-8");
const builtInsList = builtInsContent.split("\n");

// file providing Hover message content
const languageRefFilePath = join(__dirname, "../../../../daphneData/Builtins.md");
const fileContent = readFileSync(languageRefFilePath, "utf-8");
const lines = fileContent.split("\n");


export const hover = (message: RequestMessage): Hover | null => {
  const params = message.params as HoverParams;

  const currentWord = wordUnderCursor(params.textDocument.uri, params.position);

  if (!currentWord) {
    return null;
  }

  // const currentWordInDictionary = builtInsList.includes(currentWord.text);

  // Check if any word in the dictionary is a prefix of the current word with "(" immediately after the prefix
  const hasPrefixInDictionary = [...builtInsList].some(dictWord => 
    currentWord.text.startsWith(dictWord + "(")
  );

  // if (!currentWordInDictionary && !hasPrefixInDictionary) { 
  if (!hasPrefixInDictionary) { 

    return null;
  }

  const baseWord = currentWord.text.split('(')[0]; // remove everything before "("
  // finds only appropriate strings based on syntax of Builtins.md
  const startPatterns = [
    `- **\`${baseWord}\``,
    `- ***\`${baseWord}\``,
    `| **\`${baseWord}\``
  ];
  const startIndex = lines.findIndex(
    (line) => startPatterns.some(
      pattern => line.includes(pattern)
    )
  );

  if (startIndex === -1) {
    return {
      contents: {
        kind: "markdown",
        value: 'currently no defenition in Ref',
      },
      range: currentWord.range,
    };
  }

  const endIndex = lines.slice(startIndex + 1).findIndex((line) => line.startsWith("- **`") || line.startsWith("##") || line.startsWith("- ***`") || line.startsWith("| **`")) + startIndex + 1;
  const rawDefinition = lines.slice(startIndex, endIndex).join("\n");

  const value =
      `${baseWord}\n${"-".repeat(currentWord.text.length)}\n\n` +
    rawDefinition;

  return {
    contents: {
      kind: "markdown",
      value,
    },
    range: currentWord.range,
  };
};
