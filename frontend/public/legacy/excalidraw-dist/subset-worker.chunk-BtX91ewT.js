import { Commands as e, subsetToBinary as t } from "./subset-shared.chunk-hoo9sf7P.js";
import "./percentages-BXMCSKIN-BsTV3WVS.js";
var m = import.meta.url ? new URL(import.meta.url) : void 0;
typeof window > "u" && typeof self < "u" && (self.onmessage = async (a) => {
  switch (a.data.command) {
    case e.Subset:
      let s = await t(a.data.arrayBuffer, a.data.codePoints);
      self.postMessage(s, { transfer: [s] });
      break;
  }
});
export {
  m as WorkerUrl
};
