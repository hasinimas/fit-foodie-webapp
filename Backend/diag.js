// diag.js — run with: node diag.js
import fs from "fs";
import path from "path";

const root = process.cwd();

function walk(dir){
  const out = [];
  for(const name of fs.readdirSync(dir)){
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if(st.isDirectory()){
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

const files = walk(root).filter(f => f.endsWith(".js") || f.endsWith(".json") || f.endsWith(".env") || f.endsWith(".mjs"));
console.log("🔎 Scanning", files.length, "files...\n");

const findings = { emptyFiles:[], missingServiceAccount:false, openaiUsage:[], geminiUsage:[], generateEndpoints:[], analyzeEndpoints:[], planFiles:[] , TODO:[] };

for(const f of files){
  const rel = path.relative(root, f);
  const stat = fs.statSync(f);
  if(stat.size === 0) findings.emptyFiles.push(rel);
  let txt = "";
  try { txt = fs.readFileSync(f, "utf8"); } catch(e){}
  if(/serviceAccountKey\.json/.test(txt)) {
    if(!fs.existsSync(path.join(root, "serviceAccountKey.json"))) findings.missingServiceAccount = true;
  }
  if(/openai/i.test(txt)) findings.openaiUsage.push(rel);
  if(/generativelanguage|gemini/i.test(txt)) findings.geminiUsage.push(rel);
  if(/generate-plan|generatePlan|generateMealPlan/i.test(txt)) findings.generateEndpoints.push(rel);
  if(/analyzeMeals|analyze|nutritionix|natural\/nutrients/i.test(txt)) findings.analyzeEndpoints = findings.analyzeEndpoints.concat([rel]);
  if(/AI plan unavailable|AI plan unavailable\./i.test(txt)) findings.planFiles.push(rel);
  if(/TODO|FIXME|REPLACE_ME/i.test(txt)) findings.TODO.push(rel);
}

console.log("=== RESULTS ===\n");

if(findings.emptyFiles.length){
  console.log("⚠️ Empty files (open and inspect):");
  findings.emptyFiles.forEach(x=>console.log(" -", x));
} else {
  console.log("✅ No empty files found.");
}

console.log("\nOpenAI usage (files mentioning 'openai'):");
if(findings.openaiUsage.length) findings.openaiUsage.forEach(x=>console.log(" -", x)); else console.log(" - none");

console.log("\nGemini/GenerativeLanguage usage:");
if(findings.geminiUsage.length) findings.geminiUsage.forEach(x=>console.log(" -", x)); else console.log(" - none");

console.log("\nFiles referencing generate-plan / generateMealPlan:");
if(findings.generateEndpoints.length) findings.generateEndpoints.forEach(x=>console.log(" -", x)); else console.log(" - none");

console.log("\nFiles referencing Nutritionix / analyze:");
if(findings.analyzeEndpoints.length) findings.analyzeEndpoints.forEach(x=>console.log(" -", x)); else console.log(" - none");

if(findings.missingServiceAccount){
  console.log("\n⚠️ serviceAccountKey.json referenced but NOT found in backend root. (Firestore admin needs it)");
} else {
  console.log("\n✅ serviceAccountKey.json presence OK (or not referenced).");
}

if(findings.TODO.length){
  console.log("\n⚠️ TODO/FIXME markers (inspect these files):");
  findings.TODO.forEach(x=>console.log(" -", x));
} else {
  console.log("\n✅ No TODO markers found.");
}

if(findings.planFiles.length){
  console.log("\nFiles containing 'AI plan unavailable' or similar:");
  findings.planFiles.forEach(x=>console.log(" -", x));
}

console.log("\n\nIf you want, run: node diag.js > diag-output.txt and paste diag-output.txt here.");
