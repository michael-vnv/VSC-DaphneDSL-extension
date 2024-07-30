import { RequestMessage } from "../server";
type ServerCapabilities = Record<string, unknown>;

// The capabilities the language server provides.
interface InitializeResult {
  capabilities: ServerCapabilities;

  serverInfo?: {
    name: string;
    version?: string;
  };
}

// The initialize request is sent as the first request from the client to the server. 
export const initialize = (message: RequestMessage): InitializeResult => {
  return {
    capabilities: {
      completionProvider: {},
      textDocumentSync: 1,
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
      codeActionProvider: true,
      hoverProvider: true,
    },
    serverInfo: {
      name: "daphne extension",
      version: "1.0.0",
    },
  };
};