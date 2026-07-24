import { Commands as e, subsetToBinary as t } from "./subset-shared.chunk-B0Twwh1K.js";
import "./percentages-BXMCSKIN-CfZdyBUo.js";
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
