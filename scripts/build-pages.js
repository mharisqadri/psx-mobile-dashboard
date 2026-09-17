"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceFile = path.join(root, "src", "dashboard-template.ts");
const outputDir = path.join(root, "dist");
const outputFile = path.join(outputDir, "index.html");

function required(name) {
    const value = String(process.env[name] || "").trim();
    if (!value) throw new Error(`${name}_REQUIRED`);
    return value;
}

const supabaseUrl = required("SUPABASE_URL").replace(/\/$/, "");
const anonKey = required("SUPABASE_ANON_KEY");
const parsedUrl = new URL(supabaseUrl);

if (parsedUrl.protocol !== "https:" || !parsedUrl.hostname.endsWith(".supabase.co")) {
    throw new Error("SUPABASE_URL_INVALID");
}
if (!anonKey.startsWith("sb_publishable_") && !anonKey.startsWith("eyJ")) {
    throw new Error("SUPABASE_ANON_KEY_INVALID");
}

const source = fs.readFileSync(sourceFile, "utf8");
const match = source.match(/const html = `([\s\S]*?)`;\s*\n\s*Deno\.serve/);
if (!match) throw new Error("DASHBOARD_TEMPLATE_NOT_FOUND");

const securityMeta = [
    '<meta name="robots" content="noindex,nofollow,noarchive">',
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; connect-src ' +
        parsedUrl.origin +
        '; style-src \'unsafe-inline\'; script-src \'unsafe-inline\'; img-src \'self\' data:; base-uri \'none\'; frame-ancestors \'none\'; form-action \'none\'">'
].join("");

let html = match[1]
    .replace("<title>", securityMeta + "<title>")
    .replace("__SUPABASE_URL__", JSON.stringify(supabaseUrl))
    .replace("__ANON_KEY__", JSON.stringify(anonKey));

if (html.includes("__SUPABASE_URL__") || html.includes("__ANON_KEY__")) {
    throw new Error("DASHBOARD_PLACEHOLDER_REMAINING");
}

fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(outputFile, html, "utf8");
fs.writeFileSync(path.join(outputDir, ".nojekyll"), "", "utf8");
console.log(`PAGES_DASHBOARD_READY: ${outputFile}`);

