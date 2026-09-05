import "./lib/error-capture";

import { fileURLToPath, pathToFileURL } from "node:url";

import { serve } from "srvx";
import { serveStatic } from "srvx/static";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// This file is bundled to dist/server/server.js; the client build lives
// alongside it at dist/client, regardless of the process's cwd.
const clientDir = fileURLToPath(new URL("../client", import.meta.url));

type ServerEntry = {
  fetch: (request: Request) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

async function fetch(request: Request): Promise<Response> {
  try {
    const handler = await getServerEntry();
    const response = await handler.fetch(request);
    return await normalizeCatastrophicSsrResponse(response);
  } catch (error) {
    console.error(error);
    return brandedErrorResponse();
  }
}

// TanStack Start's own preview/prerender tooling imports this module and
// calls the default export's `fetch` directly (in-process) — it does not
// rely on a listening server, so this export must exist independent of the
// serve() call below.
export default { fetch };

// Only start listening when this file is actually run as the server process
// (e.g. `node dist/server/server.js`), not when it's merely imported by
// Vite's own preview/prerender tooling.
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  // Render (and most Node hosts) provide the listen port via the PORT env
  // var, which srvx's Node adapter reads by default.
  serve({
    fetch,
    hostname: "0.0.0.0",
    middleware: [serveStatic({ dir: clientDir })],
  });
}
