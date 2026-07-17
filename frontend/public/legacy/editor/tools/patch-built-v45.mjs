import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const out = resolve("../excalidraw-dist");
const file = readdirSync(out).find((name) => /^percentages-.*\.js$/.test(name));
if (!file) throw new Error("Main Excalidraw bundle was not found");
const path = resolve(out, file);
let source = readFileSync(path, "utf8");
const formatter = /([A-Za-z_$][\w$]*) = \(\{ fontSize: e, fontFamily: t \}\) => `\$\{e\}px \$\{([A-Za-z_$][\w$]*)\(\{ fontFamily: t \}\)\}`/;
const match = source.match(formatter);
if (!match) throw new Error("Excalidraw font formatter signature changed; refusing an unverified patch");
const [, formatterName, resolverName] = match;
const patched = formatterName + ' = ({ fontSize: e, fontFamily: t }) => `${t >= 200 ? \"italic \" : \"\"}${(t >= 100 && t < 200) || t >= 300 ? \"700 \" : \"\"}${e}px ${' + resolverName + '({ fontFamily: t >= 300 ? t - 300 : t >= 200 ? t - 200 : t >= 100 ? t - 100 : t })}`';
source = source.replace(formatter, patched);
writeFileSync(path, source);
console.log(`Patched synthetic bold/italic in ${file}`);