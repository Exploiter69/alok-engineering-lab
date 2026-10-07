import { send } from "../lib/response.mjs";
import { requireSession } from "../lib/session.mjs";
import { COLLECTIONS } from "../lib/schema.mjs";

export default function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error:"method_not_allowed" });
  if (!requireSession(req,res)) return;
  return send(res, 200, { collections: COLLECTIONS });
}
