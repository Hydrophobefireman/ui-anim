const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const base = join(__dirname, "..");
const src = join(base, "dist", "ui-anim.modern.js");
const dest = join(base, "docs", "anim.js");

console.log(`$ cp ${src} ${dest}`);
console.log("replacing imports");

const sourceContent = readFileSync(src).toString();
// who needs webpack
const targetContent = sourceContent
  .split("@hydrophobefireman/ui-lib")
  .join("./@hydrophobefireman/ui-lib.js");

writeFileSync(dest, targetContent);
