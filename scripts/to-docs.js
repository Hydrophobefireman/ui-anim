const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const base = join(__dirname, "..");
const src = join(base, "dist", "ui-anim.modern.js");
const dest = join(base, "docs", "anim.js");

console.log(`$ cp ${src} ${dest}`);
console.log("replacing imports");

const sourceContent = readFileSync(src).toString();
const targetContent = sourceContent
  .split("@hydrophobefireman")
  .join("https://cdn.skypack.dev/@hydrophobefireman");

writeFileSync(dest, targetContent);
