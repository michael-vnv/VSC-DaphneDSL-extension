import { Position, Range } from "./types";

export type DocumentUri = string;
type DocumentBody = string;

// Text document identifiation using URI. 
// The corresponding JSON structure is as following:
export interface TextDocumentIdentifier {
    uri: DocumentUri;
}

// An identifier to denote a specific version of a text document. 
// This information usually flows from the client to the server.
export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    version: number;
}

 // An event describing a change to a text document. If only a text is provided
 // it is considered to be the full content of the document.
export interface TextDocumentContentChangeEvent {
    text: string;
}

// Definition for a word which is currently under cursor, 
// including its context (as string) and location (starting/ending points)
export const documents = new Map<DocumentUri, DocumentBody>();

type WordUnderCursor = {
  text: string;
  range: Range;
};

export const wordUnderCursor = (
  uri: DocumentUri,
  position: Position,
): WordUnderCursor | null => {
  const document = documents.get(uri);

  if (!document) {
    return null;
  }

  const lines = document.split("\n");
  const line = lines[position.line];

  // const start = line.lastIndexOf(" ", position.character) + 1;

  const start = Math.max(
    line.lastIndexOf(" ", position.character),
    line.lastIndexOf("(", position.character)
  ) + 1;
  
  const end = line.indexOf(" ", position.character);

  if (end === -1) {
    return {
      text: line.slice(start),
      range: {
        start: { line: position.line, character: start },
        end: { line: position.line, character: line.length },
      },
    };
  }

  return {
    text: line.slice(start, end),
    range: {
      start: { line: position.line, character: start },
      end: { line: position.line, character: end },
    },
  };
};