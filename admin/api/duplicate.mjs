import { send } from "../lib/response.mjs";
import { requireSession } from "../lib/session.mjs";
import { validCollection, validSlug, readFile, writeFile, parseDocument, validateMetadata } from "../lib/content.mjs";

export default async function handler(req,res) {
  const session=requireSession(req,res); if(!session) return;
  if(req.method!=="POST") return send(res,405,{error:"method_not_allowed"});
  try {
    const body=typeof req.body==="string"?JSON.parse(req.body):req.body||{};
    if(!validCollection(body.collection)||!validSlug(body.sourceSlug)||!validSlug(body.targetSlug)||!/^admin\/[a-z0-9][a-z0-9._/-]{2,79}$/.test(body.branch||"")) return send(res,400,{error:"invalid_target"});
    const source=await readFile(session.token,`src/content/${body.collection}/${body.sourceSlug}.md`,body.ref||"master");
    const parsed=parseDocument(source.source);
    const errors=validateMetadata(body.collection,parsed.metadata,parsed.metadata.related);
    if(errors.length) return send(res,422,{error:"source_invalid",errors});
    const result=await writeFile(session.token,`src/content/${body.collection}/${body.targetSlug}.md`,source.source,body.branch,`admin: duplicate ${body.collection}/${body.sourceSlug}`);
    return send(res,201,{commit:result.commit,branch:body.branch});
  }catch(error){return send(res,502,{error:"github_operation_failed",message:error instanceof Error?error.message:"unknown error"});}
}
