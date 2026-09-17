"use strict";
const assert = require("assert");
const fs = require("fs");
const source = fs.readFileSync("src/dashboard-template.ts", "utf8");
const checks = [
    ["partial readiness is detected", /readiness==='PARTIAL'/.test(source)],
    ["missing market date blocks execution", /!s\.marketDate/.test(source)],
    ["partial snapshot displays blocked banner", /PARTIAL SNAPSHOT — BUY PERMISSION BLOCKED/.test(source)],
    ["entry-ready rows are hidden while blocked", /renderRows\('ready',buyBlocked\?\[\]:s\.entryReady/.test(source)],
    ["ranked evidence remains visible", /renderRows\('ranked',s\.ranked/.test(source)]
];
for (const [name, ok] of checks) { assert.ok(ok, name); console.log("PASS ", name); }
console.log(`M7.2 Public Dashboard Safety Tests: ${checks.length}/${checks.length} passed`);
