import { readFileSync } from "fs";
import { DocumentUri, wordUnderCursor } from "../../documents";
import { RequestMessage } from "../../server";
import { Position, Range } from "../../types";
import path = require("path");

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

// Define the path to the dictionary file
const dictionaryFilePath = path.join(__dirname, "../../../../daphneData/parsedBuiltins.txt");

// Load dictionary file once when the module is loaded
const dictionaryContent = readFileSync(dictionaryFilePath, "utf-8");

// Convert dictionary content into a Set of words for quick lookup
const dictionaryWords = new Set(dictionaryContent.split(/\r?\n/));

export const hover = (message: RequestMessage): Hover | null => {
    const params = message.params as HoverParams;
  
    const currentWord = wordUnderCursor(params.textDocument.uri, params.position);
  
    if (!currentWord) {
      return null;
    }
  
    // Check if any word in the dictionary is a prefix of the current word with "(" immediately after the prefix
    const hasPrefixInDictionary = [...dictionaryWords].some(dictWord => 
      currentWord.text.startsWith(dictWord + "(")
    );
  
    if (!hasPrefixInDictionary) {
      return null;
    }
  
    // Create the hover value with the current word and "Hover Test!"
    const value = `${currentWord.text}\n\n# Hover Test! #`;
  
    return {
      contents: {
        kind: "markdown",
        value,
      },
      range: currentWord.range,
    };
  };