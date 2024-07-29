import { RequestMessage } from "../../server";
import { documents, TextDocumentIdentifier } from "../../documents";
import * as fs from "fs";
import { Position } from "../../types";
import * as path from "path";


const MAX_LENGTH = 300;

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

const sqlFileContent = fs.readFileSync(sqlPath, 'utf-8');
// Append the SQL file content to the output file
fs.appendFileSync(outputFilePath, '\n' + sqlFileContent);

const castsPathContent = fs.readFileSync(castsPath, 'utf-8');
// Append the Casts file content to the output file
fs.appendFileSync(outputFilePath, '\n' + castsPathContent);


const words = fs.readFileSync(outputFilePath).toString().split("\n");


type CompletionItem = {
  label: string;
};

interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

interface TextDocumentPositionParams {
  textDocument: TextDocumentIdentifier;
  position: Position;
}

export interface CompletionParams extends TextDocumentPositionParams {}

export const completion = (message: RequestMessage): CompletionList | null => {
  const params = message.params as CompletionParams;
  const content = documents.get(params.textDocument.uri);

  if (!content) {
    return null;
  }

  const currentLine = content.split("\n")[params.position.line];
  const lineUntilCursor = currentLine.slice(0, params.position.character);
  const currentPrefix = lineUntilCursor.replace(/.*[\W ](.*?)/, "$1");

  const items = words
    .filter((word) => {
      return word.startsWith(currentPrefix);
    })
    .slice(0, MAX_LENGTH)
    .map((word) => {
      return { label: word + "(" };
      // return { label: word};
    });

  return {
    isIncomplete: items.length === MAX_LENGTH,
    items,
  };
};