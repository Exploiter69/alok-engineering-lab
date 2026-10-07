import { send } from "../lib/response.mjs";
import { requireSameOrigin } from "../lib/security.mjs";
import { requireSession } from "../lib/session.mjs";
import { validCollection, validSlug, readFile, writeFile } from "../lib/content.mjs";

export default async function handler(req,res) {
  const session=requireSession(req,res); if(!session) return;
  if(req.method!=="POST") return send(res,405,{error:"method_not_allowed"});
  if(!requireSameOrigin(req)) return send(res,403,{error:"cross_origin_request"});
  try {
    const body=typeof req.body==="string"?JSON.parse(req.body):req.body||{};
    if(!validCollection(body.collection)||!validSlug(body.slug)||!/^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(body.branch||"")) return send(res,400,{error:"invalid_target"});
    const source=await readFile(session.token,`src/content/${body.collection}/${body.slug}.md`,"master");
    const result=await writeFile(session.token,`src/content/${body.collection}/${body.slug}.md`,source.source,body.branch,`admin: restore ${body.collection}/${body.slug}`);
    return send(res,201,{commit:result.commit,branch:body.branch});
  }catch(error){return send(res,502,{error:"github_operation_failed",message:error instanceof Error?error.message:"unknown error"});}
}
