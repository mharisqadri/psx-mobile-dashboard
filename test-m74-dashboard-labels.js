"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "src", "dashboard-template.ts"), "utf8");

const checks = [
    ["entry-ready cards use explicit authorization", source.includes("BUY AUTHORIZED")],
    ["priority-watch cards deny buy permission", source.includes("WATCH — NO BUY")],
    ["ranked cards are informational only", source.includes("RANKED ONLY")],
    ["raw row decision is not rendered as authorization", !source.includes("esc(r.decision||r.status)")],
    ["partial readiness continues to block entry rows", source.includes("readiness==='PARTIAL'") && source.includes("renderRows('ready',buyBlocked?[]:s.entryReady")]
];

for (const [name, ok] of checks) { assert.ok(ok, name); console.log("PASS ", name); }
console.log(`M7.4 Dashboard Label Tests: ${checks.length}/${checks.length} passed`);
