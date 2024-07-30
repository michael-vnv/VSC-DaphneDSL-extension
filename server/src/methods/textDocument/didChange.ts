import { NotificationMessage } from "../../server";
import {
  documents,
  VersionedTextDocumentIdentifier,
  TextDocumentContentChangeEvent,
} from "../../documents";

// If document is changed. 
// The version number points to the version after all provided content changes have been applied.
interface DidChangeTextDocumentParams {
  textDocument: VersionedTextDocumentIdentifier;
  contentChanges: TextDocumentContentChangeEvent[];
}

export const didChange = (message: NotificationMessage): void => {
  const params = message.params as DidChangeTextDocumentParams;

  documents.set(params.textDocument.uri, params.contentChanges[0].text);
};