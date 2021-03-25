const { join } = require("path");
const { rmSync } = require("fs");
const dist = join(__dirname, "..", "dist");
console.log(`$ rm -rf ${dist}`);

rmSync(dist, { recursive: true, force: true });
