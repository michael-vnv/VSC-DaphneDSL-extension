import { RequestMessage } from "../../server";
import { documents, TextDocumentIdentifier } from "../../documents";
import * as fs from "fs";
import { Position } from "../../types";
import * as path from "path";

// Max number of words which suggested upon completion call
const MAX_LENGTH = 100;

// Parsing of builtin functions from daphne documentation 
const inputFilePath = path.join(__dirname, "../../../../daphneData/Builtins.md");
const outputFilePath = path.join(__dirname, "../../../../daphneData/parsedBuiltins.txt");
const sqlPath = path.join(__dirname, "../../../../daphneData/sqlFunctions.txt");
const castsPath = path.join(__dirname, "../../../../daphneData/casts.txt");

const content = fs.readFileSync(inputFilePath, "utf-8");
const regex = /\*\*`(.*?)`\*\*/g;

const matches = [];
let match;
while ((match = regex.exec(content)) !== null) {
  matches.push(match[1]);
}

const uniqueMatches = [...new Set(matches)];

const formattedMatches = uniqueMatches
  .join("\n")
  .replace(/\/(?!\n)/g, '\n');

fs.writeFileSync(outputFilePath, formattedMatches, { flag: 'w' });
// 'w' flag ensures the file is overwritten
// so if documentation file is updated, list of builtins is updated as well

const sqlFileContent = fs.readFileSync(sqlPath, 'utf-8');
// appends the SQL file content to the output file
fs.appendFileSync(outputFilePath, '\n' + sqlFileContent);

const castsPathContent = fs.readFileSync(castsPath, 'utf-8');
// appends the Casts file content to the output file
fs.appendFileSync(outputFilePath, '\n' + castsPathContent);

// creates a list of words for completion from the file
const words = fs.readFileSync(outputFilePath).toString().split("\n");

type CompletionItem = {
  label: string;
};

// Defines an interface for a list of completion items, 
// including a boolean flag 'isIncomplete' and an array of 'CompletionItem's
interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

// Defines an interface for text document position parameters including a 'textDocument' identifier and a 'position'
interface TextDocumentPositionParams {
  textDocument: TextDocumentIdentifier;
  position: Position;
}

// Extends the 'TextDocumentPositionParams' interface to create a new interface 'CompletionParams'
export interface CompletionParams extends TextDocumentPositionParams {}

export const completion = (message: RequestMessage): CompletionList | null => {
  const params = message.params as CompletionParams;
  const content = documents.get(params.textDocument.uri);

  // If no content is found for the given document URI, return null
  if (!content) {
    return null;
  }

  const currentLine = content.split("\n")[params.position.line];
  const lineUntilCursor = currentLine.slice(0, params.position.character);
  const currentPrefix = lineUntilCursor.replace(/.*[\W ](.*?)/, "$1");

  // filters the suggeted list by initial characters
  const items = words
    .filter((word) => {
      return word.startsWith(currentPrefix);
    })
    .slice(0, MAX_LENGTH)
    .map((word) => {
      return { label: word + "(" };
      // return { label: word};
    });

  // Returns a 'CompletionList' with 'isIncomplete' set to true if the number of items equals MAX_LENGTH, and the list of items
  return {
    isIncomplete: items.length === MAX_LENGTH,
    items,
  };
};