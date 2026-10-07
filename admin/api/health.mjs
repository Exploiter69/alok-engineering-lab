import { send } from "../lib/response.mjs";
export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "method_not_allowed" });
  return send(res, 200, { service: "alok-engineering-lab-admin", status: "ok" });
}
