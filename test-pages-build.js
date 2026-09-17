"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const child = require("node:child_process");

const result = child.spawnSync(process.execPath, ["scripts/build-pages.js"], {
    cwd: __dirname,
    env: {
        ...process.env,
        SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_ANON_KEY: "sb_publishable_example_key_for_contract_test"
    },
    encoding: "utf8"
});
assert.equal(result.status, 0, result.stderr);
const html = fs.readFileSync(`${__dirname}/dist/index.html`, "utf8");
assert.match(html, /^<!doctype html>/);
assert.match(html, /https:\/\/example\.supabase\.co/);
assert.match(html, /sb_publishable_example_key_for_contract_test/);
assert.match(html, /noindex,nofollow,noarchive/);
assert.doesNotMatch(html, /__SUPABASE_URL__|__ANON_KEY__/);
assert.doesNotMatch(html, /service_role|SUPABASE_SERVICE_ROLE_KEY/);
console.log("PSX GitHub Pages Dashboard Tests: 6/6 passed");

