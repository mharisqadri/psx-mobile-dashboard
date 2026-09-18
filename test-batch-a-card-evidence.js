"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync("src/dashboard-template.ts","utf8");

const tests = [
  ["ten-session evidence is read from governed snapshot", /s\.sessionEvidence/],
  ["last close has hover and tap disclosure", /popover\('Last Close'/],
  ["volume has hover and tap disclosure", /popover\('Volume'/],
  ["trades have hover and tap disclosure", /popover\('Trades'/],
  ["mobile disclosure is fixed and readable", /position:fixed;left:12px;right:12px/],
  ["existing authorization labels remain governed", /BUY AUTHORIZED.*WATCH — NO BUY.*RANKED ONLY/]
];

for (const [name,pattern] of tests) { assert.match(source,pattern); console.log(`PASS  ${name}`); }
console.log("Batch A Public Card Evidence Tests: 6/6 passed");
