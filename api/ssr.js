// Vercel Node.js Function entry point. Re-exports the Fetch-standard
// `{ fetch(request) }` handler built by `npm run build` (dist/server/server.js)
// so Vercel can invoke it directly per request — see src/server.ts.
import handler from "../dist/server/server.js";

export default handler;
