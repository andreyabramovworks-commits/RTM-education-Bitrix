var ux = Object.defineProperty;
var dx = (e, t, r) => t in e ? ux(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Ft = (e, t, r) => dx(e, typeof t != "symbol" ? t + "" : t, r);
import { c as fx, g as px } from "./percentages-BXMCSKIN-Bu9I2FTk.js";
const Os = 20, gx = {
  rect: "rectangle",
  circle: "ellipse"
}, Qs = {
  startOnLoad: !1,
  flowchart: { curve: "linear" },
  themeVariables: {
    fontSize: `${Os}px`
  },
  maxEdges: 500,
  maxTextSize: 5e4
};
class zi {
  constructor({ converter: t }) {
    this.convert = (r, i) => this.converter(r, {
      ...i,
      fontSize: i.fontSize || Os
    }), this.converter = t;
  }
}
var gr;
(function(e) {
  e.ROUND = "round", e.STADIUM = "stadium", e.DOUBLECIRCLE = "doublecircle", e.CIRCLE = "circle", e.DIAMOND = "diamond", e.CYLINDER = "cylinder";
})(gr || (gr = {}));
var se;
(function(e) {
  e.COLOR = "color";
})(se || (se = {}));
var Bt;
(function(e) {
  e.FILL = "fill", e.STROKE = "stroke", e.STROKE_WIDTH = "stroke-width", e.STROKE_DASHARRAY = "stroke-dasharray";
})(Bt || (Bt = {}));
var Sl = {};
Object.defineProperty(Sl, "__esModule", { value: !0 });
var ed = Sl.removeMarkdown = void 0, mx = function(e, t) {
  t === void 0 && (t = {
    listUnicodeChar: ""
  }), t = t || {}, t.listUnicodeChar = t.hasOwnProperty("listUnicodeChar") ? t.listUnicodeChar : !1, t.stripListLeaders = t.hasOwnProperty("stripListLeaders") ? t.stripListLeaders : !0, t.gfm = t.hasOwnProperty("gfm") ? t.gfm : !0, t.useImgAltText = t.hasOwnProperty("useImgAltText") ? t.useImgAltText : !0, t.preserveLinks = t.hasOwnProperty("preserveLinks") ? t.preserveLinks : !1;
  var r = e || "";
  r = r.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, "");
  try {
    t.stripListLeaders && (t.listUnicodeChar ? r = r.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, t.listUnicodeChar + " $1") : r = r.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1")), t.gfm && (r = r.replace(/\n={2,}/g, `
`).replace(/~{3}.*\n/g, "").replace(/~~/g, "").replace(/`{3}.*\n/g, "")), t.preserveLinks && (r = r.replace(/\[(.*?)\][\[\(](.*?)[\]\)]/g, "$1 ($2)")), r = r.replace(/<[^>]*>/g, "").replace(/^[=\-]{2,}\s*$/g, "").replace(/\[\^.+?\](\: .*?$)?/g, "").replace(/\s{0,2}\[.*?\]: .*?$/g, "").replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, t.useImgAltText ? "$1" : "").replace(/\[(.*?)\][\[\(].*?[\]\)]/g, "$1").replace(/^\s{0,3}>\s?/g, "").replace(/(^|\n)\s{0,3}>\s?/g, `

`).replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "").replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, "$1$2$3").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/(`{3,})(.*?)\1/gm, "$2").replace(/`(.+?)`/g, "$1").replace(/\n{2,}/g, `

`);
  } catch (i) {
    return console.error(i), e;
  }
  return r;
};
ed = Sl.removeMarkdown = mx;
const yx = {
  arrow_circle: {
    endArrowhead: "circle"
  },
  arrow_cross: {
    endArrowhead: "bar"
  },
  arrow_open: {
    endArrowhead: null,
    startArrowhead: null
  },
  double_arrow_circle: {
    endArrowhead: "circle",
    startArrowhead: "circle"
  },
  double_arrow_cross: {
    endArrowhead: "bar",
    startArrowhead: "bar"
  },
  double_arrow_point: {
    endArrowhead: "arrow",
    startArrowhead: "arrow"
  }
}, xx = (e) => yx[e], Ua = (e) => {
  let t = e.text;
  return e.labelType === "markdown" && (t = ed(e.text)), Cx(t);
}, Cx = (e) => {
  const t = /\s?(fa|fab):[a-zA-Z0-9-]+/g;
  return e.replace(t, "");
}, bs = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    var i;
    switch (r) {
      case Bt.FILL: {
        t.backgroundColor = e[r], t.fillStyle = "solid";
        break;
      }
      case Bt.STROKE: {
        t.strokeColor = e[r];
        break;
      }
      case Bt.STROKE_WIDTH: {
        t.strokeWidth = Number((i = e[r]) == null ? void 0 : i.split("px")[0]);
        break;
      }
      case Bt.STROKE_DASHARRAY: {
        t.strokeStyle = "dashed";
        break;
      }
    }
  }), t;
}, yn = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    switch (r) {
      case se.COLOR: {
        t.strokeColor = e[r];
        break;
      }
    }
  }), t;
}, bx = (e, t) => [e, t], kx = 32, rd = 0.62, Sx = 12, wx = 12, id = (e, t) => Math.max(20, Math.ceil(e.length * t * rd)), Tx = (e, t, r, i) => {
  const s = i || Os;
  if (e !== gr.CYLINDER || !t || t.includes(`
`))
    return s;
  const o = Math.max(20, r - Sx);
  return id(t, s) <= o ? s : Math.max(wx, Math.floor(o / (t.length * rd)));
}, _x = (e) => {
  const t = {};
  e.subGraphs.map((i) => {
    i.nodeIds.forEach((s) => {
      t[i.id] = {
        id: i.id,
        parent: null,
        isLeaf: !1
      }, t[s] = {
        id: s,
        parent: i.id,
        isLeaf: e.vertices[s] !== void 0
      };
    });
  });
  const r = {};
  return [...Object.keys(e.vertices), ...e.subGraphs.map((i) => i.id)].forEach((i) => {
    if (!t[i])
      return;
    let s = t[i];
    const o = [];
    for (s.isLeaf || o.push(`subgraph_group_${s.id}`); s.parent; )
      o.push(`subgraph_group_${s.parent}`), s = t[s.parent];
    r[i] = o;
  }), {
    getGroupIds: (i) => r[i] || [],
    getParentId: (i) => t[i] ? t[i].parent : null
  };
}, Bx = new zi({
  converter: (e, t) => {
    const r = [], i = t.fontSize, { getGroupIds: s, getParentId: o } = _x(e);
    return e.subGraphs.reverse().forEach((a) => {
      const n = s(a.id), l = Ua(a), u = id(l, i || 16) + kx * 2, f = Math.max(a.width, u), d = a.x - (f - a.width) / 2, p = bs(a.containerStyle), m = yn(a.labelStyle), y = {
        id: a.id,
        type: "rectangle",
        groupIds: n,
        x: d,
        y: a.y,
        width: f,
        height: a.height,
        label: {
          groupIds: n,
          text: l,
          fontSize: i,
          verticalAlign: "top",
          ...m
        },
        ...p
      };
      r.push(y);
    }), Object.values(e.vertices).forEach((a) => {
      if (!a)
        return;
      const n = s(a.id), l = Ua(a), h = Tx(a.type, l, a.width, i), c = bs(a.containerStyle), u = yn(a.labelStyle);
      let f = {
        id: a.id,
        type: "rectangle",
        groupIds: n,
        x: a.x,
        y: a.y,
        width: a.width,
        height: a.height,
        strokeWidth: 2,
        label: {
          groupIds: n,
          text: l,
          fontSize: h,
          ...u
        },
        link: a.link || null,
        ...c
      };
      switch (a.type) {
        case gr.STADIUM: {
          f = { ...f, roundness: { type: 3 } };
          break;
        }
        case gr.ROUND: {
          f = { ...f, roundness: { type: 3 } };
          break;
        }
        case gr.DOUBLECIRCLE: {
          n.push(`doublecircle_${a.id}}`);
          const p = {
            type: "ellipse",
            groupIds: n,
            x: a.x + 5,
            y: a.y + 5,
            width: a.width - 5 * 2,
            height: a.height - 5 * 2,
            strokeWidth: 2,
            roundness: { type: 3 },
            label: {
              groupIds: n,
              text: l,
              fontSize: h,
              ...u
            }
          };
          f = { ...f, groupIds: n, type: "ellipse" }, r.push(p);
          break;
        }
        case gr.CIRCLE: {
          f.type = "ellipse";
          break;
        }
        case gr.DIAMOND: {
          f.type = "diamond";
          break;
        }
      }
      r.push(f);
    }), e.edges.forEach((a) => {
      let n = [];
      const l = o(a.start), h = o(a.end);
      l && l === h && (n = s(l));
      const { startX: c, startY: u, reflectionPoints: f } = a, d = f.map((k) => bx(k.x - f[0].x, k.y - f[0].y)), p = xx(a.type || "arrow_point"), m = r.find((k) => k.id === a.start), y = r.find((k) => k.id === a.end);
      if (!m || !y)
        return;
      const C = {
        id: `${a.start}_${a.end}`,
        type: "arrow",
        groupIds: n,
        x: c,
        y: u,
        // 4 and 2 are the Excalidraw's stroke width of thick and thin respectively
        // TODO: use constant exported from Excalidraw package
        strokeWidth: a.stroke === "thick" ? 4 : 2,
        strokeStyle: a.stroke === "dotted" ? "dashed" : void 0,
        points: d,
        ...a.text ? { label: { text: Ua(a), fontSize: i, groupIds: n } } : {},
        roundness: {
          type: 2
        },
        ...p,
        start: {
          id: m.id || ""
        },
        end: {
          id: y.id || ""
        }
      };
      r.push(C);
    }), {
      elements: r
    };
  }
}), vx = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let be = (e = 21) => {
  let t = "", r = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    t += vx[r[e] & 63];
  return t;
};
const Lx = new zi({
  converter: (e) => {
    const t = be(), { width: r, height: i } = e, s = {
      type: "image",
      x: 0,
      y: 0,
      width: r,
      height: i,
      status: "saved",
      fileId: t
    };
    return { files: {
      [t]: {
        id: t,
        mimeType: e.mimeType,
        dataURL: e.dataURL
      }
    }, elements: [s] };
  }
}), fs = (e, t) => [e, t], wl = (e) => e.replace(/\\n/g, `
`), Pr = (e) => {
  const t = {
    type: "line",
    x: e.startX,
    y: e.startY,
    points: [
      fs(0, 0),
      fs(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e.strokeStyle || "solid",
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 1
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, Nr = (e) => {
  const t = {
    type: "text",
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    text: wl(e.text) || "",
    fontSize: e.fontSize,
    verticalAlign: "top",
    strokeColor: e.color
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, fi = (e) => {
  var s, o, a, n, l;
  const t = {
    text: wl(((s = e == null ? void 0 : e.label) == null ? void 0 : s.text) || ""),
    fontSize: (o = e == null ? void 0 : e.label) == null ? void 0 : o.fontSize,
    textAlign: (a = e.label) == null ? void 0 : a.textAlign,
    verticalAlign: ((n = e.label) == null ? void 0 : n.verticalAlign) || "middle",
    strokeColor: ((l = e.label) == null ? void 0 : l.color) || "#000",
    ...e.groupId ? { groupIds: [e.groupId] } : {}
  };
  let r = {};
  e.type === "rectangle" && e.subtype === "activation" && (r = {
    backgroundColor: "#e9ecef",
    fillStyle: "solid"
  });
  const i = {
    id: e.id,
    type: e.type,
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    label: t,
    strokeStyle: e == null ? void 0 : e.strokeStyle,
    strokeWidth: e == null ? void 0 : e.strokeWidth,
    strokeColor: e == null ? void 0 : e.strokeColor,
    backgroundColor: e == null ? void 0 : e.bgColor,
    fillStyle: "solid",
    ...r
  };
  return e.groupId && Object.assign(i, { groupIds: [e.groupId] }), i;
}, Tl = (e) => {
  var r, i, s, o;
  const t = {
    type: "arrow",
    x: e.startX,
    y: e.startY,
    points: ((r = e.points) == null ? void 0 : r.map(([a, n]) => fs(a, n))) || [
      fs(0, 0),
      fs(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: (e == null ? void 0 : e.strokeStyle) || "solid",
    endArrowhead: (e == null ? void 0 : e.endArrowhead) || null,
    startArrowhead: (e == null ? void 0 : e.startArrowhead) || null,
    label: {
      text: wl(((i = e == null ? void 0 : e.label) == null ? void 0 : i.text) || ""),
      fontSize: 16,
      textAlign: (s = e == null ? void 0 : e.label) == null ? void 0 : s.textAlign,
      verticalAlign: (o = e == null ? void 0 : e.label) == null ? void 0 : o.verticalAlign
    },
    roundness: {
      type: 2
    },
    start: e.start,
    end: e.end
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), t;
}, Js = 10, Xa = 16, Ax = 24, Fx = 4, Ex = (e) => {
  if (!e)
    return !0;
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "none" || t === "rgba(0,0,0,0)" || t === "rgba(0, 0, 0, 0)";
}, Mx = (e, t) => Math.max(20, Math.round(e.length * t * 0.6)), ec = (e, t, r = !0) => {
  const i = e, s = i.groupIds ?? [];
  if (s.includes(t) || (i.groupIds = [...s, t]), !r || !i.label)
    return;
  const o = i.label.groupIds ?? [];
  o.includes(t) || (i.label.groupIds = [...o, t]);
}, $x = new zi({
  converter: (e) => {
    const t = [], r = [];
    if (Object.values(e.nodes).forEach((i) => {
      !i || !i.length || i.forEach((s) => {
        let o;
        switch (s.type) {
          case "line":
            o = Pr(s);
            break;
          case "rectangle":
          case "ellipse":
            o = fi(s);
            break;
          case "text":
            o = Nr(s);
            break;
          default:
            throw `unknown type ${s.type}`;
        }
        s.type === "rectangle" && (s == null ? void 0 : s.subtype) === "activation" ? r.push(o) : t.push(o);
      });
    }), Object.values(e.lines).forEach((i) => {
      i && t.push(Pr(i));
    }), Object.values(e.arrows).forEach((i) => {
      i && (t.push(Tl(i)), i.sequenceNumber && t.push(fi(i.sequenceNumber)));
    }), t.push(...r), e.loops) {
      const { lines: i, texts: s, nodes: o } = e.loops;
      i.forEach((a) => {
        t.push(Pr(a));
      }), s.forEach((a) => {
        t.push(Nr(a));
      }), o.forEach((a) => {
        t.push(fi(a));
      });
    }
    return e.groups && e.groups.forEach((i) => {
      const { actorKeys: s, name: o } = i;
      let a = 1 / 0, n = 1 / 0, l = 0, h = 0;
      if (!s.length)
        return;
      const c = t.filter((C) => {
        if (C.id) {
          const k = C.id.indexOf("-"), w = C.id.substring(0, k);
          return s.includes(w);
        }
        return !1;
      });
      if (!c.length || (c.forEach((C) => {
        C.x === void 0 || C.y === void 0 || C.width === void 0 || C.height === void 0 || (a = Math.min(a, C.x), n = Math.min(n, C.y), l = Math.max(l, C.x + C.width), h = Math.max(h, C.y + C.height));
      }), !Number.isFinite(a) || !Number.isFinite(n) || !Number.isFinite(l) || !Number.isFinite(h)))
        return;
      const u = a - Js, f = n - Js, d = l - a + Js * 2, p = h - n + Js * 2, m = be(), y = be(), x = fi({
        type: "rectangle",
        x: u,
        y: f,
        width: d,
        height: p,
        bgColor: Ex(i.fill) ? void 0 : i.fill,
        strokeColor: "#1f1f1f",
        strokeWidth: 1,
        id: m,
        groupId: y
      });
      if (t.unshift(x), t.forEach((C) => {
        C.id !== m && (C.x === void 0 || C.y === void 0 || C.width === void 0 || C.height === void 0 || C.x >= a && C.x + C.width <= l && C.y >= n && C.y + C.height <= h && ec(C, y));
      }), o) {
        const C = Nr({
          id: be(),
          text: o,
          x: u + Fx,
          y: f - Ax,
          width: Mx(o, Xa),
          height: Xa + 8,
          fontSize: Xa,
          color: "#1f1f1f",
          groupId: y
        });
        ec(C, y, !1), t.push(C);
      }
    }), { elements: t };
  }
}), Ox = new zi({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = Pr(i);
            break;
          case "rectangle":
          case "ellipse":
            s = fi(i);
            break;
          case "text":
            s = Nr(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), Object.values(e.lines).forEach((r) => {
      r && t.push(Pr(r));
    }), Object.values(e.arrows).forEach((r) => {
      if (!r)
        return;
      const i = Tl(r);
      t.push(i);
    }), Object.values(e.text).forEach((r) => {
      const i = Nr(r);
      t.push(i);
    }), Object.values(e.namespaces).forEach((r) => {
      const i = Object.keys(r.classes), s = [...i], o = [...e.lines, ...e.arrows, ...e.text];
      i.forEach((n) => {
        const l = o.filter((h) => h.metadata && h.metadata.classId === n).map((h) => h.id);
        l.length && s.push(...l);
      });
      const a = {
        type: "frame",
        id: be(),
        name: r.id,
        children: s
      };
      t.push(a);
    }), { elements: t };
  }
}), Ix = new zi({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = Pr(i);
            break;
          case "rectangle":
          case "ellipse":
            s = fi(i);
            break;
          case "text":
            s = Nr(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), e.lines.forEach((r) => {
      t.push(Pr(r));
    }), e.arrows.forEach((r) => {
      t.push(Tl(r));
    }), e.text.forEach((r) => {
      t.push(Nr(r));
    }), { elements: t };
  }
}), vo = (e, t) => [e, t], is = 16, sd = 14, Dx = 1, xn = "#000000", od = 5, Rx = od * 2, Px = od * 2, Nx = 1.25, ad = /* @__PURE__ */ new Set([
  "choice",
  "fork",
  "join",
  "stateStart",
  "stateEnd",
  "divider"
]), Cn = (e) => e.shape === "stateEnd" ? [`state_end_group_${e.id}`] : void 0, nd = (e) => e.shape === "rectWithTitle" && e.description.length ? [e.text, ...e.description].join(`
`) : e.text;
let Lr;
const qx = () => {
  if (Lr !== void 0)
    return Lr;
  if (typeof document > "u")
    return Lr = null, Lr;
  try {
    Lr = document.createElement("canvas").getContext("2d");
  } catch {
    Lr = null;
  }
  return Lr;
}, $i = (e, t) => {
  const r = qx();
  return r ? (r.font = `${t}px Excalifont, sans-serif`, r.measureText(e).width) : e.length * t * 0.6;
}, Wx = (e, t, r) => {
  if ($i(e, t) <= r)
    return [e];
  const i = [];
  let s = "";
  for (const o of e) {
    const a = `${s}${o}`;
    if (s && $i(a, t) > r) {
      i.push(s), s = o;
      continue;
    }
    s = a;
  }
  return s && i.push(s), i;
}, zx = (e, t, r) => {
  if (!e.trim() || $i(e, t) <= r)
    return e;
  const i = e.split(/\s+/).filter(Boolean), s = [];
  let o = "";
  for (const a of i) {
    const n = Wx(a, t, r);
    for (const [l, h] of n.entries()) {
      const u = o ? `${o}${o && l === 0 ? " " : ""}${h}` : h;
      if ($i(u, t) <= r) {
        o = u;
        continue;
      }
      o && s.push(o), o = h;
    }
    n.length > 1;
  }
  return s.push(o), s.join(`
`);
}, Hx = (e, t, r) => {
  const s = e.map((n) => zx(n, t, r)).join(`
`).split(`
`), o = Math.max(...s.map((n) => $i(n, t))), a = s.length * t * Nx;
  return {
    width: o,
    height: a
  };
}, Yx = (e, t, r, i) => {
  const s = e.split(`
`);
  for (let o = is; o >= sd; o -= Dx) {
    const { height: a } = Hx(s, o, t);
    if (a <= r)
      return o;
  }
  return i;
}, Ux = (e) => {
  const t = nd(e);
  if (!t || ad.has(e.shape))
    return is;
  const r = Math.max(1, e.width - Rx), i = Math.max(1, e.height - Px), s = t.split(`
`);
  return s.length > 1 && Math.max(...s.map((a) => $i(a, is))) <= r ? is : Yx(t, r, i, s.length === 1 ? is : sd);
}, Xx = (e) => {
  if (ad.has(e.shape))
    return;
  const t = nd(e);
  if (t)
    return {
      text: t,
      fontSize: Ux(e),
      verticalAlign: e.shape === "rectWithTitle" || e.shape === "roundedWithTitle" ? "top" : "middle",
      ...yn(e.labelStyle)
    };
}, Gx = (e) => {
  const t = bs(e.containerStyle), r = Xx(e), i = e.shape === "choice" ? "diamond" : e.shape === "stateStart" || e.shape === "stateEnd" ? "ellipse" : "rectangle", s = e.shape === "rect" || e.shape === "rectWithTitle" || e.shape === "roundedWithTitle", o = e.shape === "stateStart" || e.shape === "fork" || e.shape === "join", a = t.backgroundColor || t.strokeColor || xn, n = t.strokeColor || t.backgroundColor || xn;
  return {
    id: e.id,
    type: i,
    ...Cn(e) ? { groupIds: Cn(e) } : {},
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    ...r ? { label: r } : {},
    ...t,
    ...s ? { roundness: { type: 3 } } : {},
    ...o ? {
      backgroundColor: a,
      strokeColor: n,
      fillStyle: "solid"
    } : {}
  };
}, jx = (e) => {
  if (!e.dividerLine)
    return null;
  const t = bs(e.containerStyle);
  return {
    id: `${e.id}__divider`,
    type: "line",
    x: e.dividerLine.startX,
    y: e.dividerLine.startY,
    width: e.dividerLine.endX - e.dividerLine.startX,
    height: e.dividerLine.endY - e.dividerLine.startY,
    points: [
      vo(0, 0),
      vo(e.dividerLine.endX - e.dividerLine.startX, e.dividerLine.endY - e.dividerLine.startY)
    ],
    strokeColor: t.strokeColor || "#000",
    strokeWidth: t.strokeWidth || 1
  };
}, Vx = (e) => {
  const t = bs(e.containerStyle), r = Math.max(2, Math.min(e.width, e.height) * 0.32), i = e.endInnerColor || t.strokeColor || t.backgroundColor || xn;
  return {
    id: `${e.id}__inner`,
    type: "ellipse",
    groupIds: Cn(e),
    x: e.x + r,
    y: e.y + r,
    width: Math.max(1, e.width - r * 2),
    height: Math.max(1, e.height - r * 2),
    backgroundColor: i,
    strokeColor: i,
    fillStyle: "solid",
    strokeWidth: 1
  };
}, Zx = (e) => {
  const t = e.reflectionPoints.map((r, i, s) => {
    const o = s[0];
    return i === 0 ? vo(0, 0) : vo(r.x - o.x, r.y - o.y);
  });
  return {
    id: e.id,
    type: "arrow",
    x: e.startX,
    y: e.startY,
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    points: t,
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 2,
    strokeStyle: e.strokeStyle || "solid",
    endArrowhead: e.isNoteEdge ? null : "triangle",
    roundness: { type: 2 },
    start: { id: e.start },
    end: { id: e.end },
    ...e.text ? {
      label: {
        text: e.text,
        fontSize: 16
      }
    } : {}
  };
}, Kx = new zi({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      if (!r.isRenderable)
        return;
      const i = Gx(r);
      t.push(i);
      const s = jx(r);
      s && t.push(s), r.shape === "stateEnd" && t.push(Vx(r));
    }), e.edges.forEach((r) => {
      t.push(Zx(r));
    }), { elements: t };
  }
}), fe = (e) => {
  e = Jx(e);
  const t = e.replace(/#(\d+);/g, "&#$1;").replace(/#([a-z]+);/g, "&$1;"), r = document.createElement("textarea");
  return r.innerHTML = t, r.value;
}, qr = (e) => {
  const t = e.getAttribute("transform"), r = t == null ? void 0 : t.match(/translate\(([ \d.-]+),\s*([\d.-]+)\)/);
  let i = 0, s = 0;
  return r && (i = Number(r[1]), s = Number(r[2])), { transformX: i, transformY: s };
}, Qx = (e) => {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/classDef.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/#\w+;/g, (r) => {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? `ﬂ°°${i}¶ß` : `ﬂ°${i}¶ß`;
  }), t;
}, Jx = function(e) {
  return e.replace(/ﬂ°°/g, "#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, tC = 0.5, _l = (e, t = tC) => {
  const r = [];
  return e.forEach((i) => {
    const s = r[r.length - 1];
    if (!s) {
      r.push(i);
      return;
    }
    Math.hypot(i[0] - s[0], i[1] - s[1]) <= t || r.push(i);
  }), r;
}, Bl = (e) => {
  const t = e.getAttribute("d");
  if (!t)
    return null;
  const r = Array.from(t.matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi), (i) => Number(i[0]));
  return r.length < 4 ? null : {
    startX: r[0],
    startY: r[1],
    endX: r[r.length - 2],
    endY: r[r.length - 1]
  };
}, ld = (e) => {
  const t = e.getAttribute("data-points");
  if (!t) {
    const r = Bl(e);
    return r ? [
      { x: r.startX, y: r.startY },
      { x: r.endX, y: r.endY }
    ] : [];
  }
  try {
    const r = atob(t), i = JSON.parse(r);
    return Array.isArray(i) ? i.filter((s) => s && typeof s.x == "number" && typeof s.y == "number" && Number.isFinite(s.x) && Number.isFinite(s.y)) : [];
  } catch {
    return [];
  }
}, hd = (e, t = { x: 0, y: 0 }, r = "LM") => {
  if (e.tagName.toLowerCase() !== "path")
    throw new Error(`Invalid input: Expected an HTMLElement of tag "path", got ${e.tagName}`);
  const i = e.getAttribute("d");
  if (!i)
    throw new Error('Path element does not contain a "d" attribute');
  const s = i.split(new RegExp(`(?=[${r}])`)), o = s[0].substring(1).split(",").map((l) => parseFloat(l)), a = s[s.length - 1].substring(1).split(",").map((l) => parseFloat(l)), n = s.map((l) => {
    const h = l[0], c = l.substring(1).split(",").map((u) => parseFloat(u));
    return h === "C" ? {
      x: c[4],
      y: c[5],
      command: h
    } : { x: c[0], y: c[1], command: h };
  }).filter((l, h, c) => {
    if (h === 0 || h === c.length - 1)
      return !0;
    if (l.x === c[h - 1].x && l.y === c[h - 1].y || h === c.length - 2 && l.command === "C")
      return !1;
    if (h === c.length - 2 && (c[h - 1].x === l.x || c[h - 1].y === l.y)) {
      const u = c[c.length - 1];
      return Math.hypot(u.x - l.x, u.y - l.y) > 20;
    }
    return l.x !== c[h - 1].x || l.y !== c[h - 1].y;
  }).map((l) => ({
    x: l.x + t.x,
    y: l.y + t.y
  }));
  return {
    startX: o[0] + t.x,
    startY: o[1] + t.y,
    endX: a[0] + t.x,
    endY: a[1] + t.y,
    reflectionPoints: n
  };
}, eC = (e) => ({
  ...e,
  elements: e.elements.map((t) => {
    if (!("points" in t) || !Array.isArray(t.points))
      return t;
    const r = t.points;
    if (r.length < 2)
      return t;
    const i = _l(r);
    return i.length === r.length ? t : {
      ...t,
      points: i
    };
  })
}), rC = (e, t = {}) => {
  const r = (() => {
    switch (e.type) {
      case "graphImage":
        return Lx.convert(e, t);
      case "flowchart":
        return Bx.convert(e, t);
      case "sequence":
        return $x.convert(e, t);
      case "class":
        return Ox.convert(e, t);
      case "erd":
        return Ix.convert(e, t);
      case "state":
        return Kx.convert(e, t);
      default:
        throw new Error(`graphToExcalidraw: unknown graph type "${e.type}, only flowcharts are supported!"`);
    }
  })();
  return eC(r);
};
var cd = Object.defineProperty, g = (e, t) => cd(e, "name", { value: t, configurable: !0 }), iC = (e, t) => {
  for (var r in t)
    cd(e, r, { get: t[r], enumerable: !0 });
}, ud = { exports: {} };
(function(e, t) {
  (function(r, i) {
    e.exports = i();
  })(fx, function() {
    var r = 1e3, i = 6e4, s = 36e5, o = "millisecond", a = "second", n = "minute", l = "hour", h = "day", c = "week", u = "month", f = "quarter", d = "year", p = "date", m = "Invalid Date", y = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, x = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, C = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(D) {
      var E = ["th", "st", "nd", "rd"], A = D % 100;
      return "[" + D + (E[(A - 20) % 10] || E[A] || E[0]) + "]";
    } }, k = function(D, E, A) {
      var $ = String(D);
      return !$ || $.length >= E ? D : "" + Array(E + 1 - $.length).join(A) + D;
    }, w = { s: k, z: function(D) {
      var E = -D.utcOffset(), A = Math.abs(E), $ = Math.floor(A / 60), B = A % 60;
      return (E <= 0 ? "+" : "-") + k($, 2, "0") + ":" + k(B, 2, "0");
    }, m: function D(E, A) {
      if (E.date() < A.date()) return -D(A, E);
      var $ = 12 * (A.year() - E.year()) + (A.month() - E.month()), B = E.clone().add($, u), I = A - B < 0, Y = E.clone().add($ + (I ? -1 : 1), u);
      return +(-($ + (A - B) / (I ? B - Y : Y - B)) || 0);
    }, a: function(D) {
      return D < 0 ? Math.ceil(D) || 0 : Math.floor(D);
    }, p: function(D) {
      return { M: u, y: d, w: c, d: h, D: p, h: l, m: n, s: a, ms: o, Q: f }[D] || String(D || "").toLowerCase().replace(/s$/, "");
    }, u: function(D) {
      return D === void 0;
    } }, T = "en", _ = {};
    _[T] = C;
    var v = "$isDayjsObject", L = function(D) {
      return D instanceof U || !(!D || !D[v]);
    }, W = function D(E, A, $) {
      var B;
      if (!E) return T;
      if (typeof E == "string") {
        var I = E.toLowerCase();
        _[I] && (B = I), A && (_[I] = A, B = I);
        var Y = E.split("-");
        if (!B && Y.length > 1) return D(Y[0]);
      } else {
        var X = E.name;
        _[X] = E, B = X;
      }
      return !$ && B && (T = B), B || !$ && T;
    }, O = function(D, E) {
      if (L(D)) return D.clone();
      var A = typeof E == "object" ? E : {};
      return A.date = D, A.args = arguments, new U(A);
    }, M = w;
    M.l = W, M.i = L, M.w = function(D, E) {
      return O(D, { locale: E.$L, utc: E.$u, x: E.$x, $offset: E.$offset });
    };
    var U = function() {
      function D(A) {
        this.$L = W(A.locale, null, !0), this.parse(A), this.$x = this.$x || A.x || {}, this[v] = !0;
      }
      var E = D.prototype;
      return E.parse = function(A) {
        this.$d = function($) {
          var B = $.date, I = $.utc;
          if (B === null) return /* @__PURE__ */ new Date(NaN);
          if (M.u(B)) return /* @__PURE__ */ new Date();
          if (B instanceof Date) return new Date(B);
          if (typeof B == "string" && !/Z$/i.test(B)) {
            var Y = B.match(y);
            if (Y) {
              var X = Y[2] - 1 || 0, Z = (Y[7] || "0").substring(0, 3);
              return I ? new Date(Date.UTC(Y[1], X, Y[3] || 1, Y[4] || 0, Y[5] || 0, Y[6] || 0, Z)) : new Date(Y[1], X, Y[3] || 1, Y[4] || 0, Y[5] || 0, Y[6] || 0, Z);
            }
          }
          return new Date(B);
        }(A), this.init();
      }, E.init = function() {
        var A = this.$d;
        this.$y = A.getFullYear(), this.$M = A.getMonth(), this.$D = A.getDate(), this.$W = A.getDay(), this.$H = A.getHours(), this.$m = A.getMinutes(), this.$s = A.getSeconds(), this.$ms = A.getMilliseconds();
      }, E.$utils = function() {
        return M;
      }, E.isValid = function() {
        return this.$d.toString() !== m;
      }, E.isSame = function(A, $) {
        var B = O(A);
        return this.startOf($) <= B && B <= this.endOf($);
      }, E.isAfter = function(A, $) {
        return O(A) < this.startOf($);
      }, E.isBefore = function(A, $) {
        return this.endOf($) < O(A);
      }, E.$g = function(A, $, B) {
        return M.u(A) ? this[$] : this.set(B, A);
      }, E.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, E.valueOf = function() {
        return this.$d.getTime();
      }, E.startOf = function(A, $) {
        var B = this, I = !!M.u($) || $, Y = M.p(A), X = function(At, K) {
          var V = M.w(B.$u ? Date.UTC(B.$y, K, At) : new Date(B.$y, K, At), B);
          return I ? V : V.endOf(h);
        }, Z = function(At, K) {
          return M.w(B.toDate()[At].apply(B.toDate("s"), (I ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(K)), B);
        }, ot = this.$W, Q = this.$M, at = this.$D, gt = "set" + (this.$u ? "UTC" : "");
        switch (Y) {
          case d:
            return I ? X(1, 0) : X(31, 11);
          case u:
            return I ? X(1, Q) : X(0, Q + 1);
          case c:
            var mt = this.$locale().weekStart || 0, Tt = (ot < mt ? ot + 7 : ot) - mt;
            return X(I ? at - Tt : at + (6 - Tt), Q);
          case h:
          case p:
            return Z(gt + "Hours", 0);
          case l:
            return Z(gt + "Minutes", 1);
          case n:
            return Z(gt + "Seconds", 2);
          case a:
            return Z(gt + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, E.endOf = function(A) {
        return this.startOf(A, !1);
      }, E.$set = function(A, $) {
        var B, I = M.p(A), Y = "set" + (this.$u ? "UTC" : ""), X = (B = {}, B[h] = Y + "Date", B[p] = Y + "Date", B[u] = Y + "Month", B[d] = Y + "FullYear", B[l] = Y + "Hours", B[n] = Y + "Minutes", B[a] = Y + "Seconds", B[o] = Y + "Milliseconds", B)[I], Z = I === h ? this.$D + ($ - this.$W) : $;
        if (I === u || I === d) {
          var ot = this.clone().set(p, 1);
          ot.$d[X](Z), ot.init(), this.$d = ot.set(p, Math.min(this.$D, ot.daysInMonth())).$d;
        } else X && this.$d[X](Z);
        return this.init(), this;
      }, E.set = function(A, $) {
        return this.clone().$set(A, $);
      }, E.get = function(A) {
        return this[M.p(A)]();
      }, E.add = function(A, $) {
        var B, I = this;
        A = Number(A);
        var Y = M.p($), X = function(Q) {
          var at = O(I);
          return M.w(at.date(at.date() + Math.round(Q * A)), I);
        };
        if (Y === u) return this.set(u, this.$M + A);
        if (Y === d) return this.set(d, this.$y + A);
        if (Y === h) return X(1);
        if (Y === c) return X(7);
        var Z = (B = {}, B[n] = i, B[l] = s, B[a] = r, B)[Y] || 1, ot = this.$d.getTime() + A * Z;
        return M.w(ot, this);
      }, E.subtract = function(A, $) {
        return this.add(-1 * A, $);
      }, E.format = function(A) {
        var $ = this, B = this.$locale();
        if (!this.isValid()) return B.invalidDate || m;
        var I = A || "YYYY-MM-DDTHH:mm:ssZ", Y = M.z(this), X = this.$H, Z = this.$m, ot = this.$M, Q = B.weekdays, at = B.months, gt = B.meridiem, mt = function(K, V, Ct, ht) {
          return K && (K[V] || K($, I)) || Ct[V].slice(0, ht);
        }, Tt = function(K) {
          return M.s(X % 12 || 12, K, "0");
        }, At = gt || function(K, V, Ct) {
          var ht = K < 12 ? "AM" : "PM";
          return Ct ? ht.toLowerCase() : ht;
        };
        return I.replace(x, function(K, V) {
          return V || function(Ct) {
            switch (Ct) {
              case "YY":
                return String($.$y).slice(-2);
              case "YYYY":
                return M.s($.$y, 4, "0");
              case "M":
                return ot + 1;
              case "MM":
                return M.s(ot + 1, 2, "0");
              case "MMM":
                return mt(B.monthsShort, ot, at, 3);
              case "MMMM":
                return mt(at, ot);
              case "D":
                return $.$D;
              case "DD":
                return M.s($.$D, 2, "0");
              case "d":
                return String($.$W);
              case "dd":
                return mt(B.weekdaysMin, $.$W, Q, 2);
              case "ddd":
                return mt(B.weekdaysShort, $.$W, Q, 3);
              case "dddd":
                return Q[$.$W];
              case "H":
                return String(X);
              case "HH":
                return M.s(X, 2, "0");
              case "h":
                return Tt(1);
              case "hh":
                return Tt(2);
              case "a":
                return At(X, Z, !0);
              case "A":
                return At(X, Z, !1);
              case "m":
                return String(Z);
              case "mm":
                return M.s(Z, 2, "0");
              case "s":
                return String($.$s);
              case "ss":
                return M.s($.$s, 2, "0");
              case "SSS":
                return M.s($.$ms, 3, "0");
              case "Z":
                return Y;
            }
            return null;
          }(K) || Y.replace(":", "");
        });
      }, E.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, E.diff = function(A, $, B) {
        var I, Y = this, X = M.p($), Z = O(A), ot = (Z.utcOffset() - this.utcOffset()) * i, Q = this - Z, at = function() {
          return M.m(Y, Z);
        };
        switch (X) {
          case d:
            I = at() / 12;
            break;
          case u:
            I = at();
            break;
          case f:
            I = at() / 3;
            break;
          case c:
            I = (Q - ot) / 6048e5;
            break;
          case h:
            I = (Q - ot) / 864e5;
            break;
          case l:
            I = Q / s;
            break;
          case n:
            I = Q / i;
            break;
          case a:
            I = Q / r;
            break;
          default:
            I = Q;
        }
        return B ? I : M.a(I);
      }, E.daysInMonth = function() {
        return this.endOf(u).$D;
      }, E.$locale = function() {
        return _[this.$L];
      }, E.locale = function(A, $) {
        if (!A) return this.$L;
        var B = this.clone(), I = W(A, $, !0);
        return I && (B.$L = I), B;
      }, E.clone = function() {
        return M.w(this.$d, this);
      }, E.toDate = function() {
        return new Date(this.valueOf());
      }, E.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, E.toISOString = function() {
        return this.$d.toISOString();
      }, E.toString = function() {
        return this.$d.toUTCString();
      }, D;
    }(), z = U.prototype;
    return O.prototype = z, [["$ms", o], ["$s", a], ["$m", n], ["$H", l], ["$W", h], ["$M", u], ["$y", d], ["$D", p]].forEach(function(D) {
      z[D[1]] = function(E) {
        return this.$g(E, D[0], D[1]);
      };
    }), O.extend = function(D, E) {
      return D.$i || (D(E, U, O), D.$i = !0), O;
    }, O.locale = W, O.isDayjs = L, O.unix = function(D) {
      return O(1e3 * D);
    }, O.en = _[T], O.Ls = _, O.p = {}, O;
  });
})(ud);
var sC = ud.exports;
const oC = /* @__PURE__ */ px(sC);
var Qe = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}, H = {
  trace: /* @__PURE__ */ g((...e) => {
  }, "trace"),
  debug: /* @__PURE__ */ g((...e) => {
  }, "debug"),
  info: /* @__PURE__ */ g((...e) => {
  }, "info"),
  warn: /* @__PURE__ */ g((...e) => {
  }, "warn"),
  error: /* @__PURE__ */ g((...e) => {
  }, "error"),
  fatal: /* @__PURE__ */ g((...e) => {
  }, "fatal")
}, vl = /* @__PURE__ */ g(function(e = "fatal") {
  let t = Qe.fatal;
  typeof e == "string" ? e.toLowerCase() in Qe && (t = Qe[e]) : typeof e == "number" && (t = e), H.trace = () => {
  }, H.debug = () => {
  }, H.info = () => {
  }, H.warn = () => {
  }, H.error = () => {
  }, H.fatal = () => {
  }, t <= Qe.fatal && (H.fatal = console.error ? console.error.bind(console, Ce("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", Ce("FATAL"))), t <= Qe.error && (H.error = console.error ? console.error.bind(console, Ce("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", Ce("ERROR"))), t <= Qe.warn && (H.warn = console.warn ? console.warn.bind(console, Ce("WARN"), "color: orange") : console.log.bind(console, "\x1B[33m", Ce("WARN"))), t <= Qe.info && (H.info = console.info ? console.info.bind(console, Ce("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", Ce("INFO"))), t <= Qe.debug && (H.debug = console.debug ? console.debug.bind(console, Ce("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", Ce("DEBUG"))), t <= Qe.trace && (H.trace = console.debug ? console.debug.bind(console, Ce("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", Ce("TRACE")));
}, "setLogLevel"), Ce = /* @__PURE__ */ g((e) => `%c${oC().format("ss.SSS")} : ${e} : `, "format");
const po = {
  /* CLAMP */
  min: {
    r: 0,
    g: 0,
    b: 0,
    s: 0,
    l: 0,
    a: 0
  },
  max: {
    r: 255,
    g: 255,
    b: 255,
    h: 360,
    s: 100,
    l: 100,
    a: 1
  },
  clamp: {
    r: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    g: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    b: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    h: (e) => e % 360,
    s: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
    l: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
    a: (e) => e >= 1 ? 1 : e < 0 ? 0 : e
  },
  /* CONVERSION */
  //SOURCE: https://planetcalc.com/7779
  toLinear: (e) => {
    const t = e / 255;
    return e > 0.03928 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92;
  },
  //SOURCE: https://gist.github.com/mjackson/5311256
  hue2rgb: (e, t, r) => (r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e),
  hsl2rgb: ({ h: e, s: t, l: r }, i) => {
    if (!t)
      return r * 2.55;
    e /= 360, t /= 100, r /= 100;
    const s = r < 0.5 ? r * (1 + t) : r + t - r * t, o = 2 * r - s;
    switch (i) {
      case "r":
        return po.hue2rgb(o, s, e + 1 / 3) * 255;
      case "g":
        return po.hue2rgb(o, s, e) * 255;
      case "b":
        return po.hue2rgb(o, s, e - 1 / 3) * 255;
    }
  },
  rgb2hsl: ({ r: e, g: t, b: r }, i) => {
    e /= 255, t /= 255, r /= 255;
    const s = Math.max(e, t, r), o = Math.min(e, t, r), a = (s + o) / 2;
    if (i === "l")
      return a * 100;
    if (s === o)
      return 0;
    const n = s - o, l = a > 0.5 ? n / (2 - s - o) : n / (s + o);
    if (i === "s")
      return l * 100;
    switch (s) {
      case e:
        return ((t - r) / n + (t < r ? 6 : 0)) * 60;
      case t:
        return ((r - e) / n + 2) * 60;
      case r:
        return ((e - t) / n + 4) * 60;
      default:
        return -1;
    }
  }
}, aC = {
  /* API */
  clamp: (e, t, r) => t > r ? Math.min(t, Math.max(r, e)) : Math.min(r, Math.max(t, e)),
  round: (e) => Math.round(e * 1e10) / 1e10
}, nC = {
  /* API */
  dec2hex: (e) => {
    const t = Math.round(e).toString(16);
    return t.length > 1 ? t : `0${t}`;
  }
}, yt = {
  channel: po,
  lang: aC,
  unit: nC
}, fr = {};
for (let e = 0; e <= 255; e++)
  fr[e] = yt.unit.dec2hex(e);
const Kt = {
  ALL: 0,
  RGB: 1,
  HSL: 2
};
class lC {
  constructor() {
    this.type = Kt.ALL;
  }
  /* API */
  get() {
    return this.type;
  }
  set(t) {
    if (this.type && this.type !== t)
      throw new Error("Cannot change both RGB and HSL channels at the same time");
    this.type = t;
  }
  reset() {
    this.type = Kt.ALL;
  }
  is(t) {
    return this.type === t;
  }
}
class hC {
  /* CONSTRUCTOR */
  constructor(t, r) {
    this.color = r, this.changed = !1, this.data = t, this.type = new lC();
  }
  /* API */
  set(t, r) {
    return this.color = r, this.changed = !1, this.data = t, this.type.type = Kt.ALL, this;
  }
  /* HELPERS */
  _ensureHSL() {
    const t = this.data, { h: r, s: i, l: s } = t;
    r === void 0 && (t.h = yt.channel.rgb2hsl(t, "h")), i === void 0 && (t.s = yt.channel.rgb2hsl(t, "s")), s === void 0 && (t.l = yt.channel.rgb2hsl(t, "l"));
  }
  _ensureRGB() {
    const t = this.data, { r, g: i, b: s } = t;
    r === void 0 && (t.r = yt.channel.hsl2rgb(t, "r")), i === void 0 && (t.g = yt.channel.hsl2rgb(t, "g")), s === void 0 && (t.b = yt.channel.hsl2rgb(t, "b"));
  }
  /* GETTERS */
  get r() {
    const t = this.data, r = t.r;
    return !this.type.is(Kt.HSL) && r !== void 0 ? r : (this._ensureHSL(), yt.channel.hsl2rgb(t, "r"));
  }
  get g() {
    const t = this.data, r = t.g;
    return !this.type.is(Kt.HSL) && r !== void 0 ? r : (this._ensureHSL(), yt.channel.hsl2rgb(t, "g"));
  }
  get b() {
    const t = this.data, r = t.b;
    return !this.type.is(Kt.HSL) && r !== void 0 ? r : (this._ensureHSL(), yt.channel.hsl2rgb(t, "b"));
  }
  get h() {
    const t = this.data, r = t.h;
    return !this.type.is(Kt.RGB) && r !== void 0 ? r : (this._ensureRGB(), yt.channel.rgb2hsl(t, "h"));
  }
  get s() {
    const t = this.data, r = t.s;
    return !this.type.is(Kt.RGB) && r !== void 0 ? r : (this._ensureRGB(), yt.channel.rgb2hsl(t, "s"));
  }
  get l() {
    const t = this.data, r = t.l;
    return !this.type.is(Kt.RGB) && r !== void 0 ? r : (this._ensureRGB(), yt.channel.rgb2hsl(t, "l"));
  }
  get a() {
    return this.data.a;
  }
  /* SETTERS */
  set r(t) {
    this.type.set(Kt.RGB), this.changed = !0, this.data.r = t;
  }
  set g(t) {
    this.type.set(Kt.RGB), this.changed = !0, this.data.g = t;
  }
  set b(t) {
    this.type.set(Kt.RGB), this.changed = !0, this.data.b = t;
  }
  set h(t) {
    this.type.set(Kt.HSL), this.changed = !0, this.data.h = t;
  }
  set s(t) {
    this.type.set(Kt.HSL), this.changed = !0, this.data.s = t;
  }
  set l(t) {
    this.type.set(Kt.HSL), this.changed = !0, this.data.l = t;
  }
  set a(t) {
    this.changed = !0, this.data.a = t;
  }
}
const la = new hC({ r: 0, g: 0, b: 0, a: 0 }, "transparent"), mi = {
  /* VARIABLES */
  re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
  /* API */
  parse: (e) => {
    if (e.charCodeAt(0) !== 35)
      return;
    const t = e.match(mi.re);
    if (!t)
      return;
    const r = t[1], i = parseInt(r, 16), s = r.length, o = s % 4 === 0, a = s > 4, n = a ? 1 : 17, l = a ? 8 : 4, h = o ? 0 : -1, c = a ? 255 : 15;
    return la.set({
      r: (i >> l * (h + 3) & c) * n,
      g: (i >> l * (h + 2) & c) * n,
      b: (i >> l * (h + 1) & c) * n,
      a: o ? (i & c) * n / 255 : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `#${fr[Math.round(t)]}${fr[Math.round(r)]}${fr[Math.round(i)]}${fr[Math.round(s * 255)]}` : `#${fr[Math.round(t)]}${fr[Math.round(r)]}${fr[Math.round(i)]}`;
  }
}, Or = {
  /* VARIABLES */
  re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
  hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
  /* HELPERS */
  _hue2deg: (e) => {
    const t = e.match(Or.hueRe);
    if (t) {
      const [, r, i] = t;
      switch (i) {
        case "grad":
          return yt.channel.clamp.h(parseFloat(r) * 0.9);
        case "rad":
          return yt.channel.clamp.h(parseFloat(r) * 180 / Math.PI);
        case "turn":
          return yt.channel.clamp.h(parseFloat(r) * 360);
      }
    }
    return yt.channel.clamp.h(parseFloat(e));
  },
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 104 && t !== 72)
      return;
    const r = e.match(Or.re);
    if (!r)
      return;
    const [, i, s, o, a, n] = r;
    return la.set({
      h: Or._hue2deg(i),
      s: yt.channel.clamp.s(parseFloat(s)),
      l: yt.channel.clamp.l(parseFloat(o)),
      a: a ? yt.channel.clamp.a(n ? parseFloat(a) / 100 : parseFloat(a)) : 1
    }, e);
  },
  stringify: (e) => {
    const { h: t, s: r, l: i, a: s } = e;
    return s < 1 ? `hsla(${yt.lang.round(t)}, ${yt.lang.round(r)}%, ${yt.lang.round(i)}%, ${s})` : `hsl(${yt.lang.round(t)}, ${yt.lang.round(r)}%, ${yt.lang.round(i)}%)`;
  }
}, ps = {
  /* VARIABLES */
  colors: {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyanaqua: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    transparent: "#00000000",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  },
  /* API */
  parse: (e) => {
    e = e.toLowerCase();
    const t = ps.colors[e];
    if (t)
      return mi.parse(t);
  },
  stringify: (e) => {
    const t = mi.stringify(e);
    for (const r in ps.colors)
      if (ps.colors[r] === t)
        return r;
  }
}, ss = {
  /* VARIABLES */
  re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 114 && t !== 82)
      return;
    const r = e.match(ss.re);
    if (!r)
      return;
    const [, i, s, o, a, n, l, h, c] = r;
    return la.set({
      r: yt.channel.clamp.r(s ? parseFloat(i) * 2.55 : parseFloat(i)),
      g: yt.channel.clamp.g(a ? parseFloat(o) * 2.55 : parseFloat(o)),
      b: yt.channel.clamp.b(l ? parseFloat(n) * 2.55 : parseFloat(n)),
      a: h ? yt.channel.clamp.a(c ? parseFloat(h) / 100 : parseFloat(h)) : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `rgba(${yt.lang.round(t)}, ${yt.lang.round(r)}, ${yt.lang.round(i)}, ${yt.lang.round(s)})` : `rgb(${yt.lang.round(t)}, ${yt.lang.round(r)}, ${yt.lang.round(i)})`;
  }
}, Ue = {
  /* VARIABLES */
  format: {
    keyword: ps,
    hex: mi,
    rgb: ss,
    rgba: ss,
    hsl: Or,
    hsla: Or
  },
  /* API */
  parse: (e) => {
    if (typeof e != "string")
      return e;
    const t = mi.parse(e) || ss.parse(e) || Or.parse(e) || ps.parse(e);
    if (t)
      return t;
    throw new Error(`Unsupported color format: "${e}"`);
  },
  stringify: (e) => !e.changed && e.color ? e.color : e.type.is(Kt.HSL) || e.data.r === void 0 ? Or.stringify(e) : e.a < 1 || !Number.isInteger(e.r) || !Number.isInteger(e.g) || !Number.isInteger(e.b) ? ss.stringify(e) : mi.stringify(e)
}, dd = (e, t) => {
  const r = Ue.parse(e);
  for (const i in t)
    r[i] = yt.channel.clamp[i](t[i]);
  return Ue.stringify(r);
}, Cr = (e, t, r = 0, i = 1) => {
  if (typeof e != "number")
    return dd(e, { a: t });
  const s = la.set({
    r: yt.channel.clamp.r(e),
    g: yt.channel.clamp.g(t),
    b: yt.channel.clamp.b(r),
    a: yt.channel.clamp.a(i)
  });
  return Ue.stringify(s);
}, cC = (e) => {
  const { r: t, g: r, b: i } = Ue.parse(e), s = 0.2126 * yt.channel.toLinear(t) + 0.7152 * yt.channel.toLinear(r) + 0.0722 * yt.channel.toLinear(i);
  return yt.lang.round(s);
}, uC = (e) => cC(e) >= 0.5, Oe = (e) => !uC(e), fd = (e, t, r) => {
  const i = Ue.parse(e), s = i[t], o = yt.channel.clamp[t](s + r);
  return s !== o && (i[t] = o), Ue.stringify(i);
}, N = (e, t) => fd(e, "l", t), q = (e, t) => fd(e, "l", -t), b = (e, t) => {
  const r = Ue.parse(e), i = {};
  for (const s in t)
    t[s] && (i[s] = r[s] + t[s]);
  return dd(e, i);
}, dC = (e, t, r = 50) => {
  const { r: i, g: s, b: o, a } = Ue.parse(e), { r: n, g: l, b: h, a: c } = Ue.parse(t), u = r / 100, f = u * 2 - 1, d = a - c, m = ((f * d === -1 ? f : (f + d) / (1 + f * d)) + 1) / 2, y = 1 - m, x = i * m + n * y, C = s * m + l * y, k = o * m + h * y, w = a * u + c * (1 - u);
  return Cr(x, C, k, w);
}, F = (e, t = 100) => {
  const r = Ue.parse(e);
  return r.r = 255 - r.r, r.g = 255 - r.g, r.b = 255 - r.b, dC(r, e, t);
};
/*! @license DOMPurify 3.4.12 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.12/LICENSE */
function rc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
  return i;
}
function fC(e) {
  if (Array.isArray(e)) return e;
}
function pC(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var i, s, o, a, n = [], l = !0, h = !1;
    try {
      if (o = (r = r.call(e)).next, t !== 0) for (; !(l = (i = o.call(r)).done) && (n.push(i.value), n.length !== t); l = !0) ;
    } catch (c) {
      h = !0, s = c;
    } finally {
      try {
        if (!l && r.return != null && (a = r.return(), Object(a) !== a)) return;
      } finally {
        if (h) throw s;
      }
    }
    return n;
  }
}
function gC() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function mC(e, t) {
  return fC(e) || pC(e, t) || yC(e, t) || gC();
}
function yC(e, t) {
  if (e) {
    if (typeof e == "string") return rc(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? rc(e, t) : void 0;
  }
}
const pd = Object.entries, ic = Object.setPrototypeOf, xC = Object.isFrozen, CC = Object.getPrototypeOf, bC = Object.getOwnPropertyDescriptor;
let jt = Object.freeze, Vt = Object.seal, hi = Object.create, gd = typeof Reflect < "u" && Reflect, bn = gd.apply, kn = gd.construct;
jt || (jt = function(t) {
  return t;
});
Vt || (Vt = function(t) {
  return t;
});
bn || (bn = function(t, r) {
  for (var i = arguments.length, s = new Array(i > 2 ? i - 2 : 0), o = 2; o < i; o++)
    s[o - 2] = arguments[o];
  return t.apply(r, s);
});
kn || (kn = function(t) {
  for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++)
    i[s - 1] = arguments[s];
  return new t(...i);
});
const si = Pt(Array.prototype.forEach), kC = Pt(Array.prototype.lastIndexOf), sc = Pt(Array.prototype.pop), oi = Pt(Array.prototype.push), SC = Pt(Array.prototype.splice), mr = Array.isArray, os = Pt(String.prototype.toLowerCase), Ga = Pt(String.prototype.toString), oc = Pt(String.prototype.match), ji = Pt(String.prototype.replace), ac = Pt(String.prototype.indexOf), wC = Pt(String.prototype.trim), TC = Pt(Number.prototype.toString), _C = Pt(Boolean.prototype.toString), nc = typeof BigInt > "u" ? null : Pt(BigInt.prototype.toString), lc = typeof Symbol > "u" ? null : Pt(Symbol.prototype.toString), zt = Pt(Object.prototype.hasOwnProperty), Vi = Pt(Object.prototype.toString), Wt = Pt(RegExp.prototype.test), Ar = BC(TypeError);
function Pt(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++)
      i[s - 1] = arguments[s];
    return bn(e, t, i);
  };
}
function BC(e) {
  return function() {
    for (var t = arguments.length, r = new Array(t), i = 0; i < t; i++)
      r[i] = arguments[i];
    return kn(e, r);
  };
}
function wt(e, t) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : os;
  if (ic && ic(e, null), !mr(t))
    return e;
  let i = t.length;
  for (; i--; ) {
    let s = t[i];
    if (typeof s == "string") {
      const o = r(s);
      o !== s && (xC(t) || (t[i] = o), s = o);
    }
    e[s] = !0;
  }
  return e;
}
function vC(e) {
  for (let t = 0; t < e.length; t++)
    zt(e, t) || (e[t] = null);
  return e;
}
function ie(e) {
  const t = hi(null);
  for (const i of pd(e)) {
    var r = mC(i, 2);
    const s = r[0], o = r[1];
    zt(e, s) && (mr(o) ? t[s] = vC(o) : o && typeof o == "object" && o.constructor === Object ? t[s] = ie(o) : t[s] = o);
  }
  return t;
}
function LC(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return TC(e);
    case "boolean":
      return _C(e);
    case "bigint":
      return nc ? nc(e) : "0";
    case "symbol":
      return lc ? lc(e) : "Symbol()";
    case "undefined":
      return Vi(e);
    case "function":
    case "object": {
      if (e === null)
        return Vi(e);
      const t = e, r = Ne(t, "toString");
      if (typeof r == "function") {
        const i = r(t);
        return typeof i == "string" ? i : Vi(i);
      }
      return Vi(e);
    }
    default:
      return Vi(e);
  }
}
function Ne(e, t) {
  for (; e !== null; ) {
    const i = bC(e, t);
    if (i) {
      if (i.get)
        return Pt(i.get);
      if (typeof i.value == "function")
        return Pt(i.value);
    }
    e = CC(e);
  }
  function r() {
    return null;
  }
  return r;
}
function AC(e) {
  try {
    return Wt(e, ""), !0;
  } catch {
    return !1;
  }
}
const hc = jt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), ja = jt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Va = jt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), FC = jt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Za = jt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), EC = jt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), cc = jt(["#text"]), uc = jt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), Ka = jt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), dc = jt(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), to = jt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), MC = Vt(/{{[\w\W]*|^[\w\W]*}}/g), $C = Vt(/<%[\w\W]*|^[\w\W]*%>/g), OC = Vt(/\${[\w\W]*/g), IC = Vt(/^data-[\-\w.\u00B7-\uFFFF]+$/), DC = Vt(/^aria-[\-\w]+$/), fc = Vt(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), RC = Vt(/^(?:\w+script|data):/i), PC = Vt(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), NC = Vt(/^html$/i), qC = Vt(/^[a-z][.\w]*(-[.\w]+)+$/i), pc = Vt(/<[/\w!]/g), gc = Vt(/<[/\w]/g), WC = Vt(/<\/no(script|embed|frames)/i), zC = Vt(/\/>/i), pe = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
}, HC = function() {
  return typeof window > "u" ? null : window;
}, YC = function(t, r) {
  if (typeof t != "object" || typeof t.createPolicy != "function")
    return null;
  let i = null;
  const s = "data-tt-policy-suffix";
  r && r.hasAttribute(s) && (i = r.getAttribute(s));
  const o = "dompurify" + (i ? "#" + i : "");
  try {
    return t.createPolicy(o, {
      createHTML(a) {
        return a;
      },
      createScriptURL(a) {
        return a;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
  }
}, mc = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, dr = function(t, r, i, s) {
  return zt(t, r) && mr(t[r]) ? wt(s.base ? ie(s.base) : {}, t[r], s.transform) : i;
};
function md() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : HC();
  const t = (j) => md(j);
  if (t.version = "3.4.12", t.removed = [], !e || !e.document || e.document.nodeType !== pe.document || !e.Element)
    return t.isSupported = !1, t;
  let r = e.document;
  const i = r, s = i.currentScript;
  e.DocumentFragment;
  const o = e.HTMLTemplateElement, a = e.Node, n = e.Element, l = e.NodeFilter, h = e.NamedNodeMap;
  h === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const c = e.DOMParser, u = e.trustedTypes, f = n.prototype, d = Ne(f, "cloneNode"), p = Ne(f, "remove"), m = Ne(f, "nextSibling"), y = Ne(f, "childNodes"), x = Ne(f, "parentNode"), C = Ne(f, "shadowRoot"), k = Ne(f, "attributes"), w = a && a.prototype ? Ne(a.prototype, "nodeType") : null, T = a && a.prototype ? Ne(a.prototype, "nodeName") : null;
  if (typeof o == "function") {
    const j = r.createElement("template");
    j.content && j.content.ownerDocument && (r = j.content.ownerDocument);
  }
  let _, v = "", L, W = !1, O = 0;
  const M = function() {
    if (O > 0)
      throw Ar('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, U = function(S) {
    M(), O++;
    try {
      return _.createHTML(S);
    } finally {
      O--;
    }
  }, z = function(S) {
    M(), O++;
    try {
      return _.createScriptURL(S);
    } finally {
      O--;
    }
  }, D = function() {
    return W || (L = YC(u, s), W = !0), L;
  }, E = r, A = E.implementation, $ = E.createNodeIterator, B = E.createDocumentFragment, I = E.getElementsByTagName, Y = i.importNode;
  let X = mc();
  t.isSupported = typeof pd == "function" && typeof x == "function" && A && A.createHTMLDocument !== void 0;
  const Z = MC, ot = $C, Q = OC, at = IC, gt = DC, mt = RC, Tt = PC, At = qC;
  let K = fc, V = null;
  const Ct = wt({}, [...hc, ...ja, ...Va, ...Za, ...cc]);
  let ht = null;
  const P = wt({}, [...uc, ...Ka, ...dc, ...to]);
  let J = Object.seal(hi(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), lr = null, va = null;
  const xe = Object.seal(hi(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Ih = !0, La = !0, Dh = !1, Rh = !0, hr = !1, cr = !0, Br = !1, Aa = !1, Fa = null, Ea = null, Ma = !1, Jr = !1, Ys = !1, Us = !1, Ph = !0, Nh = !1;
  const qh = "user-content-";
  let $a = !0, Oa = !1, ti = {}, De = null;
  const Ia = wt({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let Wh = null;
  const zh = wt({}, ["audio", "video", "img", "source", "image", "track"]);
  let Da = null;
  const Hh = wt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Xs = "http://www.w3.org/1998/Math/MathML", Gs = "http://www.w3.org/2000/svg", Re = "http://www.w3.org/1999/xhtml";
  let ei = Re, Ra = !1, Pa = null;
  const V0 = wt({}, [Xs, Gs, Re], Ga), Yh = jt(["mi", "mo", "mn", "ms", "mtext"]);
  let Na = wt({}, Yh);
  const Uh = jt(["annotation-xml"]);
  let qa = wt({}, Uh);
  const Z0 = wt({}, ["title", "style", "font", "a", "script"]);
  let Xi = null;
  const K0 = ["application/xhtml+xml", "text/html"], Q0 = "text/html";
  let Mt = null, ri = null;
  const J0 = r.createElement("form"), Xh = function(S) {
    return S instanceof RegExp || S instanceof Function;
  }, Wa = function() {
    let S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (ri && ri === S)
      return;
    (!S || typeof S != "object") && (S = {}), S = ie(S), Xi = // eslint-disable-next-line unicorn/prefer-includes
    K0.indexOf(S.PARSER_MEDIA_TYPE) === -1 ? Q0 : S.PARSER_MEDIA_TYPE, Mt = Xi === "application/xhtml+xml" ? Ga : os, V = dr(S, "ALLOWED_TAGS", Ct, {
      transform: Mt
    }), ht = dr(S, "ALLOWED_ATTR", P, {
      transform: Mt
    }), Pa = dr(S, "ALLOWED_NAMESPACES", V0, {
      transform: Ga
    }), Da = dr(S, "ADD_URI_SAFE_ATTR", Hh, {
      transform: Mt,
      base: Hh
    }), Wh = dr(S, "ADD_DATA_URI_TAGS", zh, {
      transform: Mt,
      base: zh
    }), De = dr(S, "FORBID_CONTENTS", Ia, {
      transform: Mt
    }), lr = dr(S, "FORBID_TAGS", ie({}), {
      transform: Mt
    }), va = dr(S, "FORBID_ATTR", ie({}), {
      transform: Mt
    }), ti = zt(S, "USE_PROFILES") ? S.USE_PROFILES && typeof S.USE_PROFILES == "object" ? ie(S.USE_PROFILES) : S.USE_PROFILES : !1, Ih = S.ALLOW_ARIA_ATTR !== !1, La = S.ALLOW_DATA_ATTR !== !1, Dh = S.ALLOW_UNKNOWN_PROTOCOLS || !1, Rh = S.ALLOW_SELF_CLOSE_IN_ATTR !== !1, hr = S.SAFE_FOR_TEMPLATES || !1, cr = S.SAFE_FOR_XML !== !1, Br = S.WHOLE_DOCUMENT || !1, Jr = S.RETURN_DOM || !1, Ys = S.RETURN_DOM_FRAGMENT || !1, Us = S.RETURN_TRUSTED_TYPE || !1, Ma = S.FORCE_BODY || !1, Ph = S.SANITIZE_DOM !== !1, Nh = S.SANITIZE_NAMED_PROPS || !1, $a = S.KEEP_CONTENT !== !1, Oa = S.IN_PLACE || !1, K = AC(S.ALLOWED_URI_REGEXP) ? S.ALLOWED_URI_REGEXP : fc, ei = typeof S.NAMESPACE == "string" ? S.NAMESPACE : Re, Na = zt(S, "MATHML_TEXT_INTEGRATION_POINTS") && S.MATHML_TEXT_INTEGRATION_POINTS && typeof S.MATHML_TEXT_INTEGRATION_POINTS == "object" ? ie(S.MATHML_TEXT_INTEGRATION_POINTS) : wt({}, Yh), qa = zt(S, "HTML_INTEGRATION_POINTS") && S.HTML_INTEGRATION_POINTS && typeof S.HTML_INTEGRATION_POINTS == "object" ? ie(S.HTML_INTEGRATION_POINTS) : wt({}, Uh);
    const R = zt(S, "CUSTOM_ELEMENT_HANDLING") && S.CUSTOM_ELEMENT_HANDLING && typeof S.CUSTOM_ELEMENT_HANDLING == "object" ? ie(S.CUSTOM_ELEMENT_HANDLING) : hi(null);
    if (J = hi(null), zt(R, "tagNameCheck") && Xh(R.tagNameCheck) && (J.tagNameCheck = R.tagNameCheck), zt(R, "attributeNameCheck") && Xh(R.attributeNameCheck) && (J.attributeNameCheck = R.attributeNameCheck), zt(R, "allowCustomizedBuiltInElements") && typeof R.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = R.allowCustomizedBuiltInElements), Vt(J), hr && (La = !1), Ys && (Jr = !0), ti && (V = wt({}, cc), ht = hi(null), ti.html === !0 && (wt(V, hc), wt(ht, uc)), ti.svg === !0 && (wt(V, ja), wt(ht, Ka), wt(ht, to)), ti.svgFilters === !0 && (wt(V, Va), wt(ht, Ka), wt(ht, to)), ti.mathMl === !0 && (wt(V, Za), wt(ht, dc), wt(ht, to))), xe.tagCheck = null, xe.attributeCheck = null, zt(S, "ADD_TAGS") && (typeof S.ADD_TAGS == "function" ? xe.tagCheck = S.ADD_TAGS : mr(S.ADD_TAGS) && (V === Ct && (V = ie(V)), wt(V, S.ADD_TAGS, Mt))), zt(S, "ADD_ATTR") && (typeof S.ADD_ATTR == "function" ? xe.attributeCheck = S.ADD_ATTR : mr(S.ADD_ATTR) && (ht === P && (ht = ie(ht)), wt(ht, S.ADD_ATTR, Mt))), zt(S, "ADD_URI_SAFE_ATTR") && mr(S.ADD_URI_SAFE_ATTR) && wt(Da, S.ADD_URI_SAFE_ATTR, Mt), zt(S, "FORBID_CONTENTS") && mr(S.FORBID_CONTENTS) && (De === Ia && (De = ie(De)), wt(De, S.FORBID_CONTENTS, Mt)), zt(S, "ADD_FORBID_CONTENTS") && mr(S.ADD_FORBID_CONTENTS) && (De === Ia && (De = ie(De)), wt(De, S.ADD_FORBID_CONTENTS, Mt)), $a && (V["#text"] = !0), Br && wt(V, ["html", "head", "body"]), V.table && (wt(V, ["tbody"]), delete lr.tbody), S.TRUSTED_TYPES_POLICY) {
      if (typeof S.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw Ar('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof S.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw Ar('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const G = _;
      _ = S.TRUSTED_TYPES_POLICY;
      try {
        v = U("");
      } catch (st) {
        throw _ = G, st;
      }
    } else S.TRUSTED_TYPES_POLICY === null ? (_ = void 0, v = "") : (_ === void 0 && (_ = D()), _ && typeof v == "string" && (v = U("")));
    jt && jt(S), ri = S;
  }, Gh = wt({}, [...ja, ...Va, ...FC]), jh = wt({}, [...Za, ...EC]), tx = function(S, R, G) {
    return R.namespaceURI === Re ? S === "svg" : R.namespaceURI === Xs ? S === "svg" && (G === "annotation-xml" || Na[G]) : !!Gh[S];
  }, ex = function(S, R, G) {
    return R.namespaceURI === Re ? S === "math" : R.namespaceURI === Gs ? S === "math" && qa[G] : !!jh[S];
  }, rx = function(S, R, G) {
    return R.namespaceURI === Gs && !qa[G] || R.namespaceURI === Xs && !Na[G] ? !1 : !jh[S] && (Z0[S] || !Gh[S]);
  }, ix = function(S) {
    let R = x(S);
    (!R || !R.tagName) && (R = {
      namespaceURI: ei,
      tagName: "template"
    });
    const G = os(S.tagName), st = os(R.tagName);
    return Pa[S.namespaceURI] ? S.namespaceURI === Gs ? tx(G, R, st) : S.namespaceURI === Xs ? ex(G, R, st) : S.namespaceURI === Re ? rx(G, R, st) : !!(Xi === "application/xhtml+xml" && Pa[S.namespaceURI]) : !1;
  }, ur = function(S) {
    oi(t.removed, {
      element: S
    });
    try {
      x(S).removeChild(S);
    } catch {
      if (p(S), !x(S))
        throw Ar("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, js = function(S) {
    za(S);
    const R = y(S);
    if (R) {
      const st = [];
      si(R, (dt) => {
        oi(st, dt);
      }), si(st, (dt) => {
        try {
          p(dt);
        } catch {
        }
      });
    }
    const G = k(S);
    if (G)
      for (let st = G.length - 1; st >= 0; --st) {
        const dt = G[st], xt = dt && dt.name;
        if (typeof xt == "string")
          try {
            S.removeAttribute(xt);
          } catch {
          }
      }
  }, vr = function(S, R) {
    try {
      oi(t.removed, {
        attribute: R.getAttributeNode(S),
        from: R
      });
    } catch {
      oi(t.removed, {
        attribute: null,
        from: R
      });
    }
    if (R.removeAttribute(S), S === "is")
      if (Jr || Ys)
        try {
          ur(R);
        } catch {
        }
      else
        try {
          R.setAttribute(S, "");
        } catch {
        }
  }, sx = function(S) {
    const R = k(S);
    if (R)
      for (let G = R.length - 1; G >= 0; --G) {
        const st = R[G], dt = st && st.name;
        if (!(typeof dt != "string" || ht[Mt(dt)]))
          try {
            S.removeAttribute(dt);
          } catch {
          }
      }
  }, za = function(S) {
    const R = [S];
    for (; R.length > 0; ) {
      const G = R.pop();
      (w ? w(G) : G.nodeType) === pe.element && sx(G);
      const dt = y(G);
      if (dt)
        for (let xt = dt.length - 1; xt >= 0; --xt)
          R.push(dt[xt]);
    }
  }, ox = function(S) {
    if (!cr)
      return;
    const R = [S];
    for (; R.length > 0; ) {
      const G = R.pop(), st = w ? w(G) : G.nodeType;
      if (st === pe.processingInstruction || st === pe.comment && Wt(gc, G.data)) {
        try {
          p(G);
        } catch {
        }
        continue;
      }
      if (st === pe.element) {
        const xt = G, Ot = Mt(T ? T(G) : G.nodeName);
        try {
          xt.hasAttribute && xt.hasAttribute("patchsrc") && xt.removeAttribute("patchsrc"), xt.hasAttribute && xt.hasAttribute("for") && Ot !== "label" && Ot !== "output" && xt.removeAttribute("for");
        } catch {
        }
      }
      const dt = y(G);
      if (dt)
        for (let xt = dt.length - 1; xt >= 0; --xt)
          R.push(dt[xt]);
    }
  }, Vh = function(S) {
    let R = null, G = null;
    if (Ma)
      S = "<remove></remove>" + S;
    else {
      const xt = oc(S, /^[\r\n\t ]+/);
      G = xt && xt[0];
    }
    Xi === "application/xhtml+xml" && ei === Re && (S = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + S + "</body></html>");
    const st = _ ? U(S) : S;
    if (ei === Re)
      try {
        R = new c().parseFromString(st, Xi);
      } catch {
      }
    if (!R || !R.documentElement) {
      R = A.createDocument(ei, "template", null);
      try {
        R.documentElement.innerHTML = Ra ? v : st;
      } catch {
      }
    }
    const dt = R.body || R.documentElement;
    return S && G && dt.insertBefore(r.createTextNode(G), dt.childNodes[0] || null), ei === Re ? I.call(R, Br ? "html" : "body")[0] : Br ? R.documentElement : dt;
  }, Zh = function(S) {
    return $.call(
      S.ownerDocument || S,
      S,
      // eslint-disable-next-line no-bitwise
      l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION,
      null
    );
  }, Vs = function(S) {
    return S = ji(S, Z, " "), S = ji(S, ot, " "), S = ji(S, Q, " "), S;
  }, Ha = function(S) {
    var R;
    S.normalize();
    const G = $.call(
      S.ownerDocument || S,
      S,
      // eslint-disable-next-line no-bitwise
      l.SHOW_TEXT | l.SHOW_COMMENT | l.SHOW_CDATA_SECTION | l.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let st = G.nextNode();
    for (; st; )
      st.data = Vs(st.data), st = G.nextNode();
    const dt = (R = S.querySelectorAll) === null || R === void 0 ? void 0 : R.call(S, "template");
    dt && si(dt, (xt) => {
      ii(xt.content) && Ha(xt.content);
    });
  }, Zs = function(S) {
    const R = T ? T(S) : null;
    return typeof R != "string" || Mt(R) !== "form" ? !1 : typeof S.nodeName != "string" || typeof S.textContent != "string" || typeof S.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    S.attributes !== k(S) || typeof S.removeAttribute != "function" || typeof S.setAttribute != "function" || typeof S.namespaceURI != "string" || typeof S.insertBefore != "function" || typeof S.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    S.nodeType !== w(S) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    S.childNodes !== y(S);
  }, ii = function(S) {
    if (!w || typeof S != "object" || S === null)
      return !1;
    try {
      return w(S) === pe.documentFragment;
    } catch {
      return !1;
    }
  }, Gi = function(S) {
    if (!w || typeof S != "object" || S === null)
      return !1;
    try {
      return typeof w(S) == "number";
    } catch {
      return !1;
    }
  };
  function Pe(j, S, R) {
    j.length !== 0 && si(j, (G) => {
      G.call(t, S, R, ri);
    });
  }
  const ax = function(S, R) {
    return !!(cr && S.hasChildNodes() && !Gi(S.firstElementChild) && Wt(pc, S.textContent) && Wt(pc, S.innerHTML) || cr && S.namespaceURI === Re && R === "style" && Gi(S.firstElementChild) || S.nodeType === pe.processingInstruction || cr && S.nodeType === pe.comment && Wt(gc, S.data));
  }, nx = function(S, R) {
    if (!lr[R] && Jh(R) && (J.tagNameCheck instanceof RegExp && Wt(J.tagNameCheck, R) || J.tagNameCheck instanceof Function && J.tagNameCheck(R)))
      return !1;
    if ($a && !De[R]) {
      const G = x(S), st = y(S);
      if (st && G) {
        const dt = st.length;
        for (let xt = dt - 1; xt >= 0; --xt) {
          const Ot = Oa ? st[xt] : d(st[xt], !0);
          G.insertBefore(Ot, m(S));
        }
      }
    }
    return ur(S), !0;
  }, Kh = function(S, R) {
    if (Pe(X.beforeSanitizeElements, S, null), S !== R && x(S) === null)
      return !0;
    if (Zs(S))
      return ur(S), !0;
    const G = Mt(T ? T(S) : S.nodeName);
    if (Pe(X.uponSanitizeElement, S, {
      tagName: G,
      allowedTags: V
    }), S !== R && x(S) === null)
      return !0;
    if (ax(S, G))
      return ur(S), !0;
    if (lr[G] || !(xe.tagCheck instanceof Function && xe.tagCheck(G)) && !V[G]) {
      const dt = nx(S, G);
      return dt === !1 && Pe(X.afterSanitizeElements, S, null), dt;
    }
    if ((w ? w(S) : S.nodeType) === pe.element && !ix(S) || (G === "noscript" || G === "noembed" || G === "noframes") && Wt(WC, S.innerHTML))
      return ur(S), !0;
    if (hr && S.nodeType === pe.text) {
      const dt = Vs(S.textContent);
      S.textContent !== dt && (oi(t.removed, {
        element: S.cloneNode()
      }), S.textContent = dt);
    }
    return Pe(X.afterSanitizeElements, S, null), !1;
  }, Qh = function(S, R, G) {
    if (va[R] || cr && R === "patchsrc" || cr && R === "for" && S !== "label" && S !== "output" || Ph && (R === "id" || R === "name") && (G in r || G in J0))
      return !1;
    const st = ht[R] || xe.attributeCheck instanceof Function && xe.attributeCheck(R, S);
    if (!(La && Wt(at, R))) {
      if (!(Ih && Wt(gt, R))) {
        if (st) {
          if (!Da[R]) {
            if (!Wt(K, ji(G, Tt, ""))) {
              if (!((R === "src" || R === "xlink:href" || R === "href") && S !== "script" && ac(G, "data:") === 0 && Wh[S])) {
                if (!(Dh && !Wt(mt, ji(G, Tt, "")))) {
                  if (G)
                    return !1;
                }
              }
            }
          }
        } else if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          !(Jh(S) && (J.tagNameCheck instanceof RegExp && Wt(J.tagNameCheck, S) || J.tagNameCheck instanceof Function && J.tagNameCheck(S)) && (J.attributeNameCheck instanceof RegExp && Wt(J.attributeNameCheck, R) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(R, S)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          R === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && Wt(J.tagNameCheck, G) || J.tagNameCheck instanceof Function && J.tagNameCheck(G)))
        ) return !1;
      }
    }
    return !0;
  }, lx = wt({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), Jh = function(S) {
    return !lx[os(S)] && Wt(At, S);
  }, hx = function(S, R, G, st) {
    if (_ && typeof u == "object" && typeof u.getAttributeType == "function" && !G)
      switch (u.getAttributeType(S, R)) {
        case "TrustedHTML":
          return U(st);
        case "TrustedScriptURL":
          return z(st);
      }
    return st;
  }, cx = function(S, R, G, st) {
    try {
      G ? S.setAttributeNS(G, R, st) : S.setAttribute(R, st), Zs(S) ? ur(S) : sc(t.removed);
    } catch {
      vr(R, S);
    }
  }, tc = function(S) {
    Pe(X.beforeSanitizeAttributes, S, null);
    const R = S.attributes;
    if (!R || Zs(S))
      return;
    const G = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: ht,
      forceKeepAttr: void 0
    };
    let st = R.length;
    const dt = Mt(S.nodeName);
    for (; st--; ) {
      const xt = R[st], Ot = xt.name, Zt = xt.namespaceURI, Te = xt.value, le = Mt(Ot), _e = Te;
      let re = Ot === "value" ? _e : wC(_e);
      if (G.attrName = le, G.attrValue = re, G.keepAttr = !0, G.forceKeepAttr = void 0, Pe(X.uponSanitizeAttribute, S, G), re = G.attrValue, Nh && (le === "id" || le === "name") && ac(re, qh) !== 0 && (vr(Ot, S), re = qh + re), cr && Wt(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, re)) {
        vr(Ot, S);
        continue;
      }
      if (le === "attributename" && oc(re, "href")) {
        vr(Ot, S);
        continue;
      }
      if (!G.forceKeepAttr) {
        if (!G.keepAttr) {
          vr(Ot, S);
          continue;
        }
        if (!Rh && Wt(zC, re)) {
          vr(Ot, S);
          continue;
        }
        if (hr && (re = Vs(re)), !Qh(dt, le, re)) {
          vr(Ot, S);
          continue;
        }
        re = hx(dt, le, Zt, re), re !== _e && cx(S, Ot, Zt, re);
      }
    }
    Pe(X.afterSanitizeAttributes, S, null);
  }, Ks = function(S) {
    let R = null;
    const G = Zh(S);
    for (Pe(X.beforeSanitizeShadowDOM, S, null); R = G.nextNode(); )
      if (Pe(X.uponSanitizeShadowNode, R, null), Kh(R, S), tc(R), ii(R.content) && Ks(R.content), (w ? w(R) : R.nodeType) === pe.element) {
        const dt = C(R);
        ii(dt) && (Ya(dt), Ks(dt));
      }
    Pe(X.afterSanitizeShadowDOM, S, null);
  }, Ya = function(S) {
    const R = [{
      node: S,
      shadow: null
    }];
    for (; R.length > 0; ) {
      const G = R.pop();
      if (G.shadow) {
        Ks(G.shadow);
        continue;
      }
      const st = G.node, xt = (w ? w(st) : st.nodeType) === pe.element, Ot = y(st);
      if (Ot)
        for (let Zt = Ot.length - 1; Zt >= 0; --Zt)
          R.push({
            node: Ot[Zt],
            shadow: null
          });
      if (xt) {
        const Zt = T ? T(st) : null;
        if (typeof Zt == "string" && Mt(Zt) === "template") {
          const Te = st.content;
          ii(Te) && R.push({
            node: Te,
            shadow: null
          });
        }
      }
      if (xt) {
        const Zt = C(st);
        ii(Zt) && R.push({
          node: null,
          shadow: Zt
        }, {
          node: Zt,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(j) {
    let S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, R = null, G = null, st = null, dt = null;
    if (Ra = !j, Ra && (j = "<!-->"), typeof j != "string" && !Gi(j) && (j = LC(j), typeof j != "string"))
      throw Ar("dirty is not a string, aborting");
    if (!t.isSupported)
      return j;
    Aa ? (V = Fa, ht = Ea) : Wa(S), (X.uponSanitizeElement.length > 0 || X.uponSanitizeAttribute.length > 0) && (V = ie(V)), X.uponSanitizeAttribute.length > 0 && (ht = ie(ht)), t.removed = [];
    const xt = Oa && typeof j != "string" && Gi(j);
    if (xt) {
      ox(j);
      const le = T ? T(j) : j.nodeName;
      if (typeof le == "string") {
        const _e = Mt(le);
        if (!V[_e] || lr[_e])
          throw js(j), Ar("root node is forbidden and cannot be sanitized in-place");
      }
      if (Zs(j))
        throw js(j), Ar("root node is clobbered and cannot be sanitized in-place");
      try {
        Ya(j);
      } catch (_e) {
        throw js(j), _e;
      }
    } else if (Gi(j))
      R = Vh("<!---->"), G = R.ownerDocument.importNode(j, !0), G.nodeType === pe.element && G.nodeName === "BODY" || G.nodeName === "HTML" ? R = G : R.appendChild(G), Ya(G);
    else {
      if (!Jr && !hr && !Br && // eslint-disable-next-line unicorn/prefer-includes
      j.indexOf("<") === -1)
        return _ && Us ? U(j) : j;
      if (R = Vh(j), !R)
        return Jr ? null : Us ? v : "";
    }
    R && Ma && ur(R.firstChild);
    const Ot = xt ? j : R, Zt = Zh(Ot);
    try {
      for (; st = Zt.nextNode(); )
        Kh(st, Ot), tc(st), ii(st.content) && Ks(st.content);
    } catch (le) {
      throw xt && (js(j), si(t.removed, (_e) => {
        _e.element && za(_e.element);
      })), le;
    }
    if (xt)
      return si(t.removed, (le) => {
        le.element && za(le.element);
      }), hr && Ha(j), j;
    if (Jr) {
      if (hr && Ha(R), Ys)
        for (dt = B.call(R.ownerDocument); R.firstChild; )
          dt.appendChild(R.firstChild);
      else
        dt = R;
      return (ht.shadowroot || ht.shadowrootmode) && (dt = Y.call(i, dt, !0)), dt;
    }
    let Te = Br ? R.outerHTML : R.innerHTML;
    return Br && V["!doctype"] && R.ownerDocument && R.ownerDocument.doctype && R.ownerDocument.doctype.name && Wt(NC, R.ownerDocument.doctype.name) && (Te = "<!DOCTYPE " + R.ownerDocument.doctype.name + `>
` + Te), hr && (Te = Vs(Te)), _ && Us ? U(Te) : Te;
  }, t.setConfig = function() {
    let j = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Wa(j), Aa = !0, Fa = V, Ea = ht;
  }, t.clearConfig = function() {
    ri = null, Aa = !1, Fa = null, Ea = null, _ = L, v = "";
  }, t.isValidAttribute = function(j, S, R) {
    ri || Wa({});
    const G = Mt(j), st = Mt(S);
    return Qh(G, st, R);
  }, t.addHook = function(j, S) {
    typeof S == "function" && zt(X, j) && oi(X[j], S);
  }, t.removeHook = function(j, S) {
    if (zt(X, j)) {
      if (S !== void 0) {
        const R = kC(X[j], S);
        return R === -1 ? void 0 : SC(X[j], R, 1)[0];
      }
      return sc(X[j]);
    }
  }, t.removeHooks = function(j) {
    zt(X, j) && (X[j] = []);
  }, t.removeAllHooks = function() {
    X = mc();
  }, t;
}
var Oi = md(), Sn = /* @__PURE__ */ g((e, t, { depth: r = 2, clobber: i = !1 } = {}) => {
  const s = { depth: r, clobber: i };
  return Array.isArray(t) && !Array.isArray(e) ? (t.forEach((o) => Sn(e, o, s)), e) : Array.isArray(t) && Array.isArray(e) ? (t.forEach((o) => {
    e.includes(o) || e.push(o);
  }), e) : e === void 0 || r <= 0 ? e != null && typeof e == "object" && typeof t == "object" ? Object.assign(e, t) : t : (t !== void 0 && typeof e == "object" && typeof t == "object" && Object.keys(t).forEach((o) => {
    typeof t[o] == "object" && t[o] !== null && (e[o] === void 0 || typeof e[o] == "object") ? (e[o] === void 0 && (e[o] = Array.isArray(t[o]) ? [] : {}), e[o] = Sn(e[o], t[o], { depth: r - 1, clobber: i })) : (i || typeof e[o] != "object" && typeof t[o] != "object") && (e[o] = t[o]);
  }), e);
}, "assignWithDepth"), Nt = Sn, Ge = "#ffffff", je = "#f2f2f2", pt = /* @__PURE__ */ g((e, t) => t ? b(e, { s: -40, l: 10 }) : b(e, { s: -40, l: -10 }), "mkBorder"), Ci, UC = (Ci = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#fff4dd", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.useGradient = !0, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    var r, i, s, o, a, n, l, h, c, u, f, d, p, m, y, x, C, k, w, T, _, v, L, W, O, M, U, z, D, E, A, $, B, I, Y, X, Z, ot, Q, at, gt, mt, Tt, At, K, V, Ct, ht, P;
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || N(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || "navy", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.darkMode ? (this.rowOdd = this.rowOdd || q(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || q(this.mainBkg, 10)) : (this.rowOdd = this.rowOdd || N(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || N(this.mainBkg, 5)), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || this.tertiaryColor, this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || b(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || b(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || b(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || b(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || b(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || b(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || b(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || b(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || b(this.primaryColor, { h: 330 }), this.darkMode)
      for (let J = 0; J < this.THEME_COLOR_LIMIT; J++)
        this["cScale" + J] = q(this["cScale" + J], 75);
    else
      for (let J = 0; J < this.THEME_COLOR_LIMIT; J++)
        this["cScale" + J] = q(this["cScale" + J], 25);
    for (let J = 0; J < this.THEME_COLOR_LIMIT; J++)
      this["cScaleInv" + J] = this["cScaleInv" + J] || F(this["cScale" + J]);
    for (let J = 0; J < this.THEME_COLOR_LIMIT; J++)
      this.darkMode ? this["cScalePeer" + J] = this["cScalePeer" + J] || N(this["cScale" + J], 10) : this["cScalePeer" + J] = this["cScalePeer" + J] || q(this["cScale" + J], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let J = 0; J < this.THEME_COLOR_LIMIT; J++)
      this["cScaleLabel" + J] = this["cScaleLabel" + J] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let J = 0; J < 5; J++)
      this["surface" + J] = this["surface" + J] || b(this.mainBkg, { h: 180, s: -15, l: t * (5 + J * 3) }), this["surfacePeer" + J] = this["surfacePeer" + J] || b(this.mainBkg, { h: 180, s: -15, l: t * (8 + J * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || b(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || b(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || b(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || b(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || b(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || b(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || b(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || b(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || b(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || b(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? b(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? b(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? b(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? b(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? b(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? b(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? b(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? b(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: ((r = this.cynefin) == null ? void 0 : r.domainFontSize) || 16,
      itemFontSize: ((i = this.cynefin) == null ? void 0 : i.itemFontSize) || 12,
      boundaryColor: ((s = this.cynefin) == null ? void 0 : s.boundaryColor) || this.lineColor,
      boundaryWidth: ((o = this.cynefin) == null ? void 0 : o.boundaryWidth) || 2,
      cliffColor: ((a = this.cynefin) == null ? void 0 : a.cliffColor) || "#8B0000",
      cliffWidth: ((n = this.cynefin) == null ? void 0 : n.cliffWidth) || 4,
      arrowColor: ((l = this.cynefin) == null ? void 0 : l.arrowColor) || this.lineColor,
      arrowWidth: ((h = this.cynefin) == null ? void 0 : h.arrowWidth) || 2,
      complexBg: ((c = this.cynefin) == null ? void 0 : c.complexBg) || "#E8F5E9",
      complicatedBg: ((u = this.cynefin) == null ? void 0 : u.complicatedBg) || "#E3F2FD",
      chaoticBg: ((f = this.cynefin) == null ? void 0 : f.chaoticBg) || "#FBE9E7",
      clearBg: ((d = this.cynefin) == null ? void 0 : d.clearBg) || "#FFF8E1",
      confusionBg: ((p = this.cynefin) == null ? void 0 : p.confusionBg) || "#F3E5F5",
      textColor: ((m = this.cynefin) == null ? void 0 : m.textColor) || this.textColor,
      labelColor: ((y = this.cynefin) == null ? void 0 : y.labelColor) || this.primaryTextColor
    }, this.radar = {
      axisColor: ((x = this.radar) == null ? void 0 : x.axisColor) || this.lineColor,
      axisStrokeWidth: ((C = this.radar) == null ? void 0 : C.axisStrokeWidth) || 2,
      axisLabelFontSize: ((k = this.radar) == null ? void 0 : k.axisLabelFontSize) || 12,
      curveOpacity: ((w = this.radar) == null ? void 0 : w.curveOpacity) || 0.5,
      curveStrokeWidth: ((T = this.radar) == null ? void 0 : T.curveStrokeWidth) || 2,
      graticuleColor: ((_ = this.radar) == null ? void 0 : _.graticuleColor) || "#DEDEDE",
      graticuleStrokeWidth: ((v = this.radar) == null ? void 0 : v.graticuleStrokeWidth) || 1,
      graticuleOpacity: ((L = this.radar) == null ? void 0 : L.graticuleOpacity) || 0.3,
      legendBoxSize: ((W = this.radar) == null ? void 0 : W.legendBoxSize) || 12,
      legendFontSize: ((O = this.radar) == null ? void 0 : O.legendFontSize) || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: ((M = this.wardley) == null ? void 0 : M.backgroundColor) || this.background,
      axisColor: ((U = this.wardley) == null ? void 0 : U.axisColor) || this.lineColor,
      axisTextColor: ((z = this.wardley) == null ? void 0 : z.axisTextColor) || this.primaryTextColor,
      gridColor: ((D = this.wardley) == null ? void 0 : D.gridColor) || this.gridColor,
      componentFill: ((E = this.wardley) == null ? void 0 : E.componentFill) || this.background,
      componentStroke: ((A = this.wardley) == null ? void 0 : A.componentStroke) || this.lineColor,
      componentLabelColor: (($ = this.wardley) == null ? void 0 : $.componentLabelColor) || this.primaryTextColor,
      linkStroke: ((B = this.wardley) == null ? void 0 : B.linkStroke) || this.lineColor,
      evolutionStroke: ((I = this.wardley) == null ? void 0 : I.evolutionStroke) || this.wardleyEvolutionColor,
      annotationStroke: ((Y = this.wardley) == null ? void 0 : Y.annotationStroke) || this.lineColor,
      annotationTextColor: ((X = this.wardley) == null ? void 0 : X.annotationTextColor) || this.primaryTextColor,
      annotationFill: ((Z = this.wardley) == null ? void 0 : Z.annotationFill) || this.background
    }, this.archEdgeColor = this.archEdgeColor || "#777", this.archEdgeArrowColor = this.archEdgeArrowColor || "#777", this.archEdgeWidth = this.archEdgeWidth || "3", this.archGroupBorderColor = this.archGroupBorderColor || "#000", this.archGroupBorderWidth = this.archGroupBorderWidth || "2px", this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((ot = this.xyChart) == null ? void 0 : ot.backgroundColor) || this.background,
      titleColor: ((Q = this.xyChart) == null ? void 0 : Q.titleColor) || this.primaryTextColor,
      dataLabelColor: ((at = this.xyChart) == null ? void 0 : at.dataLabelColor) || this.primaryTextColor,
      xAxisTitleColor: ((gt = this.xyChart) == null ? void 0 : gt.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((mt = this.xyChart) == null ? void 0 : mt.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((Tt = this.xyChart) == null ? void 0 : Tt.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((At = this.xyChart) == null ? void 0 : At.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((K = this.xyChart) == null ? void 0 : K.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((V = this.xyChart) == null ? void 0 : V.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((Ct = this.xyChart) == null ? void 0 : Ct.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((ht = this.xyChart) == null ? void 0 : ht.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((P = this.xyChart) == null ? void 0 : P.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || b(this.primaryColor, { h: -30 }), this.git4 = this.git4 || b(this.primaryColor, { h: -60 }), this.git5 = this.git5 || b(this.primaryColor, { h: -90 }), this.git6 = this.git6 || b(this.primaryColor, { h: 60 }), this.git7 = this.git7 || b(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(Ci, "Theme"), Ci), XC = /* @__PURE__ */ g((e) => {
  const t = new UC();
  return t.calculate(e), t;
}, "getThemeVariables"), bi, GC = (bi = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = N(this.primaryColor, 16), this.tertiaryColor = b(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.mainBkg = "#1f2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = N(F("#323D47"), 10), this.lineColor = "calculated", this.border1 = "#ccc", this.border2 = Cr(255, 255, 255, 0.25), this.arrowheadColor = "calculated", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#F9FFFE", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "calculated", this.activationBkgColor = "calculated", this.sequenceNumberColor = "black", this.clusterBkg = "#302F3D", this.sectionBkgColor = q("#EAE8D9", 30), this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "#EAE8D9", this.excludeBkgColor = q(this.sectionBkgColor, 10), this.taskBorderColor = Cr(255, 255, 255, 70), this.taskBkgColor = "calculated", this.taskTextColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = Cr(255, 255, 255, 50), this.activeTaskBkgColor = "#81B1DB", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "grey", this.critBorderColor = "#E83737", this.critBkgColor = "#E83737", this.taskTextDarkColor = "calculated", this.todayLineColor = "#DB5757", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = this.rowOdd || N(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || q(this.mainBkg, 10), this.labelColor = "calculated", this.errorBkgColor = "#a44141", this.errorTextColor = "#ddd", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal";
  }
  updateColors() {
    var t, r, i, s, o, a, n, l, h, c, u, f, d, p, m, y, x, C, k, w, T, _, v, L, W, O, M, U, z, D, E, A, $, B, I, Y, X, Z, ot, Q, at, gt, mt, Tt, At, K, V, Ct, ht;
    this.secondBkg = N(this.mainBkg, 16), this.lineColor = this.mainContrastColor, this.arrowheadColor = this.mainContrastColor, this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.edgeLabelBackground = N(this.labelBackground, 25), this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.actorTextColor = this.mainContrastColor, this.actorLineColor = this.actorBorder, this.signalColor = this.mainContrastColor, this.signalTextColor = this.mainContrastColor, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.mainContrastColor, this.loopTextColor = this.mainContrastColor, this.noteBorderColor = this.secondaryBorderColor, this.noteBkgColor = this.secondBkg, this.noteTextColor = this.secondaryTextColor, this.activationBorderColor = this.border1, this.activationBkgColor = this.secondBkg, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.background, this.taskBkgColor = N(this.mainBkg, 23), this.taskTextColor = this.darkTextColor, this.taskTextLightColor = this.mainContrastColor, this.taskTextOutsideColor = this.taskTextLightColor, this.gridColor = this.mainContrastColor, this.doneTaskBkgColor = this.mainContrastColor, this.taskTextDarkColor = F(this.doneTaskBkgColor), this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#555", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#f4f4f4", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = b(this.primaryColor, { h: 64 }), this.fillType3 = b(this.secondaryColor, { h: 64 }), this.fillType4 = b(this.primaryColor, { h: -64 }), this.fillType5 = b(this.secondaryColor, { h: -64 }), this.fillType6 = b(this.primaryColor, { h: 128 }), this.fillType7 = b(this.secondaryColor, { h: 128 }), this.cScale1 = this.cScale1 || "#0b0000", this.cScale2 = this.cScale2 || "#4d1037", this.cScale3 = this.cScale3 || "#3f5258", this.cScale4 = this.cScale4 || "#4f2f1b", this.cScale5 = this.cScale5 || "#6e0a0a", this.cScale6 = this.cScale6 || "#3b0048", this.cScale7 = this.cScale7 || "#995a01", this.cScale8 = this.cScale8 || "#154706", this.cScale9 = this.cScale9 || "#161722", this.cScale10 = this.cScale10 || "#00296f", this.cScale11 = this.cScale11 || "#01629c", this.cScale12 = this.cScale12 || "#010029", this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || b(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || b(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || b(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || b(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || b(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || b(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || b(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || b(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || b(this.primaryColor, { h: 330 });
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleInv" + P] = this["cScaleInv" + P] || F(this["cScale" + P]);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScalePeer" + P] = this["cScalePeer" + P] || N(this["cScale" + P], 10);
    for (let P = 0; P < 5; P++)
      this["surface" + P] = this["surface" + P] || b(this.mainBkg, { h: 30, s: -30, l: -(-10 + P * 4) }), this["surfacePeer" + P] = this["surfacePeer" + P] || b(this.mainBkg, { h: 30, s: -30, l: -(-7 + P * 4) });
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleLabel" + P] = this["cScaleLabel" + P] || this.scaleLabelColor;
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["pie" + P] = this["cScale" + P];
    this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.mainContrastColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.mainContrastColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let P = 0; P < 8; P++)
      this["venn" + (P + 1)] = this["venn" + (P + 1)] ?? N(this["cScale" + P], 30);
    this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: ((t = this.cynefin) == null ? void 0 : t.domainFontSize) || 16,
      itemFontSize: ((r = this.cynefin) == null ? void 0 : r.itemFontSize) || 12,
      boundaryColor: ((i = this.cynefin) == null ? void 0 : i.boundaryColor) || this.lineColor,
      boundaryWidth: ((s = this.cynefin) == null ? void 0 : s.boundaryWidth) || 2,
      cliffColor: ((o = this.cynefin) == null ? void 0 : o.cliffColor) || "#FF6B6B",
      cliffWidth: ((a = this.cynefin) == null ? void 0 : a.cliffWidth) || 4,
      arrowColor: ((n = this.cynefin) == null ? void 0 : n.arrowColor) || this.lineColor,
      arrowWidth: ((l = this.cynefin) == null ? void 0 : l.arrowWidth) || 2,
      complexBg: ((h = this.cynefin) == null ? void 0 : h.complexBg) || "#1B5E20",
      complicatedBg: ((c = this.cynefin) == null ? void 0 : c.complicatedBg) || "#0D47A1",
      chaoticBg: ((u = this.cynefin) == null ? void 0 : u.chaoticBg) || "#BF360C",
      clearBg: ((f = this.cynefin) == null ? void 0 : f.clearBg) || "#F57F17",
      confusionBg: ((d = this.cynefin) == null ? void 0 : d.confusionBg) || "#4A148C",
      textColor: ((p = this.cynefin) == null ? void 0 : p.textColor) || this.textColor,
      labelColor: ((m = this.cynefin) == null ? void 0 : m.labelColor) || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((y = this.xyChart) == null ? void 0 : y.backgroundColor) || this.background,
      titleColor: ((x = this.xyChart) == null ? void 0 : x.titleColor) || this.primaryTextColor,
      dataLabelColor: ((C = this.xyChart) == null ? void 0 : C.dataLabelColor) || this.primaryTextColor,
      xAxisTitleColor: ((k = this.xyChart) == null ? void 0 : k.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((w = this.xyChart) == null ? void 0 : w.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((T = this.xyChart) == null ? void 0 : T.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((_ = this.xyChart) == null ? void 0 : _.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((v = this.xyChart) == null ? void 0 : v.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((L = this.xyChart) == null ? void 0 : L.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((W = this.xyChart) == null ? void 0 : W.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((O = this.xyChart) == null ? void 0 : O.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((M = this.xyChart) == null ? void 0 : M.plotColorPalette) || "#3498db,#2ecc71,#e74c3c,#f1c40f,#bdc3c7,#ffffff,#34495e,#9b59b6,#1abc9c,#e67e22"
    }, this.packet = {
      startByteColor: this.primaryTextColor,
      endByteColor: this.primaryTextColor,
      labelColor: this.primaryTextColor,
      titleColor: this.primaryTextColor,
      blockStrokeColor: this.primaryTextColor,
      blockFillColor: this.background
    }, this.radar = {
      axisColor: ((U = this.radar) == null ? void 0 : U.axisColor) || this.lineColor,
      axisStrokeWidth: ((z = this.radar) == null ? void 0 : z.axisStrokeWidth) || 2,
      axisLabelFontSize: ((D = this.radar) == null ? void 0 : D.axisLabelFontSize) || 12,
      curveOpacity: ((E = this.radar) == null ? void 0 : E.curveOpacity) || 0.5,
      curveStrokeWidth: ((A = this.radar) == null ? void 0 : A.curveStrokeWidth) || 2,
      graticuleColor: (($ = this.radar) == null ? void 0 : $.graticuleColor) || "#DEDEDE",
      graticuleStrokeWidth: ((B = this.radar) == null ? void 0 : B.graticuleStrokeWidth) || 1,
      graticuleOpacity: ((I = this.radar) == null ? void 0 : I.graticuleOpacity) || 0.3,
      legendBoxSize: ((Y = this.radar) == null ? void 0 : Y.legendBoxSize) || 12,
      legendFontSize: ((X = this.radar) == null ? void 0 : X.legendFontSize) || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#ff6b6b", this.wardley = {
      backgroundColor: ((Z = this.wardley) == null ? void 0 : Z.backgroundColor) || this.background,
      axisColor: ((ot = this.wardley) == null ? void 0 : ot.axisColor) || this.lineColor,
      axisTextColor: ((Q = this.wardley) == null ? void 0 : Q.axisTextColor) || this.primaryTextColor,
      gridColor: ((at = this.wardley) == null ? void 0 : at.gridColor) || this.gridColor,
      componentFill: ((gt = this.wardley) == null ? void 0 : gt.componentFill) || this.mainBkg,
      componentStroke: ((mt = this.wardley) == null ? void 0 : mt.componentStroke) || this.lineColor,
      componentLabelColor: ((Tt = this.wardley) == null ? void 0 : Tt.componentLabelColor) || this.primaryTextColor,
      linkStroke: ((At = this.wardley) == null ? void 0 : At.linkStroke) || this.lineColor,
      evolutionStroke: ((K = this.wardley) == null ? void 0 : K.evolutionStroke) || this.wardleyEvolutionColor,
      annotationStroke: ((V = this.wardley) == null ? void 0 : V.annotationStroke) || this.lineColor,
      annotationTextColor: ((Ct = this.wardley) == null ? void 0 : Ct.annotationTextColor) || this.primaryTextColor,
      annotationFill: ((ht = this.wardley) == null ? void 0 : ht.annotationFill) || this.mainBkg
    }, this.classText = this.primaryTextColor, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = N(this.secondaryColor, 20), this.git1 = N(this.pie2 || this.secondaryColor, 20), this.git2 = N(this.pie3 || this.tertiaryColor, 20), this.git3 = N(this.pie4 || b(this.primaryColor, { h: -30 }), 20), this.git4 = N(this.pie5 || b(this.primaryColor, { h: -60 }), 20), this.git5 = N(this.pie6 || b(this.primaryColor, { h: -90 }), 10), this.git6 = N(this.pie7 || b(this.primaryColor, { h: 60 }), 10), this.git7 = N(this.pie8 || b(this.primaryColor, { h: 120 }), 20), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "#2d2d2d", this.emUiStroke = this.emUiStroke || "#555", this.emProcessorFill = this.emProcessorFill || N("#5a3d5c", 10), this.emProcessorStroke = this.emProcessorStroke || "#8a6d8c", this.emReadModelFill = this.emReadModelFill || N("#3d5a2d", 10), this.emReadModelStroke = this.emReadModelStroke || "#6d8c5c", this.emCommandFill = this.emCommandFill || N("#2d3d5a", 10), this.emCommandStroke = this.emCommandStroke || "#5c6d8c", this.emEventFill = this.emEventFill || N("#5a452d", 10), this.emEventStroke = this.emEventStroke || "#8c755c", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || N(this.background, 5), this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || N(this.background, 12), this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || N(this.background, 12), this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || N(this.background, 2), this.nodeBorder = this.nodeBorder || "#999";
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(bi, "Theme"), bi), jC = /* @__PURE__ */ g((e) => {
  const t = new GC();
  return t.calculate(e), t;
}, "getThemeVariables"), ki, VC = (ki = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#ECECFF", this.secondaryColor = b(this.primaryColor, { h: 120 }), this.secondaryColor = "#ffffde", this.tertiaryColor = b(this.primaryColor, { h: -160 }), this.primaryBorderColor = pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.background = "white", this.mainBkg = "#ECECFF", this.secondBkg = "#ffffde", this.lineColor = "#333333", this.border1 = "#9370DB", this.primaryBorderColor = pt(this.primaryColor, this.darkMode), this.border2 = "#aaaa33", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "rgba(232,232,232, 0.8)", this.textColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.clusterBkg = "#FBFBFF", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = this.taskTextDarkColor, this.taskTextClickableColor = "calculated", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBorderColor = "calculated", this.critBkgColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.sectionBkgColor = Cr(102, 102, 255, 0.49), this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#fff400", this.taskBorderColor = "#534fbc", this.taskBkgColor = "#8a90dd", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "#534fbc", this.activeTaskBkgColor = "#bfc7ff", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "navy", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = "calculated", this.rowEven = "calculated", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !1, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow(1px 2px 2px rgba(185, 185, 185, 1))", this.updateColors();
  }
  updateColors() {
    var t, r, i, s, o, a, n, l, h, c, u, f, d, p, m, y, x, C, k, w, T, _, v, L, W, O, M, U, z, D, E, A, $, B, I, Y, X, Z, ot, Q, at, gt, mt, Tt, At, K, V, Ct, ht;
    this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || b(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || b(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || b(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || b(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || b(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || b(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || b(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || b(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || b(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || q(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || q(this.tertiaryColor, 40);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScale" + P] = q(this["cScale" + P], 10), this["cScalePeer" + P] = this["cScalePeer" + P] || q(this["cScale" + P], 25);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleInv" + P] = this["cScaleInv" + P] || b(this["cScale" + P], { h: 180 });
    for (let P = 0; P < 5; P++)
      this["surface" + P] = this["surface" + P] || b(this.mainBkg, { h: 30, l: -(5 + P * 5) }), this["surfacePeer" + P] = this["surfacePeer" + P] || b(this.mainBkg, { h: 30, l: -(7 + P * 5) });
    if (this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor, this.labelTextColor !== "calculated") {
      this.cScaleLabel0 = this.cScaleLabel0 || F(this.labelTextColor), this.cScaleLabel3 = this.cScaleLabel3 || F(this.labelTextColor);
      for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
        this["cScaleLabel" + P] = this["cScaleLabel" + P] || this.labelTextColor;
    }
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.textColor, this.edgeLabelBackground = this.labelBackground, this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.signalColor = this.textColor, this.signalTextColor = this.textColor, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || N(this.primaryColor, 75) || "#ffffff", this.rowEven = this.rowEven || N(this.primaryColor, 1), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = b(this.primaryColor, { h: 64 }), this.fillType3 = b(this.secondaryColor, { h: 64 }), this.fillType4 = b(this.primaryColor, { h: -64 }), this.fillType5 = b(this.secondaryColor, { h: -64 }), this.fillType6 = b(this.primaryColor, { h: 128 }), this.fillType7 = b(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || b(this.tertiaryColor, { l: -40 }), this.pie4 = this.pie4 || b(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || b(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || b(this.tertiaryColor, { l: -20 }), this.pie7 = this.pie7 || b(this.primaryColor, { h: 60, l: -20 }), this.pie8 = this.pie8 || b(this.primaryColor, { h: -60, l: -40 }), this.pie9 = this.pie9 || b(this.primaryColor, { h: 120, l: -40 }), this.pie10 = this.pie10 || b(this.primaryColor, { h: 60, l: -40 }), this.pie11 = this.pie11 || b(this.primaryColor, { h: -90, l: -40 }), this.pie12 = this.pie12 || b(this.primaryColor, { h: 120, l: -30 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? b(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? b(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? b(this.tertiaryColor, { l: -40 }), this.venn4 = this.venn4 ?? b(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? b(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? b(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? b(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? b(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: ((t = this.cynefin) == null ? void 0 : t.domainFontSize) || 16,
      itemFontSize: ((r = this.cynefin) == null ? void 0 : r.itemFontSize) || 12,
      boundaryColor: ((i = this.cynefin) == null ? void 0 : i.boundaryColor) || this.lineColor,
      boundaryWidth: ((s = this.cynefin) == null ? void 0 : s.boundaryWidth) || 2,
      cliffColor: ((o = this.cynefin) == null ? void 0 : o.cliffColor) || "#8B0000",
      cliffWidth: ((a = this.cynefin) == null ? void 0 : a.cliffWidth) || 4,
      arrowColor: ((n = this.cynefin) == null ? void 0 : n.arrowColor) || this.lineColor,
      arrowWidth: ((l = this.cynefin) == null ? void 0 : l.arrowWidth) || 2,
      complexBg: ((h = this.cynefin) == null ? void 0 : h.complexBg) || "#E8F5E9",
      complicatedBg: ((c = this.cynefin) == null ? void 0 : c.complicatedBg) || "#E3F2FD",
      chaoticBg: ((u = this.cynefin) == null ? void 0 : u.chaoticBg) || "#FBE9E7",
      clearBg: ((f = this.cynefin) == null ? void 0 : f.clearBg) || "#FFF8E1",
      confusionBg: ((d = this.cynefin) == null ? void 0 : d.confusionBg) || "#F3E5F5",
      textColor: ((p = this.cynefin) == null ? void 0 : p.textColor) || this.textColor,
      labelColor: ((m = this.cynefin) == null ? void 0 : m.labelColor) || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.radar = {
      axisColor: ((y = this.radar) == null ? void 0 : y.axisColor) || this.lineColor,
      axisStrokeWidth: ((x = this.radar) == null ? void 0 : x.axisStrokeWidth) || 2,
      axisLabelFontSize: ((C = this.radar) == null ? void 0 : C.axisLabelFontSize) || 12,
      curveOpacity: ((k = this.radar) == null ? void 0 : k.curveOpacity) || 0.5,
      curveStrokeWidth: ((w = this.radar) == null ? void 0 : w.curveStrokeWidth) || 2,
      graticuleColor: ((T = this.radar) == null ? void 0 : T.graticuleColor) || "#DEDEDE",
      graticuleStrokeWidth: ((_ = this.radar) == null ? void 0 : _.graticuleStrokeWidth) || 1,
      graticuleOpacity: ((v = this.radar) == null ? void 0 : v.graticuleOpacity) || 0.3,
      legendBoxSize: ((L = this.radar) == null ? void 0 : L.legendBoxSize) || 12,
      legendFontSize: ((W = this.radar) == null ? void 0 : W.legendFontSize) || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: ((O = this.wardley) == null ? void 0 : O.backgroundColor) || this.background,
      axisColor: ((M = this.wardley) == null ? void 0 : M.axisColor) || this.lineColor,
      axisTextColor: ((U = this.wardley) == null ? void 0 : U.axisTextColor) || this.primaryTextColor,
      gridColor: ((z = this.wardley) == null ? void 0 : z.gridColor) || this.gridColor,
      componentFill: ((D = this.wardley) == null ? void 0 : D.componentFill) || this.background,
      componentStroke: ((E = this.wardley) == null ? void 0 : E.componentStroke) || this.lineColor,
      componentLabelColor: ((A = this.wardley) == null ? void 0 : A.componentLabelColor) || this.primaryTextColor,
      linkStroke: (($ = this.wardley) == null ? void 0 : $.linkStroke) || this.lineColor,
      evolutionStroke: ((B = this.wardley) == null ? void 0 : B.evolutionStroke) || this.wardleyEvolutionColor,
      annotationStroke: ((I = this.wardley) == null ? void 0 : I.annotationStroke) || this.lineColor,
      annotationTextColor: ((Y = this.wardley) == null ? void 0 : Y.annotationTextColor) || this.primaryTextColor,
      annotationFill: ((X = this.wardley) == null ? void 0 : X.annotationFill) || this.background
    }, this.xyChart = {
      backgroundColor: ((Z = this.xyChart) == null ? void 0 : Z.backgroundColor) || this.background,
      titleColor: ((ot = this.xyChart) == null ? void 0 : ot.titleColor) || this.primaryTextColor,
      dataLabelColor: ((Q = this.xyChart) == null ? void 0 : Q.dataLabelColor) || this.primaryTextColor,
      xAxisTitleColor: ((at = this.xyChart) == null ? void 0 : at.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((gt = this.xyChart) == null ? void 0 : gt.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((mt = this.xyChart) == null ? void 0 : mt.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((Tt = this.xyChart) == null ? void 0 : Tt.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((At = this.xyChart) == null ? void 0 : At.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((K = this.xyChart) == null ? void 0 : K.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((V = this.xyChart) == null ? void 0 : V.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((Ct = this.xyChart) == null ? void 0 : Ct.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((ht = this.xyChart) == null ? void 0 : ht.plotColorPalette) || "#ECECFF,#8493A6,#FFC3A0,#DCDDE1,#B8E994,#D1A36F,#C3CDE6,#FFB6C1,#496078,#F8F3E3"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.labelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || b(this.primaryColor, { h: -30 }), this.git4 = this.git4 || b(this.primaryColor, { h: -60 }), this.git5 = this.git5 || b(this.primaryColor, { h: -90 }), this.git6 = this.git6 || b(this.primaryColor, { h: 60 }), this.git7 = this.git7 || b(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || q(F(this.git0), 25), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (Object.keys(this).forEach((i) => {
      this[i] === "calculated" && (this[i] = void 0);
    }), typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(ki, "Theme"), ki), ZC = /* @__PURE__ */ g((e) => {
  const t = new VC();
  return t.calculate(e), t;
}, "getThemeVariables"), Si, KC = (Si = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#cde498", this.secondaryColor = "#cdffb2", this.background = "white", this.mainBkg = "#cde498", this.secondBkg = "#cdffb2", this.lineColor = "green", this.border1 = "#13540c", this.border2 = "#6eaa49", this.arrowheadColor = "green", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.tertiaryColor = N("#cde498", 10), this.primaryBorderColor = pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.primaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#333", this.edgeLabelBackground = "#e8e8e8", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "#333", this.signalTextColor = "#333", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "#326932", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "#6eaa49", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#6eaa49", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "#487e3a", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.5))";
  }
  updateColors() {
    var t, r, i, s, o, a, n, l, h, c, u, f, d, p, m, y, x, C, k, w, T, _, v, L, W, O, M, U, z, D, E, A, $, B, I, Y, X, Z, ot, Q, at, gt, mt, Tt, At, K, V, Ct, ht;
    this.actorBorder = q(this.mainBkg, 20), this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || b(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || b(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || b(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || b(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || b(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || b(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || b(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || b(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || b(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || q(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || q(this.tertiaryColor, 40);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScale" + P] = q(this["cScale" + P], 10), this["cScalePeer" + P] = this["cScalePeer" + P] || q(this["cScale" + P], 25);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleInv" + P] = this["cScaleInv" + P] || b(this["cScale" + P], { h: 180 });
    this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleLabel" + P] = this["cScaleLabel" + P] || this.scaleLabelColor;
    for (let P = 0; P < 5; P++)
      this["surface" + P] = this["surface" + P] || b(this.mainBkg, { h: 30, s: -30, l: -(5 + P * 5) }), this["surfacePeer" + P] = this["surfacePeer" + P] || b(this.mainBkg, { h: 30, s: -30, l: -(8 + P * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.taskBorderColor = this.border1, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || N(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || N(this.mainBkg, 20), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = b(this.primaryColor, { h: 64 }), this.fillType3 = b(this.secondaryColor, { h: 64 }), this.fillType4 = b(this.primaryColor, { h: -64 }), this.fillType5 = b(this.secondaryColor, { h: -64 }), this.fillType6 = b(this.primaryColor, { h: 128 }), this.fillType7 = b(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || b(this.primaryColor, { l: -30 }), this.pie5 = this.pie5 || b(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || b(this.tertiaryColor, { h: 40, l: -40 }), this.pie7 = this.pie7 || b(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(this.primaryColor, { h: 60, l: -50 }), this.pie11 = this.pie11 || b(this.primaryColor, { h: -60, l: -50 }), this.pie12 = this.pie12 || b(this.primaryColor, { h: 120, l: -50 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? b(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? b(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? b(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? b(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? b(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? b(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? b(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? b(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: ((t = this.cynefin) == null ? void 0 : t.domainFontSize) || 16,
      itemFontSize: ((r = this.cynefin) == null ? void 0 : r.itemFontSize) || 12,
      boundaryColor: ((i = this.cynefin) == null ? void 0 : i.boundaryColor) || this.lineColor,
      boundaryWidth: ((s = this.cynefin) == null ? void 0 : s.boundaryWidth) || 2,
      cliffColor: ((o = this.cynefin) == null ? void 0 : o.cliffColor) || "#8B4513",
      cliffWidth: ((a = this.cynefin) == null ? void 0 : a.cliffWidth) || 4,
      arrowColor: ((n = this.cynefin) == null ? void 0 : n.arrowColor) || this.lineColor,
      arrowWidth: ((l = this.cynefin) == null ? void 0 : l.arrowWidth) || 2,
      complexBg: ((h = this.cynefin) == null ? void 0 : h.complexBg) || "#C8E6C9",
      complicatedBg: ((c = this.cynefin) == null ? void 0 : c.complicatedBg) || "#DCEDC8",
      chaoticBg: ((u = this.cynefin) == null ? void 0 : u.chaoticBg) || "#FFE0B2",
      clearBg: ((f = this.cynefin) == null ? void 0 : f.clearBg) || "#FFF9C4",
      confusionBg: ((d = this.cynefin) == null ? void 0 : d.confusionBg) || "#D7CCC8",
      textColor: ((p = this.cynefin) == null ? void 0 : p.textColor) || this.textColor,
      labelColor: ((m = this.cynefin) == null ? void 0 : m.labelColor) || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.packet = {
      startByteColor: this.primaryTextColor,
      endByteColor: this.primaryTextColor,
      labelColor: this.primaryTextColor,
      titleColor: this.primaryTextColor,
      blockStrokeColor: this.primaryTextColor,
      blockFillColor: this.mainBkg
    }, this.radar = {
      axisColor: ((y = this.radar) == null ? void 0 : y.axisColor) || this.lineColor,
      axisStrokeWidth: ((x = this.radar) == null ? void 0 : x.axisStrokeWidth) || 2,
      axisLabelFontSize: ((C = this.radar) == null ? void 0 : C.axisLabelFontSize) || 12,
      curveOpacity: ((k = this.radar) == null ? void 0 : k.curveOpacity) || 0.5,
      curveStrokeWidth: ((w = this.radar) == null ? void 0 : w.curveStrokeWidth) || 2,
      graticuleColor: ((T = this.radar) == null ? void 0 : T.graticuleColor) || "#DEDEDE",
      graticuleStrokeWidth: ((_ = this.radar) == null ? void 0 : _.graticuleStrokeWidth) || 1,
      graticuleOpacity: ((v = this.radar) == null ? void 0 : v.graticuleOpacity) || 0.3,
      legendBoxSize: ((L = this.radar) == null ? void 0 : L.legendBoxSize) || 12,
      legendFontSize: ((W = this.radar) == null ? void 0 : W.legendFontSize) || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: ((O = this.wardley) == null ? void 0 : O.backgroundColor) || this.background,
      axisColor: ((M = this.wardley) == null ? void 0 : M.axisColor) || this.lineColor,
      axisTextColor: ((U = this.wardley) == null ? void 0 : U.axisTextColor) || this.primaryTextColor,
      gridColor: ((z = this.wardley) == null ? void 0 : z.gridColor) || this.gridColor,
      componentFill: ((D = this.wardley) == null ? void 0 : D.componentFill) || this.background,
      componentStroke: ((E = this.wardley) == null ? void 0 : E.componentStroke) || this.lineColor,
      componentLabelColor: ((A = this.wardley) == null ? void 0 : A.componentLabelColor) || this.primaryTextColor,
      linkStroke: (($ = this.wardley) == null ? void 0 : $.linkStroke) || this.lineColor,
      evolutionStroke: ((B = this.wardley) == null ? void 0 : B.evolutionStroke) || this.wardleyEvolutionColor,
      annotationStroke: ((I = this.wardley) == null ? void 0 : I.annotationStroke) || this.lineColor,
      annotationTextColor: ((Y = this.wardley) == null ? void 0 : Y.annotationTextColor) || this.primaryTextColor,
      annotationFill: ((X = this.wardley) == null ? void 0 : X.annotationFill) || this.background
    }, this.xyChart = {
      backgroundColor: ((Z = this.xyChart) == null ? void 0 : Z.backgroundColor) || this.background,
      titleColor: ((ot = this.xyChart) == null ? void 0 : ot.titleColor) || this.primaryTextColor,
      dataLabelColor: ((Q = this.xyChart) == null ? void 0 : Q.dataLabelColor) || this.primaryTextColor,
      xAxisTitleColor: ((at = this.xyChart) == null ? void 0 : at.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((gt = this.xyChart) == null ? void 0 : gt.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((mt = this.xyChart) == null ? void 0 : mt.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((Tt = this.xyChart) == null ? void 0 : Tt.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((At = this.xyChart) == null ? void 0 : At.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((K = this.xyChart) == null ? void 0 : K.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((V = this.xyChart) == null ? void 0 : V.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((Ct = this.xyChart) == null ? void 0 : Ct.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((ht = this.xyChart) == null ? void 0 : ht.plotColorPalette) || "#CDE498,#FF6B6B,#A0D2DB,#D7BDE2,#F0F0F0,#FFC3A0,#7FD8BE,#FF9A8B,#FAF3E0,#FFF176"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || b(this.primaryColor, { h: -30 }), this.git4 = this.git4 || b(this.primaryColor, { h: -60 }), this.git5 = this.git5 || b(this.primaryColor, { h: -90 }), this.git6 = this.git6 || b(this.primaryColor, { h: 60 }), this.git7 = this.git7 || b(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(Si, "Theme"), Si), QC = /* @__PURE__ */ g((e) => {
  const t = new KC();
  return t.calculate(e), t;
}, "getThemeVariables"), wi, JC = (wi = class {
  constructor() {
    this.primaryColor = "#eee", this.contrast = "#707070", this.secondaryColor = N(this.contrast, 55), this.background = "#ffffff", this.tertiaryColor = b(this.primaryColor, { h: -160 }), this.primaryBorderColor = pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.mainBkg = "#eee", this.secondBkg = "calculated", this.lineColor = "#666", this.border1 = "#999", this.border2 = "calculated", this.note = "#ffa", this.text = "#333", this.critical = "#d42", this.done = "#bbb", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "white", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = this.actorBorder, this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "calculated", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBkgColor = "calculated", this.critBorderColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.rowOdd = this.rowOdd || N(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || "#f4f4f4", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    var t, r, i, s, o, a, n, l, h, c, u, f, d, p, m, y, x, C, k, w, T, _, v, L, W, O, M, U, z, D, E, A, $, B, I, Y, X, Z, ot, Q, at, gt, mt, Tt, At, K, V, Ct, ht;
    this.secondBkg = N(this.contrast, 55), this.border2 = this.contrast, this.actorBorder = N(this.border1, 23), this.actorBkg = this.mainBkg, this.actorTextColor = this.text, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.signalColor = this.text, this.signalTextColor = this.text, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.text, this.loopTextColor = this.text, this.noteBorderColor = "#999", this.noteBkgColor = "#666", this.noteTextColor = "#fff", this.cScale0 = this.cScale0 || "#555", this.cScale1 = this.cScale1 || "#F4F4F4", this.cScale2 = this.cScale2 || "#555", this.cScale3 = this.cScale3 || "#BBB", this.cScale4 = this.cScale4 || "#777", this.cScale5 = this.cScale5 || "#999", this.cScale6 = this.cScale6 || "#DDD", this.cScale7 = this.cScale7 || "#FFF", this.cScale8 = this.cScale8 || "#DDD", this.cScale9 = this.cScale9 || "#BBB", this.cScale10 = this.cScale10 || "#999", this.cScale11 = this.cScale11 || "#777";
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleInv" + P] = this["cScaleInv" + P] || F(this["cScale" + P]);
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this.darkMode ? this["cScalePeer" + P] = this["cScalePeer" + P] || N(this["cScale" + P], 10) : this["cScalePeer" + P] = this["cScalePeer" + P] || q(this["cScale" + P], 10);
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.cScaleLabel0 = this.cScaleLabel0 || this.cScale1, this.cScaleLabel2 = this.cScaleLabel2 || this.cScale1;
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["cScaleLabel" + P] = this["cScaleLabel" + P] || this.scaleLabelColor;
    for (let P = 0; P < 5; P++)
      this["surface" + P] = this["surface" + P] || b(this.mainBkg, { l: -(5 + P * 5) }), this["surfacePeer" + P] = this["surfacePeer" + P] || b(this.mainBkg, { l: -(8 + P * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.text, this.sectionBkgColor = N(this.contrast, 30), this.sectionBkgColor2 = N(this.contrast, 30), this.taskBorderColor = q(this.contrast, 10), this.taskBkgColor = this.contrast, this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = this.text, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.gridColor = N(this.border1, 30), this.doneTaskBkgColor = this.done, this.doneTaskBorderColor = this.lineColor, this.critBkgColor = this.critical, this.critBorderColor = q(this.critBkgColor, 10), this.todayLineColor = this.critBkgColor, this.vertLineColor = this.critBkgColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || "#000", this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f4f4f4", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.stateBorder = this.stateBorder || "#000", this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#222", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = b(this.primaryColor, { h: 64 }), this.fillType3 = b(this.secondaryColor, { h: 64 }), this.fillType4 = b(this.primaryColor, { h: -64 }), this.fillType5 = b(this.secondaryColor, { h: -64 }), this.fillType6 = b(this.primaryColor, { h: 128 }), this.fillType7 = b(this.secondaryColor, { h: 128 });
    for (let P = 0; P < this.THEME_COLOR_LIMIT; P++)
      this["pie" + P] = this["cScale" + P];
    this.pie12 = this.pie0, this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let P = 0; P < 8; P++)
      this["venn" + (P + 1)] = this["venn" + (P + 1)] ?? this["cScale" + P];
    this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: ((t = this.cynefin) == null ? void 0 : t.domainFontSize) || 16,
      itemFontSize: ((r = this.cynefin) == null ? void 0 : r.itemFontSize) || 12,
      boundaryColor: ((i = this.cynefin) == null ? void 0 : i.boundaryColor) || this.lineColor,
      boundaryWidth: ((s = this.cynefin) == null ? void 0 : s.boundaryWidth) || 2,
      cliffColor: ((o = this.cynefin) == null ? void 0 : o.cliffColor) || "#8B0000",
      cliffWidth: ((a = this.cynefin) == null ? void 0 : a.cliffWidth) || 4,
      arrowColor: ((n = this.cynefin) == null ? void 0 : n.arrowColor) || this.lineColor,
      arrowWidth: ((l = this.cynefin) == null ? void 0 : l.arrowWidth) || 2,
      complexBg: ((h = this.cynefin) == null ? void 0 : h.complexBg) || "#E8F5E9",
      complicatedBg: ((c = this.cynefin) == null ? void 0 : c.complicatedBg) || "#E3F2FD",
      chaoticBg: ((u = this.cynefin) == null ? void 0 : u.chaoticBg) || "#FBE9E7",
      clearBg: ((f = this.cynefin) == null ? void 0 : f.clearBg) || "#FFF8E1",
      confusionBg: ((d = this.cynefin) == null ? void 0 : d.confusionBg) || "#F3E5F5",
      textColor: ((p = this.cynefin) == null ? void 0 : p.textColor) || this.textColor,
      labelColor: ((m = this.cynefin) == null ? void 0 : m.labelColor) || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((y = this.xyChart) == null ? void 0 : y.backgroundColor) || this.background,
      titleColor: ((x = this.xyChart) == null ? void 0 : x.titleColor) || this.primaryTextColor,
      dataLabelColor: ((C = this.xyChart) == null ? void 0 : C.dataLabelColor) || this.primaryTextColor,
      xAxisTitleColor: ((k = this.xyChart) == null ? void 0 : k.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((w = this.xyChart) == null ? void 0 : w.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((T = this.xyChart) == null ? void 0 : T.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((_ = this.xyChart) == null ? void 0 : _.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((v = this.xyChart) == null ? void 0 : v.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((L = this.xyChart) == null ? void 0 : L.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((W = this.xyChart) == null ? void 0 : W.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((O = this.xyChart) == null ? void 0 : O.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((M = this.xyChart) == null ? void 0 : M.plotColorPalette) || "#EEE,#6BB8E4,#8ACB88,#C7ACD6,#E8DCC2,#FFB2A8,#FFF380,#7E8D91,#FFD8B1,#FAF3E0"
    }, this.radar = {
      axisColor: ((U = this.radar) == null ? void 0 : U.axisColor) || this.lineColor,
      axisStrokeWidth: ((z = this.radar) == null ? void 0 : z.axisStrokeWidth) || 2,
      axisLabelFontSize: ((D = this.radar) == null ? void 0 : D.axisLabelFontSize) || 12,
      curveOpacity: ((E = this.radar) == null ? void 0 : E.curveOpacity) || 0.5,
      curveStrokeWidth: ((A = this.radar) == null ? void 0 : A.curveStrokeWidth) || 2,
      graticuleColor: (($ = this.radar) == null ? void 0 : $.graticuleColor) || "#DEDEDE",
      graticuleStrokeWidth: ((B = this.radar) == null ? void 0 : B.graticuleStrokeWidth) || 1,
      graticuleOpacity: ((I = this.radar) == null ? void 0 : I.graticuleOpacity) || 0.3,
      legendBoxSize: ((Y = this.radar) == null ? void 0 : Y.legendBoxSize) || 12,
      legendFontSize: ((X = this.radar) == null ? void 0 : X.legendFontSize) || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: ((Z = this.wardley) == null ? void 0 : Z.backgroundColor) || this.background,
      axisColor: ((ot = this.wardley) == null ? void 0 : ot.axisColor) || this.lineColor,
      axisTextColor: ((Q = this.wardley) == null ? void 0 : Q.axisTextColor) || this.primaryTextColor,
      gridColor: ((at = this.wardley) == null ? void 0 : at.gridColor) || this.gridColor,
      componentFill: ((gt = this.wardley) == null ? void 0 : gt.componentFill) || this.background,
      componentStroke: ((mt = this.wardley) == null ? void 0 : mt.componentStroke) || this.lineColor,
      componentLabelColor: ((Tt = this.wardley) == null ? void 0 : Tt.componentLabelColor) || this.primaryTextColor,
      linkStroke: ((At = this.wardley) == null ? void 0 : At.linkStroke) || this.lineColor,
      evolutionStroke: ((K = this.wardley) == null ? void 0 : K.evolutionStroke) || this.wardleyEvolutionColor,
      annotationStroke: ((V = this.wardley) == null ? void 0 : V.annotationStroke) || this.lineColor,
      annotationTextColor: ((Ct = this.wardley) == null ? void 0 : Ct.annotationTextColor) || this.primaryTextColor,
      annotationFill: ((ht = this.wardley) == null ? void 0 : ht.annotationFill) || this.background
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = q(this.pie1, 25) || this.primaryColor, this.git1 = this.pie2 || this.secondaryColor, this.git2 = this.pie3 || this.tertiaryColor, this.git3 = this.pie4 || b(this.primaryColor, { h: -30 }), this.git4 = this.pie5 || b(this.primaryColor, { h: -60 }), this.git5 = this.pie6 || b(this.primaryColor, { h: -90 }), this.git6 = this.pie7 || b(this.primaryColor, { h: 60 }), this.git7 = this.pie8 || b(this.primaryColor, { h: 120 }), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || this.labelTextColor, this.gitBranchLabel0 = this.branchLabelColor, this.gitBranchLabel1 = "white", this.gitBranchLabel2 = this.branchLabelColor, this.gitBranchLabel3 = "white", this.gitBranchLabel4 = this.branchLabelColor, this.gitBranchLabel5 = this.branchLabelColor, this.gitBranchLabel6 = this.branchLabelColor, this.gitBranchLabel7 = this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(wi, "Theme"), wi), tb = /* @__PURE__ */ g((e) => {
  const t = new JC();
  return t.calculate(e), t;
}, "getThemeVariables"), Ti, eb = (Ti = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 2, this.primaryBorderColor = pt(this.primaryColor, this.darkMode), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#000000", this.stateBorder = "#000000", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 0px 1px 2px rgba(0, 0, 0, 0.25));", this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    var o, a, n, l, h, c, u, f, d, p, m;
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = b(t, { h: 180, l: 5 });
    if (this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || N(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || t, this.cScale1 = this.cScale1 || r, this.cScale2 = this.cScale2 || i, this.cScale3 = this.cScale3 || b(t, { h: 30 }), this.cScale4 = this.cScale4 || b(t, { h: 60 }), this.cScale5 = this.cScale5 || b(t, { h: 90 }), this.cScale6 = this.cScale6 || b(t, { h: 120 }), this.cScale7 = this.cScale7 || b(t, { h: 150 }), this.cScale8 = this.cScale8 || b(t, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || b(t, { h: 270 }), this.cScale10 = this.cScale10 || b(t, { h: 300 }), this.cScale11 = this.cScale11 || b(t, { h: 330 }), this.darkMode)
      for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
        this["cScale" + y] = q(this["cScale" + y], 75);
    else
      for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
        this["cScale" + y] = q(this["cScale" + y], 25);
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScaleInv" + y] = this["cScaleInv" + y] || F(this["cScale" + y]);
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this.darkMode ? this["cScalePeer" + y] = this["cScalePeer" + y] || N(this["cScale" + y], 10) : this["cScalePeer" + y] = this["cScalePeer" + y] || q(this["cScale" + y], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScaleLabel" + y] = this["cScaleLabel" + y] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let y = 0; y < 5; y++)
      this["surface" + y] = this["surface" + y] || b(this.mainBkg, { h: 180, s: -15, l: s * (5 + y * 3) }), this["surfacePeer" + y] = this["surfacePeer" + y] || b(this.mainBkg, { h: 180, s: -15, l: s * (8 + y * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || b(t, { h: 64 }), this.fillType3 = this.fillType3 || b(r, { h: 64 }), this.fillType4 = this.fillType4 || b(t, { h: -64 }), this.fillType5 = this.fillType5 || b(r, { h: -64 }), this.fillType6 = this.fillType6 || b(t, { h: 128 }), this.fillType7 = this.fillType7 || b(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || b(t, { l: -10 }), this.pie5 = this.pie5 || b(r, { l: -10 }), this.pie6 = this.pie6 || b(i, { l: -10 }), this.pie7 = this.pie7 || b(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || b(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((o = this.xyChart) == null ? void 0 : o.backgroundColor) || this.background,
      titleColor: ((a = this.xyChart) == null ? void 0 : a.titleColor) || this.primaryTextColor,
      xAxisTitleColor: ((n = this.xyChart) == null ? void 0 : n.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((l = this.xyChart) == null ? void 0 : l.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((h = this.xyChart) == null ? void 0 : h.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((c = this.xyChart) == null ? void 0 : c.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((u = this.xyChart) == null ? void 0 : u.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((f = this.xyChart) == null ? void 0 : f.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((d = this.xyChart) == null ? void 0 : d.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((p = this.xyChart) == null ? void 0 : p.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((m = this.xyChart) == null ? void 0 : m.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || b(t, { h: -30 }), this.git4 = this.git4 || b(t, { h: -60 }), this.git5 = this.git5 || b(t, { h: -90 }), this.git6 = this.git6 || b(t, { h: 60 }), this.git7 = this.git7 || b(t, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(Ti, "Theme"), Ti), rb = /* @__PURE__ */ g((e) => {
  const t = new eb();
  return t.calculate(e), t;
}, "getThemeVariables"), _i, ib = (_i = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = N(this.primaryColor, 16), this.tertiaryColor = b(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#2a2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = N(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Cr(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 1, this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.2))", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    var r, i, s, o, a, n, l, h, c, u, f;
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || N(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || b(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || b(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || b(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || b(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || b(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || b(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || b(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || b(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || b(this.primaryColor, { h: 330 }), this.darkMode)
      for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
        this["cScale" + d] = q(this["cScale" + d], 75);
    else
      for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
        this["cScale" + d] = q(this["cScale" + d], 25);
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this["cScaleInv" + d] = this["cScaleInv" + d] || F(this["cScale" + d]);
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this.darkMode ? this["cScalePeer" + d] = this["cScalePeer" + d] || N(this["cScale" + d], 10) : this["cScalePeer" + d] = this["cScalePeer" + d] || q(this["cScale" + d], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this["cScaleLabel" + d] = this["cScaleLabel" + d] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let d = 0; d < 5; d++)
      this["surface" + d] = this["surface" + d] || b(this.mainBkg, { h: 180, s: -15, l: t * (5 + d * 3) }), this["surfacePeer" + d] = this["surfacePeer" + d] || b(this.mainBkg, { h: 180, s: -15, l: t * (8 + d * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || b(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || b(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || b(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || b(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || b(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || b(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || b(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || b(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || b(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || b(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((r = this.xyChart) == null ? void 0 : r.backgroundColor) || this.background,
      titleColor: ((i = this.xyChart) == null ? void 0 : i.titleColor) || this.primaryTextColor,
      xAxisTitleColor: ((s = this.xyChart) == null ? void 0 : s.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((o = this.xyChart) == null ? void 0 : o.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((a = this.xyChart) == null ? void 0 : a.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((n = this.xyChart) == null ? void 0 : n.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((l = this.xyChart) == null ? void 0 : l.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((h = this.xyChart) == null ? void 0 : h.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((c = this.xyChart) == null ? void 0 : c.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((u = this.xyChart) == null ? void 0 : u.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((f = this.xyChart) == null ? void 0 : f.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || "#0b0000", this.git1 = this.git1 || "#4d1037", this.git2 = this.git2 || "#3f5258", this.git3 = this.git3 || "#4f2f1b", this.git4 = this.git4 || "#6e0a0a", this.git5 = this.git5 || "#3b0048", this.git6 = this.git6 || "#995a01", this.git7 = this.git7 || "#154706", this.gitDarkMode = !0, this.gitDarkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(_i, "Theme"), _i), sb = /* @__PURE__ */ g((e) => {
  const t = new ib();
  return t.calculate(e), t;
}, "getThemeVariables"), Bi, ob = (Bi = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = pt("#28253D", this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.clusterBkg = "#F9F9FB", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.filterColor = "#000000";
  }
  updateColors() {
    var o, a, n, l, h, c, u, f, d, p, m;
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#FEF9C3", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.noteFontWeight = 600, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = b(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || N(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.compositeTitleBackground = "#F9F9FB", this.altBackground = "#F9F9FB", this.stateEdgeLabelBackground = "#FFFFFF", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor;
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScale" + y] = this.mainBkg;
    if (this.darkMode)
      for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
        this["cScale" + y] = q(this["cScale" + y], 75);
    else
      for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
        this["cScale" + y] = q(this["cScale" + y], 25);
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScaleInv" + y] = this["cScaleInv" + y] || F(this["cScale" + y]);
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this.darkMode ? this["cScalePeer" + y] = this["cScalePeer" + y] || N(this["cScale" + y], 10) : this["cScalePeer" + y] = this["cScalePeer" + y] || q(this["cScale" + y], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScaleLabel" + y] = this["cScaleLabel" + y] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let y = 0; y < 5; y++)
      this["surface" + y] = this["surface" + y] || b(this.mainBkg, { h: 180, s: -15, l: s * (5 + y * 3) }), this["surfacePeer" + y] = this["surfacePeer" + y] || b(this.mainBkg, { h: 180, s: -15, l: s * (8 + y * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || b(t, { h: 64 }), this.fillType3 = this.fillType3 || b(r, { h: 64 }), this.fillType4 = this.fillType4 || b(t, { h: -64 }), this.fillType5 = this.fillType5 || b(r, { h: -64 }), this.fillType6 = this.fillType6 || b(t, { h: 128 }), this.fillType7 = this.fillType7 || b(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || b(t, { l: -10 }), this.pie5 = this.pie5 || b(r, { l: -10 }), this.pie6 = this.pie6 || b(i, { l: -10 }), this.pie7 = this.pie7 || b(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || b(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((o = this.xyChart) == null ? void 0 : o.backgroundColor) || this.background,
      titleColor: ((a = this.xyChart) == null ? void 0 : a.titleColor) || this.primaryTextColor,
      xAxisTitleColor: ((n = this.xyChart) == null ? void 0 : n.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((l = this.xyChart) == null ? void 0 : l.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((h = this.xyChart) == null ? void 0 : h.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((c = this.xyChart) == null ? void 0 : c.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((u = this.xyChart) == null ? void 0 : u.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((f = this.xyChart) == null ? void 0 : f.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((d = this.xyChart) == null ? void 0 : d.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((p = this.xyChart) == null ? void 0 : p.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((m = this.xyChart) == null ? void 0 : m.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#FFFFFF", this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || b(t, { h: -30 }), this.git4 = this.git4 || b(t, { h: -60 }), this.git5 = this.git5 || b(t, { h: -90 }), this.git6 = this.git6 || b(t, { h: 60 }), this.git7 = this.git7 || b(t, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(Bi, "Theme"), Bi), ab = /* @__PURE__ */ g((e) => {
  const t = new ob();
  return t.calculate(e), t;
}, "getThemeVariables"), vi, nb = (vi = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = N(this.primaryColor, 16), this.tertiaryColor = b(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = N(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Cr(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.filterColor = "#FFFFFF";
  }
  updateColors() {
    var r, i, s, o, a, n, l, h, c, u, f;
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || N(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.compositeBackground = "#16141F", this.altBackground = "#16141F", this.compositeTitleBackground = "#16141F", this.stateEdgeLabelBackground = "#16141F", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || b(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || b(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || b(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || b(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || b(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || b(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || b(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || b(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || b(this.primaryColor, { h: 330 }), this.darkMode)
      for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
        this["cScale" + d] = q(this["cScale" + d], 75);
    else
      for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
        this["cScale" + d] = q(this["cScale" + d], 25);
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this["cScaleInv" + d] = this["cScaleInv" + d] || F(this["cScale" + d]);
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this.darkMode ? this["cScalePeer" + d] = this["cScalePeer" + d] || N(this["cScale" + d], 10) : this["cScalePeer" + d] = this["cScalePeer" + d] || q(this["cScale" + d], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this["cScaleLabel" + d] = this["cScaleLabel" + d] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let d = 0; d < 5; d++)
      this["surface" + d] = this["surface" + d] || b(this.mainBkg, { h: 180, s: -15, l: t * (5 + d * 3) }), this["surfacePeer" + d] = this["surfacePeer" + d] || b(this.mainBkg, { h: 180, s: -15, l: t * (8 + d * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || b(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || b(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || b(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || b(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || b(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || b(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || b(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || b(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || b(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || b(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((r = this.xyChart) == null ? void 0 : r.backgroundColor) || this.background,
      titleColor: ((i = this.xyChart) == null ? void 0 : i.titleColor) || this.primaryTextColor,
      xAxisTitleColor: ((s = this.xyChart) == null ? void 0 : s.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((o = this.xyChart) == null ? void 0 : o.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((a = this.xyChart) == null ? void 0 : a.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((n = this.xyChart) == null ? void 0 : n.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((l = this.xyChart) == null ? void 0 : l.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((h = this.xyChart) == null ? void 0 : h.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((c = this.xyChart) == null ? void 0 : c.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((u = this.xyChart) == null ? void 0 : u.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((f = this.xyChart) == null ? void 0 : f.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#16141F", this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || b(this.primaryColor, { h: -30 }), this.git4 = this.git4 || b(this.primaryColor, { h: -60 }), this.git5 = this.git5 || b(this.primaryColor, { h: -90 }), this.git6 = this.git6 || b(this.primaryColor, { h: 60 }), this.git7 = this.git7 || b(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(vi, "Theme"), vi), lb = /* @__PURE__ */ g((e) => {
  const t = new nb();
  return t.calculate(e), t;
}, "getThemeVariables"), Li, hb = (Li = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = pt(this.primaryColor, this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
      "#E879F9",
      //Fuchsia-400
      "#2DD4BF",
      //Teal-400
      "#FB923C",
      //Orange-400
      "#22D3EE",
      // Cyan-400
      "#4ADE80",
      // Green-400
      "#A78BFA",
      //Violet-400
      "#F87171",
      //red-400
      "#FACC15",
      //yellow-400
      "#818CF8",
      //indigo-400
      "#A3E635 ",
      //Lime-400
      "#38BDF8",
      //Sky-400
      "#FB7185"
      //Rose-400
    ], this.bkgColorArray = [
      "#FDF4FF",
      //Fuchsia-50
      "#F0FDFA",
      //Teal-50
      "#FFF7ED",
      //Orange-50
      "#ECFEFF",
      // Cyan-50
      "#F0FDF4",
      // Green-50
      "#F5F3FF",
      //Violet-50
      "#FEF2F2",
      //red-50
      "#FEFCE8",
      //yellow-50
      "#EEF2FF",
      //indigo-50
      "#F7FEE7",
      //Lime-50
      "#F0F9FF",
      //Sky-50
      "#FFF1F2"
      //Rose-50
    ], this.filterColor = "#000000";
  }
  updateColors() {
    var o, a, n, l, h, c, u, f, d, p, m;
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = b(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || N(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScaleInv" + y] = this["cScaleInv" + y] || F(this["cScale" + y]);
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this.darkMode ? this["cScalePeer" + y] = this["cScalePeer" + y] || N(this["cScale" + y], 10) : this["cScalePeer" + y] = this["cScalePeer" + y] || q(this["cScale" + y], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let y = 0; y < this.THEME_COLOR_LIMIT; y++)
      this["cScaleLabel" + y] = this["cScaleLabel" + y] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let y = 0; y < 5; y++)
      this["surface" + y] = this["surface" + y] || b(this.mainBkg, { h: 180, s: -15, l: s * (5 + y * 3) }), this["surfacePeer" + y] = this["surfacePeer" + y] || b(this.mainBkg, { h: 180, s: -15, l: s * (8 + y * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || b(t, { h: 64 }), this.fillType3 = this.fillType3 || b(r, { h: 64 }), this.fillType4 = this.fillType4 || b(t, { h: -64 }), this.fillType5 = this.fillType5 || b(r, { h: -64 }), this.fillType6 = this.fillType6 || b(t, { h: 128 }), this.fillType7 = this.fillType7 || b(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || b(t, { l: -10 }), this.pie5 = this.pie5 || b(r, { l: -10 }), this.pie6 = this.pie6 || b(i, { l: -10 }), this.pie7 = this.pie7 || b(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || b(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((o = this.xyChart) == null ? void 0 : o.backgroundColor) || this.background,
      titleColor: ((a = this.xyChart) == null ? void 0 : a.titleColor) || this.primaryTextColor,
      xAxisTitleColor: ((n = this.xyChart) == null ? void 0 : n.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((l = this.xyChart) == null ? void 0 : l.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((h = this.xyChart) == null ? void 0 : h.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((c = this.xyChart) == null ? void 0 : c.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((u = this.xyChart) == null ? void 0 : u.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((f = this.xyChart) == null ? void 0 : f.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((d = this.xyChart) == null ? void 0 : d.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((p = this.xyChart) == null ? void 0 : p.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((m = this.xyChart) == null ? void 0 : m.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || b(t, { h: -30 }), this.git4 = this.git4 || b(t, { h: -60 }), this.git5 = this.git5 || b(t, { h: -90 }), this.git6 = this.git6 || b(t, { h: 60 }), this.git7 = this.git7 || b(t, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.fontWeight = 600, this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(Li, "Theme"), Li), cb = /* @__PURE__ */ g((e) => {
  const t = new hb();
  return t.calculate(e), t;
}, "getThemeVariables"), Ai, ub = (Ai = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = N(this.primaryColor, 16), this.tertiaryColor = b(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = pt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = N(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Cr(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
      "#E879F9",
      //Fuchsia-400
      "#2DD4BF",
      //Teal-400
      "#FB923C",
      //Orange-400
      "#22D3EE",
      // Cyan-400
      "#4ADE80",
      // Green-400
      "#A78BFA",
      //Violet-400
      "#F87171",
      //red-400
      "#FACC15",
      //yellow-400
      "#818CF8",
      //indigo-400
      "#A3E635 ",
      //Lime-400
      "#38BDF8",
      //Sky-400
      "#FB7185"
      //Rose-400
    ], this.bkgColorArray = [], this.filterColor = "#FFFFFF";
  }
  updateColors() {
    var r, i, s, o, a, n, l, h, c, u, f;
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || b(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || b(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || pt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || pt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || pt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || pt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || q(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.rootLabelColor = "#FFFFFF", this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || N(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this["cScaleInv" + d] = this["cScaleInv" + d] || F(this["cScale" + d]);
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this.darkMode ? this["cScalePeer" + d] = this["cScalePeer" + d] || N(this["cScale" + d], 10) : this["cScalePeer" + d] = this["cScalePeer" + d] || q(this["cScale" + d], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let d = 0; d < this.THEME_COLOR_LIMIT; d++)
      this["cScaleLabel" + d] = q(this["cScale" + d], 75);
    const t = this.darkMode ? -4 : -1;
    for (let d = 0; d < 5; d++)
      this["surface" + d] = this["surface" + d] || b(this.mainBkg, { h: 180, s: -15, l: t * (5 + d * 3) }), this["surfacePeer" + d] = this["surfacePeer" + d] || b(this.mainBkg, { h: 180, s: -15, l: t * (8 + d * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || b(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || b(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || b(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || b(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || b(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || b(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || b(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || b(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || b(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || b(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || b(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || b(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || b(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || b(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || b(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || b(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || b(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || b(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || b(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || b(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || b(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Oe(this.quadrant1Fill) ? N(this.quadrant1Fill) : q(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: ((r = this.xyChart) == null ? void 0 : r.backgroundColor) || this.background,
      titleColor: ((i = this.xyChart) == null ? void 0 : i.titleColor) || this.primaryTextColor,
      xAxisTitleColor: ((s = this.xyChart) == null ? void 0 : s.xAxisTitleColor) || this.primaryTextColor,
      xAxisLabelColor: ((o = this.xyChart) == null ? void 0 : o.xAxisLabelColor) || this.primaryTextColor,
      xAxisTickColor: ((a = this.xyChart) == null ? void 0 : a.xAxisTickColor) || this.primaryTextColor,
      xAxisLineColor: ((n = this.xyChart) == null ? void 0 : n.xAxisLineColor) || this.primaryTextColor,
      yAxisTitleColor: ((l = this.xyChart) == null ? void 0 : l.yAxisTitleColor) || this.primaryTextColor,
      yAxisLabelColor: ((h = this.xyChart) == null ? void 0 : h.yAxisLabelColor) || this.primaryTextColor,
      yAxisTickColor: ((c = this.xyChart) == null ? void 0 : c.yAxisTickColor) || this.primaryTextColor,
      yAxisLineColor: ((u = this.xyChart) == null ? void 0 : u.yAxisLineColor) || this.primaryTextColor,
      plotColorPalette: ((f = this.xyChart) == null ? void 0 : f.plotColorPalette) || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? q(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || b(this.primaryColor, { h: -30 }), this.git4 = this.git4 || b(this.primaryColor, { h: -60 }), this.git5 = this.git5 || b(this.primaryColor, { h: -90 }), this.git6 = this.git6 || b(this.primaryColor, { h: 60 }), this.git7 = this.git7 || b(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = N(this.git0, 25), this.git1 = N(this.git1, 25), this.git2 = N(this.git2, 25), this.git3 = N(this.git3, 25), this.git4 = N(this.git4, 25), this.git5 = N(this.git5, 25), this.git6 = N(this.git6, 25), this.git7 = N(this.git7, 25)) : (this.git0 = q(this.git0, 25), this.git1 = q(this.git1, 25), this.git2 = q(this.git2, 25), this.git3 = q(this.git3, 25), this.git4 = q(this.git4, 25), this.git5 = q(this.git5, 25), this.git6 = q(this.git6, 25), this.git7 = q(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.fontWeight = 600, this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Ge, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || je;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, g(Ai, "Theme"), Ai), db = /* @__PURE__ */ g((e) => {
  const t = new ub();
  return t.calculate(e), t;
}, "getThemeVariables"), rr = {
  base: {
    getThemeVariables: XC
  },
  dark: {
    getThemeVariables: jC
  },
  default: {
    getThemeVariables: ZC
  },
  forest: {
    getThemeVariables: QC
  },
  neutral: {
    getThemeVariables: tb
  },
  neo: {
    getThemeVariables: rb
  },
  "neo-dark": {
    getThemeVariables: sb
  },
  redux: {
    getThemeVariables: ab
  },
  "redux-dark": {
    getThemeVariables: lb
  },
  "redux-color": {
    getThemeVariables: cb
  },
  "redux-dark-color": {
    getThemeVariables: db
  }
}, Ut = {
  flowchart: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    subGraphTitleMargin: {
      top: 0,
      bottom: 0
    },
    diagramPadding: 8,
    htmlLabels: null,
    nodeSpacing: 50,
    rankSpacing: 50,
    curve: "basis",
    padding: 15,
    defaultRenderer: "dagre-wrapper",
    wrappingWidth: 200,
    inheritDir: !1
  },
  swimlane: {
    useMaxWidth: !0,
    lineHops: "arc",
    ignoreCrossLaneEdges: !0,
    optimizeRanksByCrossings: !0,
    automaticLaneOrdering: !1
  },
  sequence: {
    useMaxWidth: !0,
    hideUnusedParticipants: !1,
    activationWidth: 10,
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    mirrorActors: !0,
    forceMenus: !1,
    bottomMarginAdj: 1,
    rightAngles: !1,
    showSequenceNumbers: !1,
    actorFontSize: 14,
    actorFontFamily: '"Open Sans", sans-serif',
    actorFontWeight: 400,
    noteFontSize: 14,
    noteFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    noteFontWeight: 400,
    noteAlign: "center",
    messageFontSize: 16,
    messageFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    messageFontWeight: 400,
    wrap: !1,
    wrapPadding: 10,
    labelBoxWidth: 50,
    labelBoxHeight: 20
  },
  gantt: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    rightPadding: 75,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    sectionFontSize: 11,
    numberSectionStyles: 4,
    axisFormat: "%Y-%m-%d",
    topAxis: !1,
    displayMode: "",
    weekday: "sunday"
  },
  journey: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    maxLabelWidth: 360,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    bottomMarginAdj: 1,
    rightAngles: !1,
    taskFontSize: 14,
    taskFontFamily: '"Open Sans", sans-serif',
    taskMargin: 50,
    activationWidth: 10,
    textPlacement: "fo",
    actorColours: [
      "#8FBC8F",
      "#7CFC00",
      "#00FFFF",
      "#20B2AA",
      "#B0E0E6",
      "#FFFFE0"
    ],
    sectionFills: [
      "#191970",
      "#8B008B",
      "#4B0082",
      "#2F4F4F",
      "#800000",
      "#8B4513",
      "#00008B"
    ],
    sectionColours: [
      "#fff"
    ],
    titleColor: "",
    titleFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    titleFontSize: "4ex"
  },
  class: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    arrowMarkerAbsolute: !1,
    dividerMargin: 10,
    padding: 5,
    textHeight: 10,
    defaultRenderer: "dagre-wrapper",
    htmlLabels: !1,
    hideEmptyMembersBox: !1,
    hierarchicalNamespaces: !0
  },
  state: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    dividerMargin: 10,
    sizeUnit: 5,
    padding: 8,
    textHeight: 10,
    titleShift: -15,
    noteMargin: 10,
    forkWidth: 70,
    forkHeight: 7,
    miniPadding: 2,
    fontSizeFactor: 5.02,
    fontSize: 24,
    labelHeight: 16,
    edgeLengthFactor: "20",
    compositTitleSize: 35,
    radius: 5,
    defaultRenderer: "dagre-wrapper"
  },
  er: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    diagramPadding: 20,
    layoutDirection: "TB",
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
    nodeSpacing: 140,
    rankSpacing: 80,
    stroke: "gray",
    fill: "honeydew",
    fontSize: 12
  },
  pie: {
    useMaxWidth: !0,
    textPosition: 0.75,
    donutHole: 0,
    legendPosition: "right",
    highlightSlice: ""
  },
  quadrantChart: {
    useMaxWidth: !0,
    chartWidth: 500,
    chartHeight: 500,
    titleFontSize: 20,
    titlePadding: 10,
    quadrantPadding: 5,
    xAxisLabelPadding: 5,
    yAxisLabelPadding: 5,
    xAxisLabelFontSize: 16,
    yAxisLabelFontSize: 16,
    quadrantLabelFontSize: 16,
    quadrantTextTopPadding: 5,
    pointTextPadding: 5,
    pointLabelFontSize: 12,
    pointRadius: 5,
    xAxisPosition: "top",
    yAxisPosition: "left",
    quadrantInternalBorderStrokeWidth: 1,
    quadrantExternalBorderStrokeWidth: 2
  },
  xyChart: {
    useMaxWidth: !0,
    width: 700,
    height: 500,
    titleFontSize: 20,
    titlePadding: 10,
    showDataLabel: !1,
    showDataLabelOutsideBar: !1,
    showTitle: !0,
    xAxis: {
      $ref: "#/$defs/XYChartAxisConfig",
      showLabel: !0,
      labelFontSize: 14,
      labelPadding: 5,
      showTitle: !0,
      titleFontSize: 16,
      titlePadding: 5,
      showTick: !0,
      tickLength: 5,
      tickWidth: 2,
      showAxisLine: !0,
      axisLineWidth: 2,
      labelRotation: 0
    },
    yAxis: {
      $ref: "#/$defs/XYChartAxisConfig",
      showLabel: !0,
      labelFontSize: 14,
      labelPadding: 5,
      showTitle: !0,
      titleFontSize: 16,
      titlePadding: 5,
      showTick: !0,
      tickLength: 5,
      tickWidth: 2,
      showAxisLine: !0,
      axisLineWidth: 2,
      labelRotation: 0
    },
    chartOrientation: "vertical",
    plotReservedSpacePercent: 50
  },
  requirement: {
    useMaxWidth: !0,
    rect_fill: "#f9f9f9",
    text_color: "#333",
    rect_border_size: "0.5px",
    rect_border_color: "#bbb",
    rect_min_width: 200,
    rect_min_height: 200,
    fontSize: 14,
    rect_padding: 10,
    line_height: 20
  },
  mindmap: {
    useMaxWidth: !0,
    padding: 10,
    maxNodeWidth: 200,
    layoutAlgorithm: "cose-bilkent"
  },
  ishikawa: {
    useMaxWidth: !0,
    diagramPadding: 20
  },
  kanban: {
    useMaxWidth: !0,
    padding: 8,
    sectionWidth: 200,
    ticketBaseUrl: ""
  },
  timeline: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    bottomMarginAdj: 1,
    rightAngles: !1,
    taskFontSize: 14,
    taskFontFamily: '"Open Sans", sans-serif',
    taskMargin: 50,
    activationWidth: 10,
    textPlacement: "fo",
    actorColours: [
      "#8FBC8F",
      "#7CFC00",
      "#00FFFF",
      "#20B2AA",
      "#B0E0E6",
      "#FFFFE0"
    ],
    sectionFills: [
      "#191970",
      "#8B008B",
      "#4B0082",
      "#2F4F4F",
      "#800000",
      "#8B4513",
      "#00008B"
    ],
    sectionColours: [
      "#fff"
    ],
    disableMulticolor: !1
  },
  gitGraph: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    diagramPadding: 8,
    nodeLabel: {
      width: 75,
      height: 100,
      x: -25,
      y: 0
    },
    mainBranchName: "main",
    mainBranchOrder: 0,
    showCommitLabel: !0,
    showBranches: !0,
    rotateCommitLabel: !0,
    parallelCommits: !1,
    arrowMarkerAbsolute: !1
  },
  c4: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    c4ShapeMargin: 50,
    c4ShapePadding: 20,
    width: 216,
    height: 60,
    boxMargin: 10,
    c4ShapeInRow: 4,
    nextLinePaddingX: 0,
    c4BoundaryInRow: 2,
    personFontSize: 14,
    personFontFamily: '"Open Sans", sans-serif',
    personFontWeight: "normal",
    external_personFontSize: 14,
    external_personFontFamily: '"Open Sans", sans-serif',
    external_personFontWeight: "normal",
    systemFontSize: 14,
    systemFontFamily: '"Open Sans", sans-serif',
    systemFontWeight: "normal",
    external_systemFontSize: 14,
    external_systemFontFamily: '"Open Sans", sans-serif',
    external_systemFontWeight: "normal",
    system_dbFontSize: 14,
    system_dbFontFamily: '"Open Sans", sans-serif',
    system_dbFontWeight: "normal",
    external_system_dbFontSize: 14,
    external_system_dbFontFamily: '"Open Sans", sans-serif',
    external_system_dbFontWeight: "normal",
    system_queueFontSize: 14,
    system_queueFontFamily: '"Open Sans", sans-serif',
    system_queueFontWeight: "normal",
    external_system_queueFontSize: 14,
    external_system_queueFontFamily: '"Open Sans", sans-serif',
    external_system_queueFontWeight: "normal",
    boundaryFontSize: 14,
    boundaryFontFamily: '"Open Sans", sans-serif',
    boundaryFontWeight: "normal",
    messageFontSize: 12,
    messageFontFamily: '"Open Sans", sans-serif',
    messageFontWeight: "normal",
    containerFontSize: 14,
    containerFontFamily: '"Open Sans", sans-serif',
    containerFontWeight: "normal",
    external_containerFontSize: 14,
    external_containerFontFamily: '"Open Sans", sans-serif',
    external_containerFontWeight: "normal",
    container_dbFontSize: 14,
    container_dbFontFamily: '"Open Sans", sans-serif',
    container_dbFontWeight: "normal",
    external_container_dbFontSize: 14,
    external_container_dbFontFamily: '"Open Sans", sans-serif',
    external_container_dbFontWeight: "normal",
    container_queueFontSize: 14,
    container_queueFontFamily: '"Open Sans", sans-serif',
    container_queueFontWeight: "normal",
    external_container_queueFontSize: 14,
    external_container_queueFontFamily: '"Open Sans", sans-serif',
    external_container_queueFontWeight: "normal",
    componentFontSize: 14,
    componentFontFamily: '"Open Sans", sans-serif',
    componentFontWeight: "normal",
    external_componentFontSize: 14,
    external_componentFontFamily: '"Open Sans", sans-serif',
    external_componentFontWeight: "normal",
    component_dbFontSize: 14,
    component_dbFontFamily: '"Open Sans", sans-serif',
    component_dbFontWeight: "normal",
    external_component_dbFontSize: 14,
    external_component_dbFontFamily: '"Open Sans", sans-serif',
    external_component_dbFontWeight: "normal",
    component_queueFontSize: 14,
    component_queueFontFamily: '"Open Sans", sans-serif',
    component_queueFontWeight: "normal",
    external_component_queueFontSize: 14,
    external_component_queueFontFamily: '"Open Sans", sans-serif',
    external_component_queueFontWeight: "normal",
    wrap: !0,
    wrapPadding: 10,
    person_bg_color: "#08427B",
    person_border_color: "#073B6F",
    external_person_bg_color: "#686868",
    external_person_border_color: "#8A8A8A",
    system_bg_color: "#1168BD",
    system_border_color: "#3C7FC0",
    system_db_bg_color: "#1168BD",
    system_db_border_color: "#3C7FC0",
    system_queue_bg_color: "#1168BD",
    system_queue_border_color: "#3C7FC0",
    external_system_bg_color: "#999999",
    external_system_border_color: "#8A8A8A",
    external_system_db_bg_color: "#999999",
    external_system_db_border_color: "#8A8A8A",
    external_system_queue_bg_color: "#999999",
    external_system_queue_border_color: "#8A8A8A",
    container_bg_color: "#438DD5",
    container_border_color: "#3C7FC0",
    container_db_bg_color: "#438DD5",
    container_db_border_color: "#3C7FC0",
    container_queue_bg_color: "#438DD5",
    container_queue_border_color: "#3C7FC0",
    external_container_bg_color: "#B3B3B3",
    external_container_border_color: "#A6A6A6",
    external_container_db_bg_color: "#B3B3B3",
    external_container_db_border_color: "#A6A6A6",
    external_container_queue_bg_color: "#B3B3B3",
    external_container_queue_border_color: "#A6A6A6",
    component_bg_color: "#85BBF0",
    component_border_color: "#78A8D8",
    component_db_bg_color: "#85BBF0",
    component_db_border_color: "#78A8D8",
    component_queue_bg_color: "#85BBF0",
    component_queue_border_color: "#78A8D8",
    external_component_bg_color: "#CCCCCC",
    external_component_border_color: "#BFBFBF",
    external_component_db_bg_color: "#CCCCCC",
    external_component_db_border_color: "#BFBFBF",
    external_component_queue_bg_color: "#CCCCCC",
    external_component_queue_border_color: "#BFBFBF"
  },
  sankey: {
    useMaxWidth: !0,
    width: 600,
    height: 400,
    linkColor: "gradient",
    nodeAlignment: "justify",
    showValues: !0,
    prefix: "",
    suffix: "",
    nodeWidth: 10,
    nodePadding: 12,
    labelStyle: "legacy"
  },
  block: {
    useMaxWidth: !0,
    padding: 8
  },
  packet: {
    useMaxWidth: !0,
    rowHeight: 32,
    bitWidth: 32,
    bitsPerRow: 32,
    showBits: !0,
    paddingX: 5,
    paddingY: 5
  },
  treeView: {
    useMaxWidth: !0,
    rowIndent: 10,
    paddingX: 5,
    paddingY: 5,
    lineThickness: 1,
    showIcons: !1,
    defaultIconPack: "",
    filenameIcons: {},
    extensionIcons: {}
  },
  architecture: {
    useMaxWidth: !0,
    padding: 40,
    iconSize: 80,
    fontSize: 16,
    randomize: !1,
    nodeSeparation: 75,
    idealEdgeLengthMultiplier: 1.5,
    edgeElasticity: 0.45,
    numIter: 2500,
    seed: 1
  },
  eventmodeling: {
    useMaxWidth: !0,
    padding: 30,
    rowHeight: 32
  },
  radar: {
    useMaxWidth: !0,
    width: 600,
    height: 600,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
    axisScaleFactor: 1,
    axisLabelFactor: 1.05,
    curveTension: 0.17
  },
  venn: {
    useMaxWidth: !0,
    width: 800,
    height: 450,
    padding: 8,
    useDebugLayout: !1
  },
  cynefin: {
    useMaxWidth: !0,
    width: 800,
    height: 600,
    padding: 40,
    showDomainDescriptions: !0,
    boundaryAmplitude: 8,
    seed: 0
  },
  theme: "default",
  look: "classic",
  handDrawnSeed: 0,
  layout: "dagre",
  maxTextSize: 5e4,
  maxEdges: 500,
  darkMode: !1,
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif;',
  logLevel: 5,
  securityLevel: "strict",
  startOnLoad: !0,
  arrowMarkerAbsolute: !1,
  secure: [
    "secure",
    "securityLevel",
    "startOnLoad",
    "maxTextSize",
    "suppressErrorRendering",
    "maxEdges"
  ],
  legacyMathML: !1,
  forceLegacyMathML: !1,
  deterministicIds: !1,
  fontSize: 16,
  markdownAutoWrap: !0,
  suppressErrorRendering: !1
}, yd = {
  ...Ut,
  // Set, even though they're `undefined` so that `configKeys` finds these keys
  // TODO: Should we replace these with `null` so that they can go in the JSON Schema?
  deterministicIDSeed: void 0,
  elk: {
    // mergeEdges is needed here to be considered
    mergeEdges: !1,
    nodePlacementStrategy: "BRANDES_KOEPF",
    forceNodeModelOrder: !1,
    considerModelOrder: "NODES_AND_EDGES"
  },
  themeCSS: void 0,
  // add non-JSON default config values
  themeVariables: rr.default.getThemeVariables(),
  sequence: {
    ...Ut.sequence,
    messageFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.messageFontFamily,
        fontSize: this.messageFontSize,
        fontWeight: this.messageFontWeight
      };
    }, "messageFont"),
    noteFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.noteFontFamily,
        fontSize: this.noteFontSize,
        fontWeight: this.noteFontWeight
      };
    }, "noteFont"),
    actorFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.actorFontFamily,
        fontSize: this.actorFontSize,
        fontWeight: this.actorFontWeight
      };
    }, "actorFont")
  },
  class: {
    hideEmptyMembersBox: !1,
    hierarchicalNamespaces: !0
  },
  gantt: {
    ...Ut.gantt,
    tickInterval: void 0,
    useWidth: void 0
    // can probably be removed since `configKeys` already includes this
  },
  c4: {
    ...Ut.c4,
    useWidth: void 0,
    personFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.personFontFamily,
        fontSize: this.personFontSize,
        fontWeight: this.personFontWeight
      };
    }, "personFont"),
    flowchart: {
      ...Ut.flowchart,
      inheritDir: !1
      // default to legacy behavior
    },
    external_personFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_personFontFamily,
        fontSize: this.external_personFontSize,
        fontWeight: this.external_personFontWeight
      };
    }, "external_personFont"),
    systemFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.systemFontFamily,
        fontSize: this.systemFontSize,
        fontWeight: this.systemFontWeight
      };
    }, "systemFont"),
    external_systemFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_systemFontFamily,
        fontSize: this.external_systemFontSize,
        fontWeight: this.external_systemFontWeight
      };
    }, "external_systemFont"),
    system_dbFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.system_dbFontFamily,
        fontSize: this.system_dbFontSize,
        fontWeight: this.system_dbFontWeight
      };
    }, "system_dbFont"),
    external_system_dbFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_system_dbFontFamily,
        fontSize: this.external_system_dbFontSize,
        fontWeight: this.external_system_dbFontWeight
      };
    }, "external_system_dbFont"),
    system_queueFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.system_queueFontFamily,
        fontSize: this.system_queueFontSize,
        fontWeight: this.system_queueFontWeight
      };
    }, "system_queueFont"),
    external_system_queueFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_system_queueFontFamily,
        fontSize: this.external_system_queueFontSize,
        fontWeight: this.external_system_queueFontWeight
      };
    }, "external_system_queueFont"),
    containerFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.containerFontFamily,
        fontSize: this.containerFontSize,
        fontWeight: this.containerFontWeight
      };
    }, "containerFont"),
    external_containerFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_containerFontFamily,
        fontSize: this.external_containerFontSize,
        fontWeight: this.external_containerFontWeight
      };
    }, "external_containerFont"),
    container_dbFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.container_dbFontFamily,
        fontSize: this.container_dbFontSize,
        fontWeight: this.container_dbFontWeight
      };
    }, "container_dbFont"),
    external_container_dbFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_container_dbFontFamily,
        fontSize: this.external_container_dbFontSize,
        fontWeight: this.external_container_dbFontWeight
      };
    }, "external_container_dbFont"),
    container_queueFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.container_queueFontFamily,
        fontSize: this.container_queueFontSize,
        fontWeight: this.container_queueFontWeight
      };
    }, "container_queueFont"),
    external_container_queueFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_container_queueFontFamily,
        fontSize: this.external_container_queueFontSize,
        fontWeight: this.external_container_queueFontWeight
      };
    }, "external_container_queueFont"),
    componentFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.componentFontFamily,
        fontSize: this.componentFontSize,
        fontWeight: this.componentFontWeight
      };
    }, "componentFont"),
    external_componentFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_componentFontFamily,
        fontSize: this.external_componentFontSize,
        fontWeight: this.external_componentFontWeight
      };
    }, "external_componentFont"),
    component_dbFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.component_dbFontFamily,
        fontSize: this.component_dbFontSize,
        fontWeight: this.component_dbFontWeight
      };
    }, "component_dbFont"),
    external_component_dbFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_component_dbFontFamily,
        fontSize: this.external_component_dbFontSize,
        fontWeight: this.external_component_dbFontWeight
      };
    }, "external_component_dbFont"),
    component_queueFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.component_queueFontFamily,
        fontSize: this.component_queueFontSize,
        fontWeight: this.component_queueFontWeight
      };
    }, "component_queueFont"),
    external_component_queueFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.external_component_queueFontFamily,
        fontSize: this.external_component_queueFontSize,
        fontWeight: this.external_component_queueFontWeight
      };
    }, "external_component_queueFont"),
    boundaryFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.boundaryFontFamily,
        fontSize: this.boundaryFontSize,
        fontWeight: this.boundaryFontWeight
      };
    }, "boundaryFont"),
    messageFont: /* @__PURE__ */ g(function() {
      return {
        fontFamily: this.messageFontFamily,
        fontSize: this.messageFontSize,
        fontWeight: this.messageFontWeight
      };
    }, "messageFont")
  },
  pie: {
    ...Ut.pie,
    useWidth: 984
  },
  xyChart: {
    ...Ut.xyChart,
    useWidth: void 0
  },
  requirement: {
    ...Ut.requirement,
    useWidth: void 0
  },
  packet: {
    ...Ut.packet
  },
  eventmodeling: {
    ...Ut.eventmodeling
  },
  treeView: {
    ...Ut.treeView,
    useWidth: void 0
  },
  radar: {
    ...Ut.radar
  },
  railroad: {
    ...Ut.railroad,
    // Railroad colors and typography derive from the active theme unless explicitly overridden.
    fontSize: void 0,
    fontFamily: void 0,
    terminalFill: void 0,
    terminalStroke: void 0,
    terminalTextColor: void 0,
    nonTerminalFill: void 0,
    nonTerminalStroke: void 0,
    nonTerminalTextColor: void 0,
    lineColor: void 0,
    markerFill: void 0,
    commentFill: void 0,
    commentStroke: void 0,
    commentTextColor: void 0,
    specialFill: void 0,
    specialStroke: void 0,
    ruleNameColor: void 0
  },
  ishikawa: {
    ...Ut.ishikawa
  },
  sankey: {
    ...Ut.sankey,
    // Set so that `configKeys` includes this key for sanitizeDirective
    nodeColors: void 0
  },
  treemap: {
    useMaxWidth: !0,
    padding: 10,
    diagramPadding: 8,
    showValues: !0,
    nodeWidth: 100,
    nodeHeight: 40,
    borderWidth: 1,
    valueFontSize: 12,
    labelFontSize: 14,
    valueFormat: ","
  },
  venn: {
    ...Ut.venn
  },
  cynefin: {
    ...Ut.cynefin
  }
}, xd = /* @__PURE__ */ g((e, t = "") => Object.keys(e).reduce((r, i) => Array.isArray(e[i]) ? r : typeof e[i] == "object" && e[i] !== null ? [...r, t + i, ...xd(e[i], "")] : [...r, t + i], []), "keyify"), fb = new Set(xd(yd, "")), Cd = yd, pb = {
  // CSS colors (sankey)
  nodeColors: /^#[\da-f]{3,8}$|^rgb\([\d\s%,.]+\)$|^hsl\([\d\s%,.]+\)$|^[a-z]+$/i,
  // iconify icon references (treeView filenameIcons/extensionIcons)
  filenameIcons: /^[\w-]+(?::[\w-]+)?$/,
  extensionIcons: /^[\w-]+(?::[\w-]+)?$/
}, gb = /* @__PURE__ */ g((e, t) => {
  for (const r of Object.keys(e)) {
    const i = e[r];
    (r.startsWith("__") || r.includes("proto") || r.includes("constr") || typeof i != "string" || !t.test(i)) && (H.debug("sanitize deleting dictionary entry:", r, i), delete e[r]);
  }
}, "sanitizeDictionaryConfig"), Lo = /* @__PURE__ */ g((e) => {
  if (H.debug("sanitizeDirective called with", e), !(typeof e != "object" || e == null)) {
    if (Array.isArray(e)) {
      e.forEach((t) => Lo(t));
      return;
    }
    for (const t of Object.keys(e)) {
      if (H.debug("Checking key", t), t.startsWith("__") || t.includes("proto") || t.includes("constr") || !fb.has(t) || e[t] == null) {
        H.debug("sanitize deleting key: ", t), delete e[t];
        continue;
      }
      if (typeof e[t] == "object") {
        const i = pb[t];
        i ? gb(e[t], i) : (H.debug("sanitizing object", t), Lo(e[t]));
        continue;
      }
      const r = ["themeCSS", "fontFamily", "altFontFamily"];
      for (const i of r)
        t.includes(i) && (H.debug("sanitizing css option", t), e[t] = bd(e[t]));
    }
    if (e.themeVariables)
      for (const t of Object.keys(e.themeVariables)) {
        const r = e.themeVariables[t];
        r != null && r.match && !r.match(/^[\d "#%(),.;A-Za-z]+$/) && (e.themeVariables[t] = "");
      }
    H.debug("After sanitization", e);
  }
}, "sanitizeDirective"), bd = /* @__PURE__ */ g((e) => {
  let t = 0, r = 0;
  for (const i of e) {
    if (t < r)
      return "{ /* ERROR: Unbalanced CSS */ }";
    i === "{" ? t++ : i === "}" && r++;
  }
  return t !== r ? "{ /* ERROR: Unbalanced CSS */ }" : e;
}, "sanitizeCss"), Ii = Object.freeze(Cd), Ve = /* @__PURE__ */ g((e) => !(e === !1 || ["false", "null", "0"].includes(String(e).trim().toLowerCase())), "evaluate"), ce = Nt({}, Ii), Ao, Hr = [], gs = Nt({}, Ii), ha = /* @__PURE__ */ g((e, t) => {
  let r = Nt({}, e), i = {};
  for (const s of t)
    wd(s), i = Nt(i, s);
  if (r = Nt(r, i), i.theme && i.theme in rr) {
    const s = Nt({}, Ao), o = Nt(
      s.themeVariables || {},
      i.themeVariables
    );
    r.theme && r.theme in rr && (r.themeVariables = rr[r.theme].getThemeVariables(o));
  }
  return gs = r, _d(gs), gs;
}, "updateCurrentConfig"), mb = /* @__PURE__ */ g((e) => (ce = Nt({}, Ii), ce = Nt(ce, e), e.theme && rr[e.theme] && (ce.themeVariables = rr[e.theme].getThemeVariables(e.themeVariables)), ha(ce, Hr), ce), "setSiteConfig"), yb = /* @__PURE__ */ g((e) => {
  Ao = Nt({}, e);
}, "saveConfigFromInitialize"), xb = /* @__PURE__ */ g((e) => (ce = Nt(ce, e), ha(ce, Hr), ce), "updateSiteConfig"), kd = /* @__PURE__ */ g(() => Nt({}, ce), "getSiteConfig"), Sd = /* @__PURE__ */ g((e) => (_d(e), Nt(gs, e), $t()), "setConfig"), $t = /* @__PURE__ */ g(() => Nt({}, gs), "getConfig"), wd = /* @__PURE__ */ g((e) => {
  e && (["secure", ...ce.secure ?? []].forEach((t) => {
    Object.hasOwn(e, t) && (H.debug(`Denied attempt to modify a secure key ${t}`, e[t]), delete e[t]);
  }), Object.keys(e).forEach((t) => {
    t.startsWith("__") && delete e[t];
  }), Object.keys(e).forEach((t) => {
    typeof e[t] == "string" && (e[t].includes("<") || e[t].includes(">") || e[t].includes("url(data:")) && delete e[t], typeof e[t] == "object" && wd(e[t]);
  }));
}, "sanitize"), Cb = /* @__PURE__ */ g((e) => {
  var t;
  Lo(e), e.fontFamily && !((t = e.themeVariables) != null && t.fontFamily) && (e.themeVariables = {
    ...e.themeVariables,
    fontFamily: e.fontFamily
  }), Hr.push(e), ha(ce, Hr);
}, "addDirective"), Fo = /* @__PURE__ */ g((e = ce) => {
  Hr = [], ha(e, Hr);
}, "reset"), bb = {
  LAZY_LOAD_DEPRECATED: "The configuration options lazyLoadedDiagrams and loadExternalDiagramsAtStartup are deprecated. Please use registerExternalDiagrams instead.",
  FLOWCHART_HTML_LABELS_DEPRECATED: "flowchart.htmlLabels is deprecated. Please use global htmlLabels instead."
}, yc = {}, Td = /* @__PURE__ */ g((e) => {
  yc[e] || (H.warn(bb[e]), yc[e] = !0);
}, "issueWarning"), _d = /* @__PURE__ */ g((e) => {
  e && (e.lazyLoadedDiagrams || e.loadExternalDiagramsAtStartup) && Td("LAZY_LOAD_DEPRECATED");
}, "checkConfig"), mM = /* @__PURE__ */ g(() => {
  let e = {};
  Ao && (e = Nt(e, Ao));
  for (const t of Hr)
    e = Nt(e, t);
  return e;
}, "getUserDefinedConfig"), ne = /* @__PURE__ */ g((e) => {
  var t, r;
  return ((t = e.flowchart) == null ? void 0 : t.htmlLabels) != null && Td("FLOWCHART_HTML_LABELS_DEPRECATED"), Ve(e.htmlLabels ?? ((r = e.flowchart) == null ? void 0 : r.htmlLabels) ?? !0);
}, "getEffectiveHtmlLabels"), Bd = /^([^\S\n\r]*)-{3}\s*[\n\r](.*?)[\n\r]\1-{3}\s*[\n\r]+/s, ms = /%{2}{\s*(?:(\w+)\s*:|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, kb = /\s*%%.*\n/gm, Fi, vd = (Fi = class extends Error {
  constructor(t) {
    super(t), this.name = "UnknownDiagramError";
  }
}, g(Fi, "UnknownDiagramError"), Fi), Yr = {}, Ll = /* @__PURE__ */ g(function(e, t) {
  e = e.replace(Bd, "").replace(ms, "").replace(kb, `
`);
  for (const [r, { detector: i }] of Object.entries(Yr))
    if (i(e, t))
      return r;
  throw new vd(
    `No diagram type detected matching given configuration for text: ${e}`
  );
}, "detectType"), wn = /* @__PURE__ */ g((...e) => {
  for (const { id: t, detector: r, loader: i } of e)
    Ld(t, r, i);
}, "registerLazyLoadedDiagrams"), Ld = /* @__PURE__ */ g((e, t, r) => {
  Yr[e] && H.warn(`Detector with key ${e} already exists. Overwriting.`), Yr[e] = { detector: t, loader: r }, H.debug(`Detector with key ${e} added${r ? " with loader" : ""}`);
}, "addDetector"), Sb = /* @__PURE__ */ g((e) => Yr[e].loader, "getDiagramLoader"), Is = /<br\s*\/?>/gi, wb = /* @__PURE__ */ g((e) => e ? Ed(e).replace(/\\n/g, "#br#").split("#br#") : [""], "getRows"), Tb = /* @__PURE__ */ (() => {
  let e = !1;
  return () => {
    e || (Ad(), e = !0);
  };
})();
function Ad() {
  const e = "data-temp-href-target";
  Oi.addHook("beforeSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute("target") && t.setAttribute(e, t.getAttribute("target") ?? "");
  }), Oi.addHook("afterSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute(e) && (t.setAttribute("target", t.getAttribute(e) ?? ""), t.removeAttribute(e), t.getAttribute("target") === "_blank" && t.setAttribute("rel", "noopener"));
  });
}
g(Ad, "setupDompurifyHooks");
var Fd = /* @__PURE__ */ g((e) => (Tb(), Oi.sanitize(e)), "removeScript"), xc = /* @__PURE__ */ g((e, t) => {
  if (ne(t)) {
    const r = t.securityLevel;
    r === "antiscript" || r === "strict" || r === "sandbox" ? e = Fd(e) : r !== "loose" && (e = Ed(e), e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;"), e = e.replace(/=/g, "&equals;"), e = Lb(e));
  }
  return e;
}, "sanitizeMore"), $e = /* @__PURE__ */ g((e, t) => e && (t.dompurifyConfig ? e = Oi.sanitize(xc(e, t), t.dompurifyConfig).toString() : e = Oi.sanitize(xc(e, t), {
  FORBID_TAGS: ["style"]
}).toString(), e), "sanitizeText"), _b = /* @__PURE__ */ g((e, t) => typeof e == "string" ? $e(e, t) : e.flat().map((r) => $e(r, t)), "sanitizeTextOrArray"), Bb = /* @__PURE__ */ g((e) => Is.test(e), "hasBreaks"), vb = /* @__PURE__ */ g((e) => e.split(Is), "splitBreaks"), Lb = /* @__PURE__ */ g((e) => e.replace(/#br#/g, "<br/>"), "placeholderToBreak"), Ed = /* @__PURE__ */ g((e) => e.replace(Is, "#br#"), "breakToPlaceholder"), Ab = /* @__PURE__ */ g((e) => {
  let t = "";
  return e && (t = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, t = CSS.escape(t)), t;
}, "getUrl"), Fb = /* @__PURE__ */ g(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.max(...t);
}, "getMax"), Eb = /* @__PURE__ */ g(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.min(...t);
}, "getMin"), Cc = /* @__PURE__ */ g(function(e) {
  const t = e.split(/(,)/), r = [];
  for (let i = 0; i < t.length; i++) {
    let s = t[i];
    if (s === "," && i > 0 && i + 1 < t.length) {
      const o = t[i - 1], a = t[i + 1];
      Mb(o, a) && (s = o + "," + a, i++, r.pop());
    }
    r.push($b(s));
  }
  return r.join("");
}, "parseGenericTypes"), Tn = /* @__PURE__ */ g((e, t) => Math.max(0, e.split(t).length - 1), "countOccurrence"), Mb = /* @__PURE__ */ g((e, t) => {
  const r = Tn(e, "~"), i = Tn(t, "~");
  return r === 1 && i === 1;
}, "shouldCombineSets"), $b = /* @__PURE__ */ g((e) => {
  const t = Tn(e, "~");
  let r = !1;
  if (t <= 1)
    return e;
  t % 2 !== 0 && e.startsWith("~") && (e = e.substring(1), r = !0);
  const i = [...e];
  let s = i.indexOf("~"), o = i.lastIndexOf("~");
  for (; s !== -1 && o !== -1 && s !== o; )
    i[s] = "<", i[o] = ">", s = i.indexOf("~"), o = i.lastIndexOf("~");
  return r && i.unshift("~"), i.join("");
}, "processSet"), bc = /* @__PURE__ */ g(() => window.MathMLElement !== void 0, "isMathMLSupported"), _n = /\$\$(.*?)\$\$/g, ks = /* @__PURE__ */ g((e) => {
  var t;
  return (((t = e.match(_n)) == null ? void 0 : t.length) ?? 0) > 0;
}, "hasKatex"), yM = /* @__PURE__ */ g(async (e, t) => {
  const r = document.createElement("div");
  r.innerHTML = await Md(e, t), r.id = "katex-temp", r.style.visibility = "hidden", r.style.position = "absolute", r.style.top = "0";
  const i = document.querySelector("body");
  i == null || i.insertAdjacentElement("beforeend", r);
  const s = { width: r.clientWidth, height: r.clientHeight };
  return r.remove(), s;
}, "calculateMathMLDimensions"), Ob = /* @__PURE__ */ g(async (e, t) => {
  if (!ks(e))
    return e;
  if (!(bc() || t.legacyMathML || t.forceLegacyMathML))
    return e.replace(_n, "MathML is unsupported in this environment.");
  {
    const { default: r } = await import("./katex-B6_r1m5T.js"), i = t.forceLegacyMathML || !bc() && t.legacyMathML ? "htmlAndMathml" : "mathml";
    return e.split(Is).map(
      (s) => ks(s) ? `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">${s}</div>` : `<div>${s}</div>`
    ).join("").replace(
      _n,
      (s, o) => r.renderToString(o, {
        throwOnError: !0,
        displayMode: !0,
        output: i
      }).replace(/\n/g, " ").replace(/<annotation.*<\/annotation>/g, "")
    );
  }
}, "renderKatexUnsanitized"), Md = /* @__PURE__ */ g(async (e, t) => $e(await Ob(e, t), t), "renderKatexSanitized"), Ds = {
  getRows: wb,
  sanitizeText: $e,
  sanitizeTextOrArray: _b,
  hasBreaks: Bb,
  splitBreaks: vb,
  lineBreakRegex: Is,
  removeScript: Fd,
  getUrl: Ab,
  evaluate: Ve,
  getMax: Fb,
  getMin: Eb
}, Ib = /* @__PURE__ */ g(function(e, t) {
  for (let r of t)
    e.attr(r[0], r[1]);
}, "d3Attrs"), Db = /* @__PURE__ */ g(function(e, t, r) {
  let i = /* @__PURE__ */ new Map();
  return r ? (i.set("width", "100%"), i.set("style", `max-width: ${t}px;`)) : (i.set("height", e), i.set("width", t)), i;
}, "calculateSvgSizeAttrs"), $d = /* @__PURE__ */ g(function(e, t, r, i) {
  const s = Db(t, r, i);
  Ib(e, s);
}, "configureSvgSize"), Rb = /* @__PURE__ */ g(function(e, t, r, i) {
  const s = t.node().getBBox(), o = s.width, a = s.height;
  H.info(`SVG bounds: ${o}x${a}`, s);
  let n = 0, l = 0;
  H.info(`Graph bounds: ${n}x${l}`, e), n = o + r * 2, l = a + r * 2, H.info(`Calculated bounds: ${n}x${l}`), $d(t, l, n, i);
  const h = `${s.x - r} ${s.y - r} ${s.width + 2 * r} ${s.height + 2 * r}`;
  t.attr("viewBox", h);
}, "setupGraphViewbox"), go = {};
function Bn(e) {
  return [...e.cssRules].map((t) => t.cssText).join(`
`);
}
g(Bn, "cssStyleSheetToString");
var Pb = /* @__PURE__ */ g((e, t, r, i) => {
  let s = "";
  return e in go && go[e] ? s = go[e]({ ...r, svgId: i }) : H.warn(`No theme found for ${e}`), ` & {
    font-family: ${r.fontFamily};
    font-size: ${r.fontSize};
    fill: ${r.textColor}
  }
  @keyframes edge-animation-frame {
    from {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  & .edge-animation-slow {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 50s linear infinite;
    stroke-linecap: round;
  }
  & .edge-animation-fast {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 20s linear infinite;
    stroke-linecap: round;
  }
  /* Classes common for multiple diagrams */

  & .error-icon {
    fill: ${r.errorBkgColor};
  }
  & .error-text {
    fill: ${r.errorTextColor};
    stroke: ${r.errorTextColor};
  }

  & .edge-thickness-normal {
    stroke-width: ${r.strokeWidth ?? 1}px;
  }
  & .edge-thickness-thick {
    stroke-width: 3.5px
  }
  & .edge-pattern-solid {
    stroke-dasharray: 0;
  }
  & .edge-thickness-invisible {
    stroke-width: 0;
    fill: none;
  }
  & .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  & .marker {
    fill: ${r.lineColor};
    stroke: ${r.lineColor};
  }
  & .marker.cross {
    stroke: ${r.lineColor};
  }

  & svg {
    font-family: ${r.fontFamily};
    font-size: ${r.fontSize};
  }
   & p {
    margin: 0
   }

  ${s}
  .node .neo-node {
    stroke: ${r.nodeBorder};
  }

  [data-look="neo"].node rect, [data-look="neo"].cluster rect, [data-look="neo"].node polygon {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }
  [data-look="neo"].swimlane.cluster rect {
    filter: none;
  }


  [data-look="neo"].node path {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    stroke-width: ${r.strokeWidth ?? 1}px;
  }

  [data-look="neo"].node .outer-path {
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node .neo-line path {
    stroke: ${r.nodeBorder};
    filter: none;
  }

  [data-look="neo"].node circle{
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node circle .state-start{
    fill: #000000;
  }

  [data-look="neo"].icon-shape .icon {
    fill: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

    [data-look="neo"].icon-shape .icon-neo path {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  ${t}
`;
}, "getStyles"), Nb = /* @__PURE__ */ g((e, t) => {
  t !== void 0 && (go[e] = t);
}, "addStylesForDiagram"), qb = Pb, Od = {};
iC(Od, {
  clear: () => Wb,
  getAccDescription: () => Ub,
  getAccTitle: () => Hb,
  getDiagramTitle: () => Gb,
  setAccDescription: () => Yb,
  setAccTitle: () => zb,
  setDiagramTitle: () => Xb
});
var Al = "", Fl = "", El = "", Ml = /* @__PURE__ */ g((e) => $e(e, $t()), "sanitizeText"), Wb = /* @__PURE__ */ g(() => {
  Al = "", El = "", Fl = "";
}, "clear"), zb = /* @__PURE__ */ g((e) => {
  Al = Ml(e).replace(/^\s+/g, "");
}, "setAccTitle"), Hb = /* @__PURE__ */ g(() => Al, "getAccTitle"), Yb = /* @__PURE__ */ g((e) => {
  El = Ml(e).replace(/\n\s+/g, `
`);
}, "setAccDescription"), Ub = /* @__PURE__ */ g(() => El, "getAccDescription"), Xb = /* @__PURE__ */ g((e) => {
  Fl = Ml(e);
}, "setDiagramTitle"), Gb = /* @__PURE__ */ g(() => Fl, "getDiagramTitle"), kc = H, jb = vl, _t = $t, xM = Sd, CM = Ii, $l = /* @__PURE__ */ g((e) => $e(e, _t()), "sanitizeText"), Vb = Rb, Zb = /* @__PURE__ */ g(() => Od, "getCommonDb"), Eo = {}, Mo = /* @__PURE__ */ g((e, t, r) => {
  var i;
  Eo[e] && kc.warn(`Diagram with id ${e} already registered. Overwriting.`), Eo[e] = t, r && Ld(e, r), Nb(e, t.styles), (i = t.injectUtils) == null || i.call(
    t,
    kc,
    jb,
    _t,
    $l,
    Vb,
    Zb(),
    () => {
    }
  );
}, "registerDiagram"), vn = /* @__PURE__ */ g((e) => {
  if (e in Eo)
    return Eo[e];
  throw new Kb(e);
}, "getDiagram"), Ei, Kb = (Ei = class extends Error {
  constructor(t) {
    super(`Diagram ${t} not found.`);
  }
}, g(Ei, "DiagramNotFoundError"), Ei), Qb = { value: () => {
} };
function Id() {
  for (var e = 0, t = arguments.length, r = {}, i; e < t; ++e) {
    if (!(i = arguments[e] + "") || i in r || /[\s.]/.test(i)) throw new Error("illegal type: " + i);
    r[i] = [];
  }
  return new mo(r);
}
function mo(e) {
  this._ = e;
}
function Jb(e, t) {
  return e.trim().split(/^|\s+/).map(function(r) {
    var i = "", s = r.indexOf(".");
    if (s >= 0 && (i = r.slice(s + 1), r = r.slice(0, s)), r && !t.hasOwnProperty(r)) throw new Error("unknown type: " + r);
    return { type: r, name: i };
  });
}
mo.prototype = Id.prototype = {
  constructor: mo,
  on: function(e, t) {
    var r = this._, i = Jb(e + "", r), s, o = -1, a = i.length;
    if (arguments.length < 2) {
      for (; ++o < a; ) if ((s = (e = i[o]).type) && (s = tk(r[s], e.name))) return s;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++o < a; )
      if (s = (e = i[o]).type) r[s] = Sc(r[s], e.name, t);
      else if (t == null) for (s in r) r[s] = Sc(r[s], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var r in t) e[r] = t[r].slice();
    return new mo(e);
  },
  call: function(e, t) {
    if ((s = arguments.length - 2) > 0) for (var r = new Array(s), i = 0, s, o; i < s; ++i) r[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (o = this._[e], i = 0, s = o.length; i < s; ++i) o[i].value.apply(t, r);
  },
  apply: function(e, t, r) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var i = this._[e], s = 0, o = i.length; s < o; ++s) i[s].value.apply(t, r);
  }
};
function tk(e, t) {
  for (var r = 0, i = e.length, s; r < i; ++r)
    if ((s = e[r]).name === t)
      return s.value;
}
function Sc(e, t, r) {
  for (var i = 0, s = e.length; i < s; ++i)
    if (e[i].name === t) {
      e[i] = Qb, e = e.slice(0, i).concat(e.slice(i + 1));
      break;
    }
  return r != null && e.push({ name: t, value: r }), e;
}
var Ln = "http://www.w3.org/1999/xhtml";
const wc = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ln,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function ca(e) {
  var t = e += "", r = t.indexOf(":");
  return r >= 0 && (t = e.slice(0, r)) !== "xmlns" && (e = e.slice(r + 1)), wc.hasOwnProperty(t) ? { space: wc[t], local: e } : e;
}
function ek(e) {
  return function() {
    var t = this.ownerDocument, r = this.namespaceURI;
    return r === Ln && t.documentElement.namespaceURI === Ln ? t.createElement(e) : t.createElementNS(r, e);
  };
}
function rk(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Dd(e) {
  var t = ca(e);
  return (t.local ? rk : ek)(t);
}
function ik() {
}
function Ol(e) {
  return e == null ? ik : function() {
    return this.querySelector(e);
  };
}
function sk(e) {
  typeof e != "function" && (e = Ol(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = new Array(a), l, h, c = 0; c < a; ++c)
      (l = o[c]) && (h = e.call(l, l.__data__, c, o)) && ("__data__" in l && (h.__data__ = l.__data__), n[c] = h);
  return new ye(i, this._parents);
}
function ok(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function ak() {
  return [];
}
function Rd(e) {
  return e == null ? ak : function() {
    return this.querySelectorAll(e);
  };
}
function nk(e) {
  return function() {
    return ok(e.apply(this, arguments));
  };
}
function lk(e) {
  typeof e == "function" ? e = nk(e) : e = Rd(e);
  for (var t = this._groups, r = t.length, i = [], s = [], o = 0; o < r; ++o)
    for (var a = t[o], n = a.length, l, h = 0; h < n; ++h)
      (l = a[h]) && (i.push(e.call(l, l.__data__, h, a)), s.push(l));
  return new ye(i, s);
}
function Pd(e) {
  return function() {
    return this.matches(e);
  };
}
function Nd(e) {
  return function(t) {
    return t.matches(e);
  };
}
var hk = Array.prototype.find;
function ck(e) {
  return function() {
    return hk.call(this.children, e);
  };
}
function uk() {
  return this.firstElementChild;
}
function dk(e) {
  return this.select(e == null ? uk : ck(typeof e == "function" ? e : Nd(e)));
}
var fk = Array.prototype.filter;
function pk() {
  return Array.from(this.children);
}
function gk(e) {
  return function() {
    return fk.call(this.children, e);
  };
}
function mk(e) {
  return this.selectAll(e == null ? pk : gk(typeof e == "function" ? e : Nd(e)));
}
function yk(e) {
  typeof e != "function" && (e = Pd(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = [], l, h = 0; h < a; ++h)
      (l = o[h]) && e.call(l, l.__data__, h, o) && n.push(l);
  return new ye(i, this._parents);
}
function qd(e) {
  return new Array(e.length);
}
function xk() {
  return new ye(this._enter || this._groups.map(qd), this._parents);
}
function $o(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
$o.prototype = {
  constructor: $o,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Ck(e) {
  return function() {
    return e;
  };
}
function bk(e, t, r, i, s, o) {
  for (var a = 0, n, l = t.length, h = o.length; a < h; ++a)
    (n = t[a]) ? (n.__data__ = o[a], i[a] = n) : r[a] = new $o(e, o[a]);
  for (; a < l; ++a)
    (n = t[a]) && (s[a] = n);
}
function kk(e, t, r, i, s, o, a) {
  var n, l, h = /* @__PURE__ */ new Map(), c = t.length, u = o.length, f = new Array(c), d;
  for (n = 0; n < c; ++n)
    (l = t[n]) && (f[n] = d = a.call(l, l.__data__, n, t) + "", h.has(d) ? s[n] = l : h.set(d, l));
  for (n = 0; n < u; ++n)
    d = a.call(e, o[n], n, o) + "", (l = h.get(d)) ? (i[n] = l, l.__data__ = o[n], h.delete(d)) : r[n] = new $o(e, o[n]);
  for (n = 0; n < c; ++n)
    (l = t[n]) && h.get(f[n]) === l && (s[n] = l);
}
function Sk(e) {
  return e.__data__;
}
function wk(e, t) {
  if (!arguments.length) return Array.from(this, Sk);
  var r = t ? kk : bk, i = this._parents, s = this._groups;
  typeof e != "function" && (e = Ck(e));
  for (var o = s.length, a = new Array(o), n = new Array(o), l = new Array(o), h = 0; h < o; ++h) {
    var c = i[h], u = s[h], f = u.length, d = Tk(e.call(c, c && c.__data__, h, i)), p = d.length, m = n[h] = new Array(p), y = a[h] = new Array(p), x = l[h] = new Array(f);
    r(c, u, m, y, x, d, t);
    for (var C = 0, k = 0, w, T; C < p; ++C)
      if (w = m[C]) {
        for (C >= k && (k = C + 1); !(T = y[k]) && ++k < p; ) ;
        w._next = T || null;
      }
  }
  return a = new ye(a, i), a._enter = n, a._exit = l, a;
}
function Tk(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function _k() {
  return new ye(this._exit || this._groups.map(qd), this._parents);
}
function Bk(e, t, r) {
  var i = this.enter(), s = this, o = this.exit();
  return typeof e == "function" ? (i = e(i), i && (i = i.selection())) : i = i.append(e + ""), t != null && (s = t(s), s && (s = s.selection())), r == null ? o.remove() : r(o), i && s ? i.merge(s).order() : s;
}
function vk(e) {
  for (var t = e.selection ? e.selection() : e, r = this._groups, i = t._groups, s = r.length, o = i.length, a = Math.min(s, o), n = new Array(s), l = 0; l < a; ++l)
    for (var h = r[l], c = i[l], u = h.length, f = n[l] = new Array(u), d, p = 0; p < u; ++p)
      (d = h[p] || c[p]) && (f[p] = d);
  for (; l < s; ++l)
    n[l] = r[l];
  return new ye(n, this._parents);
}
function Lk() {
  for (var e = this._groups, t = -1, r = e.length; ++t < r; )
    for (var i = e[t], s = i.length - 1, o = i[s], a; --s >= 0; )
      (a = i[s]) && (o && a.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(a, o), o = a);
  return this;
}
function Ak(e) {
  e || (e = Fk);
  function t(u, f) {
    return u && f ? e(u.__data__, f.__data__) : !u - !f;
  }
  for (var r = this._groups, i = r.length, s = new Array(i), o = 0; o < i; ++o) {
    for (var a = r[o], n = a.length, l = s[o] = new Array(n), h, c = 0; c < n; ++c)
      (h = a[c]) && (l[c] = h);
    l.sort(t);
  }
  return new ye(s, this._parents).order();
}
function Fk(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Ek() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Mk() {
  return Array.from(this);
}
function $k() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length; s < o; ++s) {
      var a = i[s];
      if (a) return a;
    }
  return null;
}
function Ok() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Ik() {
  return !this.node();
}
function Dk(e) {
  for (var t = this._groups, r = 0, i = t.length; r < i; ++r)
    for (var s = t[r], o = 0, a = s.length, n; o < a; ++o)
      (n = s[o]) && e.call(n, n.__data__, o, s);
  return this;
}
function Rk(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Pk(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Nk(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function qk(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Wk(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttribute(e) : this.setAttribute(e, r);
  };
}
function zk(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, r);
  };
}
function Hk(e, t) {
  var r = ca(e);
  if (arguments.length < 2) {
    var i = this.node();
    return r.local ? i.getAttributeNS(r.space, r.local) : i.getAttribute(r);
  }
  return this.each((t == null ? r.local ? Pk : Rk : typeof t == "function" ? r.local ? zk : Wk : r.local ? qk : Nk)(r, t));
}
function Wd(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Yk(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Uk(e, t, r) {
  return function() {
    this.style.setProperty(e, t, r);
  };
}
function Xk(e, t, r) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.style.removeProperty(e) : this.style.setProperty(e, i, r);
  };
}
function Gk(e, t, r) {
  return arguments.length > 1 ? this.each((t == null ? Yk : typeof t == "function" ? Xk : Uk)(e, t, r ?? "")) : Di(this.node(), e);
}
function Di(e, t) {
  return e.style.getPropertyValue(t) || Wd(e).getComputedStyle(e, null).getPropertyValue(t);
}
function jk(e) {
  return function() {
    delete this[e];
  };
}
function Vk(e, t) {
  return function() {
    this[e] = t;
  };
}
function Zk(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? delete this[e] : this[e] = r;
  };
}
function Kk(e, t) {
  return arguments.length > 1 ? this.each((t == null ? jk : typeof t == "function" ? Zk : Vk)(e, t)) : this.node()[e];
}
function zd(e) {
  return e.trim().split(/^|\s+/);
}
function Il(e) {
  return e.classList || new Hd(e);
}
function Hd(e) {
  this._node = e, this._names = zd(e.getAttribute("class") || "");
}
Hd.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Yd(e, t) {
  for (var r = Il(e), i = -1, s = t.length; ++i < s; ) r.add(t[i]);
}
function Ud(e, t) {
  for (var r = Il(e), i = -1, s = t.length; ++i < s; ) r.remove(t[i]);
}
function Qk(e) {
  return function() {
    Yd(this, e);
  };
}
function Jk(e) {
  return function() {
    Ud(this, e);
  };
}
function t1(e, t) {
  return function() {
    (t.apply(this, arguments) ? Yd : Ud)(this, e);
  };
}
function e1(e, t) {
  var r = zd(e + "");
  if (arguments.length < 2) {
    for (var i = Il(this.node()), s = -1, o = r.length; ++s < o; ) if (!i.contains(r[s])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? t1 : t ? Qk : Jk)(r, t));
}
function r1() {
  this.textContent = "";
}
function i1(e) {
  return function() {
    this.textContent = e;
  };
}
function s1(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function o1(e) {
  return arguments.length ? this.each(e == null ? r1 : (typeof e == "function" ? s1 : i1)(e)) : this.node().textContent;
}
function a1() {
  this.innerHTML = "";
}
function n1(e) {
  return function() {
    this.innerHTML = e;
  };
}
function l1(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function h1(e) {
  return arguments.length ? this.each(e == null ? a1 : (typeof e == "function" ? l1 : n1)(e)) : this.node().innerHTML;
}
function c1() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function u1() {
  return this.each(c1);
}
function d1() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function f1() {
  return this.each(d1);
}
function p1(e) {
  var t = typeof e == "function" ? e : Dd(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function g1() {
  return null;
}
function m1(e, t) {
  var r = typeof e == "function" ? e : Dd(e), i = t == null ? g1 : typeof t == "function" ? t : Ol(t);
  return this.select(function() {
    return this.insertBefore(r.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function y1() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function x1() {
  return this.each(y1);
}
function C1() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function b1() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function k1(e) {
  return this.select(e ? b1 : C1);
}
function S1(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function w1(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function T1(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var r = "", i = t.indexOf(".");
    return i >= 0 && (r = t.slice(i + 1), t = t.slice(0, i)), { type: t, name: r };
  });
}
function _1(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var r = 0, i = -1, s = t.length, o; r < s; ++r)
        o = t[r], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++i] = o;
      ++i ? t.length = i : delete this.__on;
    }
  };
}
function B1(e, t, r) {
  return function() {
    var i = this.__on, s, o = w1(t);
    if (i) {
      for (var a = 0, n = i.length; a < n; ++a)
        if ((s = i[a]).type === e.type && s.name === e.name) {
          this.removeEventListener(s.type, s.listener, s.options), this.addEventListener(s.type, s.listener = o, s.options = r), s.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, r), s = { type: e.type, name: e.name, value: t, listener: o, options: r }, i ? i.push(s) : this.__on = [s];
  };
}
function v1(e, t, r) {
  var i = T1(e + ""), s, o = i.length, a;
  if (arguments.length < 2) {
    var n = this.node().__on;
    if (n) {
      for (var l = 0, h = n.length, c; l < h; ++l)
        for (s = 0, c = n[l]; s < o; ++s)
          if ((a = i[s]).type === c.type && a.name === c.name)
            return c.value;
    }
    return;
  }
  for (n = t ? B1 : _1, s = 0; s < o; ++s) this.each(n(i[s], t, r));
  return this;
}
function Xd(e, t, r) {
  var i = Wd(e), s = i.CustomEvent;
  typeof s == "function" ? s = new s(t, r) : (s = i.document.createEvent("Event"), r ? (s.initEvent(t, r.bubbles, r.cancelable), s.detail = r.detail) : s.initEvent(t, !1, !1)), e.dispatchEvent(s);
}
function L1(e, t) {
  return function() {
    return Xd(this, e, t);
  };
}
function A1(e, t) {
  return function() {
    return Xd(this, e, t.apply(this, arguments));
  };
}
function F1(e, t) {
  return this.each((typeof t == "function" ? A1 : L1)(e, t));
}
function* E1() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length, a; s < o; ++s)
      (a = i[s]) && (yield a);
}
var Gd = [null];
function ye(e, t) {
  this._groups = e, this._parents = t;
}
function Rs() {
  return new ye([[document.documentElement]], Gd);
}
function M1() {
  return this;
}
ye.prototype = Rs.prototype = {
  constructor: ye,
  select: sk,
  selectAll: lk,
  selectChild: dk,
  selectChildren: mk,
  filter: yk,
  data: wk,
  enter: xk,
  exit: _k,
  join: Bk,
  merge: vk,
  selection: M1,
  order: Lk,
  sort: Ak,
  call: Ek,
  nodes: Mk,
  node: $k,
  size: Ok,
  empty: Ik,
  each: Dk,
  attr: Hk,
  style: Gk,
  property: Kk,
  classed: e1,
  text: o1,
  html: h1,
  raise: u1,
  lower: f1,
  append: p1,
  insert: m1,
  remove: x1,
  clone: k1,
  datum: S1,
  on: v1,
  dispatch: F1,
  [Symbol.iterator]: E1
};
function bt(e) {
  return typeof e == "string" ? new ye([[document.querySelector(e)]], [document.documentElement]) : new ye([[e]], Gd);
}
function Dl(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function jd(e, t) {
  var r = Object.create(e.prototype);
  for (var i in t) r[i] = t[i];
  return r;
}
function Ps() {
}
var Ss = 0.7, Oo = 1 / Ss, yi = "\\s*([+-]?\\d+)\\s*", ws = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ye = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", $1 = /^#([0-9a-f]{3,8})$/, O1 = new RegExp(`^rgb\\(${yi},${yi},${yi}\\)$`), I1 = new RegExp(`^rgb\\(${Ye},${Ye},${Ye}\\)$`), D1 = new RegExp(`^rgba\\(${yi},${yi},${yi},${ws}\\)$`), R1 = new RegExp(`^rgba\\(${Ye},${Ye},${Ye},${ws}\\)$`), P1 = new RegExp(`^hsl\\(${ws},${Ye},${Ye}\\)$`), N1 = new RegExp(`^hsla\\(${ws},${Ye},${Ye},${ws}\\)$`), Tc = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Dl(Ps, Ts, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: _c,
  // Deprecated! Use color.formatHex.
  formatHex: _c,
  formatHex8: q1,
  formatHsl: W1,
  formatRgb: Bc,
  toString: Bc
});
function _c() {
  return this.rgb().formatHex();
}
function q1() {
  return this.rgb().formatHex8();
}
function W1() {
  return Vd(this).formatHsl();
}
function Bc() {
  return this.rgb().formatRgb();
}
function Ts(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = $1.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? vc(t) : r === 3 ? new de(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? eo(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? eo(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = O1.exec(e)) ? new de(t[1], t[2], t[3], 1) : (t = I1.exec(e)) ? new de(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = D1.exec(e)) ? eo(t[1], t[2], t[3], t[4]) : (t = R1.exec(e)) ? eo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = P1.exec(e)) ? Fc(t[1], t[2] / 100, t[3] / 100, 1) : (t = N1.exec(e)) ? Fc(t[1], t[2] / 100, t[3] / 100, t[4]) : Tc.hasOwnProperty(e) ? vc(Tc[e]) : e === "transparent" ? new de(NaN, NaN, NaN, 0) : null;
}
function vc(e) {
  return new de(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function eo(e, t, r, i) {
  return i <= 0 && (e = t = r = NaN), new de(e, t, r, i);
}
function z1(e) {
  return e instanceof Ps || (e = Ts(e)), e ? (e = e.rgb(), new de(e.r, e.g, e.b, e.opacity)) : new de();
}
function An(e, t, r, i) {
  return arguments.length === 1 ? z1(e) : new de(e, t, r, i ?? 1);
}
function de(e, t, r, i) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +i;
}
Dl(de, An, jd(Ps, {
  brighter(e) {
    return e = e == null ? Oo : Math.pow(Oo, e), new de(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Ss : Math.pow(Ss, e), new de(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new de(Wr(this.r), Wr(this.g), Wr(this.b), Io(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Lc,
  // Deprecated! Use color.formatHex.
  formatHex: Lc,
  formatHex8: H1,
  formatRgb: Ac,
  toString: Ac
}));
function Lc() {
  return `#${Ir(this.r)}${Ir(this.g)}${Ir(this.b)}`;
}
function H1() {
  return `#${Ir(this.r)}${Ir(this.g)}${Ir(this.b)}${Ir((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Ac() {
  const e = Io(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Wr(this.r)}, ${Wr(this.g)}, ${Wr(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Io(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Wr(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ir(e) {
  return e = Wr(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Fc(e, t, r, i) {
  return i <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ae(e, t, r, i);
}
function Vd(e) {
  if (e instanceof Ae) return new Ae(e.h, e.s, e.l, e.opacity);
  if (e instanceof Ps || (e = Ts(e)), !e) return new Ae();
  if (e instanceof Ae) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, i = e.b / 255, s = Math.min(t, r, i), o = Math.max(t, r, i), a = NaN, n = o - s, l = (o + s) / 2;
  return n ? (t === o ? a = (r - i) / n + (r < i) * 6 : r === o ? a = (i - t) / n + 2 : a = (t - r) / n + 4, n /= l < 0.5 ? o + s : 2 - o - s, a *= 60) : n = l > 0 && l < 1 ? 0 : a, new Ae(a, n, l, e.opacity);
}
function Y1(e, t, r, i) {
  return arguments.length === 1 ? Vd(e) : new Ae(e, t, r, i ?? 1);
}
function Ae(e, t, r, i) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +i;
}
Dl(Ae, Y1, jd(Ps, {
  brighter(e) {
    return e = e == null ? Oo : Math.pow(Oo, e), new Ae(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Ss : Math.pow(Ss, e), new Ae(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, i = r + (r < 0.5 ? r : 1 - r) * t, s = 2 * r - i;
    return new de(
      Qa(e >= 240 ? e - 240 : e + 120, s, i),
      Qa(e, s, i),
      Qa(e < 120 ? e + 240 : e - 120, s, i),
      this.opacity
    );
  },
  clamp() {
    return new Ae(Ec(this.h), ro(this.s), ro(this.l), Io(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Io(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Ec(this.h)}, ${ro(this.s) * 100}%, ${ro(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Ec(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function ro(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Qa(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const Rl = (e) => () => e;
function Zd(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function U1(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(i) {
    return Math.pow(e + i * t, r);
  };
}
function bM(e, t) {
  var r = t - e;
  return r ? Zd(e, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : Rl(isNaN(e) ? t : e);
}
function X1(e) {
  return (e = +e) == 1 ? Kd : function(t, r) {
    return r - t ? U1(t, r, e) : Rl(isNaN(t) ? r : t);
  };
}
function Kd(e, t) {
  var r = t - e;
  return r ? Zd(e, r) : Rl(isNaN(e) ? t : e);
}
const Mc = function e(t) {
  var r = X1(t);
  function i(s, o) {
    var a = r((s = An(s)).r, (o = An(o)).r), n = r(s.g, o.g), l = r(s.b, o.b), h = Kd(s.opacity, o.opacity);
    return function(c) {
      return s.r = a(c), s.g = n(c), s.b = l(c), s.opacity = h(c), s + "";
    };
  }
  return i.gamma = e, i;
}(1);
function pr(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
var Fn = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Ja = new RegExp(Fn.source, "g");
function G1(e) {
  return function() {
    return e;
  };
}
function j1(e) {
  return function(t) {
    return e(t) + "";
  };
}
function V1(e, t) {
  var r = Fn.lastIndex = Ja.lastIndex = 0, i, s, o, a = -1, n = [], l = [];
  for (e = e + "", t = t + ""; (i = Fn.exec(e)) && (s = Ja.exec(t)); )
    (o = s.index) > r && (o = t.slice(r, o), n[a] ? n[a] += o : n[++a] = o), (i = i[0]) === (s = s[0]) ? n[a] ? n[a] += s : n[++a] = s : (n[++a] = null, l.push({ i: a, x: pr(i, s) })), r = Ja.lastIndex;
  return r < t.length && (o = t.slice(r), n[a] ? n[a] += o : n[++a] = o), n.length < 2 ? l[0] ? j1(l[0].x) : G1(t) : (t = l.length, function(h) {
    for (var c = 0, u; c < t; ++c) n[(u = l[c]).i] = u.x(h);
    return n.join("");
  });
}
var $c = 180 / Math.PI, En = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Qd(e, t, r, i, s, o) {
  var a, n, l;
  return (a = Math.sqrt(e * e + t * t)) && (e /= a, t /= a), (l = e * r + t * i) && (r -= e * l, i -= t * l), (n = Math.sqrt(r * r + i * i)) && (r /= n, i /= n, l /= n), e * i < t * r && (e = -e, t = -t, l = -l, a = -a), {
    translateX: s,
    translateY: o,
    rotate: Math.atan2(t, e) * $c,
    skewX: Math.atan(l) * $c,
    scaleX: a,
    scaleY: n
  };
}
var io;
function Z1(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? En : Qd(t.a, t.b, t.c, t.d, t.e, t.f);
}
function K1(e) {
  return e == null || (io || (io = document.createElementNS("http://www.w3.org/2000/svg", "g")), io.setAttribute("transform", e), !(e = io.transform.baseVal.consolidate())) ? En : (e = e.matrix, Qd(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Jd(e, t, r, i) {
  function s(h) {
    return h.length ? h.pop() + " " : "";
  }
  function o(h, c, u, f, d, p) {
    if (h !== u || c !== f) {
      var m = d.push("translate(", null, t, null, r);
      p.push({ i: m - 4, x: pr(h, u) }, { i: m - 2, x: pr(c, f) });
    } else (u || f) && d.push("translate(" + u + t + f + r);
  }
  function a(h, c, u, f) {
    h !== c ? (h - c > 180 ? c += 360 : c - h > 180 && (h += 360), f.push({ i: u.push(s(u) + "rotate(", null, i) - 2, x: pr(h, c) })) : c && u.push(s(u) + "rotate(" + c + i);
  }
  function n(h, c, u, f) {
    h !== c ? f.push({ i: u.push(s(u) + "skewX(", null, i) - 2, x: pr(h, c) }) : c && u.push(s(u) + "skewX(" + c + i);
  }
  function l(h, c, u, f, d, p) {
    if (h !== u || c !== f) {
      var m = d.push(s(d) + "scale(", null, ",", null, ")");
      p.push({ i: m - 4, x: pr(h, u) }, { i: m - 2, x: pr(c, f) });
    } else (u !== 1 || f !== 1) && d.push(s(d) + "scale(" + u + "," + f + ")");
  }
  return function(h, c) {
    var u = [], f = [];
    return h = e(h), c = e(c), o(h.translateX, h.translateY, c.translateX, c.translateY, u, f), a(h.rotate, c.rotate, u, f), n(h.skewX, c.skewX, u, f), l(h.scaleX, h.scaleY, c.scaleX, c.scaleY, u, f), h = c = null, function(d) {
      for (var p = -1, m = f.length, y; ++p < m; ) u[(y = f[p]).i] = y.x(d);
      return u.join("");
    };
  };
}
var Q1 = Jd(Z1, "px, ", "px)", "deg)"), J1 = Jd(K1, ", ", ")", ")"), Ri = 0, as = 0, Zi = 0, tf = 1e3, Do, ns, Ro = 0, Ur = 0, ua = 0, _s = typeof performance == "object" && performance.now ? performance : Date, ef = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Pl() {
  return Ur || (ef(t2), Ur = _s.now() + ua);
}
function t2() {
  Ur = 0;
}
function Po() {
  this._call = this._time = this._next = null;
}
Po.prototype = rf.prototype = {
  constructor: Po,
  restart: function(e, t, r) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    r = (r == null ? Pl() : +r) + (t == null ? 0 : +t), !this._next && ns !== this && (ns ? ns._next = this : Do = this, ns = this), this._call = e, this._time = r, Mn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Mn());
  }
};
function rf(e, t, r) {
  var i = new Po();
  return i.restart(e, t, r), i;
}
function e2() {
  Pl(), ++Ri;
  for (var e = Do, t; e; )
    (t = Ur - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Ri;
}
function Oc() {
  Ur = (Ro = _s.now()) + ua, Ri = as = 0;
  try {
    e2();
  } finally {
    Ri = 0, i2(), Ur = 0;
  }
}
function r2() {
  var e = _s.now(), t = e - Ro;
  t > tf && (ua -= t, Ro = e);
}
function i2() {
  for (var e, t = Do, r, i = 1 / 0; t; )
    t._call ? (i > t._time && (i = t._time), e = t, t = t._next) : (r = t._next, t._next = null, t = e ? e._next = r : Do = r);
  ns = e, Mn(i);
}
function Mn(e) {
  if (!Ri) {
    as && (as = clearTimeout(as));
    var t = e - Ur;
    t > 24 ? (e < 1 / 0 && (as = setTimeout(Oc, e - _s.now() - ua)), Zi && (Zi = clearInterval(Zi))) : (Zi || (Ro = _s.now(), Zi = setInterval(r2, tf)), Ri = 1, ef(Oc));
  }
}
function Ic(e, t, r) {
  var i = new Po();
  return t = t == null ? 0 : +t, i.restart((s) => {
    i.stop(), e(s + t);
  }, t, r), i;
}
var s2 = Id("start", "end", "cancel", "interrupt"), o2 = [], sf = 0, Dc = 1, $n = 2, yo = 3, Rc = 4, On = 5, xo = 6;
function da(e, t, r, i, s, o) {
  var a = e.__transition;
  if (!a) e.__transition = {};
  else if (r in a) return;
  a2(e, r, {
    name: t,
    index: i,
    // For context during callback.
    group: s,
    // For context during callback.
    on: s2,
    tween: o2,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: sf
  });
}
function Nl(e, t) {
  var r = Ie(e, t);
  if (r.state > sf) throw new Error("too late; already scheduled");
  return r;
}
function Ze(e, t) {
  var r = Ie(e, t);
  if (r.state > yo) throw new Error("too late; already running");
  return r;
}
function Ie(e, t) {
  var r = e.__transition;
  if (!r || !(r = r[t])) throw new Error("transition not found");
  return r;
}
function a2(e, t, r) {
  var i = e.__transition, s;
  i[t] = r, r.timer = rf(o, 0, r.time);
  function o(h) {
    r.state = Dc, r.timer.restart(a, r.delay, r.time), r.delay <= h && a(h - r.delay);
  }
  function a(h) {
    var c, u, f, d;
    if (r.state !== Dc) return l();
    for (c in i)
      if (d = i[c], d.name === r.name) {
        if (d.state === yo) return Ic(a);
        d.state === Rc ? (d.state = xo, d.timer.stop(), d.on.call("interrupt", e, e.__data__, d.index, d.group), delete i[c]) : +c < t && (d.state = xo, d.timer.stop(), d.on.call("cancel", e, e.__data__, d.index, d.group), delete i[c]);
      }
    if (Ic(function() {
      r.state === yo && (r.state = Rc, r.timer.restart(n, r.delay, r.time), n(h));
    }), r.state = $n, r.on.call("start", e, e.__data__, r.index, r.group), r.state === $n) {
      for (r.state = yo, s = new Array(f = r.tween.length), c = 0, u = -1; c < f; ++c)
        (d = r.tween[c].value.call(e, e.__data__, r.index, r.group)) && (s[++u] = d);
      s.length = u + 1;
    }
  }
  function n(h) {
    for (var c = h < r.duration ? r.ease.call(null, h / r.duration) : (r.timer.restart(l), r.state = On, 1), u = -1, f = s.length; ++u < f; )
      s[u].call(e, c);
    r.state === On && (r.on.call("end", e, e.__data__, r.index, r.group), l());
  }
  function l() {
    r.state = xo, r.timer.stop(), delete i[t];
    for (var h in i) return;
    delete e.__transition;
  }
}
function n2(e, t) {
  var r = e.__transition, i, s, o = !0, a;
  if (r) {
    t = t == null ? null : t + "";
    for (a in r) {
      if ((i = r[a]).name !== t) {
        o = !1;
        continue;
      }
      s = i.state > $n && i.state < On, i.state = xo, i.timer.stop(), i.on.call(s ? "interrupt" : "cancel", e, e.__data__, i.index, i.group), delete r[a];
    }
    o && delete e.__transition;
  }
}
function l2(e) {
  return this.each(function() {
    n2(this, e);
  });
}
function h2(e, t) {
  var r, i;
  return function() {
    var s = Ze(this, e), o = s.tween;
    if (o !== r) {
      i = r = o;
      for (var a = 0, n = i.length; a < n; ++a)
        if (i[a].name === t) {
          i = i.slice(), i.splice(a, 1);
          break;
        }
    }
    s.tween = i;
  };
}
function c2(e, t, r) {
  var i, s;
  if (typeof r != "function") throw new Error();
  return function() {
    var o = Ze(this, e), a = o.tween;
    if (a !== i) {
      s = (i = a).slice();
      for (var n = { name: t, value: r }, l = 0, h = s.length; l < h; ++l)
        if (s[l].name === t) {
          s[l] = n;
          break;
        }
      l === h && s.push(n);
    }
    o.tween = s;
  };
}
function u2(e, t) {
  var r = this._id;
  if (e += "", arguments.length < 2) {
    for (var i = Ie(this.node(), r).tween, s = 0, o = i.length, a; s < o; ++s)
      if ((a = i[s]).name === e)
        return a.value;
    return null;
  }
  return this.each((t == null ? h2 : c2)(r, e, t));
}
function ql(e, t, r) {
  var i = e._id;
  return e.each(function() {
    var s = Ze(this, i);
    (s.value || (s.value = {}))[t] = r.apply(this, arguments);
  }), function(s) {
    return Ie(s, i).value[t];
  };
}
function of(e, t) {
  var r;
  return (typeof t == "number" ? pr : t instanceof Ts ? Mc : (r = Ts(t)) ? (t = r, Mc) : V1)(e, t);
}
function d2(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function f2(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function p2(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = this.getAttribute(e);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function g2(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = this.getAttributeNS(e.space, e.local);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function m2(e, t, r) {
  var i, s, o;
  return function() {
    var a, n = r(this), l;
    return n == null ? void this.removeAttribute(e) : (a = this.getAttribute(e), l = n + "", a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n)));
  };
}
function y2(e, t, r) {
  var i, s, o;
  return function() {
    var a, n = r(this), l;
    return n == null ? void this.removeAttributeNS(e.space, e.local) : (a = this.getAttributeNS(e.space, e.local), l = n + "", a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n)));
  };
}
function x2(e, t) {
  var r = ca(e), i = r === "transform" ? J1 : of;
  return this.attrTween(e, typeof t == "function" ? (r.local ? y2 : m2)(r, i, ql(this, "attr." + e, t)) : t == null ? (r.local ? f2 : d2)(r) : (r.local ? g2 : p2)(r, i, t));
}
function C2(e, t) {
  return function(r) {
    this.setAttribute(e, t.call(this, r));
  };
}
function b2(e, t) {
  return function(r) {
    this.setAttributeNS(e.space, e.local, t.call(this, r));
  };
}
function k2(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && b2(e, o)), r;
  }
  return s._value = t, s;
}
function S2(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && C2(e, o)), r;
  }
  return s._value = t, s;
}
function w2(e, t) {
  var r = "attr." + e;
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  var i = ca(e);
  return this.tween(r, (i.local ? k2 : S2)(i, t));
}
function T2(e, t) {
  return function() {
    Nl(this, e).delay = +t.apply(this, arguments);
  };
}
function _2(e, t) {
  return t = +t, function() {
    Nl(this, e).delay = t;
  };
}
function B2(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? T2 : _2)(t, e)) : Ie(this.node(), t).delay;
}
function v2(e, t) {
  return function() {
    Ze(this, e).duration = +t.apply(this, arguments);
  };
}
function L2(e, t) {
  return t = +t, function() {
    Ze(this, e).duration = t;
  };
}
function A2(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? v2 : L2)(t, e)) : Ie(this.node(), t).duration;
}
function F2(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ze(this, e).ease = t;
  };
}
function E2(e) {
  var t = this._id;
  return arguments.length ? this.each(F2(t, e)) : Ie(this.node(), t).ease;
}
function M2(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    if (typeof r != "function") throw new Error();
    Ze(this, e).ease = r;
  };
}
function $2(e) {
  if (typeof e != "function") throw new Error();
  return this.each(M2(this._id, e));
}
function O2(e) {
  typeof e != "function" && (e = Pd(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = [], l, h = 0; h < a; ++h)
      (l = o[h]) && e.call(l, l.__data__, h, o) && n.push(l);
  return new sr(i, this._parents, this._name, this._id);
}
function I2(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, r = e._groups, i = t.length, s = r.length, o = Math.min(i, s), a = new Array(i), n = 0; n < o; ++n)
    for (var l = t[n], h = r[n], c = l.length, u = a[n] = new Array(c), f, d = 0; d < c; ++d)
      (f = l[d] || h[d]) && (u[d] = f);
  for (; n < i; ++n)
    a[n] = t[n];
  return new sr(a, this._parents, this._name, this._id);
}
function D2(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var r = t.indexOf(".");
    return r >= 0 && (t = t.slice(0, r)), !t || t === "start";
  });
}
function R2(e, t, r) {
  var i, s, o = D2(t) ? Nl : Ze;
  return function() {
    var a = o(this, e), n = a.on;
    n !== i && (s = (i = n).copy()).on(t, r), a.on = s;
  };
}
function P2(e, t) {
  var r = this._id;
  return arguments.length < 2 ? Ie(this.node(), r).on.on(e) : this.each(R2(r, e, t));
}
function N2(e) {
  return function() {
    var t = this.parentNode;
    for (var r in this.__transition) if (+r !== e) return;
    t && t.removeChild(this);
  };
}
function q2() {
  return this.on("end.remove", N2(this._id));
}
function W2(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = Ol(e));
  for (var i = this._groups, s = i.length, o = new Array(s), a = 0; a < s; ++a)
    for (var n = i[a], l = n.length, h = o[a] = new Array(l), c, u, f = 0; f < l; ++f)
      (c = n[f]) && (u = e.call(c, c.__data__, f, n)) && ("__data__" in c && (u.__data__ = c.__data__), h[f] = u, da(h[f], t, r, f, h, Ie(c, r)));
  return new sr(o, this._parents, t, r);
}
function z2(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = Rd(e));
  for (var i = this._groups, s = i.length, o = [], a = [], n = 0; n < s; ++n)
    for (var l = i[n], h = l.length, c, u = 0; u < h; ++u)
      if (c = l[u]) {
        for (var f = e.call(c, c.__data__, u, l), d, p = Ie(c, r), m = 0, y = f.length; m < y; ++m)
          (d = f[m]) && da(d, t, r, m, f, p);
        o.push(f), a.push(c);
      }
  return new sr(o, a, t, r);
}
var H2 = Rs.prototype.constructor;
function Y2() {
  return new H2(this._groups, this._parents);
}
function U2(e, t) {
  var r, i, s;
  return function() {
    var o = Di(this, e), a = (this.style.removeProperty(e), Di(this, e));
    return o === a ? null : o === r && a === i ? s : s = t(r = o, i = a);
  };
}
function af(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function X2(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = Di(this, e);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function G2(e, t, r) {
  var i, s, o;
  return function() {
    var a = Di(this, e), n = r(this), l = n + "";
    return n == null && (l = n = (this.style.removeProperty(e), Di(this, e))), a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n));
  };
}
function j2(e, t) {
  var r, i, s, o = "style." + t, a = "end." + o, n;
  return function() {
    var l = Ze(this, e), h = l.on, c = l.value[o] == null ? n || (n = af(t)) : void 0;
    (h !== r || s !== c) && (i = (r = h).copy()).on(a, s = c), l.on = i;
  };
}
function V2(e, t, r) {
  var i = (e += "") == "transform" ? Q1 : of;
  return t == null ? this.styleTween(e, U2(e, i)).on("end.style." + e, af(e)) : typeof t == "function" ? this.styleTween(e, G2(e, i, ql(this, "style." + e, t))).each(j2(this._id, e)) : this.styleTween(e, X2(e, i, t), r).on("end.style." + e, null);
}
function Z2(e, t, r) {
  return function(i) {
    this.style.setProperty(e, t.call(this, i), r);
  };
}
function K2(e, t, r) {
  var i, s;
  function o() {
    var a = t.apply(this, arguments);
    return a !== s && (i = (s = a) && Z2(e, a, r)), i;
  }
  return o._value = t, o;
}
function Q2(e, t, r) {
  var i = "style." + (e += "");
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (t == null) return this.tween(i, null);
  if (typeof t != "function") throw new Error();
  return this.tween(i, K2(e, t, r ?? ""));
}
function J2(e) {
  return function() {
    this.textContent = e;
  };
}
function tS(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function eS(e) {
  return this.tween("text", typeof e == "function" ? tS(ql(this, "text", e)) : J2(e == null ? "" : e + ""));
}
function rS(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function iS(e) {
  var t, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (t = (r = s) && rS(s)), t;
  }
  return i._value = e, i;
}
function sS(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, iS(e));
}
function oS() {
  for (var e = this._name, t = this._id, r = nf(), i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var a = i[o], n = a.length, l, h = 0; h < n; ++h)
      if (l = a[h]) {
        var c = Ie(l, t);
        da(l, e, r, h, a, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new sr(i, this._parents, e, r);
}
function aS() {
  var e, t, r = this, i = r._id, s = r.size();
  return new Promise(function(o, a) {
    var n = { value: a }, l = { value: function() {
      --s === 0 && o();
    } };
    r.each(function() {
      var h = Ze(this, i), c = h.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(n), t._.interrupt.push(n), t._.end.push(l)), h.on = t;
    }), s === 0 && o();
  });
}
var nS = 0;
function sr(e, t, r, i) {
  this._groups = e, this._parents = t, this._name = r, this._id = i;
}
function nf() {
  return ++nS;
}
var Je = Rs.prototype;
sr.prototype = {
  constructor: sr,
  select: W2,
  selectAll: z2,
  selectChild: Je.selectChild,
  selectChildren: Je.selectChildren,
  filter: O2,
  merge: I2,
  selection: Y2,
  transition: oS,
  call: Je.call,
  nodes: Je.nodes,
  node: Je.node,
  size: Je.size,
  empty: Je.empty,
  each: Je.each,
  on: P2,
  attr: x2,
  attrTween: w2,
  style: V2,
  styleTween: Q2,
  text: eS,
  textTween: sS,
  remove: q2,
  tween: u2,
  delay: B2,
  duration: A2,
  ease: E2,
  easeVarying: $2,
  end: aS,
  [Symbol.iterator]: Je[Symbol.iterator]
};
function lS(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var hS = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: lS
};
function cS(e, t) {
  for (var r; !(r = e.__transition) || !(r = r[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return r;
}
function uS(e) {
  var t, r;
  e instanceof sr ? (t = e._id, e = e._name) : (t = nf(), (r = hS).time = Pl(), e = e == null ? null : e + "");
  for (var i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var a = i[o], n = a.length, l, h = 0; h < n; ++h)
      (l = a[h]) && da(l, e, t, h, a, r || cS(l, t));
  return new sr(i, this._parents, e, t);
}
Rs.prototype.interrupt = l2;
Rs.prototype.transition = uS;
const In = Math.PI, Dn = 2 * In, Mr = 1e-6, dS = Dn - Mr;
function lf(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function fS(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return lf;
  const r = 10 ** t;
  return function(i) {
    this._ += i[0];
    for (let s = 1, o = i.length; s < o; ++s)
      this._ += Math.round(arguments[s] * r) / r + i[s];
  };
}
class pS {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? lf : fS(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, i, s) {
    this._append`Q${+t},${+r},${this._x1 = +i},${this._y1 = +s}`;
  }
  bezierCurveTo(t, r, i, s, o, a) {
    this._append`C${+t},${+r},${+i},${+s},${this._x1 = +o},${this._y1 = +a}`;
  }
  arcTo(t, r, i, s, o) {
    if (t = +t, r = +r, i = +i, s = +s, o = +o, o < 0) throw new Error(`negative radius: ${o}`);
    let a = this._x1, n = this._y1, l = i - t, h = s - r, c = a - t, u = n - r, f = c * c + u * u;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (f > Mr) if (!(Math.abs(u * l - h * c) > Mr) || !o)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let d = i - a, p = s - n, m = l * l + h * h, y = d * d + p * p, x = Math.sqrt(m), C = Math.sqrt(f), k = o * Math.tan((In - Math.acos((m + f - y) / (2 * x * C))) / 2), w = k / C, T = k / x;
      Math.abs(w - 1) > Mr && this._append`L${t + w * c},${r + w * u}`, this._append`A${o},${o},0,0,${+(u * d > c * p)},${this._x1 = t + T * l},${this._y1 = r + T * h}`;
    }
  }
  arc(t, r, i, s, o, a) {
    if (t = +t, r = +r, i = +i, a = !!a, i < 0) throw new Error(`negative radius: ${i}`);
    let n = i * Math.cos(s), l = i * Math.sin(s), h = t + n, c = r + l, u = 1 ^ a, f = a ? s - o : o - s;
    this._x1 === null ? this._append`M${h},${c}` : (Math.abs(this._x1 - h) > Mr || Math.abs(this._y1 - c) > Mr) && this._append`L${h},${c}`, i && (f < 0 && (f = f % Dn + Dn), f > dS ? this._append`A${i},${i},0,1,${u},${t - n},${r - l}A${i},${i},0,1,${u},${this._x1 = h},${this._y1 = c}` : f > Mr && this._append`A${i},${i},0,${+(f >= In)},${u},${this._x1 = t + i * Math.cos(o)},${this._y1 = r + i * Math.sin(o)}`);
  }
  rect(t, r, i, s) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${i = +i}v${+s}h${-i}Z`;
  }
  toString() {
    return this._;
  }
}
function ai(e) {
  return function() {
    return e;
  };
}
const kM = Math.abs, SM = Math.atan2, wM = Math.cos, TM = Math.max, _M = Math.min, BM = Math.sin, vM = Math.sqrt, Pc = 1e-12, Wl = Math.PI, Nc = Wl / 2, LM = 2 * Wl;
function AM(e) {
  return e > 1 ? 0 : e < -1 ? Wl : Math.acos(e);
}
function FM(e) {
  return e >= 1 ? Nc : e <= -1 ? -Nc : Math.asin(e);
}
function gS(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const i = Math.floor(r);
      if (!(i >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = i;
    }
    return e;
  }, () => new pS(t);
}
function mS(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function hf(e) {
  this._context = e;
}
hf.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function ys(e) {
  return new hf(e);
}
function yS(e) {
  return e[0];
}
function xS(e) {
  return e[1];
}
function CS(e, t) {
  var r = ai(!0), i = null, s = ys, o = null, a = gS(n);
  e = typeof e == "function" ? e : e === void 0 ? yS : ai(e), t = typeof t == "function" ? t : t === void 0 ? xS : ai(t);
  function n(l) {
    var h, c = (l = mS(l)).length, u, f = !1, d;
    for (i == null && (o = s(d = a())), h = 0; h <= c; ++h)
      !(h < c && r(u = l[h], h, l)) === f && ((f = !f) ? o.lineStart() : o.lineEnd()), f && o.point(+e(u, h, l), +t(u, h, l));
    if (d) return o = null, d + "" || null;
  }
  return n.x = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : ai(+l), n) : e;
  }, n.y = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : ai(+l), n) : t;
  }, n.defined = function(l) {
    return arguments.length ? (r = typeof l == "function" ? l : ai(!!l), n) : r;
  }, n.curve = function(l) {
    return arguments.length ? (s = l, i != null && (o = s(i)), n) : s;
  }, n.context = function(l) {
    return arguments.length ? (l == null ? i = o = null : o = s(i = l), n) : i;
  }, n;
}
class cf {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function uf(e) {
  return new cf(e, !0);
}
function df(e) {
  return new cf(e, !1);
}
function kr() {
}
function No(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function fa(e) {
  this._context = e;
}
fa.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        No(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      default:
        No(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Rn(e) {
  return new fa(e);
}
function ff(e) {
  this._context = e;
}
ff.prototype = {
  areaStart: kr,
  areaEnd: kr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        No(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function bS(e) {
  return new ff(e);
}
function pf(e) {
  this._context = e;
}
pf.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, i = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, i) : this._context.moveTo(r, i);
        break;
      case 3:
        this._point = 4;
      default:
        No(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function kS(e) {
  return new pf(e);
}
function gf(e, t) {
  this._basis = new fa(e), this._beta = t;
}
gf.prototype = {
  lineStart: function() {
    this._x = [], this._y = [], this._basis.lineStart();
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length - 1;
    if (r > 0)
      for (var i = e[0], s = t[0], o = e[r] - i, a = t[r] - s, n = -1, l; ++n <= r; )
        l = n / r, this._basis.point(
          this._beta * e[n] + (1 - this._beta) * (i + l * o),
          this._beta * t[n] + (1 - this._beta) * (s + l * a)
        );
    this._x = this._y = null, this._basis.lineEnd();
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
const SS = function e(t) {
  function r(i) {
    return t === 1 ? new fa(i) : new gf(i, t);
  }
  return r.beta = function(i) {
    return e(+i);
  }, r;
}(0.85);
function qo(e, t, r) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - r),
    e._x2,
    e._y2
  );
}
function zl(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
zl.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        qo(this, this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2, this._x1 = e, this._y1 = t;
        break;
      case 2:
        this._point = 3;
      default:
        qo(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const mf = function e(t) {
  function r(i) {
    return new zl(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
}(0);
function Hl(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Hl.prototype = {
  areaStart: kr,
  areaEnd: kr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        qo(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const wS = function e(t) {
  function r(i) {
    return new Hl(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
}(0);
function Yl(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Yl.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        qo(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const TS = function e(t) {
  function r(i) {
    return new Yl(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
}(0);
function Ul(e, t, r) {
  var i = e._x1, s = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > Pc) {
    var n = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, l = 3 * e._l01_a * (e._l01_a + e._l12_a);
    i = (i * n - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / l, s = (s * n - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / l;
  }
  if (e._l23_a > Pc) {
    var h = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, c = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * h + e._x1 * e._l23_2a - t * e._l12_2a) / c, a = (a * h + e._y1 * e._l23_2a - r * e._l12_2a) / c;
  }
  e._context.bezierCurveTo(i, s, o, a, e._x2, e._y2);
}
function yf(e, t) {
  this._context = e, this._alpha = t;
}
yf.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        Ul(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const xf = function e(t) {
  function r(i) {
    return t ? new yf(i, t) : new zl(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
}(0.5);
function Cf(e, t) {
  this._context = e, this._alpha = t;
}
Cf.prototype = {
  areaStart: kr,
  areaEnd: kr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        Ul(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const _S = function e(t) {
  function r(i) {
    return t ? new Cf(i, t) : new Hl(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
}(0.5);
function bf(e, t) {
  this._context = e, this._alpha = t;
}
bf.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        Ul(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const BS = function e(t) {
  function r(i) {
    return t ? new bf(i, t) : new Yl(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
}(0.5);
function kf(e) {
  this._context = e;
}
kf.prototype = {
  areaStart: kr,
  areaEnd: kr,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function vS(e) {
  return new kf(e);
}
function qc(e) {
  return e < 0 ? -1 : 1;
}
function Wc(e, t, r) {
  var i = e._x1 - e._x0, s = t - e._x1, o = (e._y1 - e._y0) / (i || s < 0 && -0), a = (r - e._y1) / (s || i < 0 && -0), n = (o * s + a * i) / (i + s);
  return (qc(o) + qc(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(n)) || 0;
}
function zc(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function tn(e, t, r) {
  var i = e._x0, s = e._y0, o = e._x1, a = e._y1, n = (o - i) / 3;
  e._context.bezierCurveTo(i + n, s + n * t, o - n, a - n * r, o, a);
}
function Wo(e) {
  this._context = e;
}
Wo.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        tn(this, this._t0, zc(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, tn(this, zc(this, r = Wc(this, e, t)), r);
          break;
        default:
          tn(this, this._t0, r = Wc(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function Sf(e) {
  this._context = new wf(e);
}
(Sf.prototype = Object.create(Wo.prototype)).point = function(e, t) {
  Wo.prototype.point.call(this, t, e);
};
function wf(e) {
  this._context = e;
}
wf.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, i, s, o) {
    this._context.bezierCurveTo(t, e, i, r, o, s);
  }
};
function Tf(e) {
  return new Wo(e);
}
function _f(e) {
  return new Sf(e);
}
function Bf(e) {
  this._context = e;
}
Bf.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var i = Hc(e), s = Hc(t), o = 0, a = 1; a < r; ++o, ++a)
          this._context.bezierCurveTo(i[0][o], s[0][o], i[1][o], s[1][o], e[a], t[a]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function Hc(e) {
  var t, r = e.length - 1, i, s = new Array(r), o = new Array(r), a = new Array(r);
  for (s[0] = 0, o[0] = 2, a[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) s[t] = 1, o[t] = 4, a[t] = 4 * e[t] + 2 * e[t + 1];
  for (s[r - 1] = 2, o[r - 1] = 7, a[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) i = s[t] / o[t - 1], o[t] -= i, a[t] -= i * a[t - 1];
  for (s[r - 1] = a[r - 1] / o[r - 1], t = r - 2; t >= 0; --t) s[t] = (a[t] - s[t + 1]) / o[t];
  for (o[r - 1] = (e[r] + s[r - 1]) / 2, t = 0; t < r - 1; ++t) o[t] = 2 * e[t + 1] - s[t + 1];
  return [s, o];
}
function vf(e) {
  return new Bf(e);
}
function pa(e, t) {
  this._context = e, this._t = t;
}
pa.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function Lf(e) {
  return new pa(e, 0.5);
}
function Af(e) {
  return new pa(e, 0);
}
function Ff(e) {
  return new pa(e, 1);
}
function ls(e, t, r) {
  this.k = e, this.x = t, this.y = r;
}
ls.prototype = {
  constructor: ls,
  scale: function(e) {
    return e === 1 ? this : new ls(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new ls(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
ls.prototype;
var LS = /* @__PURE__ */ g((e) => {
  var s;
  const { securityLevel: t } = _t();
  let r = bt("body");
  if (t === "sandbox") {
    const a = ((s = bt(`#i${e}`).node()) == null ? void 0 : s.contentDocument) ?? document;
    r = bt(a.body);
  }
  return r.select(`#${e}`);
}, "selectSvgElement");
function Xl(e) {
  return typeof e > "u" || e === null;
}
g(Xl, "isNothing");
function Ef(e) {
  return typeof e == "object" && e !== null;
}
g(Ef, "isObject");
function Mf(e) {
  return Array.isArray(e) ? e : Xl(e) ? [] : [e];
}
g(Mf, "toArray");
function $f(e, t) {
  var r, i, s, o;
  if (t)
    for (o = Object.keys(t), r = 0, i = o.length; r < i; r += 1)
      s = o[r], e[s] = t[s];
  return e;
}
g($f, "extend");
function Of(e, t) {
  var r = "", i;
  for (i = 0; i < t; i += 1)
    r += e;
  return r;
}
g(Of, "repeat");
function If(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
g(If, "isNegativeZero");
var AS = Xl, FS = Ef, ES = Mf, MS = Of, $S = If, OS = $f, qt = {
  isNothing: AS,
  isObject: FS,
  toArray: ES,
  repeat: MS,
  isNegativeZero: $S,
  extend: OS
};
function Gl(e, t) {
  var r = "", i = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), i + " " + r) : i;
}
g(Gl, "formatError");
function Pi(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Gl(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
g(Pi, "YAMLException$1");
Pi.prototype = Object.create(Error.prototype);
Pi.prototype.constructor = Pi;
Pi.prototype.toString = /* @__PURE__ */ g(function(t) {
  return this.name + ": " + Gl(this, t);
}, "toString");
var ue = Pi;
function Co(e, t, r, i, s) {
  var o = "", a = "", n = Math.floor(s / 2) - 1;
  return i - t > n && (o = " ... ", t = i - n + o.length), r - i > n && (a = " ...", r = i + n - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: i - t + o.length
    // relative position
  };
}
g(Co, "getLine");
function bo(e, t) {
  return qt.repeat(" ", t - e.length) + e;
}
g(bo, "padStart");
function Df(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, i = [0], s = [], o, a = -1; o = r.exec(e.buffer); )
    s.push(o.index), i.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = i.length - 2);
  a < 0 && (a = i.length - 1);
  var n = "", l, h, c = Math.min(e.line + t.linesAfter, s.length).toString().length, u = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    h = Co(
      e.buffer,
      i[a - l],
      s[a - l],
      e.position - (i[a] - i[a - l]),
      u
    ), n = qt.repeat(" ", t.indent) + bo((e.line - l + 1).toString(), c) + " | " + h.str + `
` + n;
  for (h = Co(e.buffer, i[a], s[a], e.position, u), n += qt.repeat(" ", t.indent) + bo((e.line + 1).toString(), c) + " | " + h.str + `
`, n += qt.repeat("-", t.indent + c + 3 + h.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= s.length); l++)
    h = Co(
      e.buffer,
      i[a + l],
      s[a + l],
      e.position - (i[a] - i[a + l]),
      u
    ), n += qt.repeat(" ", t.indent) + bo((e.line + l + 1).toString(), c) + " | " + h.str + `
`;
  return n.replace(/\n$/, "");
}
g(Df, "makeSnippet");
var IS = Df, DS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], RS = [
  "scalar",
  "sequence",
  "mapping"
];
function Rf(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(i) {
      t[String(i)] = r;
    });
  }), t;
}
g(Rf, "compileStyleAliases");
function Pf(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (DS.indexOf(r) === -1)
      throw new ue('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Rf(t.styleAliases || null), RS.indexOf(this.kind) === -1)
    throw new ue('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
g(Pf, "Type$1");
var te = Pf;
function Pn(e, t) {
  var r = [];
  return e[t].forEach(function(i) {
    var s = r.length;
    r.forEach(function(o, a) {
      o.tag === i.tag && o.kind === i.kind && o.multi === i.multi && (s = a);
    }), r[s] = i;
  }), r;
}
g(Pn, "compileList");
function Nf() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function i(s) {
    s.multi ? (e.multi[s.kind].push(s), e.multi.fallback.push(s)) : e[s.kind][s.tag] = e.fallback[s.tag] = s;
  }
  for (g(i, "collectType"), t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(i);
  return e;
}
g(Nf, "compileMap");
function zo(e) {
  return this.extend(e);
}
g(zo, "Schema$1");
zo.prototype.extend = /* @__PURE__ */ g(function(t) {
  var r = [], i = [];
  if (t instanceof te)
    i.push(t);
  else if (Array.isArray(t))
    i = i.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (i = i.concat(t.explicit));
  else
    throw new ue("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof te))
      throw new ue("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new ue("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new ue("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), i.forEach(function(o) {
    if (!(o instanceof te))
      throw new ue("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var s = Object.create(zo.prototype);
  return s.implicit = (this.implicit || []).concat(r), s.explicit = (this.explicit || []).concat(i), s.compiledImplicit = Pn(s, "implicit"), s.compiledExplicit = Pn(s, "explicit"), s.compiledTypeMap = Nf(s.compiledImplicit, s.compiledExplicit), s;
}, "extend");
var PS = zo, NS = new te("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: /* @__PURE__ */ g(function(e) {
    return e !== null ? e : "";
  }, "construct")
}), qS = new te("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: /* @__PURE__ */ g(function(e) {
    return e !== null ? e : [];
  }, "construct")
}), WS = new te("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: /* @__PURE__ */ g(function(e) {
    return e !== null ? e : {};
  }, "construct")
}), zS = new PS({
  explicit: [
    NS,
    qS,
    WS
  ]
});
function qf(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
g(qf, "resolveYamlNull");
function Wf() {
  return null;
}
g(Wf, "constructYamlNull");
function zf(e) {
  return e === null;
}
g(zf, "isNull");
var HS = new te("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: qf,
  construct: Wf,
  predicate: zf,
  represent: {
    canonical: /* @__PURE__ */ g(function() {
      return "~";
    }, "canonical"),
    lowercase: /* @__PURE__ */ g(function() {
      return "null";
    }, "lowercase"),
    uppercase: /* @__PURE__ */ g(function() {
      return "NULL";
    }, "uppercase"),
    camelcase: /* @__PURE__ */ g(function() {
      return "Null";
    }, "camelcase"),
    empty: /* @__PURE__ */ g(function() {
      return "";
    }, "empty")
  },
  defaultStyle: "lowercase"
});
function Hf(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
g(Hf, "resolveYamlBoolean");
function Yf(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
g(Yf, "constructYamlBoolean");
function Uf(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
g(Uf, "isBoolean");
var YS = new te("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Hf,
  construct: Yf,
  predicate: Uf,
  represent: {
    lowercase: /* @__PURE__ */ g(function(e) {
      return e ? "true" : "false";
    }, "lowercase"),
    uppercase: /* @__PURE__ */ g(function(e) {
      return e ? "TRUE" : "FALSE";
    }, "uppercase"),
    camelcase: /* @__PURE__ */ g(function(e) {
      return e ? "True" : "False";
    }, "camelcase")
  },
  defaultStyle: "lowercase"
});
function Xf(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
g(Xf, "isHexCode");
function Gf(e) {
  return 48 <= e && e <= 55;
}
g(Gf, "isOctCode");
function jf(e) {
  return 48 <= e && e <= 57;
}
g(jf, "isDecCode");
function Vf(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, i = !1, s;
  if (!t) return !1;
  if (s = e[r], (s === "-" || s === "+") && (s = e[++r]), s === "0") {
    if (r + 1 === t) return !0;
    if (s = e[++r], s === "b") {
      for (r++; r < t; r++)
        if (s = e[r], s !== "_") {
          if (s !== "0" && s !== "1") return !1;
          i = !0;
        }
      return i && s !== "_";
    }
    if (s === "x") {
      for (r++; r < t; r++)
        if (s = e[r], s !== "_") {
          if (!Xf(e.charCodeAt(r))) return !1;
          i = !0;
        }
      return i && s !== "_";
    }
    if (s === "o") {
      for (r++; r < t; r++)
        if (s = e[r], s !== "_") {
          if (!Gf(e.charCodeAt(r))) return !1;
          i = !0;
        }
      return i && s !== "_";
    }
  }
  if (s === "_") return !1;
  for (; r < t; r++)
    if (s = e[r], s !== "_") {
      if (!jf(e.charCodeAt(r)))
        return !1;
      i = !0;
    }
  return !(!i || s === "_");
}
g(Vf, "resolveYamlInteger");
function Zf(e) {
  var t = e, r = 1, i;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), i = t[0], (i === "-" || i === "+") && (i === "-" && (r = -1), t = t.slice(1), i = t[0]), t === "0") return 0;
  if (i === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
g(Zf, "constructYamlInteger");
function Kf(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !qt.isNegativeZero(e);
}
g(Kf, "isInteger");
var US = new te("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Vf,
  construct: Zf,
  predicate: Kf,
  represent: {
    binary: /* @__PURE__ */ g(function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    }, "binary"),
    octal: /* @__PURE__ */ g(function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    }, "octal"),
    decimal: /* @__PURE__ */ g(function(e) {
      return e.toString(10);
    }, "decimal"),
    /* eslint-disable max-len */
    hexadecimal: /* @__PURE__ */ g(function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }, "hexadecimal")
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), XS = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Qf(e) {
  return !(e === null || !XS.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
g(Qf, "resolveYamlFloat");
function Jf(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
g(Jf, "constructYamlFloat");
var GS = /^[-+]?[0-9]+e/;
function tp(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (qt.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), GS.test(r) ? r.replace("e", ".e") : r;
}
g(tp, "representYamlFloat");
function ep(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || qt.isNegativeZero(e));
}
g(ep, "isFloat");
var jS = new te("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Qf,
  construct: Jf,
  predicate: ep,
  represent: tp,
  defaultStyle: "lowercase"
}), rp = zS.extend({
  implicit: [
    HS,
    YS,
    US,
    jS
  ]
}), VS = rp, ip = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), sp = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function op(e) {
  return e === null ? !1 : ip.exec(e) !== null || sp.exec(e) !== null;
}
g(op, "resolveYamlTimestamp");
function ap(e) {
  var t, r, i, s, o, a, n, l = 0, h = null, c, u, f;
  if (t = ip.exec(e), t === null && (t = sp.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], i = +t[2] - 1, s = +t[3], !t[4])
    return new Date(Date.UTC(r, i, s));
  if (o = +t[4], a = +t[5], n = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], u = +(t[11] || 0), h = (c * 60 + u) * 6e4, t[9] === "-" && (h = -h)), f = new Date(Date.UTC(r, i, s, o, a, n, l)), h && f.setTime(f.getTime() - h), f;
}
g(ap, "constructYamlTimestamp");
function np(e) {
  return e.toISOString();
}
g(np, "representYamlTimestamp");
var ZS = new te("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: op,
  construct: ap,
  instanceOf: Date,
  represent: np
});
function lp(e) {
  return e === "<<" || e === null;
}
g(lp, "resolveYamlMerge");
var KS = new te("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: lp
}), jl = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function hp(e) {
  if (e === null) return !1;
  var t, r, i = 0, s = e.length, o = jl;
  for (r = 0; r < s; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      i += 6;
    }
  return i % 8 === 0;
}
g(hp, "resolveYamlBinary");
function cp(e) {
  var t, r, i = e.replace(/[\r\n=]/g, ""), s = i.length, o = jl, a = 0, n = [];
  for (t = 0; t < s; t++)
    t % 4 === 0 && t && (n.push(a >> 16 & 255), n.push(a >> 8 & 255), n.push(a & 255)), a = a << 6 | o.indexOf(i.charAt(t));
  return r = s % 4 * 6, r === 0 ? (n.push(a >> 16 & 255), n.push(a >> 8 & 255), n.push(a & 255)) : r === 18 ? (n.push(a >> 10 & 255), n.push(a >> 2 & 255)) : r === 12 && n.push(a >> 4 & 255), new Uint8Array(n);
}
g(cp, "constructYamlBinary");
function up(e) {
  var t = "", r = 0, i, s, o = e.length, a = jl;
  for (i = 0; i < o; i++)
    i % 3 === 0 && i && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[i];
  return s = o % 3, s === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : s === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : s === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
g(up, "representYamlBinary");
function dp(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
g(dp, "isBinary");
var QS = new te("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: hp,
  construct: cp,
  predicate: dp,
  represent: up
}), JS = Object.prototype.hasOwnProperty, tw = Object.prototype.toString;
function fp(e) {
  if (e === null) return !0;
  var t = [], r, i, s, o, a, n = e;
  for (r = 0, i = n.length; r < i; r += 1) {
    if (s = n[r], a = !1, tw.call(s) !== "[object Object]") return !1;
    for (o in s)
      if (JS.call(s, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
g(fp, "resolveYamlOmap");
function pp(e) {
  return e !== null ? e : [];
}
g(pp, "constructYamlOmap");
var ew = new te("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: fp,
  construct: pp
}), rw = Object.prototype.toString;
function gp(e) {
  if (e === null) return !0;
  var t, r, i, s, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (i = a[t], rw.call(i) !== "[object Object]" || (s = Object.keys(i), s.length !== 1)) return !1;
    o[t] = [s[0], i[s[0]]];
  }
  return !0;
}
g(gp, "resolveYamlPairs");
function mp(e) {
  if (e === null) return [];
  var t, r, i, s, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    i = a[t], s = Object.keys(i), o[t] = [s[0], i[s[0]]];
  return o;
}
g(mp, "constructYamlPairs");
var iw = new te("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: gp,
  construct: mp
}), sw = Object.prototype.hasOwnProperty;
function yp(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (sw.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
g(yp, "resolveYamlSet");
function xp(e) {
  return e !== null ? e : {};
}
g(xp, "constructYamlSet");
var ow = new te("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: yp,
  construct: xp
}), Cp = VS.extend({
  implicit: [
    ZS,
    KS
  ],
  explicit: [
    QS,
    ew,
    iw,
    ow
  ]
}), Sr = Object.prototype.hasOwnProperty, Ho = 1, bp = 2, kp = 3, Yo = 4, en = 1, aw = 2, Yc = 3, nw = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, lw = /[\x85\u2028\u2029]/, hw = /[,\[\]\{\}]/, Sp = /^(?:!|!!|![a-z\-]+!)$/i, wp = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Nn(e) {
  return Object.prototype.toString.call(e);
}
g(Nn, "_class");
function Ee(e) {
  return e === 10 || e === 13;
}
g(Ee, "is_EOL");
function br(e) {
  return e === 9 || e === 32;
}
g(br, "is_WHITE_SPACE");
function oe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
g(oe, "is_WS_OR_EOL");
function Dr(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
g(Dr, "is_FLOW_INDICATOR");
function Tp(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
g(Tp, "fromHexCode");
function _p(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
g(_p, "escapedHexLen");
function Bp(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
g(Bp, "fromDecimalCode");
function qn(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
g(qn, "simpleEscapeSequence");
function vp(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
g(vp, "charFromCodepoint");
function Vl(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
g(Vl, "setProperty");
var Lp = new Array(256), Ap = new Array(256);
for (Fr = 0; Fr < 256; Fr++)
  Lp[Fr] = qn(Fr) ? 1 : 0, Ap[Fr] = qn(Fr);
var Fr;
function Fp(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || Cp, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
g(Fp, "State$1");
function Zl(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = IS(r), new ue(t, r);
}
g(Zl, "generateError");
function lt(e, t) {
  throw Zl(e, t);
}
g(lt, "throwError");
function Bs(e, t) {
  e.onWarning && e.onWarning.call(null, Zl(e, t));
}
g(Bs, "throwWarning");
var Uc = {
  YAML: /* @__PURE__ */ g(function(t, r, i) {
    var s, o, a;
    t.version !== null && lt(t, "duplication of %YAML directive"), i.length !== 1 && lt(t, "YAML directive accepts exactly one argument"), s = /^([0-9]+)\.([0-9]+)$/.exec(i[0]), s === null && lt(t, "ill-formed argument of the YAML directive"), o = parseInt(s[1], 10), a = parseInt(s[2], 10), o !== 1 && lt(t, "unacceptable YAML version of the document"), t.version = i[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Bs(t, "unsupported YAML version of the document");
  }, "handleYamlDirective"),
  TAG: /* @__PURE__ */ g(function(t, r, i) {
    var s, o;
    i.length !== 2 && lt(t, "TAG directive accepts exactly two arguments"), s = i[0], o = i[1], Sp.test(s) || lt(t, "ill-formed tag handle (first argument) of the TAG directive"), Sr.call(t.tagMap, s) && lt(t, 'there is a previously declared suffix for "' + s + '" tag handle'), wp.test(o) || lt(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      lt(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[s] = o;
  }, "handleTagDirective")
};
function ir(e, t, r, i) {
  var s, o, a, n;
  if (t < r) {
    if (n = e.input.slice(t, r), i)
      for (s = 0, o = n.length; s < o; s += 1)
        a = n.charCodeAt(s), a === 9 || 32 <= a && a <= 1114111 || lt(e, "expected valid JSON character");
    else nw.test(n) && lt(e, "the stream contains non-printable characters");
    e.result += n;
  }
}
g(ir, "captureSegment");
function Wn(e, t, r, i) {
  var s, o, a, n;
  for (qt.isObject(r) || lt(e, "cannot merge mappings; the provided source object is unacceptable"), s = Object.keys(r), a = 0, n = s.length; a < n; a += 1)
    o = s[a], Sr.call(t, o) || (Vl(t, o, r[o]), i[o] = !0);
}
g(Wn, "mergeMappings");
function Rr(e, t, r, i, s, o, a, n, l) {
  var h, c;
  if (Array.isArray(s))
    for (s = Array.prototype.slice.call(s), h = 0, c = s.length; h < c; h += 1)
      Array.isArray(s[h]) && lt(e, "nested arrays are not supported inside keys"), typeof s == "object" && Nn(s[h]) === "[object Object]" && (s[h] = "[object Object]");
  if (typeof s == "object" && Nn(s) === "[object Object]" && (s = "[object Object]"), s = String(s), t === null && (t = {}), i === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (h = 0, c = o.length; h < c; h += 1)
        Wn(e, t, o[h], r);
    else
      Wn(e, t, o, r);
  else
    !e.json && !Sr.call(r, s) && Sr.call(t, s) && (e.line = a || e.line, e.lineStart = n || e.lineStart, e.position = l || e.position, lt(e, "duplicated mapping key")), Vl(t, s, o), delete r[s];
  return t;
}
g(Rr, "storeMappingPair");
function ga(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : lt(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
g(ga, "readLineBreak");
function Dt(e, t, r) {
  for (var i = 0, s = e.input.charCodeAt(e.position); s !== 0; ) {
    for (; br(s); )
      s === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), s = e.input.charCodeAt(++e.position);
    if (t && s === 35)
      do
        s = e.input.charCodeAt(++e.position);
      while (s !== 10 && s !== 13 && s !== 0);
    if (Ee(s))
      for (ga(e), s = e.input.charCodeAt(e.position), i++, e.lineIndent = 0; s === 32; )
        e.lineIndent++, s = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && i !== 0 && e.lineIndent < r && Bs(e, "deficient indentation"), i;
}
g(Dt, "skipSeparationSpace");
function Ns(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || oe(r)));
}
g(Ns, "testDocumentSeparator");
function ma(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += qt.repeat(`
`, t - 1));
}
g(ma, "writeFoldedLines");
function Ep(e, t, r) {
  var i, s, o, a, n, l, h, c, u = e.kind, f = e.result, d;
  if (d = e.input.charCodeAt(e.position), oe(d) || Dr(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96 || (d === 63 || d === 45) && (s = e.input.charCodeAt(e.position + 1), oe(s) || r && Dr(s)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, n = !1; d !== 0; ) {
    if (d === 58) {
      if (s = e.input.charCodeAt(e.position + 1), oe(s) || r && Dr(s))
        break;
    } else if (d === 35) {
      if (i = e.input.charCodeAt(e.position - 1), oe(i))
        break;
    } else {
      if (e.position === e.lineStart && Ns(e) || r && Dr(d))
        break;
      if (Ee(d))
        if (l = e.line, h = e.lineStart, c = e.lineIndent, Dt(e, !1, -1), e.lineIndent >= t) {
          n = !0, d = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = h, e.lineIndent = c;
          break;
        }
    }
    n && (ir(e, o, a, !1), ma(e, e.line - l), o = a = e.position, n = !1), br(d) || (a = e.position + 1), d = e.input.charCodeAt(++e.position);
  }
  return ir(e, o, a, !1), e.result ? !0 : (e.kind = u, e.result = f, !1);
}
g(Ep, "readPlainScalar");
function Mp(e, t) {
  var r, i, s;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, i = s = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (ir(e, i, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        i = e.position, e.position++, s = e.position;
      else
        return !0;
    else Ee(r) ? (ir(e, i, s, !0), ma(e, Dt(e, !1, t)), i = s = e.position) : e.position === e.lineStart && Ns(e) ? lt(e, "unexpected end of the document within a single quoted scalar") : (e.position++, s = e.position);
  lt(e, "unexpected end of the stream within a single quoted scalar");
}
g(Mp, "readSingleQuotedScalar");
function $p(e, t) {
  var r, i, s, o, a, n;
  if (n = e.input.charCodeAt(e.position), n !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; ) {
    if (n === 34)
      return ir(e, r, e.position, !0), e.position++, !0;
    if (n === 92) {
      if (ir(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), Ee(n))
        Dt(e, !1, t);
      else if (n < 256 && Lp[n])
        e.result += Ap[n], e.position++;
      else if ((a = _p(n)) > 0) {
        for (s = a, o = 0; s > 0; s--)
          n = e.input.charCodeAt(++e.position), (a = Tp(n)) >= 0 ? o = (o << 4) + a : lt(e, "expected hexadecimal character");
        e.result += vp(o), e.position++;
      } else
        lt(e, "unknown escape sequence");
      r = i = e.position;
    } else Ee(n) ? (ir(e, r, i, !0), ma(e, Dt(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Ns(e) ? lt(e, "unexpected end of the document within a double quoted scalar") : (e.position++, i = e.position);
  }
  lt(e, "unexpected end of the stream within a double quoted scalar");
}
g($p, "readDoubleQuotedScalar");
function Op(e, t) {
  var r = !0, i, s, o, a = e.tag, n, l = e.anchor, h, c, u, f, d, p = /* @__PURE__ */ Object.create(null), m, y, x, C;
  if (C = e.input.charCodeAt(e.position), C === 91)
    c = 93, d = !1, n = [];
  else if (C === 123)
    c = 125, d = !0, n = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = n), C = e.input.charCodeAt(++e.position); C !== 0; ) {
    if (Dt(e, !0, t), C = e.input.charCodeAt(e.position), C === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = d ? "mapping" : "sequence", e.result = n, !0;
    r ? C === 44 && lt(e, "expected the node content, but found ','") : lt(e, "missed comma between flow collection entries"), y = m = x = null, u = f = !1, C === 63 && (h = e.input.charCodeAt(e.position + 1), oe(h) && (u = f = !0, e.position++, Dt(e, !0, t))), i = e.line, s = e.lineStart, o = e.position, Xr(e, t, Ho, !1, !0), y = e.tag, m = e.result, Dt(e, !0, t), C = e.input.charCodeAt(e.position), (f || e.line === i) && C === 58 && (u = !0, C = e.input.charCodeAt(++e.position), Dt(e, !0, t), Xr(e, t, Ho, !1, !0), x = e.result), d ? Rr(e, n, p, y, m, x, i, s, o) : u ? n.push(Rr(e, null, p, y, m, x, i, s, o)) : n.push(m), Dt(e, !0, t), C = e.input.charCodeAt(e.position), C === 44 ? (r = !0, C = e.input.charCodeAt(++e.position)) : r = !1;
  }
  lt(e, "unexpected end of the stream within a flow collection");
}
g(Op, "readFlowCollection");
function Ip(e, t) {
  var r, i, s = en, o = !1, a = !1, n = t, l = 0, h = !1, c, u;
  if (u = e.input.charCodeAt(e.position), u === 124)
    i = !1;
  else if (u === 62)
    i = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; u !== 0; )
    if (u = e.input.charCodeAt(++e.position), u === 43 || u === 45)
      en === s ? s = u === 43 ? Yc : aw : lt(e, "repeat of a chomping mode identifier");
    else if ((c = Bp(u)) >= 0)
      c === 0 ? lt(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? lt(e, "repeat of an indentation width identifier") : (n = t + c - 1, a = !0);
    else
      break;
  if (br(u)) {
    do
      u = e.input.charCodeAt(++e.position);
    while (br(u));
    if (u === 35)
      do
        u = e.input.charCodeAt(++e.position);
      while (!Ee(u) && u !== 0);
  }
  for (; u !== 0; ) {
    for (ga(e), e.lineIndent = 0, u = e.input.charCodeAt(e.position); (!a || e.lineIndent < n) && u === 32; )
      e.lineIndent++, u = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > n && (n = e.lineIndent), Ee(u)) {
      l++;
      continue;
    }
    if (e.lineIndent < n) {
      s === Yc ? e.result += qt.repeat(`
`, o ? 1 + l : l) : s === en && o && (e.result += `
`);
      break;
    }
    for (i ? br(u) ? (h = !0, e.result += qt.repeat(`
`, o ? 1 + l : l)) : h ? (h = !1, e.result += qt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += qt.repeat(`
`, l) : e.result += qt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, r = e.position; !Ee(u) && u !== 0; )
      u = e.input.charCodeAt(++e.position);
    ir(e, r, e.position, !1);
  }
  return !0;
}
g(Ip, "readBlockScalar");
function zn(e, t) {
  var r, i = e.tag, s = e.anchor, o = [], a, n = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, lt(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !oe(a)))); ) {
    if (n = !0, e.position++, Dt(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, Xr(e, t, kp, !1, !0), o.push(e.result), Dt(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      lt(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return n ? (e.tag = i, e.anchor = s, e.kind = "sequence", e.result = o, !0) : !1;
}
g(zn, "readBlockSequence");
function Dp(e, t, r) {
  var i, s, o, a, n, l, h = e.tag, c = e.anchor, u = {}, f = /* @__PURE__ */ Object.create(null), d = null, p = null, m = null, y = !1, x = !1, C;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = u), C = e.input.charCodeAt(e.position); C !== 0; ) {
    if (!y && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, lt(e, "tab characters must not be used in indentation")), i = e.input.charCodeAt(e.position + 1), o = e.line, (C === 63 || C === 58) && oe(i))
      C === 63 ? (y && (Rr(e, u, f, d, p, null, a, n, l), d = p = m = null), x = !0, y = !0, s = !0) : y ? (y = !1, s = !0) : lt(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, C = i;
    else {
      if (a = e.line, n = e.lineStart, l = e.position, !Xr(e, r, bp, !1, !0))
        break;
      if (e.line === o) {
        for (C = e.input.charCodeAt(e.position); br(C); )
          C = e.input.charCodeAt(++e.position);
        if (C === 58)
          C = e.input.charCodeAt(++e.position), oe(C) || lt(e, "a whitespace character is expected after the key-value separator within a block mapping"), y && (Rr(e, u, f, d, p, null, a, n, l), d = p = m = null), x = !0, y = !1, s = !1, d = e.tag, p = e.result;
        else if (x)
          lt(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = h, e.anchor = c, !0;
      } else if (x)
        lt(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = h, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (y && (a = e.line, n = e.lineStart, l = e.position), Xr(e, t, Yo, !0, s) && (y ? p = e.result : m = e.result), y || (Rr(e, u, f, d, p, m, a, n, l), d = p = m = null), Dt(e, !0, -1), C = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && C !== 0)
      lt(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return y && Rr(e, u, f, d, p, null, a, n, l), x && (e.tag = h, e.anchor = c, e.kind = "mapping", e.result = u), x;
}
g(Dp, "readBlockMapping");
function Rp(e) {
  var t, r = !1, i = !1, s, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && lt(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (i = !0, s = "!!", a = e.input.charCodeAt(++e.position)) : s = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : lt(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !oe(a); )
      a === 33 && (i ? lt(e, "tag suffix cannot contain exclamation marks") : (s = e.input.slice(t - 1, e.position + 1), Sp.test(s) || lt(e, "named tag handle cannot contain such characters"), i = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), hw.test(o) && lt(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !wp.test(o) && lt(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    lt(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : Sr.call(e.tagMap, s) ? e.tag = e.tagMap[s] + o : s === "!" ? e.tag = "!" + o : s === "!!" ? e.tag = "tag:yaml.org,2002:" + o : lt(e, 'undeclared tag handle "' + s + '"'), !0;
}
g(Rp, "readTagProperty");
function Pp(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && lt(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !oe(r) && !Dr(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && lt(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
g(Pp, "readAnchorProperty");
function Np(e) {
  var t, r, i;
  if (i = e.input.charCodeAt(e.position), i !== 42) return !1;
  for (i = e.input.charCodeAt(++e.position), t = e.position; i !== 0 && !oe(i) && !Dr(i); )
    i = e.input.charCodeAt(++e.position);
  return e.position === t && lt(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Sr.call(e.anchorMap, r) || lt(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Dt(e, !0, -1), !0;
}
g(Np, "readAlias");
function Xr(e, t, r, i, s) {
  var o, a, n, l = 1, h = !1, c = !1, u, f, d, p, m, y;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = n = Yo === r || kp === r, i && Dt(e, !0, -1) && (h = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; Rp(e) || Pp(e); )
      Dt(e, !0, -1) ? (h = !0, n = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : n = !1;
  if (n && (n = h || s), (l === 1 || Yo === r) && (Ho === r || bp === r ? m = t : m = t + 1, y = e.position - e.lineStart, l === 1 ? n && (zn(e, y) || Dp(e, y, m)) || Op(e, m) ? c = !0 : (a && Ip(e, m) || Mp(e, m) || $p(e, m) ? c = !0 : Np(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && lt(e, "alias node should not have any properties")) : Ep(e, m, Ho === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = n && zn(e, y))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && lt(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), u = 0, f = e.implicitTypes.length; u < f; u += 1)
      if (p = e.implicitTypes[u], p.resolve(e.result)) {
        e.result = p.construct(e.result), e.tag = p.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Sr.call(e.typeMap[e.kind || "fallback"], e.tag))
      p = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (p = null, d = e.typeMap.multi[e.kind || "fallback"], u = 0, f = d.length; u < f; u += 1)
        if (e.tag.slice(0, d[u].tag.length) === d[u].tag) {
          p = d[u];
          break;
        }
    p || lt(e, "unknown tag !<" + e.tag + ">"), e.result !== null && p.kind !== e.kind && lt(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + p.kind + '", not "' + e.kind + '"'), p.resolve(e.result, e.tag) ? (e.result = p.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : lt(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
g(Xr, "composeNode");
function qp(e) {
  var t = e.position, r, i, s, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (Dt(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !oe(a); )
      a = e.input.charCodeAt(++e.position);
    for (i = e.input.slice(r, e.position), s = [], i.length < 1 && lt(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; br(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Ee(a));
        break;
      }
      if (Ee(a)) break;
      for (r = e.position; a !== 0 && !oe(a); )
        a = e.input.charCodeAt(++e.position);
      s.push(e.input.slice(r, e.position));
    }
    a !== 0 && ga(e), Sr.call(Uc, i) ? Uc[i](e, i, s) : Bs(e, 'unknown document directive "' + i + '"');
  }
  if (Dt(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Dt(e, !0, -1)) : o && lt(e, "directives end mark is expected"), Xr(e, e.lineIndent - 1, Yo, !1, !0), Dt(e, !0, -1), e.checkLineBreaks && lw.test(e.input.slice(t, e.position)) && Bs(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Ns(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Dt(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    lt(e, "end of the stream or a document separator is expected");
  else
    return;
}
g(qp, "readDocument");
function Kl(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new Fp(e, t), i = e.indexOf("\0");
  for (i !== -1 && (r.position = i, lt(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    qp(r);
  return r.documents;
}
g(Kl, "loadDocuments");
function cw(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var i = Kl(e, r);
  if (typeof t != "function")
    return i;
  for (var s = 0, o = i.length; s < o; s += 1)
    t(i[s]);
}
g(cw, "loadAll$1");
function Wp(e, t) {
  var r = Kl(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new ue("expected a single document in the stream, but found more");
  }
}
g(Wp, "load$1");
var uw = Wp, dw = {
  load: uw
}, zp = Object.prototype.toString, Hp = Object.prototype.hasOwnProperty, Ql = 65279, fw = 9, vs = 10, pw = 13, gw = 32, mw = 33, yw = 34, Hn = 35, xw = 37, Cw = 38, bw = 39, kw = 42, Yp = 44, Sw = 45, Uo = 58, ww = 61, Tw = 62, _w = 63, Bw = 64, Up = 91, Xp = 93, vw = 96, Gp = 123, Lw = 124, jp = 125, ee = {};
ee[0] = "\\0";
ee[7] = "\\a";
ee[8] = "\\b";
ee[9] = "\\t";
ee[10] = "\\n";
ee[11] = "\\v";
ee[12] = "\\f";
ee[13] = "\\r";
ee[27] = "\\e";
ee[34] = '\\"';
ee[92] = "\\\\";
ee[133] = "\\N";
ee[160] = "\\_";
ee[8232] = "\\L";
ee[8233] = "\\P";
var Aw = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], Fw = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Vp(e, t) {
  var r, i, s, o, a, n, l;
  if (t === null) return {};
  for (r = {}, i = Object.keys(t), s = 0, o = i.length; s < o; s += 1)
    a = i[s], n = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Hp.call(l.styleAliases, n) && (n = l.styleAliases[n]), r[a] = n;
  return r;
}
g(Vp, "compileStyleMap");
function Zp(e) {
  var t, r, i;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", i = 2;
  else if (e <= 65535)
    r = "u", i = 4;
  else if (e <= 4294967295)
    r = "U", i = 8;
  else
    throw new ue("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + qt.repeat("0", i - t.length) + t;
}
g(Zp, "encodeHex");
var Ew = 1, Ls = 2;
function Kp(e) {
  this.schema = e.schema || Cp, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = qt.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Vp(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Ls : Ew, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
g(Kp, "State");
function Yn(e, t) {
  for (var r = qt.repeat(" ", t), i = 0, s = -1, o = "", a, n = e.length; i < n; )
    s = e.indexOf(`
`, i), s === -1 ? (a = e.slice(i), i = n) : (a = e.slice(i, s + 1), i = s + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
g(Yn, "indentString");
function Xo(e, t) {
  return `
` + qt.repeat(" ", e.indent * t);
}
g(Xo, "generateNextLine");
function Qp(e, t) {
  var r, i, s;
  for (r = 0, i = e.implicitTypes.length; r < i; r += 1)
    if (s = e.implicitTypes[r], s.resolve(t))
      return !0;
  return !1;
}
g(Qp, "testImplicitResolving");
function As(e) {
  return e === gw || e === fw;
}
g(As, "isWhitespace");
function Ni(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Ql || 65536 <= e && e <= 1114111;
}
g(Ni, "isPrintable");
function Un(e) {
  return Ni(e) && e !== Ql && e !== pw && e !== vs;
}
g(Un, "isNsCharOrWhitespace");
function Xn(e, t, r) {
  var i = Un(e), s = i && !As(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      i
    ) : i && e !== Yp && e !== Up && e !== Xp && e !== Gp && e !== jp) && e !== Hn && !(t === Uo && !s) || Un(t) && !As(t) && e === Hn || t === Uo && s
  );
}
g(Xn, "isPlainSafe");
function Jp(e) {
  return Ni(e) && e !== Ql && !As(e) && e !== Sw && e !== _w && e !== Uo && e !== Yp && e !== Up && e !== Xp && e !== Gp && e !== jp && e !== Hn && e !== Cw && e !== kw && e !== mw && e !== Lw && e !== ww && e !== Tw && e !== bw && e !== yw && e !== xw && e !== Bw && e !== vw;
}
g(Jp, "isPlainSafeFirst");
function tg(e) {
  return !As(e) && e !== Uo;
}
g(tg, "isPlainSafeLast");
function pi(e, t) {
  var r = e.charCodeAt(t), i;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (i = e.charCodeAt(t + 1), i >= 56320 && i <= 57343) ? (r - 55296) * 1024 + i - 56320 + 65536 : r;
}
g(pi, "codePointAt");
function Jl(e) {
  var t = /^\n* /;
  return t.test(e);
}
g(Jl, "needIndentIndicator");
var eg = 1, Gn = 2, rg = 3, ig = 4, ci = 5;
function sg(e, t, r, i, s, o, a, n) {
  var l, h = 0, c = null, u = !1, f = !1, d = i !== -1, p = -1, m = Jp(pi(e, 0)) && tg(pi(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = pi(e, l), !Ni(h))
        return ci;
      m = m && Xn(h, c, n), c = h;
    }
  else {
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = pi(e, l), h === vs)
        u = !0, d && (f = f || // Foldable line = too long, and not more-indented.
        l - p - 1 > i && e[p + 1] !== " ", p = l);
      else if (!Ni(h))
        return ci;
      m = m && Xn(h, c, n), c = h;
    }
    f = f || d && l - p - 1 > i && e[p + 1] !== " ";
  }
  return !u && !f ? m && !a && !s(e) ? eg : o === Ls ? ci : Gn : r > 9 && Jl(e) ? ci : a ? o === Ls ? ci : Gn : f ? ig : rg;
}
g(sg, "chooseScalarStyle");
function og(e, t, r, i, s) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Ls ? '""' : "''";
    if (!e.noCompatMode && (Aw.indexOf(t) !== -1 || Fw.test(t)))
      return e.quotingType === Ls ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), n = i || e.flowLevel > -1 && r >= e.flowLevel;
    function l(h) {
      return Qp(e, h);
    }
    switch (g(l, "testAmbiguity"), sg(
      t,
      n,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !i,
      s
    )) {
      case eg:
        return t;
      case Gn:
        return "'" + t.replace(/'/g, "''") + "'";
      case rg:
        return "|" + jn(t, e.indent) + Vn(Yn(t, o));
      case ig:
        return ">" + jn(t, e.indent) + Vn(Yn(ag(t, a), o));
      case ci:
        return '"' + ng(t) + '"';
      default:
        throw new ue("impossible error: invalid scalar style");
    }
  }();
}
g(og, "writeScalar");
function jn(e, t) {
  var r = Jl(e) ? String(t) : "", i = e[e.length - 1] === `
`, s = i && (e[e.length - 2] === `
` || e === `
`), o = s ? "+" : i ? "" : "-";
  return r + o + `
`;
}
g(jn, "blockHeader");
function Vn(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
g(Vn, "dropEndingNewline");
function ag(e, t) {
  for (var r = /(\n+)([^\n]*)/g, i = function() {
    var h = e.indexOf(`
`);
    return h = h !== -1 ? h : e.length, r.lastIndex = h, Zn(e.slice(0, h), t);
  }(), s = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var n = a[1], l = a[2];
    o = l[0] === " ", i += n + (!s && !o && l !== "" ? `
` : "") + Zn(l, t), s = o;
  }
  return i;
}
g(ag, "foldString");
function Zn(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, i, s = 0, o, a = 0, n = 0, l = ""; i = r.exec(e); )
    n = i.index, n - s > t && (o = a > s ? a : n, l += `
` + e.slice(s, o), s = o + 1), a = n;
  return l += `
`, e.length - s > t && a > s ? l += e.slice(s, a) + `
` + e.slice(a + 1) : l += e.slice(s), l.slice(1);
}
g(Zn, "foldLine");
function ng(e) {
  for (var t = "", r = 0, i, s = 0; s < e.length; r >= 65536 ? s += 2 : s++)
    r = pi(e, s), i = ee[r], !i && Ni(r) ? (t += e[s], r >= 65536 && (t += e[s + 1])) : t += i || Zp(r);
  return t;
}
g(ng, "escapeString");
function lg(e, t, r) {
  var i = "", s = e.tag, o, a, n;
  for (o = 0, a = r.length; o < a; o += 1)
    n = r[o], e.replacer && (n = e.replacer.call(r, String(o), n)), (Xe(e, t, n, !1, !1) || typeof n > "u" && Xe(e, t, null, !1, !1)) && (i !== "" && (i += "," + (e.condenseFlow ? "" : " ")), i += e.dump);
  e.tag = s, e.dump = "[" + i + "]";
}
g(lg, "writeFlowSequence");
function Kn(e, t, r, i) {
  var s = "", o = e.tag, a, n, l;
  for (a = 0, n = r.length; a < n; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (Xe(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && Xe(e, t + 1, null, !0, !0, !1, !0)) && ((!i || s !== "") && (s += Xo(e, t)), e.dump && vs === e.dump.charCodeAt(0) ? s += "-" : s += "- ", s += e.dump);
  e.tag = o, e.dump = s || "[]";
}
g(Kn, "writeBlockSequence");
function hg(e, t, r) {
  var i = "", s = e.tag, o = Object.keys(r), a, n, l, h, c;
  for (a = 0, n = o.length; a < n; a += 1)
    c = "", i !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], h = r[l], e.replacer && (h = e.replacer.call(r, l, h)), Xe(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Xe(e, t, h, !1, !1) && (c += e.dump, i += c));
  e.tag = s, e.dump = "{" + i + "}";
}
g(hg, "writeFlowMapping");
function cg(e, t, r, i) {
  var s = "", o = e.tag, a = Object.keys(r), n, l, h, c, u, f;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new ue("sortKeys must be a boolean or a function");
  for (n = 0, l = a.length; n < l; n += 1)
    f = "", (!i || s !== "") && (f += Xo(e, t)), h = a[n], c = r[h], e.replacer && (c = e.replacer.call(r, h, c)), Xe(e, t + 1, h, !0, !0, !0) && (u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, u && (e.dump && vs === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, u && (f += Xo(e, t)), Xe(e, t + 1, c, !0, u) && (e.dump && vs === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, s += f));
  e.tag = o, e.dump = s || "{}";
}
g(cg, "writeBlockMapping");
function Qn(e, t, r) {
  var i, s, o, a, n, l;
  for (s = r ? e.explicitTypes : e.implicitTypes, o = 0, a = s.length; o < a; o += 1)
    if (n = s[o], (n.instanceOf || n.predicate) && (!n.instanceOf || typeof t == "object" && t instanceof n.instanceOf) && (!n.predicate || n.predicate(t))) {
      if (r ? n.multi && n.representName ? e.tag = n.representName(t) : e.tag = n.tag : e.tag = "?", n.represent) {
        if (l = e.styleMap[n.tag] || n.defaultStyle, zp.call(n.represent) === "[object Function]")
          i = n.represent(t, l);
        else if (Hp.call(n.represent, l))
          i = n.represent[l](t, l);
        else
          throw new ue("!<" + n.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = i;
      }
      return !0;
    }
  return !1;
}
g(Qn, "detectType");
function Xe(e, t, r, i, s, o, a) {
  e.tag = null, e.dump = r, Qn(e, r, !1) || Qn(e, r, !0);
  var n = zp.call(e.dump), l = i, h;
  i && (i = e.flowLevel < 0 || e.flowLevel > t);
  var c = n === "[object Object]" || n === "[object Array]", u, f;
  if (c && (u = e.duplicates.indexOf(r), f = u !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (s = !1), f && e.usedDuplicates[u])
    e.dump = "*ref_" + u;
  else {
    if (c && f && !e.usedDuplicates[u] && (e.usedDuplicates[u] = !0), n === "[object Object]")
      i && Object.keys(e.dump).length !== 0 ? (cg(e, t, e.dump, s), f && (e.dump = "&ref_" + u + e.dump)) : (hg(e, t, e.dump), f && (e.dump = "&ref_" + u + " " + e.dump));
    else if (n === "[object Array]")
      i && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Kn(e, t - 1, e.dump, s) : Kn(e, t, e.dump, s), f && (e.dump = "&ref_" + u + e.dump)) : (lg(e, t, e.dump), f && (e.dump = "&ref_" + u + " " + e.dump));
    else if (n === "[object String]")
      e.tag !== "?" && og(e, e.dump, t, o, l);
    else {
      if (n === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new ue("unacceptable kind of an object to dump " + n);
    }
    e.tag !== null && e.tag !== "?" && (h = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? h = "!" + h : h.slice(0, 18) === "tag:yaml.org,2002:" ? h = "!!" + h.slice(18) : h = "!<" + h + ">", e.dump = h + " " + e.dump);
  }
  return !0;
}
g(Xe, "writeNode");
function ug(e, t) {
  var r = [], i = [], s, o;
  for (Go(e, r, i), s = 0, o = i.length; s < o; s += 1)
    t.duplicates.push(r[i[s]]);
  t.usedDuplicates = new Array(o);
}
g(ug, "getDuplicateReferences");
function Go(e, t, r) {
  var i, s, o;
  if (e !== null && typeof e == "object")
    if (s = t.indexOf(e), s !== -1)
      r.indexOf(s) === -1 && r.push(s);
    else if (t.push(e), Array.isArray(e))
      for (s = 0, o = e.length; s < o; s += 1)
        Go(e[s], t, r);
    else
      for (i = Object.keys(e), s = 0, o = i.length; s < o; s += 1)
        Go(e[i[s]], t, r);
}
g(Go, "inspectNode");
function Mw(e, t) {
  t = t || {};
  var r = new Kp(t);
  r.noRefs || ug(e, r);
  var i = e;
  return r.replacer && (i = r.replacer.call({ "": i }, "", i)), Xe(r, 0, i, !0, !0) ? r.dump + `
` : "";
}
g(Mw, "dump$1");
function $w(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
g($w, "renamed");
var Ow = rp, Iw = dw.load;
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
var Dw = /* @__PURE__ */ g((e) => {
  const { handDrawnSeed: t } = _t();
  return {
    fill: e,
    hachureAngle: 120,
    // angle of hachure,
    hachureGap: 4,
    fillWeight: 2,
    roughness: 0.7,
    stroke: e,
    seed: t
  };
}, "solidStateFill"), Hi = /* @__PURE__ */ g((e) => {
  const t = Rw([
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || [],
    ...e.labelStyle || []
  ]);
  return { stylesMap: t, stylesArray: [...t] };
}, "compileStyles"), Rw = /* @__PURE__ */ g((e) => {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const [i, s] = r.split(":");
    t.set(i.trim(), s == null ? void 0 : s.trim());
  }), t;
}, "styles2Map"), dg = /* @__PURE__ */ g((e) => e === "color" || e === "font-size" || e === "font-family" || e === "font-weight" || e === "font-style" || e === "text-decoration" || e === "text-align" || e === "text-transform" || e === "line-height" || e === "letter-spacing" || e === "word-spacing" || e === "text-shadow" || e === "text-overflow" || e === "white-space" || e === "word-wrap" || e === "word-break" || e === "overflow-wrap" || e === "hyphens", "isLabelStyle"), it = /* @__PURE__ */ g((e) => {
  const { stylesArray: t } = Hi(e), r = [], i = [], s = [], o = [];
  return t.forEach((a) => {
    const n = a[0];
    dg(n) ? r.push(a.join(":") + " !important") : (i.push(a.join(":") + " !important"), n.includes("stroke") && s.push(a.join(":") + " !important"), n === "fill" && o.push(a.join(":") + " !important"));
  }), {
    labelStyles: r.join(";"),
    nodeStyles: i.join(";"),
    stylesArray: t,
    borderStyles: s,
    backgroundStyles: o
  };
}, "styles2String"), et = /* @__PURE__ */ g((e, t) => {
  var l;
  const { themeVariables: r, handDrawnSeed: i } = _t(), { nodeBorder: s, mainBkg: o } = r, { stylesMap: a } = Hi(e);
  return Object.assign(
    {
      roughness: 0.7,
      fill: a.get("fill") || o,
      fillStyle: "hachure",
      // solid fill
      fillWeight: 4,
      hachureGap: 5.2,
      stroke: a.get("stroke") || s,
      seed: i,
      strokeWidth: ((l = a.get("stroke-width")) == null ? void 0 : l.replace("px", "")) || 1.3,
      fillLineDash: [0, 0],
      strokeLineDash: Pw(a.get("stroke-dasharray"))
    },
    t
  );
}, "userNodeOverrides"), Pw = /* @__PURE__ */ g((e) => {
  if (!e)
    return [0, 0];
  const t = e.trim().split(/\s+/).map(Number);
  if (t.length === 1) {
    const s = isNaN(t[0]) ? 0 : t[0];
    return [s, s];
  }
  const r = isNaN(t[0]) ? 0 : t[0], i = isNaN(t[1]) ? 0 : t[1];
  return [r, i];
}, "getStrokeDashArray"), fg = {}, Ht = {};
Object.defineProperty(Ht, "__esModule", { value: !0 });
Ht.BLANK_URL = Ht.relativeFirstCharacters = Ht.whitespaceEscapeCharsRegex = Ht.urlSchemeRegex = Ht.ctrlCharactersRegex = Ht.htmlCtrlEntityRegex = Ht.htmlEntitiesRegex = Ht.invalidProtocolRegex = void 0;
Ht.invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
Ht.htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
Ht.htmlCtrlEntityRegex = /&(newline|tab);/gi;
Ht.ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
Ht.urlSchemeRegex = /^.+(:|&colon;)/gim;
Ht.whitespaceEscapeCharsRegex = /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g;
Ht.relativeFirstCharacters = [".", "/"];
Ht.BLANK_URL = "about:blank";
Object.defineProperty(fg, "__esModule", { value: !0 });
var Nw = fg.sanitizeUrl = Hw, Qt = Ht;
function qw(e) {
  return Qt.relativeFirstCharacters.indexOf(e[0]) > -1;
}
function Ww(e) {
  var t = e.replace(Qt.ctrlCharactersRegex, "");
  return t.replace(Qt.htmlEntitiesRegex, function(r, i) {
    return String.fromCharCode(i);
  });
}
function zw(e) {
  return URL.canParse(e);
}
function Xc(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e;
  }
}
function Hw(e) {
  if (!e)
    return Qt.BLANK_URL;
  var t, r = Xc(e.trim());
  do
    r = Ww(r).replace(Qt.htmlCtrlEntityRegex, "").replace(Qt.ctrlCharactersRegex, "").replace(Qt.whitespaceEscapeCharsRegex, "").trim(), r = Xc(r), t = r.match(Qt.ctrlCharactersRegex) || r.match(Qt.htmlEntitiesRegex) || r.match(Qt.htmlCtrlEntityRegex) || r.match(Qt.whitespaceEscapeCharsRegex);
  while (t && t.length > 0);
  var i = r;
  if (!i)
    return Qt.BLANK_URL;
  if (qw(i))
    return i;
  var s = i.trimStart(), o = s.match(Qt.urlSchemeRegex);
  if (!o)
    return i;
  var a = o[0].toLowerCase().trim();
  if (Qt.invalidProtocolRegex.test(a))
    return Qt.BLANK_URL;
  var n = s.replace(/\\/g, "/");
  if (a === "mailto:" || a.includes("://"))
    return n;
  if (a === "http:" || a === "https:") {
    if (!zw(n))
      return Qt.BLANK_URL;
    var l = new URL(n);
    return l.protocol = l.protocol.toLowerCase(), l.hostname = l.hostname.toLowerCase(), l.toString();
  }
  return n;
}
function rn(e) {
  var r;
  if (typeof e != "object" || e == null) return !1;
  if (Object.getPrototypeOf(e) === null) return !0;
  if (Object.prototype.toString.call(e) !== "[object Object]") {
    const i = e[Symbol.toStringTag];
    return i == null || !((r = Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)) != null && r.writable) ? !1 : e.toString() === `[object ${i}]`;
  }
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; ) t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
function Yw() {
}
function pg(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function th(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const Uw = "[object RegExp]", gg = "[object String]", mg = "[object Number]", yg = "[object Boolean]", xg = "[object Arguments]", Xw = "[object Symbol]", Gw = "[object Date]", jw = "[object Map]", Vw = "[object Set]", Zw = "[object Array]", Kw = "[object ArrayBuffer]", Qw = "[object Object]", Jw = "[object DataView]", tT = "[object Uint8Array]", eT = "[object Uint8ClampedArray]", rT = "[object Uint16Array]", iT = "[object Uint32Array]", sT = "[object Int8Array]", oT = "[object Int16Array]", aT = "[object Int32Array]", nT = "[object Float32Array]", lT = "[object Float64Array]", Gc = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ function() {
  return this;
}();
function eh(e) {
  return typeof Gc.Buffer < "u" && Gc.Buffer.isBuffer(e);
}
function hT(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function Cg(e) {
  return e != null && typeof e != "function" && hT(e.length);
}
function cT(e) {
  return e === "__proto__";
}
function rh(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function ih(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function uT(e, t) {
  return gi(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function gi(e, t, r, i = /* @__PURE__ */ new Map(), s = void 0) {
  const o = s == null ? void 0 : s(e, t, r, i);
  if (o !== void 0) return o;
  if (rh(e)) return e;
  if (i.has(e)) return i.get(e);
  if (Array.isArray(e)) {
    const a = new Array(e.length);
    i.set(e, a);
    for (let n = 0; n < e.length; n++) a[n] = gi(e[n], n, r, i, s);
    return Object.hasOwn(e, "index") && (a.index = e.index), Object.hasOwn(e, "input") && (a.input = e.input), a;
  }
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof RegExp) {
    const a = new RegExp(e.source, e.flags);
    return a.lastIndex = e.lastIndex, a;
  }
  if (e instanceof Map) {
    const a = /* @__PURE__ */ new Map();
    i.set(e, a);
    for (const [n, l] of e) a.set(n, gi(l, n, r, i, s));
    return a;
  }
  if (e instanceof Set) {
    const a = /* @__PURE__ */ new Set();
    i.set(e, a);
    for (const n of e) a.add(gi(n, void 0, r, i, s));
    return a;
  }
  if (eh(e)) return e.subarray();
  if (ih(e)) {
    const a = new (Object.getPrototypeOf(e)).constructor(e.length);
    i.set(e, a);
    for (let n = 0; n < e.length; n++) a[n] = gi(e[n], n, r, i, s);
    return a;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const a = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  if (typeof File < "u" && e instanceof File) {
    const a = new File([e], e.name, { type: e.type });
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const a = new Blob([e], { type: e.type });
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  if (e instanceof Error) {
    const a = structuredClone(e);
    return i.set(e, a), a.message = e.message, a.name = e.name, a.stack = e.stack, a.cause = e.cause, a.constructor = e.constructor, Be(a, e, r, i, s), a;
  }
  if (e instanceof Boolean) {
    const a = new Boolean(e.valueOf());
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  if (e instanceof Number) {
    const a = new Number(e.valueOf());
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  if (e instanceof String) {
    const a = new String(e.valueOf());
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  if (typeof e == "object" && dT(e)) {
    const a = Object.create(Object.getPrototypeOf(e));
    return i.set(e, a), Be(a, e, r, i, s), a;
  }
  return e;
}
function Be(e, t, r = e, i, s) {
  const o = [...Object.keys(t), ...pg(t)];
  for (let a = 0; a < o.length; a++) {
    const n = o[a], l = Object.getOwnPropertyDescriptor(e, n);
    (l == null || l.writable) && (e[n] = gi(t[n], n, r, i, s));
  }
}
function dT(e) {
  switch (th(e)) {
    case xg:
    case Zw:
    case Kw:
    case Jw:
    case yg:
    case Gw:
    case nT:
    case lT:
    case sT:
    case oT:
    case aT:
    case jw:
    case mg:
    case Qw:
    case Uw:
    case Vw:
    case gg:
    case Xw:
    case tT:
    case eT:
    case rT:
    case iT:
      return !0;
    default:
      return !1;
  }
}
function fT(e, t) {
  return uT(e, (r, i, s, o) => {
    if (typeof e == "object") {
      if (th(e) === "[object Object]" && typeof e.constructor != "function") {
        const a = {};
        return o.set(e, a), Be(a, e, s, o), a;
      }
      switch (Object.prototype.toString.call(e)) {
        case mg:
        case gg:
        case yg: {
          const a = new e.constructor(e == null ? void 0 : e.valueOf());
          return Be(a, e), a;
        }
        case xg: {
          const a = {};
          return Be(a, e), a.length = e.length, a[Symbol.iterator] = e[Symbol.iterator], a;
        }
        default:
          return;
      }
    }
  });
}
function jc(e) {
  return fT(e);
}
function Jn(e) {
  return e !== null && typeof e == "object" && th(e) === "[object Arguments]";
}
function tl(e) {
  return typeof e == "object" && e !== null;
}
function pT(e) {
  return tl(e) && Cg(e);
}
function qs(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function") throw new TypeError("Expected a function");
  const r = function(...i) {
    const s = t ? t.apply(this, i) : i[0], o = r.cache;
    if (o.has(s)) return o.get(s);
    const a = e.apply(this, i);
    return r.cache = o.set(s, a) || o, a;
  };
  return r.cache = new (qs.Cache || Map)(), r;
}
qs.Cache = Map;
function ko(e) {
  return ih(e);
}
function gT(e) {
  const t = e == null ? void 0 : e.constructor;
  return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
function mT(e) {
  if (rh(e)) return e;
  if (Array.isArray(e) || ih(e) || e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  const t = Object.getPrototypeOf(e);
  if (t == null) return Object.assign(Object.create(t), e);
  const r = t.constructor;
  if (e instanceof Date || e instanceof Map || e instanceof Set) return new r(e);
  if (e instanceof RegExp) {
    const i = new r(e);
    return i.lastIndex = e.lastIndex, i;
  }
  if (e instanceof DataView) return new r(e.buffer.slice(0));
  if (e instanceof Error) {
    let i;
    return e instanceof AggregateError ? i = new r(e.errors, e.message, { cause: e.cause }) : i = new r(e.message, { cause: e.cause }), i.stack = e.stack, Object.assign(i, e), i;
  }
  return typeof File < "u" && e instanceof File ? new r([e], e.name, {
    type: e.type,
    lastModified: e.lastModified
  }) : typeof e == "object" ? Object.assign(Object.create(t), e) : e;
}
function yT(e, ...t) {
  const r = t.slice(0, -1), i = t[t.length - 1];
  let s = e;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    s = So(s, a, i, /* @__PURE__ */ new Map());
  }
  return s;
}
function So(e, t, r, i) {
  if (rh(e) && (e = Object(e)), t == null || typeof t != "object") return e;
  if (i.has(t)) return mT(i.get(t));
  if (i.set(t, e), Array.isArray(t)) {
    t = t.slice();
    for (let o = 0; o < t.length; o++) t[o] = t[o] ?? void 0;
  }
  const s = [...Object.keys(t), ...pg(t)];
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    if (cT(a)) continue;
    let n = t[a], l = e[a];
    if (Jn(n) && (n = { ...n }), Jn(l) && (l = { ...l }), eh(n) && (n = jc(n)), Array.isArray(n)) if (Array.isArray(l)) {
      const c = [], u = Reflect.ownKeys(l);
      for (let f = 0; f < u.length; f++) {
        const d = u[f];
        c[d] = l[d];
      }
      l = c;
    } else if (pT(l)) {
      const c = [];
      for (let u = 0; u < l.length; u++) c[u] = l[u];
      l = c;
    } else l = [];
    const h = r(l, n, a, e, t, i);
    h !== void 0 ? e[a] = h : Array.isArray(n) || tl(l) && tl(n) && (rn(l) || rn(n) || ko(l) || ko(n)) ? e[a] = So(l, n, r, i) : l == null && rn(n) ? e[a] = So({}, n, r, i) : l == null && ko(n) ? e[a] = jc(n) : (l === void 0 || n !== void 0) && (e[a] = n);
  }
  return e;
}
function xT(e, ...t) {
  return yT(e, ...t, Yw);
}
function Vc(e) {
  if (e == null) return !0;
  if (Cg(e))
    return typeof e.splice != "function" && typeof e != "string" && !eh(e) && !ko(e) && !Jn(e) ? !1 : e.length === 0;
  if (typeof e == "object" || typeof e == "function") {
    if (e instanceof Map || e instanceof Set) return e.size === 0;
    const t = Object.keys(e);
    return gT(e) ? t.filter((r) => r !== "constructor").length === 0 : t.length === 0;
  }
  return !0;
}
var CT = "​", bT = {
  curveBasis: Rn,
  curveBasisClosed: bS,
  curveBasisOpen: kS,
  curveBumpX: uf,
  curveBumpY: df,
  curveBundle: SS,
  curveCardinalClosed: wS,
  curveCardinalOpen: TS,
  curveCardinal: mf,
  curveCatmullRomClosed: _S,
  curveCatmullRomOpen: BS,
  curveCatmullRom: xf,
  curveLinear: ys,
  curveLinearClosed: vS,
  curveMonotoneX: Tf,
  curveMonotoneY: _f,
  curveNatural: vf,
  curveStep: Lf,
  curveStepAfter: Ff,
  curveStepBefore: Af
}, kT = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, ST = /* @__PURE__ */ g(function(e, t) {
  const r = bg(e, /(?:init\b)|(?:initialize\b)/);
  let i = {};
  if (Array.isArray(r)) {
    const a = r.map((n) => n.args);
    Lo(a), i = Nt(i, [...a]);
  } else
    i = r.args;
  if (!i)
    return;
  let s = Ll(e, t);
  const o = "config";
  return i[o] !== void 0 && (s === "flowchart-v2" && (s = "flowchart"), i[s] = i[o], delete i[o]), i;
}, "detectInit"), bg = /* @__PURE__ */ g(function(e, t = null) {
  var r, i;
  try {
    const s = new RegExp(
      `[%]{2}(?![{]${kT.source})(?=[}][%]{2}).*
`,
      "ig"
    );
    e = e.trim().replace(s, "").replace(/'/gm, '"'), H.debug(
      `Detecting diagram directive${t !== null ? " type:" + t : ""} based on the text:${e}`
    );
    let o;
    const a = [];
    for (; (o = ms.exec(e)) !== null; )
      if (o.index === ms.lastIndex && ms.lastIndex++, o && !t || t && ((r = o[1]) != null && r.match(t)) || t && ((i = o[2]) != null && i.match(t))) {
        const n = o[1] ? o[1] : o[2], l = o[3] ? o[3].trim() : o[4] ? JSON.parse(o[4].trim()) : null;
        a.push({ type: n, args: l });
      }
    return a.length === 0 ? { type: e, args: null } : a.length === 1 ? a[0] : a;
  } catch (s) {
    return H.error(
      `ERROR: ${s.message} - Unable to parse directive type: '${t}' based on the text: '${e}'`
    ), { type: void 0, args: null };
  }
}, "detectDirective"), wT = /* @__PURE__ */ g(function(e) {
  return e.replace(ms, "");
}, "removeDirectives"), TT = /* @__PURE__ */ g(function(e, t) {
  for (const [r, i] of t.entries())
    if (i.match(e))
      return r;
  return -1;
}, "isSubstringInArray");
function sh(e, t) {
  if (!e)
    return t;
  const r = `curve${e.charAt(0).toUpperCase() + e.slice(1)}`;
  return bT[r] ?? t;
}
g(sh, "interpolateToCurve");
function kg(e, t) {
  const r = e.trim();
  if (r)
    return t.securityLevel !== "loose" ? Nw(r) : r;
}
g(kg, "formatUrl");
var _T = /* @__PURE__ */ g((e, ...t) => {
  const r = e.split("."), i = r.length - 1, s = r[i];
  let o = window;
  for (let a = 0; a < i; a++)
    if (o = o[r[a]], !o) {
      H.error(`Function name: ${e} not found in window`);
      return;
    }
  o[s](...t);
}, "runFunc");
function oh(e, t) {
  return !e || !t ? 0 : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
g(oh, "distance");
function Sg(e) {
  let t, r = 0;
  e.forEach((s) => {
    r += oh(s, t), t = s;
  });
  const i = r / 2;
  return ah(e, i);
}
g(Sg, "traverseEdge");
function wg(e) {
  return e.length === 1 ? e[0] : Sg(e);
}
g(wg, "calcLabelPosition");
var Zc = /* @__PURE__ */ g((e, t = 2) => {
  const r = Math.pow(10, t);
  return Math.round(e * r) / r;
}, "roundNumber"), ah = /* @__PURE__ */ g((e, t) => {
  let r, i = t;
  for (const s of e) {
    if (r) {
      const o = oh(s, r);
      if (o === 0)
        return r;
      if (o < i)
        i -= o;
      else {
        const a = i / o;
        if (a <= 0)
          return r;
        if (a >= 1)
          return { x: s.x, y: s.y };
        if (a > 0 && a < 1)
          return {
            x: Zc((1 - a) * r.x + a * s.x, 5),
            y: Zc((1 - a) * r.y + a * s.y, 5)
          };
      }
    }
    r = s;
  }
  throw new Error("Could not find a suitable point for the given distance");
}, "calculatePoint"), BT = /* @__PURE__ */ g((e, t, r) => {
  H.info(`our points ${JSON.stringify(t)}`), t[0] !== r && (t = t.reverse());
  const s = ah(t, 25), o = e ? 10 : 5, a = Math.atan2(t[0].y - s.y, t[0].x - s.x), n = { x: 0, y: 0 };
  return n.x = Math.sin(a) * o + (t[0].x + s.x) / 2, n.y = -Math.cos(a) * o + (t[0].y + s.y) / 2, n;
}, "calcCardinalityPosition");
function Tg(e, t, r) {
  const i = structuredClone(r);
  H.info("our points", i), t !== "start_left" && t !== "start_right" && i.reverse();
  const s = 25 + e, o = ah(i, s), a = 10 + e * 0.5, n = Math.atan2(i[0].y - o.y, i[0].x - o.x), l = { x: 0, y: 0 };
  return t === "start_left" ? (l.x = Math.sin(n + Math.PI) * a + (i[0].x + o.x) / 2, l.y = -Math.cos(n + Math.PI) * a + (i[0].y + o.y) / 2) : t === "end_right" ? (l.x = Math.sin(n - Math.PI) * a + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(n - Math.PI) * a + (i[0].y + o.y) / 2 - 5) : t === "end_left" ? (l.x = Math.sin(n) * a + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(n) * a + (i[0].y + o.y) / 2 - 5) : (l.x = Math.sin(n) * a + (i[0].x + o.x) / 2, l.y = -Math.cos(n) * a + (i[0].y + o.y) / 2), l;
}
g(Tg, "calcTerminalLabelPosition");
function _g(e) {
  let t = "", r = "";
  for (const i of e)
    i !== void 0 && (i.startsWith("color:") || i.startsWith("text-align:") ? r = r + i + ";" : t = t + i + ";");
  return { style: t, labelStyle: r };
}
g(_g, "getStylesFromArray");
var Kc = 0, vT = /* @__PURE__ */ g(() => (Kc++, "id-" + Math.random().toString(36).substr(2, 12) + "-" + Kc), "generateId");
function Bg(e) {
  let t = "";
  const r = "0123456789abcdef", i = r.length;
  for (let s = 0; s < e; s++)
    t += r.charAt(Math.floor(Math.random() * i));
  return t;
}
g(Bg, "makeRandomHex");
var LT = /* @__PURE__ */ g((e) => Bg(e.length), "random"), AT = /* @__PURE__ */ g(function() {
  return {
    x: 0,
    y: 0,
    fill: void 0,
    anchor: "start",
    style: "#666",
    width: 100,
    height: 100,
    textMargin: 0,
    rx: 0,
    ry: 0,
    valign: void 0,
    text: ""
  };
}, "getTextObj"), FT = /* @__PURE__ */ g(function(e, t) {
  const r = t.text.replace(Ds.lineBreakRegex, " "), [, i] = ya(t.fontSize), s = e.append("text");
  s.attr("x", t.x), s.attr("y", t.y), s.style("text-anchor", t.anchor), s.style("font-family", t.fontFamily), s.style("font-size", i), s.style("font-weight", t.fontWeight), s.attr("fill", t.fill), t.class !== void 0 && s.attr("class", t.class);
  const o = s.append("tspan");
  return o.attr("x", t.x + t.textMargin * 2), o.attr("fill", t.fill), o.text(r), s;
}, "drawSimpleText"), ET = qs(
  (e, t, r) => {
    if (!e || (r = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", joinWith: "<br/>" },
      r
    ), Ds.lineBreakRegex.test(e)))
      return e;
    const i = e.split(" ").filter(Boolean), s = [];
    let o = "";
    return i.forEach((a, n) => {
      const l = or(`${a} `, r), h = or(o, r);
      if (l > t) {
        const { hyphenatedStrings: f, remainingWord: d } = MT(a, t, "-", r);
        s.push(o, ...f), o = d;
      } else h + l >= t ? (s.push(o), o = a) : o = [o, a].filter(Boolean).join(" ");
      n + 1 === i.length && s.push(o);
    }), s.filter((a) => a !== "").join(r.joinWith);
  },
  (e, t, r) => `${e}${t}${r.fontSize}${r.fontWeight}${r.fontFamily}${r.joinWith}`
), MT = qs(
  (e, t, r = "-", i) => {
    i = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", margin: 0 },
      i
    );
    const s = [...e], o = [];
    let a = "";
    return s.forEach((n, l) => {
      const h = `${a}${n}`;
      if (or(h, i) >= t) {
        const u = l + 1, f = s.length === u, d = `${h}${r}`;
        o.push(f ? h : d), a = "";
      } else
        a = h;
    }), { hyphenatedStrings: o, remainingWord: a };
  },
  (e, t, r = "-", i) => `${e}${t}${r}${i.fontSize}${i.fontWeight}${i.fontFamily}`
);
function vg(e, t) {
  return nh(e, t).height;
}
g(vg, "calculateTextHeight");
function or(e, t) {
  return nh(e, t).width;
}
g(or, "calculateTextWidth");
var nh = qs(
  (e, t) => {
    const { fontSize: r = 12, fontFamily: i = "Arial", fontWeight: s = 400 } = t;
    if (!e)
      return { width: 0, height: 0 };
    const [, o] = ya(r), a = ["sans-serif", i], n = e.split(Ds.lineBreakRegex), l = [], h = bt("body");
    if (!h.remove)
      return { width: 0, height: 0, lineHeight: 0 };
    const c = h.append("svg");
    for (const f of a) {
      let d = 0;
      const p = { width: 0, height: 0, lineHeight: 0 };
      for (const m of n) {
        const y = AT();
        y.text = m || CT;
        const x = FT(c, y).style("font-size", o).style("font-weight", s).style("font-family", f), C = (x._groups || x)[0][0].getBBox();
        if (C.width === 0 && C.height === 0)
          throw new Error("svg element not in render tree");
        p.width = Math.round(Math.max(p.width, C.width)), d = Math.round(C.height), p.height += d, p.lineHeight = Math.round(Math.max(p.lineHeight, d));
      }
      l.push(p);
    }
    c.remove();
    const u = isNaN(l[1].height) || isNaN(l[1].width) || isNaN(l[1].lineHeight) || l[0].height > l[1].height && l[0].width > l[1].width && l[0].lineHeight > l[1].lineHeight ? 0 : 1;
    return l[u];
  },
  (e, t) => `${e}${t.fontSize}${t.fontWeight}${t.fontFamily}`
), Mi, $T = (Mi = class {
  constructor(t = !1, r) {
    this.count = 0, this.count = r ? r.length : 0, this.next = t ? () => this.count++ : () => Date.now();
  }
}, g(Mi, "InitIDGenerator"), Mi), so, OT = /* @__PURE__ */ g(function(e) {
  return so = so || document.createElement("div"), e = escape(e).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";"), so.innerHTML = e, unescape(so.textContent);
}, "entityDecode");
function lh(e) {
  return "str" in e;
}
g(lh, "isDetailedError");
var IT = /* @__PURE__ */ g((e, t, r, i) => {
  var o;
  if (!i)
    return;
  const s = (o = e.node()) == null ? void 0 : o.getBBox();
  s && e.append("text").text(i).attr("text-anchor", "middle").attr("x", s.x + s.width / 2).attr("y", -r).attr("class", t);
}, "insertTitle"), ya = /* @__PURE__ */ g((e) => {
  if (typeof e == "number")
    return [e, e + "px"];
  const t = parseInt(e ?? "", 10);
  return Number.isNaN(t) ? [void 0, void 0] : e === String(t) ? [t, e + "px"] : [t, e];
}, "parseFontSize");
function hh(e, t) {
  return xT({}, e, t);
}
g(hh, "cleanAndMerge");
var Fe = {
  assignWithDepth: Nt,
  wrapLabel: ET,
  calculateTextHeight: vg,
  calculateTextWidth: or,
  calculateTextDimensions: nh,
  cleanAndMerge: hh,
  detectInit: ST,
  detectDirective: bg,
  isSubstringInArray: TT,
  interpolateToCurve: sh,
  calcLabelPosition: wg,
  calcCardinalityPosition: BT,
  calcTerminalLabelPosition: Tg,
  formatUrl: kg,
  getStylesFromArray: _g,
  generateId: vT,
  random: LT,
  runFunc: _T,
  entityDecode: OT,
  insertTitle: IT,
  isLabelCoordinateInPath: Lg,
  parseFontSize: ya,
  InitIDGenerator: $T
}, DT = /* @__PURE__ */ g(function(e) {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/classDef.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/#\w+;/g, function(r) {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? "ﬂ°°" + i + "¶ß" : "ﬂ°" + i + "¶ß";
  }), t;
}, "encodeEntities"), Gr = /* @__PURE__ */ g(function(e) {
  return e.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities"), EM = /* @__PURE__ */ g((e, t, {
  counter: r = 0,
  prefix: i,
  suffix: s
}, o) => o || `${i ? `${i}_` : ""}${e}_${t}_${r}${s ? `_${s}` : ""}`, "getEdgeId");
function Yt(e) {
  return e ?? null;
}
g(Yt, "handleUndefinedAttr");
function Lg(e, t) {
  const r = Math.round(e.x), i = Math.round(e.y), s = t.replace(
    /(\d+\.\d+)/g,
    (o) => Math.round(parseFloat(o)).toString()
  );
  return s.includes(r.toString()) || s.includes(i.toString());
}
g(Lg, "isLabelCoordinateInPath");
var ch = /* @__PURE__ */ g(({
  flowchart: e
}) => {
  var s, o;
  const t = ((s = e == null ? void 0 : e.subGraphTitleMargin) == null ? void 0 : s.top) ?? 0, r = ((o = e == null ? void 0 : e.subGraphTitleMargin) == null ? void 0 : o.bottom) ?? 0, i = t + r;
  return {
    subGraphTitleTopMargin: t,
    subGraphTitleBottomMargin: r,
    subGraphTitleTotalMargin: i
  };
}, "getSubGraphTitleMargins");
async function Ag(e, t) {
  const r = e.getElementsByTagName("img");
  if (!r || r.length === 0)
    return;
  const i = t.replace(/<img[^>]*>/g, "").trim() === "";
  await Promise.all(
    [...r].map(
      (s) => new Promise((o) => {
        function a() {
          if (s.style.display = "flex", s.style.flexDirection = "column", i) {
            const n = _t().fontSize ? _t().fontSize : window.getComputedStyle(document.body).fontSize, l = 5, [h = Cd.fontSize] = ya(n), c = h * l + "px";
            s.style.minWidth = c, s.style.maxWidth = c;
          } else
            s.style.width = "100%";
          o(s);
        }
        g(a, "setupImage"), setTimeout(() => {
          s.complete && a();
        }), s.addEventListener("error", a), s.addEventListener("load", a);
      })
    )
  );
}
g(Ag, "configureLabelImages");
const RT = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16
}), jo = Object.freeze({
  rotate: 0,
  vFlip: !1,
  hFlip: !1
}), Fg = Object.freeze({
  ...RT,
  ...jo
}), PT = Object.freeze({
  ...Fg,
  body: "",
  hidden: !1
}), NT = Object.freeze({
  width: null,
  height: null
}), qT = Object.freeze({
  ...NT,
  ...jo
}), WT = (e, t, r, i = "") => {
  const s = e.split(":");
  if (e.slice(0, 1) === "@") {
    if (s.length < 2 || s.length > 3) return null;
    i = s.shift().slice(1);
  }
  if (s.length > 3 || !s.length) return null;
  if (s.length > 1) {
    const n = s.pop(), l = s.pop(), h = {
      provider: s.length > 0 ? s[0] : i,
      prefix: l,
      name: n
    };
    return sn(h) ? h : null;
  }
  const o = s[0], a = o.split("-");
  if (a.length > 1) {
    const n = {
      provider: i,
      prefix: a.shift(),
      name: a.join("-")
    };
    return sn(n) ? n : null;
  }
  if (r && i === "") {
    const n = {
      provider: i,
      prefix: "",
      name: o
    };
    return sn(n, r) ? n : null;
  }
  return null;
}, sn = (e, t) => e ? !!((t && e.prefix === "" || e.prefix) && e.name) : !1;
function zT(e, t) {
  const r = {};
  !e.hFlip != !t.hFlip && (r.hFlip = !0), !e.vFlip != !t.vFlip && (r.vFlip = !0);
  const i = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return i && (r.rotate = i), r;
}
function Qc(e, t) {
  const r = zT(e, t);
  for (const i in PT) i in jo ? i in e && !(i in r) && (r[i] = jo[i]) : i in t ? r[i] = t[i] : i in e && (r[i] = e[i]);
  return r;
}
function HT(e, t) {
  const r = e.icons, i = e.aliases || /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  function o(a) {
    if (r[a]) return s[a] = [];
    if (!(a in s)) {
      s[a] = null;
      const n = i[a] && i[a].parent, l = n && o(n);
      l && (s[a] = [n].concat(l));
    }
    return s[a];
  }
  return (t || Object.keys(r).concat(Object.keys(i))).forEach(o), s;
}
function Jc(e, t, r) {
  const i = e.icons, s = e.aliases || /* @__PURE__ */ Object.create(null);
  let o = {};
  function a(n) {
    o = Qc(i[n] || s[n], o);
  }
  return a(t), r.forEach(a), Qc(e, o);
}
function YT(e, t) {
  if (e.icons[t]) return Jc(e, t, []);
  const r = HT(e, [t])[t];
  return r ? Jc(e, t, r) : null;
}
const UT = /(-?[0-9.]*[0-9]+[0-9.]*)/g, XT = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function tu(e, t, r) {
  if (t === 1) return e;
  if (r = r || 100, typeof e == "number") return Math.ceil(e * t * r) / r;
  if (typeof e != "string") return e;
  const i = e.split(UT);
  if (i === null || !i.length) return e;
  const s = [];
  let o = i.shift(), a = XT.test(o);
  for (; ; ) {
    if (a) {
      const n = parseFloat(o);
      isNaN(n) ? s.push(o) : s.push(Math.ceil(n * t * r) / r);
    } else s.push(o);
    if (o = i.shift(), o === void 0) return s.join("");
    a = !a;
  }
}
function GT(e, t = "defs") {
  let r = "";
  const i = e.indexOf("<" + t);
  for (; i >= 0; ) {
    const s = e.indexOf(">", i), o = e.indexOf("</" + t);
    if (s === -1 || o === -1) break;
    const a = e.indexOf(">", o);
    if (a === -1) break;
    r += e.slice(s + 1, o).trim(), e = e.slice(0, i).trim() + e.slice(a + 1);
  }
  return {
    defs: r,
    content: e
  };
}
function jT(e, t) {
  return e ? "<defs>" + e + "</defs>" + t : t;
}
function VT(e, t, r) {
  const i = GT(e);
  return jT(i.defs, t + i.content + r);
}
const ZT = (e) => e === "unset" || e === "undefined" || e === "none";
function KT(e, t) {
  const r = {
    ...Fg,
    ...e
  }, i = {
    ...qT,
    ...t
  }, s = {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height
  };
  let o = r.body;
  [r, i].forEach((m) => {
    const y = [], x = m.hFlip, C = m.vFlip;
    let k = m.rotate;
    x ? C ? k += 2 : (y.push("translate(" + (s.width + s.left).toString() + " " + (0 - s.top).toString() + ")"), y.push("scale(-1 1)"), s.top = s.left = 0) : C && (y.push("translate(" + (0 - s.left).toString() + " " + (s.height + s.top).toString() + ")"), y.push("scale(1 -1)"), s.top = s.left = 0);
    let w;
    switch (k < 0 && (k -= Math.floor(k / 4) * 4), k = k % 4, k) {
      case 1:
        w = s.height / 2 + s.top, y.unshift("rotate(90 " + w.toString() + " " + w.toString() + ")");
        break;
      case 2:
        y.unshift("rotate(180 " + (s.width / 2 + s.left).toString() + " " + (s.height / 2 + s.top).toString() + ")");
        break;
      case 3:
        w = s.width / 2 + s.left, y.unshift("rotate(-90 " + w.toString() + " " + w.toString() + ")");
        break;
    }
    k % 2 === 1 && (s.left !== s.top && (w = s.left, s.left = s.top, s.top = w), s.width !== s.height && (w = s.width, s.width = s.height, s.height = w)), y.length && (o = VT(o, '<g transform="' + y.join(" ") + '">', "</g>"));
  });
  const a = i.width, n = i.height, l = s.width, h = s.height;
  let c, u;
  a === null ? (u = n === null ? "1em" : n === "auto" ? h : n, c = tu(u, l / h)) : (c = a === "auto" ? l : a, u = n === null ? tu(c, h / l) : n === "auto" ? h : n);
  const f = {}, d = (m, y) => {
    ZT(y) || (f[m] = y.toString());
  };
  d("width", c), d("height", u);
  const p = [
    s.left,
    s.top,
    l,
    h
  ];
  return f.viewBox = p.join(" "), {
    attributes: f,
    viewBox: p,
    body: o
  };
}
const QT = /\sid="(\S+)"/g, eu = /* @__PURE__ */ new Map();
function JT(e) {
  e = e.replace(/[0-9]+$/, "") || "a";
  const t = eu.get(e) || 0;
  return eu.set(e, t + 1), t ? `${e}${t}` : e;
}
function t_(e) {
  const t = [];
  let r;
  for (; r = QT.exec(e); ) t.push(r[1]);
  if (!t.length) return e;
  const i = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  return t.forEach((s) => {
    const o = JT(s), a = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    e = e.replace(new RegExp('([#;"])(' + a + ')([")]|\\.[a-z])', "g"), "$1" + o + i + "$3");
  }), e = e.replace(new RegExp(i, "g"), ""), e;
}
function e_(e, t) {
  let r = e.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const i in t) r += " " + i + '="' + t[i] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + r + ">" + e + "</svg>";
}
var r_ = {
  body: '<g><rect width="80" height="80" style="fill: #087ebf; stroke-width: 0px;"/><text transform="translate(21.16 64.67)" style="fill: #fff; font-family: ArialMT, Arial; font-size: 67.75px;"><tspan x="0" y="0">?</tspan></text></g>',
  height: 80,
  width: 80
}, el = /* @__PURE__ */ new Map(), Eg = /* @__PURE__ */ new Map(), i_ = /* @__PURE__ */ g((e) => {
  for (const t of e) {
    if (!t.name)
      throw new Error(
        'Invalid icon loader. Must have a "name" property with non-empty string value.'
      );
    if (H.debug("Registering icon pack:", t.name), "loader" in t)
      Eg.set(t.name, t.loader);
    else if ("icons" in t)
      el.set(t.name, t.icons);
    else
      throw H.error("Invalid icon loader:", t), new Error('Invalid icon loader. Must have either "icons" or "loader" property.');
  }
}, "registerIconPacks"), Mg = /* @__PURE__ */ g(async (e, t) => {
  const r = WT(e, !0, t !== void 0);
  if (!r)
    throw new Error(`Invalid icon name: ${e}`);
  const i = r.prefix || t;
  if (!i)
    throw new Error(`Icon name must contain a prefix: ${e}`);
  let s = el.get(i);
  if (!s) {
    const a = Eg.get(i);
    if (!a)
      throw new Error(`Icon set not found: ${r.prefix}`);
    try {
      s = { ...await a(), prefix: i }, el.set(i, s);
    } catch (n) {
      throw H.error(n), new Error(`Failed to load icon set: ${r.prefix}`);
    }
  }
  const o = YT(s, r.name);
  if (!o)
    throw new Error(`Icon not found: ${e}`);
  return o;
}, "getRegisteredIconData"), s_ = /* @__PURE__ */ g(async (e) => {
  try {
    return await Mg(e), !0;
  } catch {
    return !1;
  }
}, "isIconAvailable"), Ws = /* @__PURE__ */ g(async (e, t, r) => {
  let i;
  try {
    i = await Mg(e, t == null ? void 0 : t.fallbackPrefix);
  } catch (a) {
    H.error(a), i = r_;
  }
  const s = KT(i, t), o = e_(t_(s.body), {
    ...s.attributes,
    ...r
  });
  return $e(o, $t());
}, "getIconSVG");
function uh() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Kr = uh();
function $g(e) {
  Kr = e;
}
var xs = { exec: () => null };
function vt(e, t = "") {
  let r = typeof e == "string" ? e : e.source, i = { replace: (s, o) => {
    let a = typeof o == "string" ? o : o.source;
    return a = a.replace(ae.caret, "$1"), r = r.replace(s, a), i;
  }, getRegex: () => new RegExp(r, t) };
  return i;
}
var o_ = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ae = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i") }, a_ = /^(?:[ \t]*(?:\n|$))+/, n_ = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, l_ = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, zs = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, h_ = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, dh = /(?:[*+-]|\d{1,9}[.)])/, Og = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ig = vt(Og).replace(/bull/g, dh).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), c_ = vt(Og).replace(/bull/g, dh).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), fh = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, u_ = /^[^\n]+/, ph = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, d_ = vt(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ph).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), f_ = vt(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, dh).getRegex(), xa = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", gh = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, p_ = vt("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", gh).replace("tag", xa).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Dg = vt(fh).replace("hr", zs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", xa).getRegex(), g_ = vt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Dg).getRegex(), mh = { blockquote: g_, code: n_, def: d_, fences: l_, heading: h_, hr: zs, html: p_, lheading: Ig, list: f_, newline: a_, paragraph: Dg, table: xs, text: u_ }, ru = vt("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", zs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", xa).getRegex(), m_ = { ...mh, lheading: c_, table: ru, paragraph: vt(fh).replace("hr", zs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ru).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", xa).getRegex() }, y_ = { ...mh, html: vt(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", gh).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: xs, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: vt(fh).replace("hr", zs).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ig).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, x_ = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, C_ = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Rg = /^( {2,}|\\)\n(?!\s*$)/, b_ = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ca = /[\p{P}\p{S}]/u, yh = /[\s\p{P}\p{S}]/u, Pg = /[^\s\p{P}\p{S}]/u, k_ = vt(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, yh).getRegex(), Ng = /(?!~)[\p{P}\p{S}]/u, S_ = /(?!~)[\s\p{P}\p{S}]/u, w_ = /(?:[^\s\p{P}\p{S}]|~)/u, T_ = vt(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", o_ ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), qg = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, __ = vt(qg, "u").replace(/punct/g, Ca).getRegex(), B_ = vt(qg, "u").replace(/punct/g, Ng).getRegex(), Wg = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", v_ = vt(Wg, "gu").replace(/notPunctSpace/g, Pg).replace(/punctSpace/g, yh).replace(/punct/g, Ca).getRegex(), L_ = vt(Wg, "gu").replace(/notPunctSpace/g, w_).replace(/punctSpace/g, S_).replace(/punct/g, Ng).getRegex(), A_ = vt("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Pg).replace(/punctSpace/g, yh).replace(/punct/g, Ca).getRegex(), F_ = vt(/\\(punct)/, "gu").replace(/punct/g, Ca).getRegex(), E_ = vt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), M_ = vt(gh).replace("(?:-->|$)", "-->").getRegex(), $_ = vt("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", M_).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Vo = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, O_ = vt(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Vo).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), zg = vt(/^!?\[(label)\]\[(ref)\]/).replace("label", Vo).replace("ref", ph).getRegex(), Hg = vt(/^!?\[(ref)\](?:\[\])?/).replace("ref", ph).getRegex(), I_ = vt("reflink|nolink(?!\\()", "g").replace("reflink", zg).replace("nolink", Hg).getRegex(), iu = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, xh = { _backpedal: xs, anyPunctuation: F_, autolink: E_, blockSkip: T_, br: Rg, code: C_, del: xs, emStrongLDelim: __, emStrongRDelimAst: v_, emStrongRDelimUnd: A_, escape: x_, link: O_, nolink: Hg, punctuation: k_, reflink: zg, reflinkSearch: I_, tag: $_, text: b_, url: xs }, D_ = { ...xh, link: vt(/^!?\[(label)\]\((.*?)\)/).replace("label", Vo).getRegex(), reflink: vt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Vo).getRegex() }, rl = { ...xh, emStrongRDelimAst: L_, emStrongLDelim: B_, url: vt(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", iu).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: vt(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", iu).getRegex() }, R_ = { ...rl, br: vt(Rg).replace("{2,}", "*").getRegex(), text: vt(rl.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, oo = { normal: mh, gfm: m_, pedantic: y_ }, Ki = { normal: xh, gfm: rl, breaks: R_, pedantic: D_ }, P_ = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, su = (e) => P_[e];
function qe(e, t) {
  if (t) {
    if (ae.escapeTest.test(e)) return e.replace(ae.escapeReplace, su);
  } else if (ae.escapeTestNoEncode.test(e)) return e.replace(ae.escapeReplaceNoEncode, su);
  return e;
}
function ou(e) {
  try {
    e = encodeURI(e).replace(ae.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function au(e, t) {
  var o;
  let r = e.replace(ae.findPipe, (a, n, l) => {
    let h = !1, c = n;
    for (; --c >= 0 && l[c] === "\\"; ) h = !h;
    return h ? "|" : " |";
  }), i = r.split(ae.splitPipe), s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !((o = i.at(-1)) != null && o.trim()) && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; s < i.length; s++) i[s] = i[s].trim().replace(ae.slashPipe, "|");
  return i;
}
function Qi(e, t, r) {
  let i = e.length;
  if (i === 0) return "";
  let s = 0;
  for (; s < i && e.charAt(i - s - 1) === t; )
    s++;
  return e.slice(0, i - s);
}
function N_(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) r++;
  else if (e[i] === t[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function nu(e, t, r, i, s) {
  let o = t.href, a = t.title || null, n = e[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: r, href: o, title: a, text: n, tokens: i.inlineTokens(n) };
  return i.state.inLink = !1, l;
}
function q_(e, t, r) {
  let i = e.match(r.other.indentCodeCompensation);
  if (i === null) return t;
  let s = i[1];
  return t.split(`
`).map((o) => {
    let a = o.match(r.other.beginningSpace);
    if (a === null) return o;
    let [n] = a;
    return n.length >= s.length ? o.slice(s.length) : o;
  }).join(`
`);
}
var Zo = class {
  constructor(t) {
    Ft(this, "options");
    Ft(this, "rules");
    Ft(this, "lexer");
    this.options = t || Kr;
  }
  space(t) {
    let r = this.rules.block.newline.exec(t);
    if (r && r[0].length > 0) return { type: "space", raw: r[0] };
  }
  code(t) {
    let r = this.rules.block.code.exec(t);
    if (r) {
      let i = r[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r[0], codeBlockStyle: "indented", text: this.options.pedantic ? i : Qi(i, `
`) };
    }
  }
  fences(t) {
    let r = this.rules.block.fences.exec(t);
    if (r) {
      let i = r[0], s = q_(i, r[3] || "", this.rules);
      return { type: "code", raw: i, lang: r[2] ? r[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : r[2], text: s };
    }
  }
  heading(t) {
    let r = this.rules.block.heading.exec(t);
    if (r) {
      let i = r[2].trim();
      if (this.rules.other.endingHash.test(i)) {
        let s = Qi(i, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (i = s.trim());
      }
      return { type: "heading", raw: r[0], depth: r[1].length, text: i, tokens: this.lexer.inline(i) };
    }
  }
  hr(t) {
    let r = this.rules.block.hr.exec(t);
    if (r) return { type: "hr", raw: Qi(r[0], `
`) };
  }
  blockquote(t) {
    let r = this.rules.block.blockquote.exec(t);
    if (r) {
      let i = Qi(r[0], `
`).split(`
`), s = "", o = "", a = [];
      for (; i.length > 0; ) {
        let n = !1, l = [], h;
        for (h = 0; h < i.length; h++) if (this.rules.other.blockquoteStart.test(i[h])) l.push(i[h]), n = !0;
        else if (!n) l.push(i[h]);
        else break;
        i = i.slice(h);
        let c = l.join(`
`), u = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${c}` : c, o = o ? `${o}
${u}` : u;
        let f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = f, i.length === 0) break;
        let d = a.at(-1);
        if ((d == null ? void 0 : d.type) === "code") break;
        if ((d == null ? void 0 : d.type) === "blockquote") {
          let p = d, m = p.raw + `
` + i.join(`
`), y = this.blockquote(m);
          a[a.length - 1] = y, s = s.substring(0, s.length - p.raw.length) + y.raw, o = o.substring(0, o.length - p.text.length) + y.text;
          break;
        } else if ((d == null ? void 0 : d.type) === "list") {
          let p = d, m = p.raw + `
` + i.join(`
`), y = this.list(m);
          a[a.length - 1] = y, s = s.substring(0, s.length - d.raw.length) + y.raw, o = o.substring(0, o.length - p.raw.length) + y.raw, i = m.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: a, text: o };
    }
  }
  list(t) {
    let r = this.rules.block.list.exec(t);
    if (r) {
      let i = r[1].trim(), s = i.length > 1, o = { type: "list", raw: "", ordered: s, start: s ? +i.slice(0, -1) : "", loose: !1, items: [] };
      i = s ? `\\d{1,9}\\${i.slice(-1)}` : `\\${i}`, this.options.pedantic && (i = s ? i : "[*+-]");
      let a = this.rules.other.listItemRegex(i), n = !1;
      for (; t; ) {
        let h = !1, c = "", u = "";
        if (!(r = a.exec(t)) || this.rules.block.hr.test(t)) break;
        c = r[0], t = t.substring(c.length);
        let f = r[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (C) => " ".repeat(3 * C.length)), d = t.split(`
`, 1)[0], p = !f.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, u = f.trimStart()) : p ? m = r[1].length + 1 : (m = r[2].search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, u = f.slice(m), m += r[1].length), p && this.rules.other.blankLine.test(d) && (c += d + `
`, t = t.substring(d.length + 1), h = !0), !h) {
          let C = this.rules.other.nextBulletRegex(m), k = this.rules.other.hrRegex(m), w = this.rules.other.fencesBeginRegex(m), T = this.rules.other.headingBeginRegex(m), _ = this.rules.other.htmlBeginRegex(m);
          for (; t; ) {
            let v = t.split(`
`, 1)[0], L;
            if (d = v, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), L = d) : L = d.replace(this.rules.other.tabCharGlobal, "    "), w.test(d) || T.test(d) || _.test(d) || C.test(d) || k.test(d)) break;
            if (L.search(this.rules.other.nonSpaceChar) >= m || !d.trim()) u += `
` + L.slice(m);
            else {
              if (p || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || w.test(f) || T.test(f) || k.test(f)) break;
              u += `
` + d;
            }
            !p && !d.trim() && (p = !0), c += v + `
`, t = t.substring(v.length + 1), f = L.slice(m);
          }
        }
        o.loose || (n ? o.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (n = !0));
        let y = null, x;
        this.options.gfm && (y = this.rules.other.listIsTask.exec(u), y && (x = y[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), o.items.push({ type: "list_item", raw: c, task: !!y, checked: x, loose: !1, text: u, tokens: [] }), o.raw += c;
      }
      let l = o.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      o.raw = o.raw.trimEnd();
      for (let h = 0; h < o.items.length; h++) if (this.lexer.state.top = !1, o.items[h].tokens = this.lexer.blockTokens(o.items[h].text, []), !o.loose) {
        let c = o.items[h].tokens.filter((f) => f.type === "space"), u = c.length > 0 && c.some((f) => this.rules.other.anyLine.test(f.raw));
        o.loose = u;
      }
      if (o.loose) for (let h = 0; h < o.items.length; h++) o.items[h].loose = !0;
      return o;
    }
  }
  html(t) {
    let r = this.rules.block.html.exec(t);
    if (r) return { type: "html", block: !0, raw: r[0], pre: r[1] === "pre" || r[1] === "script" || r[1] === "style", text: r[0] };
  }
  def(t) {
    let r = this.rules.block.def.exec(t);
    if (r) {
      let i = r[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = r[2] ? r[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", o = r[3] ? r[3].substring(1, r[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : r[3];
      return { type: "def", tag: i, raw: r[0], href: s, title: o };
    }
  }
  table(t) {
    var n;
    let r = this.rules.block.table.exec(t);
    if (!r || !this.rules.other.tableDelimiter.test(r[2])) return;
    let i = au(r[1]), s = r[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = (n = r[3]) != null && n.trim() ? r[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: r[0], header: [], align: [], rows: [] };
    if (i.length === s.length) {
      for (let l of s) this.rules.other.tableAlignRight.test(l) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? a.align.push("left") : a.align.push(null);
      for (let l = 0; l < i.length; l++) a.header.push({ text: i[l], tokens: this.lexer.inline(i[l]), header: !0, align: a.align[l] });
      for (let l of o) a.rows.push(au(l, a.header.length).map((h, c) => ({ text: h, tokens: this.lexer.inline(h), header: !1, align: a.align[c] })));
      return a;
    }
  }
  lheading(t) {
    let r = this.rules.block.lheading.exec(t);
    if (r) return { type: "heading", raw: r[0], depth: r[2].charAt(0) === "=" ? 1 : 2, text: r[1], tokens: this.lexer.inline(r[1]) };
  }
  paragraph(t) {
    let r = this.rules.block.paragraph.exec(t);
    if (r) {
      let i = r[1].charAt(r[1].length - 1) === `
` ? r[1].slice(0, -1) : r[1];
      return { type: "paragraph", raw: r[0], text: i, tokens: this.lexer.inline(i) };
    }
  }
  text(t) {
    let r = this.rules.block.text.exec(t);
    if (r) return { type: "text", raw: r[0], text: r[0], tokens: this.lexer.inline(r[0]) };
  }
  escape(t) {
    let r = this.rules.inline.escape.exec(t);
    if (r) return { type: "escape", raw: r[0], text: r[1] };
  }
  tag(t) {
    let r = this.rules.inline.tag.exec(t);
    if (r) return !this.lexer.state.inLink && this.rules.other.startATag.test(r[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(r[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(r[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(r[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: r[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: r[0] };
  }
  link(t) {
    let r = this.rules.inline.link.exec(t);
    if (r) {
      let i = r[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(i)) {
        if (!this.rules.other.endAngleBracket.test(i)) return;
        let a = Qi(i.slice(0, -1), "\\");
        if ((i.length - a.length) % 2 === 0) return;
      } else {
        let a = N_(r[2], "()");
        if (a === -2) return;
        if (a > -1) {
          let n = (r[0].indexOf("!") === 0 ? 5 : 4) + r[1].length + a;
          r[2] = r[2].substring(0, a), r[0] = r[0].substring(0, n).trim(), r[3] = "";
        }
      }
      let s = r[2], o = "";
      if (this.options.pedantic) {
        let a = this.rules.other.pedanticHrefTitle.exec(s);
        a && (s = a[1], o = a[3]);
      } else o = r[3] ? r[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? s = s.slice(1) : s = s.slice(1, -1)), nu(r, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: o && o.replace(this.rules.inline.anyPunctuation, "$1") }, r[0], this.lexer, this.rules);
    }
  }
  reflink(t, r) {
    let i;
    if ((i = this.rules.inline.reflink.exec(t)) || (i = this.rules.inline.nolink.exec(t))) {
      let s = (i[2] || i[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = r[s.toLowerCase()];
      if (!o) {
        let a = i[0].charAt(0);
        return { type: "text", raw: a, text: a };
      }
      return nu(i, o, i[0], this.lexer, this.rules);
    }
  }
  emStrong(t, r, i = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && i.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !i || this.rules.inline.punctuation.exec(i))) {
      let o = [...s[0]].length - 1, a, n, l = o, h = 0, c = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, r = r.slice(-1 * t.length + o); (s = c.exec(r)) != null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a) continue;
        if (n = [...a].length, s[3] || s[4]) {
          l += n;
          continue;
        } else if ((s[5] || s[6]) && o % 3 && !((o + n) % 3)) {
          h += n;
          continue;
        }
        if (l -= n, l > 0) continue;
        n = Math.min(n, n + l + h);
        let u = [...s[0]][0].length, f = t.slice(0, o + s.index + u + n);
        if (Math.min(o, n) % 2) {
          let p = f.slice(1, -1);
          return { type: "em", raw: f, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let d = f.slice(2, -2);
        return { type: "strong", raw: f, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  codespan(t) {
    let r = this.rules.inline.code.exec(t);
    if (r) {
      let i = r[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(i), o = this.rules.other.startingSpaceChar.test(i) && this.rules.other.endingSpaceChar.test(i);
      return s && o && (i = i.substring(1, i.length - 1)), { type: "codespan", raw: r[0], text: i };
    }
  }
  br(t) {
    let r = this.rules.inline.br.exec(t);
    if (r) return { type: "br", raw: r[0] };
  }
  del(t) {
    let r = this.rules.inline.del.exec(t);
    if (r) return { type: "del", raw: r[0], text: r[2], tokens: this.lexer.inlineTokens(r[2]) };
  }
  autolink(t) {
    let r = this.rules.inline.autolink.exec(t);
    if (r) {
      let i, s;
      return r[2] === "@" ? (i = r[1], s = "mailto:" + i) : (i = r[1], s = i), { type: "link", raw: r[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  url(t) {
    var i;
    let r;
    if (r = this.rules.inline.url.exec(t)) {
      let s, o;
      if (r[2] === "@") s = r[0], o = "mailto:" + s;
      else {
        let a;
        do
          a = r[0], r[0] = ((i = this.rules.inline._backpedal.exec(r[0])) == null ? void 0 : i[0]) ?? "";
        while (a !== r[0]);
        s = r[0], r[1] === "www." ? o = "http://" + r[0] : o = r[0];
      }
      return { type: "link", raw: r[0], text: s, href: o, tokens: [{ type: "text", raw: s, text: s }] };
    }
  }
  inlineText(t) {
    let r = this.rules.inline.text.exec(t);
    if (r) {
      let i = this.lexer.state.inRawBlock;
      return { type: "text", raw: r[0], text: r[0], escaped: i };
    }
  }
}, ve = class il {
  constructor(t) {
    Ft(this, "tokens");
    Ft(this, "options");
    Ft(this, "state");
    Ft(this, "tokenizer");
    Ft(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Kr, this.options.tokenizer = this.options.tokenizer || new Zo(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: ae, block: oo.normal, inline: Ki.normal };
    this.options.pedantic ? (r.block = oo.pedantic, r.inline = Ki.pedantic) : this.options.gfm && (r.block = oo.gfm, this.options.breaks ? r.inline = Ki.breaks : r.inline = Ki.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: oo, inline: Ki };
  }
  static lex(t, r) {
    return new il(r).lex(t);
  }
  static lexInline(t, r) {
    return new il(r).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(ae.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, r = [], i = !1) {
    var s, o, a;
    for (this.options.pedantic && (t = t.replace(ae.tabCharGlobal, "    ").replace(ae.spaceLine, "")); t; ) {
      let n;
      if ((o = (s = this.options.extensions) == null ? void 0 : s.block) != null && o.some((h) => (n = h.call({ lexer: this }, t, r)) ? (t = t.substring(n.raw.length), r.push(n), !0) : !1)) continue;
      if (n = this.tokenizer.space(t)) {
        t = t.substring(n.raw.length);
        let h = r.at(-1);
        n.raw.length === 1 && h !== void 0 ? h.raw += `
` : r.push(n);
        continue;
      }
      if (n = this.tokenizer.code(t)) {
        t = t.substring(n.raw.length);
        let h = r.at(-1);
        (h == null ? void 0 : h.type) === "paragraph" || (h == null ? void 0 : h.type) === "text" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + n.raw, h.text += `
` + n.text, this.inlineQueue.at(-1).src = h.text) : r.push(n);
        continue;
      }
      if (n = this.tokenizer.fences(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.heading(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.hr(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.blockquote(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.list(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.html(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.def(t)) {
        t = t.substring(n.raw.length);
        let h = r.at(-1);
        (h == null ? void 0 : h.type) === "paragraph" || (h == null ? void 0 : h.type) === "text" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + n.raw, h.text += `
` + n.raw, this.inlineQueue.at(-1).src = h.text) : this.tokens.links[n.tag] || (this.tokens.links[n.tag] = { href: n.href, title: n.title }, r.push(n));
        continue;
      }
      if (n = this.tokenizer.table(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      if (n = this.tokenizer.lheading(t)) {
        t = t.substring(n.raw.length), r.push(n);
        continue;
      }
      let l = t;
      if ((a = this.options.extensions) != null && a.startBlock) {
        let h = 1 / 0, c = t.slice(1), u;
        this.options.extensions.startBlock.forEach((f) => {
          u = f.call({ lexer: this }, c), typeof u == "number" && u >= 0 && (h = Math.min(h, u));
        }), h < 1 / 0 && h >= 0 && (l = t.substring(0, h + 1));
      }
      if (this.state.top && (n = this.tokenizer.paragraph(l))) {
        let h = r.at(-1);
        i && (h == null ? void 0 : h.type) === "paragraph" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + n.raw, h.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = h.text) : r.push(n), i = l.length !== t.length, t = t.substring(n.raw.length);
        continue;
      }
      if (n = this.tokenizer.text(t)) {
        t = t.substring(n.raw.length);
        let h = r.at(-1);
        (h == null ? void 0 : h.type) === "text" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + n.raw, h.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = h.text) : r.push(n);
        continue;
      }
      if (t) {
        let h = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return this.state.top = !0, r;
  }
  inline(t, r = []) {
    return this.inlineQueue.push({ src: t, tokens: r }), r;
  }
  inlineTokens(t, r = []) {
    var l, h, c, u, f;
    let i = t, s = null;
    if (this.tokens.links) {
      let d = Object.keys(this.tokens.links);
      if (d.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) d.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let o;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) o = s[2] ? s[2].length : 0, i = i.slice(0, s.index + o) + "[" + "a".repeat(s[0].length - o - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = ((h = (l = this.options.hooks) == null ? void 0 : l.emStrongMask) == null ? void 0 : h.call({ lexer: this }, i)) ?? i;
    let a = !1, n = "";
    for (; t; ) {
      a || (n = ""), a = !1;
      let d;
      if ((u = (c = this.options.extensions) == null ? void 0 : c.inline) != null && u.some((m) => (d = m.call({ lexer: this }, t, r)) ? (t = t.substring(d.raw.length), r.push(d), !0) : !1)) continue;
      if (d = this.tokenizer.escape(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.tag(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.link(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(d.raw.length);
        let m = r.at(-1);
        d.type === "text" && (m == null ? void 0 : m.type) === "text" ? (m.raw += d.raw, m.text += d.text) : r.push(d);
        continue;
      }
      if (d = this.tokenizer.emStrong(t, i, n)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.codespan(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.br(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.del(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (d = this.tokenizer.autolink(t)) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      if (!this.state.inLink && (d = this.tokenizer.url(t))) {
        t = t.substring(d.raw.length), r.push(d);
        continue;
      }
      let p = t;
      if ((f = this.options.extensions) != null && f.startInline) {
        let m = 1 / 0, y = t.slice(1), x;
        this.options.extensions.startInline.forEach((C) => {
          x = C.call({ lexer: this }, y), typeof x == "number" && x >= 0 && (m = Math.min(m, x));
        }), m < 1 / 0 && m >= 0 && (p = t.substring(0, m + 1));
      }
      if (d = this.tokenizer.inlineText(p)) {
        t = t.substring(d.raw.length), d.raw.slice(-1) !== "_" && (n = d.raw.slice(-1)), a = !0;
        let m = r.at(-1);
        (m == null ? void 0 : m.type) === "text" ? (m.raw += d.raw, m.text += d.text) : r.push(d);
        continue;
      }
      if (t) {
        let m = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(m);
          break;
        } else throw new Error(m);
      }
    }
    return r;
  }
}, Ko = class {
  constructor(t) {
    Ft(this, "options");
    Ft(this, "parser");
    this.options = t || Kr;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: r, escaped: i }) {
    var a;
    let s = (a = (r || "").match(ae.notSpaceStart)) == null ? void 0 : a[0], o = t.replace(ae.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + qe(s) + '">' + (i ? o : qe(o, !0)) + `</code></pre>
` : "<pre><code>" + (i ? o : qe(o, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: r }) {
    return `<h${r}>${this.parser.parseInline(t)}</h${r}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let r = t.ordered, i = t.start, s = "";
    for (let n = 0; n < t.items.length; n++) {
      let l = t.items[n];
      s += this.listitem(l);
    }
    let o = r ? "ol" : "ul", a = r && i !== 1 ? ' start="' + i + '"' : "";
    return "<" + o + a + `>
` + s + "</" + o + `>
`;
  }
  listitem(t) {
    var i;
    let r = "";
    if (t.task) {
      let s = this.checkbox({ checked: !!t.checked });
      t.loose ? ((i = t.tokens[0]) == null ? void 0 : i.type) === "paragraph" ? (t.tokens[0].text = s + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = s + " " + qe(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: s + " ", text: s + " ", escaped: !0 }) : r += s + " ";
    }
    return r += this.parser.parse(t.tokens, !!t.loose), `<li>${r}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let r = "", i = "";
    for (let o = 0; o < t.header.length; o++) i += this.tablecell(t.header[o]);
    r += this.tablerow({ text: i });
    let s = "";
    for (let o = 0; o < t.rows.length; o++) {
      let a = t.rows[o];
      i = "";
      for (let n = 0; n < a.length; n++) i += this.tablecell(a[n]);
      s += this.tablerow({ text: i });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + r + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let r = this.parser.parseInline(t.tokens), i = t.header ? "th" : "td";
    return (t.align ? `<${i} align="${t.align}">` : `<${i}>`) + r + `</${i}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${qe(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: r, tokens: i }) {
    let s = this.parser.parseInline(i), o = ou(t);
    if (o === null) return s;
    t = o;
    let a = '<a href="' + t + '"';
    return r && (a += ' title="' + qe(r) + '"'), a += ">" + s + "</a>", a;
  }
  image({ href: t, title: r, text: i, tokens: s }) {
    s && (i = this.parser.parseInline(s, this.parser.textRenderer));
    let o = ou(t);
    if (o === null) return qe(i);
    t = o;
    let a = `<img src="${t}" alt="${i}"`;
    return r && (a += ` title="${qe(r)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : qe(t.text);
  }
}, Ch = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
}, Le = class sl {
  constructor(t) {
    Ft(this, "options");
    Ft(this, "renderer");
    Ft(this, "textRenderer");
    this.options = t || Kr, this.options.renderer = this.options.renderer || new Ko(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ch();
  }
  static parse(t, r) {
    return new sl(r).parse(t);
  }
  static parseInline(t, r) {
    return new sl(r).parseInline(t);
  }
  parse(t, r = !0) {
    var s, o;
    let i = "";
    for (let a = 0; a < t.length; a++) {
      let n = t[a];
      if ((o = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && o[n.type]) {
        let h = n, c = this.options.extensions.renderers[h.type].call({ parser: this }, h);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(h.type)) {
          i += c || "";
          continue;
        }
      }
      let l = n;
      switch (l.type) {
        case "space": {
          i += this.renderer.space(l);
          continue;
        }
        case "hr": {
          i += this.renderer.hr(l);
          continue;
        }
        case "heading": {
          i += this.renderer.heading(l);
          continue;
        }
        case "code": {
          i += this.renderer.code(l);
          continue;
        }
        case "table": {
          i += this.renderer.table(l);
          continue;
        }
        case "blockquote": {
          i += this.renderer.blockquote(l);
          continue;
        }
        case "list": {
          i += this.renderer.list(l);
          continue;
        }
        case "html": {
          i += this.renderer.html(l);
          continue;
        }
        case "def": {
          i += this.renderer.def(l);
          continue;
        }
        case "paragraph": {
          i += this.renderer.paragraph(l);
          continue;
        }
        case "text": {
          let h = l, c = this.renderer.text(h);
          for (; a + 1 < t.length && t[a + 1].type === "text"; ) h = t[++a], c += `
` + this.renderer.text(h);
          r ? i += this.renderer.paragraph({ type: "paragraph", raw: c, text: c, tokens: [{ type: "text", raw: c, text: c, escaped: !0 }] }) : i += c;
          continue;
        }
        default: {
          let h = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(h), "";
          throw new Error(h);
        }
      }
    }
    return i;
  }
  parseInline(t, r = this.renderer) {
    var s, o;
    let i = "";
    for (let a = 0; a < t.length; a++) {
      let n = t[a];
      if ((o = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && o[n.type]) {
        let h = this.options.extensions.renderers[n.type].call({ parser: this }, n);
        if (h !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(n.type)) {
          i += h || "";
          continue;
        }
      }
      let l = n;
      switch (l.type) {
        case "escape": {
          i += r.text(l);
          break;
        }
        case "html": {
          i += r.html(l);
          break;
        }
        case "link": {
          i += r.link(l);
          break;
        }
        case "image": {
          i += r.image(l);
          break;
        }
        case "strong": {
          i += r.strong(l);
          break;
        }
        case "em": {
          i += r.em(l);
          break;
        }
        case "codespan": {
          i += r.codespan(l);
          break;
        }
        case "br": {
          i += r.br(l);
          break;
        }
        case "del": {
          i += r.del(l);
          break;
        }
        case "text": {
          i += r.text(l);
          break;
        }
        default: {
          let h = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(h), "";
          throw new Error(h);
        }
      }
    }
    return i;
  }
}, fo, hs = (fo = class {
  constructor(t) {
    Ft(this, "options");
    Ft(this, "block");
    this.options = t || Kr;
  }
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? ve.lex : ve.lexInline;
  }
  provideParser() {
    return this.block ? Le.parse : Le.parseInline;
  }
}, Ft(fo, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), Ft(fo, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), fo), W_ = class {
  constructor(...t) {
    Ft(this, "defaults", uh());
    Ft(this, "options", this.setOptions);
    Ft(this, "parse", this.parseMarkdown(!0));
    Ft(this, "parseInline", this.parseMarkdown(!1));
    Ft(this, "Parser", Le);
    Ft(this, "Renderer", Ko);
    Ft(this, "TextRenderer", Ch);
    Ft(this, "Lexer", ve);
    Ft(this, "Tokenizer", Zo);
    Ft(this, "Hooks", hs);
    this.use(...t);
  }
  walkTokens(t, r) {
    var s, o;
    let i = [];
    for (let a of t) switch (i = i.concat(r.call(this, a)), a.type) {
      case "table": {
        let n = a;
        for (let l of n.header) i = i.concat(this.walkTokens(l.tokens, r));
        for (let l of n.rows) for (let h of l) i = i.concat(this.walkTokens(h.tokens, r));
        break;
      }
      case "list": {
        let n = a;
        i = i.concat(this.walkTokens(n.items, r));
        break;
      }
      default: {
        let n = a;
        (o = (s = this.defaults.extensions) == null ? void 0 : s.childTokens) != null && o[n.type] ? this.defaults.extensions.childTokens[n.type].forEach((l) => {
          let h = n[l].flat(1 / 0);
          i = i.concat(this.walkTokens(h, r));
        }) : n.tokens && (i = i.concat(this.walkTokens(n.tokens, r)));
      }
    }
    return i;
  }
  use(...t) {
    let r = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((i) => {
      let s = { ...i };
      if (s.async = this.defaults.async || s.async || !1, i.extensions && (i.extensions.forEach((o) => {
        if (!o.name) throw new Error("extension name required");
        if ("renderer" in o) {
          let a = r.renderers[o.name];
          a ? r.renderers[o.name] = function(...n) {
            let l = o.renderer.apply(this, n);
            return l === !1 && (l = a.apply(this, n)), l;
          } : r.renderers[o.name] = o.renderer;
        }
        if ("tokenizer" in o) {
          if (!o.level || o.level !== "block" && o.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = r[o.level];
          a ? a.unshift(o.tokenizer) : r[o.level] = [o.tokenizer], o.start && (o.level === "block" ? r.startBlock ? r.startBlock.push(o.start) : r.startBlock = [o.start] : o.level === "inline" && (r.startInline ? r.startInline.push(o.start) : r.startInline = [o.start]));
        }
        "childTokens" in o && o.childTokens && (r.childTokens[o.name] = o.childTokens);
      }), s.extensions = r), i.renderer) {
        let o = this.defaults.renderer || new Ko(this.defaults);
        for (let a in i.renderer) {
          if (!(a in o)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let n = a, l = i.renderer[n], h = o[n];
          o[n] = (...c) => {
            let u = l.apply(o, c);
            return u === !1 && (u = h.apply(o, c)), u || "";
          };
        }
        s.renderer = o;
      }
      if (i.tokenizer) {
        let o = this.defaults.tokenizer || new Zo(this.defaults);
        for (let a in i.tokenizer) {
          if (!(a in o)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let n = a, l = i.tokenizer[n], h = o[n];
          o[n] = (...c) => {
            let u = l.apply(o, c);
            return u === !1 && (u = h.apply(o, c)), u;
          };
        }
        s.tokenizer = o;
      }
      if (i.hooks) {
        let o = this.defaults.hooks || new hs();
        for (let a in i.hooks) {
          if (!(a in o)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let n = a, l = i.hooks[n], h = o[n];
          hs.passThroughHooks.has(a) ? o[n] = (c) => {
            if (this.defaults.async && hs.passThroughHooksRespectAsync.has(a)) return (async () => {
              let f = await l.call(o, c);
              return h.call(o, f);
            })();
            let u = l.call(o, c);
            return h.call(o, u);
          } : o[n] = (...c) => {
            if (this.defaults.async) return (async () => {
              let f = await l.apply(o, c);
              return f === !1 && (f = await h.apply(o, c)), f;
            })();
            let u = l.apply(o, c);
            return u === !1 && (u = h.apply(o, c)), u;
          };
        }
        s.hooks = o;
      }
      if (i.walkTokens) {
        let o = this.defaults.walkTokens, a = i.walkTokens;
        s.walkTokens = function(n) {
          let l = [];
          return l.push(a.call(this, n)), o && (l = l.concat(o.call(this, n))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, r) {
    return ve.lex(t, r ?? this.defaults);
  }
  parser(t, r) {
    return Le.parse(t, r ?? this.defaults);
  }
  parseMarkdown(t) {
    return (r, i) => {
      let s = { ...i }, o = { ...this.defaults, ...s }, a = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof r > "u" || r === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof r != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(r) + ", string expected"));
      if (o.hooks && (o.hooks.options = o, o.hooks.block = t), o.async) return (async () => {
        let n = o.hooks ? await o.hooks.preprocess(r) : r, l = await (o.hooks ? await o.hooks.provideLexer() : t ? ve.lex : ve.lexInline)(n, o), h = o.hooks ? await o.hooks.processAllTokens(l) : l;
        o.walkTokens && await Promise.all(this.walkTokens(h, o.walkTokens));
        let c = await (o.hooks ? await o.hooks.provideParser() : t ? Le.parse : Le.parseInline)(h, o);
        return o.hooks ? await o.hooks.postprocess(c) : c;
      })().catch(a);
      try {
        o.hooks && (r = o.hooks.preprocess(r));
        let n = (o.hooks ? o.hooks.provideLexer() : t ? ve.lex : ve.lexInline)(r, o);
        o.hooks && (n = o.hooks.processAllTokens(n)), o.walkTokens && this.walkTokens(n, o.walkTokens);
        let l = (o.hooks ? o.hooks.provideParser() : t ? Le.parse : Le.parseInline)(n, o);
        return o.hooks && (l = o.hooks.postprocess(l)), l;
      } catch (n) {
        return a(n);
      }
    };
  }
  onError(t, r) {
    return (i) => {
      if (i.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + qe(i.message + "", !0) + "</pre>";
        return r ? Promise.resolve(s) : s;
      }
      if (r) return Promise.reject(i);
      throw i;
    };
  }
}, jr = new W_();
function Lt(e, t) {
  return jr.parse(e, t);
}
Lt.options = Lt.setOptions = function(e) {
  return jr.setOptions(e), Lt.defaults = jr.defaults, $g(Lt.defaults), Lt;
};
Lt.getDefaults = uh;
Lt.defaults = Kr;
Lt.use = function(...e) {
  return jr.use(...e), Lt.defaults = jr.defaults, $g(Lt.defaults), Lt;
};
Lt.walkTokens = function(e, t) {
  return jr.walkTokens(e, t);
};
Lt.parseInline = jr.parseInline;
Lt.Parser = Le;
Lt.parser = Le.parse;
Lt.Renderer = Ko;
Lt.TextRenderer = Ch;
Lt.Lexer = ve;
Lt.lexer = ve.lex;
Lt.Tokenizer = Zo;
Lt.Hooks = hs;
Lt.parse = Lt;
Lt.options;
Lt.setOptions;
Lt.use;
Lt.walkTokens;
Lt.parseInline;
Le.parse;
ve.lex;
function Yg(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  var i = Array.from(typeof e == "string" ? [e] : e);
  i[i.length - 1] = i[i.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var s = i.reduce(function(n, l) {
    var h = l.match(/\n([\t ]+|(?!\s).)/g);
    return h ? n.concat(h.map(function(c) {
      var u, f;
      return (f = (u = c.match(/[\t ]/g)) === null || u === void 0 ? void 0 : u.length) !== null && f !== void 0 ? f : 0;
    })) : n;
  }, []);
  if (s.length) {
    var o = new RegExp(`
[	 ]{`.concat(Math.min.apply(Math, s), "}"), "g");
    i = i.map(function(n) {
      return n.replace(o, `
`);
    });
  }
  i[0] = i[0].replace(/^\r?\n/, "");
  var a = i[0];
  return t.forEach(function(n, l) {
    var h = a.match(/(?:^|\n)( *)$/), c = h ? h[1] : "", u = n;
    typeof n == "string" && n.includes(`
`) && (u = String(n).split(`
`).map(function(f, d) {
      return d === 0 ? f : "".concat(c).concat(f);
    }).join(`
`)), a += u + i[l + 1];
  }), a;
}
function Ug(e, { markdownAutoWrap: t }) {
  const i = e.replace(/<br\/>/g, `
`).replace(/\n{2,}/g, `
`);
  return Yg(i);
}
g(Ug, "preprocessMarkdown");
function Xg(e) {
  return e.split(/\\n|\n|<br\s*\/?>/gi).map(
    (t) => {
      var r;
      return ((r = t.trim().match(/<[^>]+>|[^\s<>]+/g)) == null ? void 0 : r.map((i) => ({ content: i, type: "normal" }))) ?? [];
    }
  );
}
g(Xg, "nonMarkdownToLines");
function Gg(e, t = {}) {
  const r = Ug(e, t), i = Lt.lexer(r), s = [[]];
  let o = 0;
  function a(n, l = "normal") {
    n.type === "text" ? n.text.split(`
`).forEach((c, u) => {
      u !== 0 && (o++, s.push([])), c.split(" ").forEach((f) => {
        f = f.replace(/&#39;/g, "'"), f && s[o].push({ content: f, type: l });
      });
    }) : n.type === "strong" || n.type === "em" ? n.tokens.forEach((h) => {
      a(h, n.type);
    }) : n.type === "html" && s[o].push({ content: n.text, type: "normal" });
  }
  return g(a, "processNode"), i.forEach((n) => {
    var l;
    n.type === "paragraph" ? (l = n.tokens) == null || l.forEach((h) => {
      a(h);
    }) : n.type === "html" ? s[o].push({ content: n.text, type: "normal" }) : s[o].push({ content: n.raw, type: "normal" });
  }), s;
}
g(Gg, "markdownToLines");
function jg(e) {
  return e ? `<p>${/**
  * Replace new lines with <br /> tags.
  *
  * Unlike in markdown text, `\n` sequences are treated as line breaks here.
  */
  e.replace(/\\n|\n/g, "<br />")}</p>` : "";
}
g(jg, "nonMarkdownToHTML");
function Vg(e, { markdownAutoWrap: t } = {}) {
  const r = Lt.lexer(e);
  function i(s) {
    var o, a, n;
    return s.type === "text" ? t === !1 ? s.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;") : s.text.replace(/\n */g, "<br/>") : s.type === "strong" ? `<strong>${(o = s.tokens) == null ? void 0 : o.map(i).join("")}</strong>` : s.type === "em" ? `<em>${(a = s.tokens) == null ? void 0 : a.map(i).join("")}</em>` : s.type === "paragraph" ? `<p>${(n = s.tokens) == null ? void 0 : n.map(i).join("")}</p>` : s.type === "space" ? "" : s.type === "html" ? `${s.text}` : s.type === "escape" ? s.text : (H.warn(`Unsupported markdown: ${s.type}`), s.raw);
  }
  return g(i, "output"), r.map(i).join("");
}
g(Vg, "markdownToHTML");
function Zg(e) {
  return Intl.Segmenter ? [...new Intl.Segmenter().segment(e)].map((t) => t.segment) : [...e];
}
g(Zg, "splitTextToChars");
function Kg(e, t) {
  const r = Zg(t.content);
  return bh(e, [], r, t.type);
}
g(Kg, "splitWordToFitWidth");
function bh(e, t, r, i) {
  if (r.length === 0)
    return [
      { content: t.join(""), type: i },
      { content: "", type: i }
    ];
  const [s, ...o] = r, a = [...t, s];
  return e([{ content: a.join(""), type: i }]) ? bh(e, a, o, i) : (t.length === 0 && s && (t.push(s), r.shift()), [
    { content: t.join(""), type: i },
    { content: r.join(""), type: i }
  ]);
}
g(bh, "splitWordToFitWidthRecursion");
function Qg(e, t) {
  if (e.some(({ content: r }) => r.includes(`
`)))
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  return Qo(e, t);
}
g(Qg, "splitLineToFitWidth");
function Qo(e, t, r = [], i = []) {
  if (e.length === 0)
    return i.length > 0 && r.push(i), r.length > 0 ? r : [];
  let s = "";
  e[0].content === " " && (s = " ", e.shift());
  const o = e.shift() ?? { content: " ", type: "normal" }, a = [...i];
  if (s !== "" && a.push({ content: s, type: "normal" }), a.push(o), t(a))
    return Qo(e, t, r, a);
  if (i.length > 0)
    r.push(i), e.unshift(o);
  else if (o.content) {
    const [n, l] = Kg(t, o);
    r.push([n]), l.content && e.unshift(l);
  }
  return Qo(e, t, r);
}
g(Qo, "splitLineToFitWidthRecursion");
function ol(e, t) {
  t && e.attr("style", t);
}
g(ol, "applyStyle");
var lu = 16384;
async function Jg(e, t, r, i, s = !1, o = $t()) {
  const a = e.append("foreignObject");
  a.attr("width", `${Math.min(10 * r, lu)}px`), a.attr("height", `${Math.min(10 * r, lu)}px`);
  const n = a.append("xhtml:div"), l = ks(t.label) ? await Md(t.label.replace(Ds.lineBreakRegex, `
`), o) : $e(t.label, o), h = t.isNode ? "nodeLabel" : "edgeLabel", c = n.append("span");
  c.html(l), ol(c, t.labelStyle), c.attr("class", `${h} ${i}`), ol(n, t.labelStyle), n.style("display", "table-cell"), n.style("white-space", "nowrap"), n.style("line-height", "1.5"), r !== Number.POSITIVE_INFINITY && (n.style("max-width", r + "px"), n.style("text-align", "center")), n.attr("xmlns", "http://www.w3.org/1999/xhtml"), s && n.attr("class", "labelBkg");
  let u = n.node().getBoundingClientRect();
  return u.width === r && (n.style("display", "table"), n.style("white-space", "break-spaces"), n.style("width", r + "px"), u = n.node().getBoundingClientRect()), a.node();
}
g(Jg, "addHtmlSpan");
function ba(e, t, r, i = !1) {
  const s = e.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", t * r - 0.1 + "em").attr("dy", r + "em");
  return i && s.attr("text-anchor", "middle"), s;
}
g(ba, "createTspan");
function tm(e, t, r) {
  const i = e.append("text"), s = ba(i, 1, t);
  ka(s, r);
  const o = s.node().getComputedTextLength();
  return i.remove(), o;
}
g(tm, "computeWidthOfText");
function z_(e, t, r) {
  var a;
  const i = e.append("text"), s = ba(i, 1, t);
  ka(s, [{ content: r, type: "normal" }]);
  const o = (a = s.node()) == null ? void 0 : a.getBoundingClientRect();
  return o && i.remove(), o;
}
g(z_, "computeDimensionOfText");
function em(e, t, r, i = !1, s = !1) {
  const a = t.append("g"), n = a.insert("rect").attr("class", "background").attr("style", "stroke: none"), l = a.append("text").attr("y", "-10.1");
  s && l.attr("text-anchor", "middle");
  let h = 0;
  for (const c of r) {
    const u = /* @__PURE__ */ g((d) => tm(a, 1.1, d) <= e, "checkWidth"), f = u(c) ? [c] : Qg(c, u);
    for (const d of f) {
      const p = ba(l, h, 1.1, s);
      ka(p, d), h++;
    }
  }
  if (i) {
    const c = l.node().getBBox(), u = 2;
    return n.attr("x", c.x - u).attr("y", c.y - u).attr("width", c.width + 2 * u).attr("height", c.height + 2 * u), a.node();
  } else
    return l.node();
}
g(em, "createFormattedText");
function al(e) {
  const t = /&(amp|lt|gt);/g;
  return e.replace(t, (r, i) => {
    switch (i) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      default:
        return r;
    }
  });
}
g(al, "decodeHTMLEntities");
function ka(e, t) {
  e.text(""), t.forEach((r, i) => {
    const s = e.append("tspan").attr("font-style", r.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", r.type === "strong" ? "bold" : "normal");
    i === 0 ? s.text(al(r.content)) : s.text(" " + al(r.content));
  });
}
g(ka, "updateTextContentAndStyles");
async function rm(e, t = {}) {
  const r = [];
  e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (s, o, a) => (r.push(
    (async () => {
      const n = `${o}:${a}`;
      return await s_(n) ? await Ws(n, void 0, { class: "label-icon" }) : `<i class='${$e(s, t).replace(":", " ")}'></i>`;
    })()
  ), s));
  const i = await Promise.all(r);
  return e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, () => i.shift() ?? "");
}
g(rm, "replaceIconSubstring");
var Ke = /* @__PURE__ */ g(async (e, t = "", {
  style: r = "",
  isTitle: i = !1,
  classes: s = "",
  useHtmlLabels: o = !0,
  markdown: a = !0,
  isNode: n = !0,
  /**
   * The width to wrap the text within. Set to `Number.POSITIVE_INFINITY` for no wrapping.
   */
  width: l = 200,
  addSvgBackground: h = !1
} = {}, c) => {
  if (H.debug(
    "XYZ createText",
    t,
    r,
    i,
    s,
    o,
    n,
    "addSvgBackground: ",
    h
  ), o) {
    const u = a ? Vg(t, c) : jg(t), f = await rm(Gr(u), c), d = t.replace(/\\\\/g, "\\"), p = {
      isNode: n,
      label: ks(t) ? d : f,
      labelStyle: r.replace("fill:", "color:")
    };
    return await Jg(e, p, l, s, h, c);
  } else {
    const u = Gr(t.replace(/<br\s*\/?>/g, "<br/>")), f = a ? Gg(u.replace("<br>", "<br/>"), c) : Xg(u), d = em(
      l,
      e,
      f,
      t ? h : !1,
      !n
    );
    if (n) {
      /stroke:/.exec(r) && (r = r.replace("stroke:", "lineColor:"));
      const p = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      bt(d).attr("style", p);
    } else {
      const p = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
      bt(d).select("rect").attr("style", p.replace(/background:/g, "fill:"));
      const m = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      bt(d).select("text").attr("style", m);
    }
    return i ? bt(d).selectAll("tspan.text-outer-tspan").classed("title-row", !0) : bt(d).selectAll("tspan.text-outer-tspan").classed("row", !0), d;
  }
}, "createText");
function on(e, t, r) {
  if (e && e.length) {
    const [i, s] = t, o = Math.PI / 180 * r, a = Math.cos(o), n = Math.sin(o);
    for (const l of e) {
      const [h, c] = l;
      l[0] = (h - i) * a - (c - s) * n + i, l[1] = (h - i) * n + (c - s) * a + s;
    }
  }
}
function H_(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}
function Y_(e, t, r, i = 1) {
  const s = r, o = Math.max(t, 0.1), a = e[0] && e[0][0] && typeof e[0][0] == "number" ? [e] : e, n = [0, 0];
  if (s) for (const h of a) on(h, n, s);
  const l = function(h, c, u) {
    const f = [];
    for (const C of h) {
      const k = [...C];
      H_(k[0], k[k.length - 1]) || k.push([k[0][0], k[0][1]]), k.length > 2 && f.push(k);
    }
    const d = [];
    c = Math.max(c, 0.1);
    const p = [];
    for (const C of f) for (let k = 0; k < C.length - 1; k++) {
      const w = C[k], T = C[k + 1];
      if (w[1] !== T[1]) {
        const _ = Math.min(w[1], T[1]);
        p.push({ ymin: _, ymax: Math.max(w[1], T[1]), x: _ === w[1] ? w[0] : T[0], islope: (T[0] - w[0]) / (T[1] - w[1]) });
      }
    }
    if (p.sort((C, k) => C.ymin < k.ymin ? -1 : C.ymin > k.ymin ? 1 : C.x < k.x ? -1 : C.x > k.x ? 1 : C.ymax === k.ymax ? 0 : (C.ymax - k.ymax) / Math.abs(C.ymax - k.ymax)), !p.length) return d;
    let m = [], y = p[0].ymin, x = 0;
    for (; m.length || p.length; ) {
      if (p.length) {
        let C = -1;
        for (let k = 0; k < p.length && !(p[k].ymin > y); k++) C = k;
        p.splice(0, C + 1).forEach((k) => {
          m.push({ s: y, edge: k });
        });
      }
      if (m = m.filter((C) => !(C.edge.ymax <= y)), m.sort((C, k) => C.edge.x === k.edge.x ? 0 : (C.edge.x - k.edge.x) / Math.abs(C.edge.x - k.edge.x)), (u !== 1 || x % c == 0) && m.length > 1) for (let C = 0; C < m.length; C += 2) {
        const k = C + 1;
        if (k >= m.length) break;
        const w = m[C].edge, T = m[k].edge;
        d.push([[Math.round(w.x), y], [Math.round(T.x), y]]);
      }
      y += u, m.forEach((C) => {
        C.edge.x = C.edge.x + u * C.edge.islope;
      }), x++;
    }
    return d;
  }(a, o, i);
  if (s) {
    for (const h of a) on(h, n, -s);
    (function(h, c, u) {
      const f = [];
      h.forEach((d) => f.push(...d)), on(f, c, u);
    })(l, n, -s);
  }
  return l;
}
function Hs(e, t) {
  var r;
  const i = t.hachureAngle + 90;
  let s = t.hachureGap;
  s < 0 && (s = 4 * t.strokeWidth), s = Math.round(Math.max(s, 0.1));
  let o = 1;
  return t.roughness >= 1 && (((r = t.randomizer) === null || r === void 0 ? void 0 : r.next()) || Math.random()) > 0.7 && (o = s), Y_(e, s, i, o || 1);
}
class kh {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    return this._fillPolygons(t, r);
  }
  _fillPolygons(t, r) {
    const i = Hs(t, r);
    return { type: "fillSketch", ops: this.renderLines(i, r) };
  }
  renderLines(t, r) {
    const i = [];
    for (const s of t) i.push(...this.helper.doubleLineOps(s[0][0], s[0][1], s[1][0], s[1][1], r));
    return i;
  }
}
function Sa(e) {
  const t = e[0], r = e[1];
  return Math.sqrt(Math.pow(t[0] - r[0], 2) + Math.pow(t[1] - r[1], 2));
}
class U_ extends kh {
  fillPolygons(t, r) {
    let i = r.hachureGap;
    i < 0 && (i = 4 * r.strokeWidth), i = Math.max(i, 0.1);
    const s = Hs(t, Object.assign({}, r, { hachureGap: i })), o = Math.PI / 180 * r.hachureAngle, a = [], n = 0.5 * i * Math.cos(o), l = 0.5 * i * Math.sin(o);
    for (const [h, c] of s) Sa([h, c]) && a.push([[h[0] - n, h[1] + l], [...c]], [[h[0] + n, h[1] - l], [...c]]);
    return { type: "fillSketch", ops: this.renderLines(a, r) };
  }
}
class X_ extends kh {
  fillPolygons(t, r) {
    const i = this._fillPolygons(t, r), s = Object.assign({}, r, { hachureAngle: r.hachureAngle + 90 }), o = this._fillPolygons(t, s);
    return i.ops = i.ops.concat(o.ops), i;
  }
}
class G_ {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = Hs(t, r = Object.assign({}, r, { hachureAngle: 0 }));
    return this.dotsOnLines(i, r);
  }
  dotsOnLines(t, r) {
    const i = [];
    let s = r.hachureGap;
    s < 0 && (s = 4 * r.strokeWidth), s = Math.max(s, 0.1);
    let o = r.fillWeight;
    o < 0 && (o = r.strokeWidth / 2);
    const a = s / 4;
    for (const n of t) {
      const l = Sa(n), h = l / s, c = Math.ceil(h) - 1, u = l - c * s, f = (n[0][0] + n[1][0]) / 2 - s / 4, d = Math.min(n[0][1], n[1][1]);
      for (let p = 0; p < c; p++) {
        const m = d + u + p * s, y = f - a + 2 * Math.random() * a, x = m - a + 2 * Math.random() * a, C = this.helper.ellipse(y, x, o, o, r);
        i.push(...C.ops);
      }
    }
    return { type: "fillSketch", ops: i };
  }
}
class j_ {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = Hs(t, r);
    return { type: "fillSketch", ops: this.dashedLine(i, r) };
  }
  dashedLine(t, r) {
    const i = r.dashOffset < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashOffset, s = r.dashGap < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashGap, o = [];
    return t.forEach((a) => {
      const n = Sa(a), l = Math.floor(n / (i + s)), h = (n + s - l * (i + s)) / 2;
      let c = a[0], u = a[1];
      c[0] > u[0] && (c = a[1], u = a[0]);
      const f = Math.atan((u[1] - c[1]) / (u[0] - c[0]));
      for (let d = 0; d < l; d++) {
        const p = d * (i + s), m = p + i, y = [c[0] + p * Math.cos(f) + h * Math.cos(f), c[1] + p * Math.sin(f) + h * Math.sin(f)], x = [c[0] + m * Math.cos(f) + h * Math.cos(f), c[1] + m * Math.sin(f) + h * Math.sin(f)];
        o.push(...this.helper.doubleLineOps(y[0], y[1], x[0], x[1], r));
      }
    }), o;
  }
}
class V_ {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap, s = r.zigzagOffset < 0 ? i : r.zigzagOffset, o = Hs(t, r = Object.assign({}, r, { hachureGap: i + s }));
    return { type: "fillSketch", ops: this.zigzagLines(o, s, r) };
  }
  zigzagLines(t, r, i) {
    const s = [];
    return t.forEach((o) => {
      const a = Sa(o), n = Math.round(a / (2 * r));
      let l = o[0], h = o[1];
      l[0] > h[0] && (l = o[1], h = o[0]);
      const c = Math.atan((h[1] - l[1]) / (h[0] - l[0]));
      for (let u = 0; u < n; u++) {
        const f = 2 * u * r, d = 2 * (u + 1) * r, p = Math.sqrt(2 * Math.pow(r, 2)), m = [l[0] + f * Math.cos(c), l[1] + f * Math.sin(c)], y = [l[0] + d * Math.cos(c), l[1] + d * Math.sin(c)], x = [m[0] + p * Math.cos(c + Math.PI / 4), m[1] + p * Math.sin(c + Math.PI / 4)];
        s.push(...this.helper.doubleLineOps(m[0], m[1], x[0], x[1], i), ...this.helper.doubleLineOps(x[0], x[1], y[0], y[1], i));
      }
    }), s;
  }
}
const he = {};
class Z_ {
  constructor(t) {
    this.seed = t;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
const K_ = 0, an = 1, hu = 2, ao = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function nn(e, t) {
  return e.type === t;
}
function Sh(e) {
  const t = [], r = function(a) {
    const n = new Array();
    for (; a !== ""; ) if (a.match(/^([ \t\r\n,]+)/)) a = a.substr(RegExp.$1.length);
    else if (a.match(/^([aAcChHlLmMqQsStTvVzZ])/)) n[n.length] = { type: K_, text: RegExp.$1 }, a = a.substr(RegExp.$1.length);
    else {
      if (!a.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
      n[n.length] = { type: an, text: `${parseFloat(RegExp.$1)}` }, a = a.substr(RegExp.$1.length);
    }
    return n[n.length] = { type: hu, text: "" }, n;
  }(e);
  let i = "BOD", s = 0, o = r[s];
  for (; !nn(o, hu); ) {
    let a = 0;
    const n = [];
    if (i === "BOD") {
      if (o.text !== "M" && o.text !== "m") return Sh("M0,0" + e);
      s++, a = ao[o.text], i = o.text;
    } else nn(o, an) ? a = ao[i] : (s++, a = ao[o.text], i = o.text);
    if (!(s + a < r.length)) throw new Error("Path data ended short");
    for (let l = s; l < s + a; l++) {
      const h = r[l];
      if (!nn(h, an)) throw new Error("Param not a number: " + i + "," + h.text);
      n[n.length] = +h.text;
    }
    if (typeof ao[i] != "number") throw new Error("Bad segment: " + i);
    {
      const l = { key: i, data: n };
      t.push(l), s += a, o = r[s], i === "M" && (i = "L"), i === "m" && (i = "l");
    }
  }
  return t;
}
function im(e) {
  let t = 0, r = 0, i = 0, s = 0;
  const o = [];
  for (const { key: a, data: n } of e) switch (a) {
    case "M":
      o.push({ key: "M", data: [...n] }), [t, r] = n, [i, s] = n;
      break;
    case "m":
      t += n[0], r += n[1], o.push({ key: "M", data: [t, r] }), i = t, s = r;
      break;
    case "L":
      o.push({ key: "L", data: [...n] }), [t, r] = n;
      break;
    case "l":
      t += n[0], r += n[1], o.push({ key: "L", data: [t, r] });
      break;
    case "C":
      o.push({ key: "C", data: [...n] }), t = n[4], r = n[5];
      break;
    case "c": {
      const l = n.map((h, c) => c % 2 ? h + r : h + t);
      o.push({ key: "C", data: l }), t = l[4], r = l[5];
      break;
    }
    case "Q":
      o.push({ key: "Q", data: [...n] }), t = n[2], r = n[3];
      break;
    case "q": {
      const l = n.map((h, c) => c % 2 ? h + r : h + t);
      o.push({ key: "Q", data: l }), t = l[2], r = l[3];
      break;
    }
    case "A":
      o.push({ key: "A", data: [...n] }), t = n[5], r = n[6];
      break;
    case "a":
      t += n[5], r += n[6], o.push({ key: "A", data: [n[0], n[1], n[2], n[3], n[4], t, r] });
      break;
    case "H":
      o.push({ key: "H", data: [...n] }), t = n[0];
      break;
    case "h":
      t += n[0], o.push({ key: "H", data: [t] });
      break;
    case "V":
      o.push({ key: "V", data: [...n] }), r = n[0];
      break;
    case "v":
      r += n[0], o.push({ key: "V", data: [r] });
      break;
    case "S":
      o.push({ key: "S", data: [...n] }), t = n[2], r = n[3];
      break;
    case "s": {
      const l = n.map((h, c) => c % 2 ? h + r : h + t);
      o.push({ key: "S", data: l }), t = l[2], r = l[3];
      break;
    }
    case "T":
      o.push({ key: "T", data: [...n] }), t = n[0], r = n[1];
      break;
    case "t":
      t += n[0], r += n[1], o.push({ key: "T", data: [t, r] });
      break;
    case "Z":
    case "z":
      o.push({ key: "Z", data: [] }), t = i, r = s;
  }
  return o;
}
function sm(e) {
  const t = [];
  let r = "", i = 0, s = 0, o = 0, a = 0, n = 0, l = 0;
  for (const { key: h, data: c } of e) {
    switch (h) {
      case "M":
        t.push({ key: "M", data: [...c] }), [i, s] = c, [o, a] = c;
        break;
      case "C":
        t.push({ key: "C", data: [...c] }), i = c[4], s = c[5], n = c[2], l = c[3];
        break;
      case "L":
        t.push({ key: "L", data: [...c] }), [i, s] = c;
        break;
      case "H":
        i = c[0], t.push({ key: "L", data: [i, s] });
        break;
      case "V":
        s = c[0], t.push({ key: "L", data: [i, s] });
        break;
      case "S": {
        let u = 0, f = 0;
        r === "C" || r === "S" ? (u = i + (i - n), f = s + (s - l)) : (u = i, f = s), t.push({ key: "C", data: [u, f, ...c] }), n = c[0], l = c[1], i = c[2], s = c[3];
        break;
      }
      case "T": {
        const [u, f] = c;
        let d = 0, p = 0;
        r === "Q" || r === "T" ? (d = i + (i - n), p = s + (s - l)) : (d = i, p = s);
        const m = i + 2 * (d - i) / 3, y = s + 2 * (p - s) / 3, x = u + 2 * (d - u) / 3, C = f + 2 * (p - f) / 3;
        t.push({ key: "C", data: [m, y, x, C, u, f] }), n = d, l = p, i = u, s = f;
        break;
      }
      case "Q": {
        const [u, f, d, p] = c, m = i + 2 * (u - i) / 3, y = s + 2 * (f - s) / 3, x = d + 2 * (u - d) / 3, C = p + 2 * (f - p) / 3;
        t.push({ key: "C", data: [m, y, x, C, d, p] }), n = u, l = f, i = d, s = p;
        break;
      }
      case "A": {
        const u = Math.abs(c[0]), f = Math.abs(c[1]), d = c[2], p = c[3], m = c[4], y = c[5], x = c[6];
        u === 0 || f === 0 ? (t.push({ key: "C", data: [i, s, y, x, y, x] }), i = y, s = x) : (i !== y || s !== x) && (om(i, s, y, x, u, f, d, p, m).forEach(function(C) {
          t.push({ key: "C", data: C });
        }), i = y, s = x);
        break;
      }
      case "Z":
        t.push({ key: "Z", data: [] }), i = o, s = a;
    }
    r = h;
  }
  return t;
}
function Ji(e, t, r) {
  return [e * Math.cos(r) - t * Math.sin(r), e * Math.sin(r) + t * Math.cos(r)];
}
function om(e, t, r, i, s, o, a, n, l, h) {
  const c = (u = a, Math.PI * u / 180);
  var u;
  let f = [], d = 0, p = 0, m = 0, y = 0;
  if (h) [d, p, m, y] = h;
  else {
    [e, t] = Ji(e, t, -c), [r, i] = Ji(r, i, -c);
    const z = (e - r) / 2, D = (t - i) / 2;
    let E = z * z / (s * s) + D * D / (o * o);
    E > 1 && (E = Math.sqrt(E), s *= E, o *= E);
    const A = s * s, $ = o * o, B = A * $ - A * D * D - $ * z * z, I = A * D * D + $ * z * z, Y = (n === l ? -1 : 1) * Math.sqrt(Math.abs(B / I));
    m = Y * s * D / o + (e + r) / 2, y = Y * -o * z / s + (t + i) / 2, d = Math.asin(parseFloat(((t - y) / o).toFixed(9))), p = Math.asin(parseFloat(((i - y) / o).toFixed(9))), e < m && (d = Math.PI - d), r < m && (p = Math.PI - p), d < 0 && (d = 2 * Math.PI + d), p < 0 && (p = 2 * Math.PI + p), l && d > p && (d -= 2 * Math.PI), !l && p > d && (p -= 2 * Math.PI);
  }
  let x = p - d;
  if (Math.abs(x) > 120 * Math.PI / 180) {
    const z = p, D = r, E = i;
    p = l && p > d ? d + 120 * Math.PI / 180 * 1 : d + 120 * Math.PI / 180 * -1, f = om(r = m + s * Math.cos(p), i = y + o * Math.sin(p), D, E, s, o, a, 0, l, [p, z, m, y]);
  }
  x = p - d;
  const C = Math.cos(d), k = Math.sin(d), w = Math.cos(p), T = Math.sin(p), _ = Math.tan(x / 4), v = 4 / 3 * s * _, L = 4 / 3 * o * _, W = [e, t], O = [e + v * k, t - L * C], M = [r + v * T, i - L * w], U = [r, i];
  if (O[0] = 2 * W[0] - O[0], O[1] = 2 * W[1] - O[1], h) return [O, M, U].concat(f);
  {
    f = [O, M, U].concat(f);
    const z = [];
    for (let D = 0; D < f.length; D += 3) {
      const E = Ji(f[D][0], f[D][1], c), A = Ji(f[D + 1][0], f[D + 1][1], c), $ = Ji(f[D + 2][0], f[D + 2][1], c);
      z.push([E[0], E[1], A[0], A[1], $[0], $[1]]);
    }
    return z;
  }
}
const Q_ = { randOffset: function(e, t) {
  return ft(e, t);
}, randOffsetWithRange: function(e, t, r) {
  return Jo(e, t, r);
}, ellipse: function(e, t, r, i, s) {
  const o = nm(r, i, s);
  return nl(e, t, s, o).opset;
}, doubleLineOps: function(e, t, r, i, s) {
  return wr(e, t, r, i, s, !0);
} };
function am(e, t, r, i, s) {
  return { type: "path", ops: wr(e, t, r, i, s) };
}
function wo(e, t, r) {
  const i = (e || []).length;
  if (i > 2) {
    const s = [];
    for (let o = 0; o < i - 1; o++) s.push(...wr(e[o][0], e[o][1], e[o + 1][0], e[o + 1][1], r));
    return t && s.push(...wr(e[i - 1][0], e[i - 1][1], e[0][0], e[0][1], r)), { type: "path", ops: s };
  }
  return i === 2 ? am(e[0][0], e[0][1], e[1][0], e[1][1], r) : { type: "path", ops: [] };
}
function J_(e, t, r, i, s) {
  return function(o, a) {
    return wo(o, !0, a);
  }([[e, t], [e + r, t], [e + r, t + i], [e, t + i]], s);
}
function cu(e, t) {
  if (e.length) {
    const r = typeof e[0][0] == "number" ? [e] : e, i = no(r[0], 1 * (1 + 0.2 * t.roughness), t), s = t.disableMultiStroke ? [] : no(r[0], 1.5 * (1 + 0.22 * t.roughness), fu(t));
    for (let o = 1; o < r.length; o++) {
      const a = r[o];
      if (a.length) {
        const n = no(a, 1 * (1 + 0.2 * t.roughness), t), l = t.disableMultiStroke ? [] : no(a, 1.5 * (1 + 0.22 * t.roughness), fu(t));
        for (const h of n) h.op !== "move" && i.push(h);
        for (const h of l) h.op !== "move" && s.push(h);
      }
    }
    return { type: "path", ops: i.concat(s) };
  }
  return { type: "path", ops: [] };
}
function nm(e, t, r) {
  const i = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(e / 2, 2) + Math.pow(t / 2, 2)) / 2)), s = Math.ceil(Math.max(r.curveStepCount, r.curveStepCount / Math.sqrt(200) * i)), o = 2 * Math.PI / s;
  let a = Math.abs(e / 2), n = Math.abs(t / 2);
  const l = 1 - r.curveFitting;
  return a += ft(a * l, r), n += ft(n * l, r), { increment: o, rx: a, ry: n };
}
function nl(e, t, r, i) {
  const [s, o] = pu(i.increment, e, t, i.rx, i.ry, 1, i.increment * Jo(0.1, Jo(0.4, 1, r), r), r);
  let a = ta(s, null, r);
  if (!r.disableMultiStroke && r.roughness !== 0) {
    const [n] = pu(i.increment, e, t, i.rx, i.ry, 1.5, 0, r), l = ta(n, null, r);
    a = a.concat(l);
  }
  return { estimatedPoints: o, opset: { type: "path", ops: a } };
}
function uu(e, t, r, i, s, o, a, n, l) {
  const h = e, c = t;
  let u = Math.abs(r / 2), f = Math.abs(i / 2);
  u += ft(0.01 * u, l), f += ft(0.01 * f, l);
  let d = s, p = o;
  for (; d < 0; ) d += 2 * Math.PI, p += 2 * Math.PI;
  p - d > 2 * Math.PI && (d = 0, p = 2 * Math.PI);
  const m = 2 * Math.PI / l.curveStepCount, y = Math.min(m / 2, (p - d) / 2), x = gu(y, h, c, u, f, d, p, 1, l);
  if (!l.disableMultiStroke) {
    const C = gu(y, h, c, u, f, d, p, 1.5, l);
    x.push(...C);
  }
  return a && (n ? x.push(...wr(h, c, h + u * Math.cos(d), c + f * Math.sin(d), l), ...wr(h, c, h + u * Math.cos(p), c + f * Math.sin(p), l)) : x.push({ op: "lineTo", data: [h, c] }, { op: "lineTo", data: [h + u * Math.cos(d), c + f * Math.sin(d)] })), { type: "path", ops: x };
}
function du(e, t) {
  const r = sm(im(Sh(e))), i = [];
  let s = [0, 0], o = [0, 0];
  for (const { key: a, data: n } of r) switch (a) {
    case "M":
      o = [n[0], n[1]], s = [n[0], n[1]];
      break;
    case "L":
      i.push(...wr(o[0], o[1], n[0], n[1], t)), o = [n[0], n[1]];
      break;
    case "C": {
      const [l, h, c, u, f, d] = n;
      i.push(...tB(l, h, c, u, f, d, o, t)), o = [f, d];
      break;
    }
    case "Z":
      i.push(...wr(o[0], o[1], s[0], s[1], t)), o = [s[0], s[1]];
  }
  return { type: "path", ops: i };
}
function ln(e, t) {
  const r = [];
  for (const i of e) if (i.length) {
    const s = t.maxRandomnessOffset || 0, o = i.length;
    if (o > 2) {
      r.push({ op: "move", data: [i[0][0] + ft(s, t), i[0][1] + ft(s, t)] });
      for (let a = 1; a < o; a++) r.push({ op: "lineTo", data: [i[a][0] + ft(s, t), i[a][1] + ft(s, t)] });
    }
  }
  return { type: "fillPath", ops: r };
}
function ni(e, t) {
  return function(r, i) {
    let s = r.fillStyle || "hachure";
    if (!he[s]) switch (s) {
      case "zigzag":
        he[s] || (he[s] = new U_(i));
        break;
      case "cross-hatch":
        he[s] || (he[s] = new X_(i));
        break;
      case "dots":
        he[s] || (he[s] = new G_(i));
        break;
      case "dashed":
        he[s] || (he[s] = new j_(i));
        break;
      case "zigzag-line":
        he[s] || (he[s] = new V_(i));
        break;
      default:
        s = "hachure", he[s] || (he[s] = new kh(i));
    }
    return he[s];
  }(t, Q_).fillPolygons(e, t);
}
function fu(e) {
  const t = Object.assign({}, e);
  return t.randomizer = void 0, e.seed && (t.seed = e.seed + 1), t;
}
function lm(e) {
  return e.randomizer || (e.randomizer = new Z_(e.seed || 0)), e.randomizer.next();
}
function Jo(e, t, r, i = 1) {
  return r.roughness * i * (lm(r) * (t - e) + e);
}
function ft(e, t, r = 1) {
  return Jo(-e, e, t, r);
}
function wr(e, t, r, i, s, o = !1) {
  const a = o ? s.disableMultiStrokeFill : s.disableMultiStroke, n = ll(e, t, r, i, s, !0, !1);
  if (a) return n;
  const l = ll(e, t, r, i, s, !0, !0);
  return n.concat(l);
}
function ll(e, t, r, i, s, o, a) {
  const n = Math.pow(e - r, 2) + Math.pow(t - i, 2), l = Math.sqrt(n);
  let h = 1;
  h = l < 200 ? 1 : l > 500 ? 0.4 : -16668e-7 * l + 1.233334;
  let c = s.maxRandomnessOffset || 0;
  c * c * 100 > n && (c = l / 10);
  const u = c / 2, f = 0.2 + 0.2 * lm(s);
  let d = s.bowing * s.maxRandomnessOffset * (i - t) / 200, p = s.bowing * s.maxRandomnessOffset * (e - r) / 200;
  d = ft(d, s, h), p = ft(p, s, h);
  const m = [], y = () => ft(u, s, h), x = () => ft(c, s, h), C = s.preserveVertices;
  return a ? m.push({ op: "move", data: [e + (C ? 0 : y()), t + (C ? 0 : y())] }) : m.push({ op: "move", data: [e + (C ? 0 : ft(c, s, h)), t + (C ? 0 : ft(c, s, h))] }), a ? m.push({ op: "bcurveTo", data: [d + e + (r - e) * f + y(), p + t + (i - t) * f + y(), d + e + 2 * (r - e) * f + y(), p + t + 2 * (i - t) * f + y(), r + (C ? 0 : y()), i + (C ? 0 : y())] }) : m.push({ op: "bcurveTo", data: [d + e + (r - e) * f + x(), p + t + (i - t) * f + x(), d + e + 2 * (r - e) * f + x(), p + t + 2 * (i - t) * f + x(), r + (C ? 0 : x()), i + (C ? 0 : x())] }), m;
}
function no(e, t, r) {
  if (!e.length) return [];
  const i = [];
  i.push([e[0][0] + ft(t, r), e[0][1] + ft(t, r)]), i.push([e[0][0] + ft(t, r), e[0][1] + ft(t, r)]);
  for (let s = 1; s < e.length; s++) i.push([e[s][0] + ft(t, r), e[s][1] + ft(t, r)]), s === e.length - 1 && i.push([e[s][0] + ft(t, r), e[s][1] + ft(t, r)]);
  return ta(i, null, r);
}
function ta(e, t, r) {
  const i = e.length, s = [];
  if (i > 3) {
    const o = [], a = 1 - r.curveTightness;
    s.push({ op: "move", data: [e[1][0], e[1][1]] });
    for (let n = 1; n + 2 < i; n++) {
      const l = e[n];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (a * e[n + 1][0] - a * e[n - 1][0]) / 6, l[1] + (a * e[n + 1][1] - a * e[n - 1][1]) / 6], o[2] = [e[n + 1][0] + (a * e[n][0] - a * e[n + 2][0]) / 6, e[n + 1][1] + (a * e[n][1] - a * e[n + 2][1]) / 6], o[3] = [e[n + 1][0], e[n + 1][1]], s.push({ op: "bcurveTo", data: [o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]] });
    }
  } else i === 3 ? (s.push({ op: "move", data: [e[1][0], e[1][1]] }), s.push({ op: "bcurveTo", data: [e[1][0], e[1][1], e[2][0], e[2][1], e[2][0], e[2][1]] })) : i === 2 && s.push(...ll(e[0][0], e[0][1], e[1][0], e[1][1], r, !0, !0));
  return s;
}
function pu(e, t, r, i, s, o, a, n) {
  const l = [], h = [];
  if (n.roughness === 0) {
    e /= 4, h.push([t + i * Math.cos(-e), r + s * Math.sin(-e)]);
    for (let c = 0; c <= 2 * Math.PI; c += e) {
      const u = [t + i * Math.cos(c), r + s * Math.sin(c)];
      l.push(u), h.push(u);
    }
    h.push([t + i * Math.cos(0), r + s * Math.sin(0)]), h.push([t + i * Math.cos(e), r + s * Math.sin(e)]);
  } else {
    const c = ft(0.5, n) - Math.PI / 2;
    h.push([ft(o, n) + t + 0.9 * i * Math.cos(c - e), ft(o, n) + r + 0.9 * s * Math.sin(c - e)]);
    const u = 2 * Math.PI + c - 0.01;
    for (let f = c; f < u; f += e) {
      const d = [ft(o, n) + t + i * Math.cos(f), ft(o, n) + r + s * Math.sin(f)];
      l.push(d), h.push(d);
    }
    h.push([ft(o, n) + t + i * Math.cos(c + 2 * Math.PI + 0.5 * a), ft(o, n) + r + s * Math.sin(c + 2 * Math.PI + 0.5 * a)]), h.push([ft(o, n) + t + 0.98 * i * Math.cos(c + a), ft(o, n) + r + 0.98 * s * Math.sin(c + a)]), h.push([ft(o, n) + t + 0.9 * i * Math.cos(c + 0.5 * a), ft(o, n) + r + 0.9 * s * Math.sin(c + 0.5 * a)]);
  }
  return [h, l];
}
function gu(e, t, r, i, s, o, a, n, l) {
  const h = o + ft(0.1, l), c = [];
  c.push([ft(n, l) + t + 0.9 * i * Math.cos(h - e), ft(n, l) + r + 0.9 * s * Math.sin(h - e)]);
  for (let u = h; u <= a; u += e) c.push([ft(n, l) + t + i * Math.cos(u), ft(n, l) + r + s * Math.sin(u)]);
  return c.push([t + i * Math.cos(a), r + s * Math.sin(a)]), c.push([t + i * Math.cos(a), r + s * Math.sin(a)]), ta(c, null, l);
}
function tB(e, t, r, i, s, o, a, n) {
  const l = [], h = [n.maxRandomnessOffset || 1, (n.maxRandomnessOffset || 1) + 0.3];
  let c = [0, 0];
  const u = n.disableMultiStroke ? 1 : 2, f = n.preserveVertices;
  for (let d = 0; d < u; d++) d === 0 ? l.push({ op: "move", data: [a[0], a[1]] }) : l.push({ op: "move", data: [a[0] + (f ? 0 : ft(h[0], n)), a[1] + (f ? 0 : ft(h[0], n))] }), c = f ? [s, o] : [s + ft(h[d], n), o + ft(h[d], n)], l.push({ op: "bcurveTo", data: [e + ft(h[d], n), t + ft(h[d], n), r + ft(h[d], n), i + ft(h[d], n), c[0], c[1]] });
  return l;
}
function ts(e) {
  return [...e];
}
function mu(e, t = 0) {
  const r = e.length;
  if (r < 3) throw new Error("A curve must have at least three points.");
  const i = [];
  if (r === 3) i.push(ts(e[0]), ts(e[1]), ts(e[2]), ts(e[2]));
  else {
    const s = [];
    s.push(e[0], e[0]);
    for (let n = 1; n < e.length; n++) s.push(e[n]), n === e.length - 1 && s.push(e[n]);
    const o = [], a = 1 - t;
    i.push(ts(s[0]));
    for (let n = 1; n + 2 < s.length; n++) {
      const l = s[n];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (a * s[n + 1][0] - a * s[n - 1][0]) / 6, l[1] + (a * s[n + 1][1] - a * s[n - 1][1]) / 6], o[2] = [s[n + 1][0] + (a * s[n][0] - a * s[n + 2][0]) / 6, s[n + 1][1] + (a * s[n][1] - a * s[n + 2][1]) / 6], o[3] = [s[n + 1][0], s[n + 1][1]], i.push(o[1], o[2], o[3]);
    }
  }
  return i;
}
function To(e, t) {
  return Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2);
}
function eB(e, t, r) {
  const i = To(t, r);
  if (i === 0) return To(e, t);
  let s = ((e[0] - t[0]) * (r[0] - t[0]) + (e[1] - t[1]) * (r[1] - t[1])) / i;
  return s = Math.max(0, Math.min(1, s)), To(e, $r(t, r, s));
}
function $r(e, t, r) {
  return [e[0] + (t[0] - e[0]) * r, e[1] + (t[1] - e[1]) * r];
}
function hl(e, t, r, i) {
  const s = i || [];
  if (function(n, l) {
    const h = n[l + 0], c = n[l + 1], u = n[l + 2], f = n[l + 3];
    let d = 3 * c[0] - 2 * h[0] - f[0];
    d *= d;
    let p = 3 * c[1] - 2 * h[1] - f[1];
    p *= p;
    let m = 3 * u[0] - 2 * f[0] - h[0];
    m *= m;
    let y = 3 * u[1] - 2 * f[1] - h[1];
    return y *= y, d < m && (d = m), p < y && (p = y), d + p;
  }(e, t) < r) {
    const n = e[t + 0];
    s.length ? (o = s[s.length - 1], a = n, Math.sqrt(To(o, a)) > 1 && s.push(n)) : s.push(n), s.push(e[t + 3]);
  } else {
    const l = e[t + 0], h = e[t + 1], c = e[t + 2], u = e[t + 3], f = $r(l, h, 0.5), d = $r(h, c, 0.5), p = $r(c, u, 0.5), m = $r(f, d, 0.5), y = $r(d, p, 0.5), x = $r(m, y, 0.5);
    hl([l, f, m, x], 0, r, s), hl([x, y, p, u], 0, r, s);
  }
  var o, a;
  return s;
}
function rB(e, t) {
  return ea(e, 0, e.length, t);
}
function ea(e, t, r, i, s) {
  const o = s || [], a = e[t], n = e[r - 1];
  let l = 0, h = 1;
  for (let c = t + 1; c < r - 1; ++c) {
    const u = eB(e[c], a, n);
    u > l && (l = u, h = c);
  }
  return Math.sqrt(l) > i ? (ea(e, t, h + 1, i, o), ea(e, h, r, i, o)) : (o.length || o.push(a), o.push(n)), o;
}
function hn(e, t = 0.15, r) {
  const i = [], s = (e.length - 1) / 3;
  for (let o = 0; o < s; o++)
    hl(e, 3 * o, t, i);
  return r && r > 0 ? ea(i, 0, i.length, r) : i;
}
const ge = "none";
class ra {
  constructor(t) {
    this.defaultOptions = { maxRandomnessOffset: 2, roughness: 1, bowing: 1, stroke: "#000", strokeWidth: 1, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, seed: 0, disableMultiStroke: !1, disableMultiStrokeFill: !1, preserveVertices: !1, fillShapeRoughnessGain: 0.8 }, this.config = t || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
  }
  static newSeed() {
    return Math.floor(Math.random() * 2 ** 31);
  }
  _o(t) {
    return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions;
  }
  _d(t, r, i) {
    return { shape: t, sets: r || [], options: i || this.defaultOptions };
  }
  line(t, r, i, s, o) {
    const a = this._o(o);
    return this._d("line", [am(t, r, i, s, a)], a);
  }
  rectangle(t, r, i, s, o) {
    const a = this._o(o), n = [], l = J_(t, r, i, s, a);
    if (a.fill) {
      const h = [[t, r], [t + i, r], [t + i, r + s], [t, r + s]];
      a.fillStyle === "solid" ? n.push(ln([h], a)) : n.push(ni([h], a));
    }
    return a.stroke !== ge && n.push(l), this._d("rectangle", n, a);
  }
  ellipse(t, r, i, s, o) {
    const a = this._o(o), n = [], l = nm(i, s, a), h = nl(t, r, a, l);
    if (a.fill) if (a.fillStyle === "solid") {
      const c = nl(t, r, a, l).opset;
      c.type = "fillPath", n.push(c);
    } else n.push(ni([h.estimatedPoints], a));
    return a.stroke !== ge && n.push(h.opset), this._d("ellipse", n, a);
  }
  circle(t, r, i, s) {
    const o = this.ellipse(t, r, i, i, s);
    return o.shape = "circle", o;
  }
  linearPath(t, r) {
    const i = this._o(r);
    return this._d("linearPath", [wo(t, !1, i)], i);
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const h = this._o(l), c = [], u = uu(t, r, i, s, o, a, n, !0, h);
    if (n && h.fill) if (h.fillStyle === "solid") {
      const f = Object.assign({}, h);
      f.disableMultiStroke = !0;
      const d = uu(t, r, i, s, o, a, !0, !1, f);
      d.type = "fillPath", c.push(d);
    } else c.push(function(f, d, p, m, y, x, C) {
      const k = f, w = d;
      let T = Math.abs(p / 2), _ = Math.abs(m / 2);
      T += ft(0.01 * T, C), _ += ft(0.01 * _, C);
      let v = y, L = x;
      for (; v < 0; ) v += 2 * Math.PI, L += 2 * Math.PI;
      L - v > 2 * Math.PI && (v = 0, L = 2 * Math.PI);
      const W = (L - v) / C.curveStepCount, O = [];
      for (let M = v; M <= L; M += W) O.push([k + T * Math.cos(M), w + _ * Math.sin(M)]);
      return O.push([k + T * Math.cos(L), w + _ * Math.sin(L)]), O.push([k, w]), ni([O], C);
    }(t, r, i, s, o, a, h));
    return h.stroke !== ge && c.push(u), this._d("arc", c, h);
  }
  curve(t, r) {
    const i = this._o(r), s = [], o = cu(t, i);
    if (i.fill && i.fill !== ge) if (i.fillStyle === "solid") {
      const a = cu(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(a.ops) });
    } else {
      const a = [], n = t;
      if (n.length) {
        const l = typeof n[0][0] == "number" ? [n] : n;
        for (const h of l) h.length < 3 ? a.push(...h) : h.length === 3 ? a.push(...hn(mu([h[0], h[0], h[1], h[2]]), 10, (1 + i.roughness) / 2)) : a.push(...hn(mu(h), 10, (1 + i.roughness) / 2));
      }
      a.length && s.push(ni([a], i));
    }
    return i.stroke !== ge && s.push(o), this._d("curve", s, i);
  }
  polygon(t, r) {
    const i = this._o(r), s = [], o = wo(t, !0, i);
    return i.fill && (i.fillStyle === "solid" ? s.push(ln([t], i)) : s.push(ni([t], i))), i.stroke !== ge && s.push(o), this._d("polygon", s, i);
  }
  path(t, r) {
    const i = this._o(r), s = [];
    if (!t) return this._d("path", s, i);
    t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const o = i.fill && i.fill !== "transparent" && i.fill !== ge, a = i.stroke !== ge, n = !!(i.simplification && i.simplification < 1), l = function(c, u, f) {
      const d = sm(im(Sh(c))), p = [];
      let m = [], y = [0, 0], x = [];
      const C = () => {
        x.length >= 4 && m.push(...hn(x, u)), x = [];
      }, k = () => {
        C(), m.length && (p.push(m), m = []);
      };
      for (const { key: T, data: _ } of d) switch (T) {
        case "M":
          k(), y = [_[0], _[1]], m.push(y);
          break;
        case "L":
          C(), m.push([_[0], _[1]]);
          break;
        case "C":
          if (!x.length) {
            const v = m.length ? m[m.length - 1] : y;
            x.push([v[0], v[1]]);
          }
          x.push([_[0], _[1]]), x.push([_[2], _[3]]), x.push([_[4], _[5]]);
          break;
        case "Z":
          C(), m.push([y[0], y[1]]);
      }
      if (k(), !f) return p;
      const w = [];
      for (const T of p) {
        const _ = rB(T, f);
        _.length && w.push(_);
      }
      return w;
    }(t, 1, n ? 4 - 4 * (i.simplification || 1) : (1 + i.roughness) / 2), h = du(t, i);
    if (o) if (i.fillStyle === "solid") if (l.length === 1) {
      const c = du(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(c.ops) });
    } else s.push(ln(l, i));
    else s.push(ni(l, i));
    return a && (n ? l.forEach((c) => {
      s.push(wo(c, !1, i));
    }) : s.push(h)), this._d("path", s, i);
  }
  opsToPath(t, r) {
    let i = "";
    for (const s of t.ops) {
      const o = typeof r == "number" && r >= 0 ? s.data.map((a) => +a.toFixed(r)) : s.data;
      switch (s.op) {
        case "move":
          i += `M${o[0]} ${o[1]} `;
          break;
        case "bcurveTo":
          i += `C${o[0]} ${o[1]}, ${o[2]} ${o[3]}, ${o[4]} ${o[5]} `;
          break;
        case "lineTo":
          i += `L${o[0]} ${o[1]} `;
      }
    }
    return i.trim();
  }
  toPaths(t) {
    const r = t.sets || [], i = t.options || this.defaultOptions, s = [];
    for (const o of r) {
      let a = null;
      switch (o.type) {
        case "path":
          a = { d: this.opsToPath(o), stroke: i.stroke, strokeWidth: i.strokeWidth, fill: ge };
          break;
        case "fillPath":
          a = { d: this.opsToPath(o), stroke: ge, strokeWidth: 0, fill: i.fill || ge };
          break;
        case "fillSketch":
          a = this.fillSketch(o, i);
      }
      a && s.push(a);
    }
    return s;
  }
  fillSketch(t, r) {
    let i = r.fillWeight;
    return i < 0 && (i = r.strokeWidth / 2), { d: this.opsToPath(t), stroke: r.fill || ge, strokeWidth: i, fill: ge };
  }
  _mergedShape(t) {
    return t.filter((r, i) => i === 0 || r.op !== "move");
  }
}
class iB {
  constructor(t, r) {
    this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new ra(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.ctx, o = t.options.fixedDecimalPlaceDigits;
    for (const a of r) switch (a.type) {
      case "path":
        s.save(), s.strokeStyle = i.stroke === "none" ? "transparent" : i.stroke, s.lineWidth = i.strokeWidth, i.strokeLineDash && s.setLineDash(i.strokeLineDash), i.strokeLineDashOffset && (s.lineDashOffset = i.strokeLineDashOffset), this._drawToContext(s, a, o), s.restore();
        break;
      case "fillPath": {
        s.save(), s.fillStyle = i.fill || "";
        const n = t.shape === "curve" || t.shape === "polygon" || t.shape === "path" ? "evenodd" : "nonzero";
        this._drawToContext(s, a, o, n), s.restore();
        break;
      }
      case "fillSketch":
        this.fillSketch(s, a, i);
    }
  }
  fillSketch(t, r, i) {
    let s = i.fillWeight;
    s < 0 && (s = i.strokeWidth / 2), t.save(), i.fillLineDash && t.setLineDash(i.fillLineDash), i.fillLineDashOffset && (t.lineDashOffset = i.fillLineDashOffset), t.strokeStyle = i.fill || "", t.lineWidth = s, this._drawToContext(t, r, i.fixedDecimalPlaceDigits), t.restore();
  }
  _drawToContext(t, r, i, s = "nonzero") {
    t.beginPath();
    for (const o of r.ops) {
      const a = typeof i == "number" && i >= 0 ? o.data.map((n) => +n.toFixed(i)) : o.data;
      switch (o.op) {
        case "move":
          t.moveTo(a[0], a[1]);
          break;
        case "bcurveTo":
          t.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
          break;
        case "lineTo":
          t.lineTo(a[0], a[1]);
      }
    }
    r.type === "fillPath" ? t.fill(s) : t.stroke();
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  line(t, r, i, s, o) {
    const a = this.gen.line(t, r, i, s, o);
    return this.draw(a), a;
  }
  rectangle(t, r, i, s, o) {
    const a = this.gen.rectangle(t, r, i, s, o);
    return this.draw(a), a;
  }
  ellipse(t, r, i, s, o) {
    const a = this.gen.ellipse(t, r, i, s, o);
    return this.draw(a), a;
  }
  circle(t, r, i, s) {
    const o = this.gen.circle(t, r, i, s);
    return this.draw(o), o;
  }
  linearPath(t, r) {
    const i = this.gen.linearPath(t, r);
    return this.draw(i), i;
  }
  polygon(t, r) {
    const i = this.gen.polygon(t, r);
    return this.draw(i), i;
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const h = this.gen.arc(t, r, i, s, o, a, n, l);
    return this.draw(h), h;
  }
  curve(t, r) {
    const i = this.gen.curve(t, r);
    return this.draw(i), i;
  }
  path(t, r) {
    const i = this.gen.path(t, r);
    return this.draw(i), i;
  }
}
const lo = "http://www.w3.org/2000/svg";
class sB {
  constructor(t, r) {
    this.svg = t, this.gen = new ra(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.svg.ownerDocument || window.document, o = s.createElementNS(lo, "g"), a = t.options.fixedDecimalPlaceDigits;
    for (const n of r) {
      let l = null;
      switch (n.type) {
        case "path":
          l = s.createElementNS(lo, "path"), l.setAttribute("d", this.opsToPath(n, a)), l.setAttribute("stroke", i.stroke), l.setAttribute("stroke-width", i.strokeWidth + ""), l.setAttribute("fill", "none"), i.strokeLineDash && l.setAttribute("stroke-dasharray", i.strokeLineDash.join(" ").trim()), i.strokeLineDashOffset && l.setAttribute("stroke-dashoffset", `${i.strokeLineDashOffset}`);
          break;
        case "fillPath":
          l = s.createElementNS(lo, "path"), l.setAttribute("d", this.opsToPath(n, a)), l.setAttribute("stroke", "none"), l.setAttribute("stroke-width", "0"), l.setAttribute("fill", i.fill || ""), t.shape !== "curve" && t.shape !== "polygon" || l.setAttribute("fill-rule", "evenodd");
          break;
        case "fillSketch":
          l = this.fillSketch(s, n, i);
      }
      l && o.appendChild(l);
    }
    return o;
  }
  fillSketch(t, r, i) {
    let s = i.fillWeight;
    s < 0 && (s = i.strokeWidth / 2);
    const o = t.createElementNS(lo, "path");
    return o.setAttribute("d", this.opsToPath(r, i.fixedDecimalPlaceDigits)), o.setAttribute("stroke", i.fill || ""), o.setAttribute("stroke-width", s + ""), o.setAttribute("fill", "none"), i.fillLineDash && o.setAttribute("stroke-dasharray", i.fillLineDash.join(" ").trim()), i.fillLineDashOffset && o.setAttribute("stroke-dashoffset", `${i.fillLineDashOffset}`), o;
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  opsToPath(t, r) {
    return this.gen.opsToPath(t, r);
  }
  line(t, r, i, s, o) {
    const a = this.gen.line(t, r, i, s, o);
    return this.draw(a);
  }
  rectangle(t, r, i, s, o) {
    const a = this.gen.rectangle(t, r, i, s, o);
    return this.draw(a);
  }
  ellipse(t, r, i, s, o) {
    const a = this.gen.ellipse(t, r, i, s, o);
    return this.draw(a);
  }
  circle(t, r, i, s) {
    const o = this.gen.circle(t, r, i, s);
    return this.draw(o);
  }
  linearPath(t, r) {
    const i = this.gen.linearPath(t, r);
    return this.draw(i);
  }
  polygon(t, r) {
    const i = this.gen.polygon(t, r);
    return this.draw(i);
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const h = this.gen.arc(t, r, i, s, o, a, n, l);
    return this.draw(h);
  }
  curve(t, r) {
    const i = this.gen.curve(t, r);
    return this.draw(i);
  }
  path(t, r) {
    const i = this.gen.path(t, r);
    return this.draw(i);
  }
}
var rt = { canvas: (e, t) => new iB(e, t), svg: (e, t) => new sB(e, t), generator: (e) => new ra(e), newSeed: () => ra.newSeed() }, ut = /* @__PURE__ */ g(async (e, t, r) => {
  var d, p;
  let i;
  const s = t.useHtmlLabels || Ve((d = _t()) == null ? void 0 : d.htmlLabels);
  r ? i = r : i = "node default";
  const o = e.insert("g").attr("class", i).attr("id", t.domId || t.id), a = o.insert("g").attr("class", "label").attr("style", Yt(t.labelStyle));
  let n;
  t.label === void 0 ? n = "" : n = typeof t.label == "string" ? t.label : t.label[0];
  const l = !!t.icon || !!t.img, h = t.labelType === "markdown", c = await Ke(
    a,
    $e(Gr(n), _t()),
    {
      useHtmlLabels: s,
      width: t.width || ((p = _t().flowchart) == null ? void 0 : p.wrappingWidth),
      classes: h ? "markdown-node-label" : "",
      style: t.labelStyle,
      addSvgBackground: l,
      markdown: h
    },
    _t()
  );
  let u = c.getBBox();
  const f = ((t == null ? void 0 : t.padding) ?? 0) / 2;
  if (s) {
    const m = c.children[0], y = bt(c);
    await Ag(m, n), u = m.getBoundingClientRect(), y.attr("width", u.width), y.attr("height", u.height);
  }
  return s ? a.attr("transform", "translate(" + -u.width / 2 + ", " + -u.height / 2 + ")") : a.attr("transform", "translate(0, " + -u.height / 2 + ")"), t.centerLabel && a.attr("transform", "translate(" + -u.width / 2 + ", " + -u.height / 2 + ")"), a.insert("rect", ":first-child"), { shapeSvg: o, bbox: u, halfPadding: f, label: a };
}, "labelHelper"), cn = /* @__PURE__ */ g(async (e, t, r) => {
  var l, h;
  const i = r.useHtmlLabels ?? ne(_t()), s = e.insert("g").attr("class", "label").attr("style", r.labelStyle || ""), o = await Ke(s, $e(Gr(t), _t()), {
    useHtmlLabels: i,
    width: r.width || ((h = (l = _t()) == null ? void 0 : l.flowchart) == null ? void 0 : h.wrappingWidth),
    style: r.labelStyle,
    addSvgBackground: !!r.icon || !!r.img
  });
  let a = o.getBBox();
  const n = r.padding / 2;
  if (ne(_t())) {
    const c = o.children[0], u = bt(o);
    a = c.getBoundingClientRect(), u.attr("width", a.width), u.attr("height", a.height);
  }
  return i ? s.attr("transform", "translate(" + -a.width / 2 + ", " + -a.height / 2 + ")") : s.attr("transform", "translate(0, " + -a.height / 2 + ")"), r.centerLabel && s.attr("transform", "translate(" + -a.width / 2 + ", " + -a.height / 2 + ")"), s.insert("rect", ":first-child"), { shapeSvg: e, bbox: a, halfPadding: n, label: s };
}, "insertLabel"), nt = /* @__PURE__ */ g((e, t) => {
  const r = t.node().getBBox();
  e.width = r.width, e.height = r.height;
}, "updateNodeBounds"), ct = /* @__PURE__ */ g((e, t) => (e.look === "handDrawn" ? "rough-node" : "node") + " " + e.cssClasses + " " + (t || ""), "getNodeClasses");
function St(e) {
  const t = e.map((r, i) => `${i === 0 ? "M" : "L"}${r.x},${r.y}`);
  return t.push("Z"), t.join(" ");
}
g(St, "createPathFromPoints");
function Tr(e, t, r, i, s, o) {
  const a = [], l = r - e, h = i - t, c = l / o, u = 2 * Math.PI / c, f = t + h / 2;
  for (let d = 0; d <= 50; d++) {
    const p = d / 50, m = e + p * l, y = f + s * Math.sin(u * (m - e));
    a.push({ x: m, y });
  }
  return a;
}
g(Tr, "generateFullSineWavePoints");
function Fs(e, t, r, i, s, o) {
  const a = [], n = s * Math.PI / 180, c = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const f = n + u * c, d = e + r * Math.cos(f), p = t + r * Math.sin(f);
    a.push({ x: -d, y: -p });
  }
  return a;
}
g(Fs, "generateCirclePoints");
function cl(e) {
  const t = Array.from(e.childNodes).filter(
    (l) => l.tagName === "path"
  ), r = document.createElementNS("http://www.w3.org/2000/svg", "path"), i = t.map((l) => l.getAttribute("d")).filter((l) => l !== null).join(" ");
  r.setAttribute("d", i);
  const s = t.find((l) => l.getAttribute("fill") !== "none"), o = t.find((l) => l.getAttribute("stroke") !== "none"), a = /* @__PURE__ */ g((l, h) => (l == null ? void 0 : l.getAttribute(h)) ?? void 0, "getAttr");
  if (s) {
    const l = {
      fill: a(s, "fill"),
      "fill-opacity": a(s, "fill-opacity") ?? "1"
    };
    Object.entries(l).forEach(([h, c]) => {
      c && r.setAttribute(h, c);
    });
  }
  if (o) {
    const l = {
      stroke: a(o, "stroke"),
      "stroke-width": a(o, "stroke-width") ?? "1",
      "stroke-opacity": a(o, "stroke-opacity") ?? "1"
    };
    Object.entries(l).forEach(([h, c]) => {
      c && r.setAttribute(h, c);
    });
  }
  const n = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return n.appendChild(r), n;
}
g(cl, "mergePaths");
var oB = /* @__PURE__ */ g((e, t) => {
  var r = e.x, i = e.y, s = t.x - r, o = t.y - i, a = e.width / 2, n = e.height / 2, l, h;
  return Math.abs(o) * a > Math.abs(s) * n ? (o < 0 && (n = -n), l = o === 0 ? 0 : n * s / o, h = n) : (s < 0 && (a = -a), l = a, h = s === 0 ? 0 : a * o / s), { x: r + l, y: i + h };
}, "intersectRect"), Qr = oB, aB = /* @__PURE__ */ g(async (e, t, r, i = !1, s = !1) => {
  let o = t || "";
  typeof o == "object" && (o = o[0]);
  const a = _t(), n = ne(a);
  return await Ke(
    e,
    o,
    {
      style: r,
      isTitle: i,
      useHtmlLabels: n,
      markdown: !1,
      isNode: s,
      width: Number.POSITIVE_INFINITY
    },
    a
  );
}, "createLabel"), yr = aB, _r = /* @__PURE__ */ g((e, t, r, i, s) => [
  "M",
  e + s,
  t,
  // Move to the first point
  "H",
  e + r - s,
  // Draw horizontal line to the beginning of the right corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + r,
  t + s,
  // Draw arc to the right top corner
  "V",
  t + i - s,
  // Draw vertical line down to the beginning of the right bottom corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + r - s,
  t + i,
  // Draw arc to the right bottom corner
  "H",
  e + s,
  // Draw horizontal line to the beginning of the left bottom corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e,
  t + i - s,
  // Draw arc to the left bottom corner
  "V",
  t + s,
  // Draw vertical line up to the beginning of the left top corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + s,
  t,
  // Draw arc to the left top corner
  "Z"
  // Close the path
].join(" "), "createRoundedRectPathD"), nB = /* @__PURE__ */ g(async (e, t) => {
  const r = _t(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, n = a, { labelStyles: l, nodeStyles: h, borderStyles: c, backgroundStyles: u } = it(t), f = e.insert("g").attr("class", "cluster swimlane " + (t.cssClasses || "")).attr("id", t.id).attr("data-id", t.id).attr("data-et", "cluster").attr("data-look", t.look), d = Ve(r.flowchart.htmlLabels), p = t.direction === "LR", m = f.insert("g").attr("class", "cluster-label swimlane-label"), y = await Ke(m, t.label, {
    style: t.labelStyle,
    useHtmlLabels: d,
    isNode: !0,
    width: t.width
  });
  let x = y.getBBox();
  if (d) {
    const z = y.children[0], D = bt(y);
    x = z.getBoundingClientRect(), D.attr("width", x.width), D.attr("height", x.height);
  }
  const C = t.padding ?? 0, k = t.width <= x.width + C ? x.width + C : t.width;
  t.width <= x.width + C ? t.diff = (k - t.width) / 2 - C : t.diff = -C;
  const w = t.height, T = t.y - w / 2, _ = t.y + w / 2, v = t.x - k / 2, L = t.swimlaneContentTop !== void 0 ? t.swimlaneContentTop : T + w / 3, W = p ? 4 : 0, O = x.height + 2 * W;
  let M, U;
  if (p) {
    const z = Math.max(O, x.height + 2 * W), D = v + z, E = Math.max(0, k - z);
    if (t.look === "handDrawn") {
      const B = rt.svg(f), I = et(t, {
        roughness: 0.7,
        fill: o,
        stroke: n,
        fillWeight: 3,
        seed: s
      }), Y = et(t, {
        roughness: 0.7,
        fill: "none",
        stroke: n,
        seed: s
      }), X = B.rectangle(v, T, z, w, I);
      M = f.insert(() => X, ":first-child");
      const Z = B.rectangle(D, T, E, w, Y);
      U = f.insert(() => Z, ":first-child"), M.select("path:nth-child(2)").attr("style", c.join(";")), M.select("path").attr("style", u.join(";").replace("fill", "stroke"));
    } else
      M = f.insert("rect", ":first-child"), U = f.insert("rect", ":first-child"), M.attr("class", "swimlane-title").attr("style", h).attr("x", v).attr("y", T).attr("width", z).attr("height", w).attr("fill", o).attr("stroke", n), U.attr("class", "swimlane-body").attr("style", h).attr("x", D).attr("y", T).attr("width", E).attr("height", w).attr("fill", "none").attr("stroke", n);
    const A = v + z / 2, $ = t.y;
    m.attr(
      "transform",
      `translate(${A}, ${$}) rotate(-90) translate(${-x.width / 2}, ${-x.height / 2})`
    );
  } else {
    const z = Math.max(0, L - T), D = Math.min(O, z), E = T + D, A = Math.max(0, _ - E), $ = t.x - k / 2;
    if (t.look === "handDrawn") {
      const Y = rt.svg(f), X = et(t, {
        roughness: 0.7,
        fill: o,
        stroke: n,
        fillWeight: 3,
        seed: s
      }), Z = et(t, {
        roughness: 0.7,
        fill: "none",
        stroke: n,
        seed: s
      }), ot = Y.rectangle($, T, k, D, X);
      M = f.insert(() => ot, ":first-child");
      const Q = Y.rectangle($, E, k, A, Z);
      U = f.insert(() => Q, ":first-child"), M.select("path:nth-child(2)").attr("style", c.join(";")), M.select("path").attr("style", u.join(";").replace("fill", "stroke"));
    } else
      M = f.insert("rect", ":first-child"), U = f.insert("rect", ":first-child"), M.attr("class", "swimlane-title").attr("style", h).attr("x", $).attr("y", T).attr("width", k).attr("height", D).attr("fill", o).attr("stroke", n), U.attr("class", "swimlane-body").attr("style", h).attr("x", $).attr("y", E).attr("width", k).attr("height", A).attr("fill", "none").attr("stroke", n);
    const B = t.x - x.width / 2, I = T + (D - x.height) / 2;
    m.attr("transform", `translate(${B}, ${I})`);
  }
  if (H.trace("Swimlane data ", t, JSON.stringify(t)), l) {
    const z = m.select("span");
    z && z.attr("style", l);
  }
  return t.offsetX = 0, t.width = k, t.height = w, t.offsetY = x.height - C / 2, t.intersect = function(z) {
    return Qr(t, z);
  }, { cluster: f, labelBBox: x };
}, "swimlane"), hm = /* @__PURE__ */ g(async (e, t) => {
  H.info("Creating subgraph rect for ", t.id, t);
  const r = _t(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, { labelStyles: n, nodeStyles: l, borderStyles: h, backgroundStyles: c } = it(t), u = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), f = ne(r), d = u.insert("g").attr("class", "cluster-label ");
  let p;
  t.labelType === "markdown" ? p = await Ke(d, t.label, {
    style: t.labelStyle,
    useHtmlLabels: f,
    isNode: !0,
    width: t.width
  }) : p = await yr(d, t.label, t.labelStyle || "", !1, !0);
  let m = p.getBBox();
  if (ne(r)) {
    const v = p.children[0], L = bt(p);
    m = v.getBoundingClientRect(), L.attr("width", m.width), L.attr("height", m.height);
  }
  const y = t.width <= m.width + t.padding ? m.width + t.padding : t.width;
  t.width <= m.width + t.padding ? t.diff = (y - t.width) / 2 - t.padding : t.diff = -t.padding;
  const x = t.height, C = t.x - y / 2, k = t.y - x / 2;
  H.trace("Data ", t, JSON.stringify(t));
  let w;
  if (t.look === "handDrawn") {
    const v = rt.svg(u), L = et(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: a,
      fillWeight: 3,
      seed: s
    }), W = v.path(_r(C, k, y, x, 0), L);
    w = u.insert(() => (H.debug("Rough node insert CXC", W), W), ":first-child"), w.select("path:nth-child(2)").attr("style", h.join(";")), w.select("path").attr("style", c.join(";").replace("fill", "stroke"));
  } else
    w = u.insert("rect", ":first-child"), w.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", C).attr("y", k).attr("width", y).attr("height", x);
  const { subGraphTitleTopMargin: T } = ch(r);
  if (d.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - m.width / 2}, ${t.y - t.height / 2 + T})`
  ), n) {
    const v = d.select("span");
    v && v.attr("style", n);
  }
  const _ = w.node().getBBox();
  return t.offsetX = 0, t.width = _.width, t.height = _.height, t.offsetY = m.height - t.padding / 2, t.intersect = function(v) {
    return Qr(t, v);
  }, { cluster: u, labelBBox: m };
}, "rect"), lB = /* @__PURE__ */ g((e, t) => {
  const r = e.insert("g").attr("class", "note-cluster").attr("id", t.domId), i = r.insert("rect", ":first-child"), s = 0 * t.padding, o = s / 2;
  i.attr("rx", t.rx).attr("ry", t.ry).attr("x", t.x - t.width / 2 - o).attr("y", t.y - t.height / 2 - o).attr("width", t.width + s).attr("height", t.height + s).attr("fill", "none");
  const a = i.node().getBBox();
  return t.width = a.width, t.height = a.height, t.intersect = function(n) {
    return Qr(t, n);
  }, { cluster: r, labelBBox: { width: 0, height: 0 } };
}, "noteGroup"), hB = /* @__PURE__ */ g(async (e, t) => {
  const r = _t(), { themeVariables: i, handDrawnSeed: s } = r, { altBackground: o, compositeBackground: a, compositeTitleBackground: n, nodeBorder: l } = i, h = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-id", t.id).attr("data-look", t.look), c = h.insert("g", ":first-child"), u = h.insert("g").attr("class", "cluster-label");
  let f = h.append("rect");
  const d = await yr(u, t.label, t.labelStyle, void 0, !0);
  let p = d.getBBox();
  if (ne(r)) {
    const W = d.children[0], O = bt(d);
    p = W.getBoundingClientRect(), O.attr("width", p.width), O.attr("height", p.height);
  }
  const m = 0 * t.padding, y = m / 2, x = (t.width <= p.width + t.padding ? p.width + t.padding : t.width) + m;
  t.width <= p.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height + m, k = t.height + m - p.height - 6, w = t.x - x / 2, T = t.y - C / 2;
  t.width = x;
  const _ = t.y - t.height / 2 - y + p.height + 2;
  let v;
  if (t.look === "handDrawn") {
    const W = t.cssClasses.includes("statediagram-cluster-alt"), O = rt.svg(h), M = t.rx || t.ry ? O.path(_r(w, T, x, C, 10), {
      roughness: 0.7,
      fill: n,
      fillStyle: "solid",
      stroke: l,
      seed: s
    }) : O.rectangle(w, T, x, C, { seed: s });
    v = h.insert(() => M, ":first-child");
    const U = O.rectangle(w, _, x, k, {
      fill: W ? o : a,
      fillStyle: W ? "hachure" : "solid",
      stroke: l,
      seed: s
    });
    v = h.insert(() => M, ":first-child"), f = h.insert(() => U);
  } else
    v = c.insert("rect", ":first-child"), v.attr("class", "outer").attr("x", w).attr("y", T).attr("width", x).attr("height", C).attr("data-look", t.look), f.attr("class", "inner").attr("x", w).attr("y", _).attr("width", x).attr("height", k);
  u.attr(
    "transform",
    `translate(${t.x - p.width / 2}, ${T + 1 - (ne(r) ? 0 : 3)})`
  );
  const L = v.node().getBBox();
  return t.height = L.height, t.offsetX = 0, t.offsetY = p.height - t.padding / 2, t.labelBBox = p, t.intersect = function(W) {
    return Qr(t, W);
  }, { cluster: h, labelBBox: p };
}, "roundedWithTitle"), cB = /* @__PURE__ */ g(async (e, t) => {
  H.info("Creating subgraph rect for ", t.id, t);
  const r = _t(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, { labelStyles: n, nodeStyles: l, borderStyles: h, backgroundStyles: c } = it(t), u = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), f = ne(r), d = u.insert("g").attr("class", "cluster-label "), p = await Ke(d, t.label, {
    style: t.labelStyle,
    useHtmlLabels: f,
    isNode: !0,
    width: t.width
  });
  let m = p.getBBox();
  if (ne(r)) {
    const v = p.children[0], L = bt(p);
    m = v.getBoundingClientRect(), L.attr("width", m.width), L.attr("height", m.height);
  }
  const y = t.width <= m.width + t.padding ? m.width + t.padding : t.width;
  t.width <= m.width + t.padding ? t.diff = (y - t.width) / 2 - t.padding : t.diff = -t.padding;
  const x = t.height, C = t.x - y / 2, k = t.y - x / 2;
  H.trace("Data ", t, JSON.stringify(t));
  let w;
  if (t.look === "handDrawn") {
    const v = rt.svg(u), L = et(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: a,
      fillWeight: 4,
      seed: s
    }), W = v.path(_r(C, k, y, x, t.rx), L);
    w = u.insert(() => (H.debug("Rough node insert CXC", W), W), ":first-child"), w.select("path:nth-child(2)").attr("style", h.join(";")), w.select("path").attr("style", c.join(";").replace("fill", "stroke"));
  } else
    w = u.insert("rect", ":first-child"), w.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", C).attr("y", k).attr("width", y).attr("height", x);
  const { subGraphTitleTopMargin: T } = ch(r);
  if (d.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - m.width / 2}, ${t.y - t.height / 2 + T})`
  ), n) {
    const v = d.select("span");
    v && v.attr("style", n);
  }
  const _ = w.node().getBBox();
  return t.offsetX = 0, t.width = _.width, t.height = _.height, t.offsetY = m.height - t.padding / 2, t.intersect = function(v) {
    return Qr(t, v);
  }, { cluster: u, labelBBox: m };
}, "kanbanSection"), uB = /* @__PURE__ */ g((e, t) => {
  const r = _t(), { themeVariables: i, handDrawnSeed: s } = r, { nodeBorder: o } = i, a = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-look", t.look), n = a.insert("g", ":first-child"), l = 0 * t.padding, h = t.width + l;
  t.diff = -t.padding;
  const c = t.height + l, u = t.x - h / 2, f = t.y - c / 2;
  t.width = h;
  let d;
  if (t.look === "handDrawn") {
    const y = rt.svg(a).rectangle(u, f, h, c, {
      fill: "lightgrey",
      roughness: 0.5,
      strokeLineDash: [5],
      stroke: o,
      seed: s
    });
    d = a.insert(() => y, ":first-child");
  } else {
    d = n.insert("rect", ":first-child");
    let m = "outer";
    t.look, m = "divider", d.attr("class", m).attr("x", u).attr("y", f).attr("width", h).attr("height", c).attr("data-look", t.look);
  }
  const p = d.node().getBBox();
  return t.height = p.height, t.offsetX = 0, t.offsetY = 0, t.intersect = function(m) {
    return Qr(t, m);
  }, { cluster: a, labelBBox: {} };
}, "divider"), dB = hm, fB = {
  rect: hm,
  squareRect: dB,
  roundedWithTitle: hB,
  noteGroup: lB,
  divider: uB,
  kanbanSection: cB,
  swimlane: nB
}, cm = /* @__PURE__ */ new Map(), pB = /* @__PURE__ */ g(async (e, t) => {
  const r = t.shape || "rect", i = await fB[r](e, t);
  return cm.set(t.id, i), i;
}, "insertCluster"), RM = /* @__PURE__ */ g(() => {
  cm = /* @__PURE__ */ new Map();
}, "clear");
function um(e, t) {
  return e.intersect(t);
}
g(um, "intersectNode");
var gB = um;
function dm(e, t, r, i) {
  var s = e.x, o = e.y, a = s - i.x, n = o - i.y, l = Math.sqrt(t * t * n * n + r * r * a * a), h = Math.abs(t * r * a / l);
  i.x < s && (h = -h);
  var c = Math.abs(t * r * n / l);
  return i.y < o && (c = -c), { x: s + h, y: o + c };
}
g(dm, "intersectEllipse");
var fm = dm;
function pm(e, t, r) {
  return fm(e, t, t, r);
}
g(pm, "intersectCircle");
var mB = pm;
function gm(e, t, r, i) {
  {
    const s = t.y - e.y, o = e.x - t.x, a = t.x * e.y - e.x * t.y, n = s * r.x + o * r.y + a, l = s * i.x + o * i.y + a, h = 1e-6;
    if (n !== 0 && l !== 0 && ul(n, l))
      return;
    const c = i.y - r.y, u = r.x - i.x, f = i.x * r.y - r.x * i.y, d = c * e.x + u * e.y + f, p = c * t.x + u * t.y + f;
    if (Math.abs(d) < h && Math.abs(p) < h && ul(d, p))
      return;
    const m = s * u - c * o;
    if (m === 0)
      return;
    const y = Math.abs(m / 2);
    let x = o * f - u * a;
    const C = x < 0 ? (x - y) / m : (x + y) / m;
    x = c * a - s * f;
    const k = x < 0 ? (x - y) / m : (x + y) / m;
    return { x: C, y: k };
  }
}
g(gm, "intersectLine");
function ul(e, t) {
  return e * t > 0;
}
g(ul, "sameSign");
var yB = gm;
function mm(e, t, r) {
  let i = e.x, s = e.y, o = [], a = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY;
  typeof t.forEach == "function" ? t.forEach(function(c) {
    a = Math.min(a, c.x), n = Math.min(n, c.y);
  }) : (a = Math.min(a, t.x), n = Math.min(n, t.y));
  let l = i - e.width / 2 - a, h = s - e.height / 2 - n;
  for (let c = 0; c < t.length; c++) {
    let u = t[c], f = t[c < t.length - 1 ? c + 1 : 0], d = yB(
      e,
      r,
      { x: l + u.x, y: h + u.y },
      { x: l + f.x, y: h + f.y }
    );
    d && o.push(d);
  }
  return o.length ? (o.length > 1 && o.sort(function(c, u) {
    let f = c.x - r.x, d = c.y - r.y, p = Math.sqrt(f * f + d * d), m = u.x - r.x, y = u.y - r.y, x = Math.sqrt(m * m + y * y);
    return p < x ? -1 : p === x ? 0 : 1;
  }), o[0]) : e;
}
g(mm, "intersectPolygon");
var xB = mm, tt = {
  node: gB,
  circle: mB,
  ellipse: fm,
  polygon: xB,
  rect: Qr
};
function ym(e, t) {
  const { labelStyles: r } = it(t);
  t.labelStyle = r;
  const i = ct(t);
  let s = i;
  i || (s = "anchor");
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), a = 1, { cssStyles: n } = t, l = rt.svg(o), h = et(t, { fill: "black", stroke: "none", fillStyle: "solid" });
  t.look !== "handDrawn" && (h.roughness = 0);
  const c = l.circle(0, 0, a * 2, h), u = o.insert(() => c, ":first-child");
  return u.attr("class", "anchor").attr("style", Yt(n)), nt(t, u), t.intersect = function(f) {
    return H.info("Circle intersect", t, a, f), tt.circle(t, a, f);
  }, o;
}
g(ym, "anchor");
function dl(e, t, r, i, s, o, a) {
  const l = (e + r) / 2, h = (t + i) / 2, c = Math.atan2(i - t, r - e), u = (r - e) / 2, f = (i - t) / 2, d = u / s, p = f / o, m = Math.sqrt(d ** 2 + p ** 2);
  if (m > 1)
    throw new Error("The given radii are too small to create an arc between the points.");
  const y = Math.sqrt(1 - m ** 2), x = l + y * o * Math.sin(c) * (a ? -1 : 1), C = h - y * s * Math.cos(c) * (a ? -1 : 1), k = Math.atan2((t - C) / o, (e - x) / s);
  let T = Math.atan2((i - C) / o, (r - x) / s) - k;
  a && T < 0 && (T += 2 * Math.PI), !a && T > 0 && (T -= 2 * Math.PI);
  const _ = [];
  for (let v = 0; v < 20; v++) {
    const L = v / 19, W = k + L * T, O = x + s * Math.cos(W), M = C + o * Math.sin(W);
    _.push({ x: O, y: M });
  }
  return _;
}
g(dl, "generateArcPoints");
function xm(e, t, r) {
  const [i, s] = [t, r].sort((o, a) => a - o);
  return s * (1 - Math.sqrt(1 - (e / i / 2) ** 2));
}
g(xm, "calculateArcSagitta");
async function Cm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = /* @__PURE__ */ g((W) => W + a, "calcTotalHeight"), l = /* @__PURE__ */ g((W) => {
    const O = W / 2;
    return [O / (2.5 + W / 50), O];
  }, "calcEllipseRadius"), { shapeSvg: h, bbox: c } = await ut(e, t, ct(t)), u = n(t != null && t.height ? t == null ? void 0 : t.height : c.height), [f, d] = l(u), p = xm(u, f, d), y = (t != null && t.width ? t == null ? void 0 : t.width : c.width) + o * 2 + p - p, x = u, { cssStyles: C } = t, k = [
    { x: y / 2, y: -x / 2 },
    { x: -y / 2, y: -x / 2 },
    ...dl(-y / 2, -x / 2, -y / 2, x / 2, f, d, !1),
    { x: y / 2, y: x / 2 },
    ...dl(y / 2, x / 2, y / 2, -x / 2, f, d, !0)
  ], w = rt.svg(h), T = et(t, {});
  t.look !== "handDrawn" && (T.roughness = 0, T.fillStyle = "solid");
  const _ = St(k), v = w.path(_, T), L = h.insert(() => v, ":first-child");
  return L.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && L.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(${f / 2}, 0)`), nt(t, L), t.intersect = function(W) {
    return tt.polygon(t, k, W);
  }, h;
}
g(Cm, "bowTieRect");
function nr(e, t, r, i) {
  return e.insert("polygon", ":first-child").attr(
    "points",
    i.map(function(s) {
      return s.x + "," + s.y;
    }).join(" ")
  ).attr("class", "label-container").attr("transform", "translate(" + -t / 2 + "," + r / 2 + ")");
}
g(nr, "insertPolygonShape");
var ho = 12;
async function bm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 28 : s, a = t.look === "neo" ? 24 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = ((t == null ? void 0 : t.width) ?? l.width) + (t.look === "neo" ? o * 2 : o + ho), c = ((t == null ? void 0 : t.height) ?? l.height) + (t.look === "neo" ? a * 2 : a), u = 0, f = h, d = -c, p = 0, m = [
    { x: u + ho, y: d },
    { x: f, y: d },
    { x: f, y: p },
    { x: u, y: p },
    { x: u, y: d + ho },
    { x: u + ho, y: d }
  ];
  let y;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = rt.svg(n), k = et(t, {}), w = St(m), T = C.path(w, k);
    y = n.insert(() => T, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), x && y.attr("style", x);
  } else
    y = nr(n, h, c, m);
  return i && y.attr("style", i), nt(t, y), t.intersect = function(C) {
    return tt.polygon(t, m, C);
  }, n;
}
g(bm, "card");
function km(e, t) {
  const { nodeStyles: r } = it(t);
  t.label = "";
  const i = e.insert("g").attr("class", ct(t)).attr("id", t.domId ?? t.id), { cssStyles: s } = t, o = Math.max(28, t.width ?? 0), a = [
    { x: 0, y: o / 2 },
    { x: o / 2, y: 0 },
    { x: 0, y: -o / 2 },
    { x: -o / 2, y: 0 }
  ], n = rt.svg(i), l = et(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const h = St(a), c = n.path(h, l), u = i.insert(() => c, ":first-child");
  return s && t.look !== "handDrawn" && u.selectAll("path").attr("style", s), r && t.look !== "handDrawn" && u.selectAll("path").attr("style", r), t.width = 28, t.height = 28, t.intersect = function(f) {
    return tt.polygon(t, a, f);
  }, i;
}
g(km, "choice");
async function wh(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = it(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, halfPadding: n } = await ut(e, t, ct(t)), l = 16, h = (r == null ? void 0 : r.padding) ?? n, c = t.look === "neo" ? a.width / 2 + l * 2 : a.width / 2 + h;
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const d = rt.svg(o), p = et(t, {}), m = d.circle(0, 0, c * 2, p);
    u = o.insert(() => m, ":first-child"), u.attr("class", "basic label-container").attr("style", Yt(f));
  } else
    u = o.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", s).attr("r", c).attr("cx", 0).attr("cy", 0);
  return nt(t, u), t.calcIntersect = function(d, p) {
    const m = d.width / 2;
    return tt.circle(d, m, p);
  }, t.intersect = function(d) {
    return H.info("Circle intersect", t, c, d), tt.circle(t, c, d);
  }, o;
}
g(wh, "circle");
function Sm(e) {
  const t = Math.cos(Math.PI / 4), r = Math.sin(Math.PI / 4), i = e * 2, s = { x: i / 2 * t, y: i / 2 * r }, o = { x: -(i / 2) * t, y: i / 2 * r }, a = { x: -(i / 2) * t, y: -(i / 2) * r }, n = { x: i / 2 * t, y: -(i / 2) * r };
  return `M ${o.x},${o.y} L ${n.x},${n.y}
                   M ${s.x},${s.y} L ${a.x},${a.y}`;
}
g(Sm, "createLine");
function wm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r, t.label = "";
  const s = e.insert("g").attr("class", ct(t)).attr("id", t.domId ?? t.id), o = Math.max(30, (t == null ? void 0 : t.width) ?? 0), { cssStyles: a } = t, n = rt.svg(s), l = et(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const h = n.circle(0, 0, o * 2, l), c = Sm(o), u = n.path(c, l), f = s.insert(() => h, ":first-child");
  return f.insert(() => u), f.attr("class", "outer-path"), a && t.look !== "handDrawn" && f.selectAll("path").attr("style", a), i && t.look !== "handDrawn" && f.selectAll("path").attr("style", i), nt(t, f), t.intersect = function(d) {
    return H.info("crossedCircle intersect", t, { radius: o, point: d }), tt.circle(t, o, d);
  }, s;
}
g(wm, "crossedCircle");
function tr(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, c = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const f = n + u * c, d = e + r * Math.cos(f), p = t + r * Math.sin(f);
    a.push({ x: -d, y: -p });
  }
  return a;
}
g(tr, "generateCirclePoints");
async function Tm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ut(e, t, ct(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, h = o.width + n, c = o.height + l, u = Math.max(5, c * 0.1), { cssStyles: f } = t, d = [
    ...tr(h / 2, -c / 2, u, 30, -90, 0),
    { x: -h / 2 - u, y: u },
    ...tr(h / 2 + u * 2, -u, u, 20, -180, -270),
    ...tr(h / 2 + u * 2, u, u, 20, -90, -180),
    { x: -h / 2 - u, y: -c / 2 },
    ...tr(h / 2, c / 2, u, 20, 0, 90)
  ], p = [
    { x: h / 2, y: -c / 2 - u },
    { x: -h / 2, y: -c / 2 - u },
    ...tr(h / 2, -c / 2, u, 20, -90, 0),
    { x: -h / 2 - u, y: -u },
    ...tr(h / 2 + h * 0.1, -u, u, 20, -180, -270),
    ...tr(h / 2 + h * 0.1, u, u, 20, -90, -180),
    { x: -h / 2 - u, y: c / 2 },
    ...tr(h / 2, c / 2, u, 20, 0, 90),
    { x: -h / 2, y: c / 2 + u },
    { x: h / 2, y: c / 2 + u }
  ], m = rt.svg(s), y = et(t, { fill: "none" });
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const C = St(d).replace("Z", ""), k = m.path(C, y), w = St(p), T = m.path(w, { ...y }), _ = s.insert("g", ":first-child");
  return _.insert(() => T, ":first-child").attr("stroke-opacity", 0), _.insert(() => k, ":first-child"), _.attr("class", "text"), f && t.look !== "handDrawn" && _.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), _.attr("transform", `translate(${u}, 0)`), a.attr(
    "transform",
    `translate(${-h / 2 + u - (o.x - (o.left ?? 0))},${-c / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), nt(t, _), t.intersect = function(v) {
    return tt.polygon(t, p, v);
  }, s;
}
g(Tm, "curlyBraceLeft");
function er(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, c = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const f = n + u * c, d = e + r * Math.cos(f), p = t + r * Math.sin(f);
    a.push({ x: d, y: p });
  }
  return a;
}
g(er, "generateCirclePoints");
async function _m(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ut(e, t, ct(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, h = o.width + (t.look === "neo" ? n * 2 : n), c = o.height + (t.look === "neo" ? l * 2 : l), u = Math.max(5, c * 0.1), { cssStyles: f } = t, d = [
    ...er(h / 2, -c / 2, u, 20, -90, 0),
    { x: h / 2 + u, y: -u },
    ...er(h / 2 + u * 2, -u, u, 20, -180, -270),
    ...er(h / 2 + u * 2, u, u, 20, -90, -180),
    { x: h / 2 + u, y: c / 2 },
    ...er(h / 2, c / 2, u, 20, 0, 90)
  ], p = [
    { x: -h / 2, y: -c / 2 - u },
    { x: h / 2, y: -c / 2 - u },
    ...er(h / 2, -c / 2, u, 20, -90, 0),
    { x: h / 2 + u, y: -u },
    ...er(h / 2 + u * 2, -u, u, 20, -180, -270),
    ...er(h / 2 + u * 2, u, u, 20, -90, -180),
    { x: h / 2 + u, y: c / 2 },
    ...er(h / 2, c / 2, u, 20, 0, 90),
    { x: h / 2, y: c / 2 + u },
    { x: -h / 2, y: c / 2 + u }
  ], m = rt.svg(s), y = et(t, { fill: "none" });
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const C = St(d).replace("Z", ""), k = m.path(C, y), w = St(p), T = m.path(w, { ...y }), _ = s.insert("g", ":first-child");
  return _.insert(() => T, ":first-child").attr("stroke-opacity", 0), _.insert(() => k, ":first-child"), _.attr("class", "text"), f && t.look !== "handDrawn" && _.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), _.attr("transform", `translate(${-u}, 0)`), a.attr(
    "transform",
    `translate(${-h / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-c / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), nt(t, _), t.intersect = function(v) {
    return tt.polygon(t, p, v);
  }, s;
}
g(_m, "curlyBraceRight");
function Xt(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, c = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const f = n + u * c, d = e + r * Math.cos(f), p = t + r * Math.sin(f);
    a.push({ x: -d, y: -p });
  }
  return a;
}
g(Xt, "generateCirclePoints");
async function Bm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ut(e, t, ct(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, h = o.width + (t.look === "neo" ? n * 2 : n), c = o.height + (t.look === "neo" ? l * 2 : l), u = Math.max(5, c * 0.1), { cssStyles: f } = t, d = [
    ...Xt(h / 2, -c / 2, u, 30, -90, 0),
    { x: -h / 2 - u, y: u },
    ...Xt(h / 2 + u * 2, -u, u, 20, -180, -270),
    ...Xt(h / 2 + u * 2, u, u, 20, -90, -180),
    { x: -h / 2 - u, y: -c / 2 },
    ...Xt(h / 2, c / 2, u, 20, 0, 90)
  ], p = [
    ...Xt(-h / 2 + u + u / 2, -c / 2, u, 20, -90, -180),
    { x: h / 2 - u / 2, y: u },
    ...Xt(-h / 2 - u / 2, -u, u, 20, 0, 90),
    ...Xt(-h / 2 - u / 2, u, u, 20, -90, 0),
    { x: h / 2 - u / 2, y: -u },
    ...Xt(-h / 2 + u + u / 2, c / 2, u, 30, -180, -270)
  ], m = [
    { x: h / 2, y: -c / 2 - u },
    { x: -h / 2, y: -c / 2 - u },
    ...Xt(h / 2, -c / 2, u, 20, -90, 0),
    { x: -h / 2 - u, y: -u },
    ...Xt(h / 2 + u * 2, -u, u, 20, -180, -270),
    ...Xt(h / 2 + u * 2, u, u, 20, -90, -180),
    { x: -h / 2 - u, y: c / 2 },
    ...Xt(h / 2, c / 2, u, 20, 0, 90),
    { x: -h / 2, y: c / 2 + u },
    { x: h / 2 - u - u / 2, y: c / 2 + u },
    ...Xt(-h / 2 + u + u / 2, -c / 2, u, 20, -90, -180),
    { x: h / 2 - u / 2, y: u },
    ...Xt(-h / 2 - u / 2, -u, u, 20, 0, 90),
    ...Xt(-h / 2 - u / 2, u, u, 20, -90, 0),
    { x: h / 2 - u / 2, y: -u },
    ...Xt(-h / 2 + u + u / 2, c / 2, u, 30, -180, -270)
  ], y = rt.svg(s), x = et(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const k = St(d).replace("Z", ""), w = y.path(k, x), _ = St(p).replace("Z", ""), v = y.path(_, x), L = St(m), W = y.path(L, { ...x }), O = s.insert("g", ":first-child");
  return O.insert(() => W, ":first-child").attr("stroke-opacity", 0), O.insert(() => w, ":first-child"), O.insert(() => v, ":first-child"), O.attr("class", "text"), f && t.look !== "handDrawn" && O.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && O.selectAll("path").attr("style", i), O.attr("transform", `translate(${u - u / 4}, 0)`), a.attr(
    "transform",
    `translate(${-h / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-c / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), nt(t, O), t.intersect = function(M) {
    return tt.polygon(t, m, M);
  }, s;
}
g(Bm, "curlyBraces");
async function vm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = 20, l = 5, { shapeSvg: h, bbox: c } = await ut(e, t, ct(t)), u = Math.max(n, (c.width + o * 2) * 1.25, (t == null ? void 0 : t.width) ?? 0), f = Math.max(l, c.height + a * 2, (t == null ? void 0 : t.height) ?? 0), d = f / 2, { cssStyles: p } = t, m = rt.svg(h), y = et(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = u, C = f, k = x - d, w = C / 4, T = [
    { x: k, y: 0 },
    { x: w, y: 0 },
    { x: 0, y: C / 2 },
    { x: w, y: C },
    { x: k, y: C },
    ...Fs(-k, -C / 2, d, 50, 270, 90)
  ], _ = St(T), v = m.path(_, y), L = h.insert(() => v, ":first-child");
  return L.attr("class", "basic label-container outer-path"), p && t.look !== "handDrawn" && L.selectChildren("path").attr("style", p), i && t.look !== "handDrawn" && L.selectChildren("path").attr("style", i), L.attr("transform", `translate(${-u / 2}, ${-f / 2})`), nt(t, L), t.intersect = function(W) {
    return tt.polygon(t, T, W);
  }, h;
}
g(vm, "curvedTrapezoid");
var CB = /* @__PURE__ */ g((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createCylinderPathD"), bB = /* @__PURE__ */ g((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createOuterCylinderPathD"), kB = /* @__PURE__ */ g((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), yu = 8, xu = 8;
async function Lm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 24 : s, a = t.look === "neo" ? 24 : s;
  if (t.width || t.height) {
    const y = t.width ?? 0;
    t.width = (t.width ?? 0) - a, t.width < xu && (t.width = xu);
    const C = y / 2 / (2.5 + y / 50);
    t.height = (t.height ?? 0) - o - C * 3, t.height < yu && (t.height = yu);
  }
  const { shapeSvg: n, bbox: l, label: h } = await ut(e, t, ct(t)), c = (t.width ? t.width : l.width) + a, u = c / 2, f = u / (2.5 + c / 50), d = (t.height ? t.height : l.height) + o + f;
  let p;
  const { cssStyles: m } = t;
  if (t.look === "handDrawn") {
    const y = rt.svg(n), x = bB(0, 0, c, d, u, f), C = kB(0, f, c, d, u, f), k = et(t, {}), w = y.path(x, k), T = y.path(C, et(t, { fill: "none" }));
    p = n.insert(() => T, ":first-child"), p = n.insert(() => w, ":first-child"), p.attr("class", "basic label-container"), m && p.attr("style", m);
  } else {
    const y = CB(0, 0, c, d, u, f);
    p = n.insert("path", ":first-child").attr("d", y).attr("class", "basic label-container outer-path").attr("style", Yt(m)).attr("style", i);
  }
  return p.attr("label-offset-y", f), p.attr("transform", `translate(${-c / 2}, ${-(d / 2 + f)})`), nt(t, p), h.attr(
    "transform",
    `translate(${-(l.width / 2) - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + (t.padding ?? 0) / 1.5 - (l.y - (l.top ?? 0))})`
  ), t.intersect = function(y) {
    const x = tt.rect(t, y), C = x.x - (t.x ?? 0);
    if (u != 0 && (Math.abs(C) < (t.width ?? 0) / 2 || Math.abs(C) == (t.width ?? 0) / 2 && Math.abs(x.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
      let k = f * f * (1 - C * C / (u * u));
      k > 0 && (k = Math.sqrt(k)), k = f - k, y.y - (t.y ?? 0) > 0 && (k = -k), x.y += k;
    }
    return x;
  }, n;
}
g(Lm, "cylinder");
async function Yi(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = it(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a } = await ut(e, t, ct(t)), n = Math.max(a.width + r.labelPaddingX * 2, (t == null ? void 0 : t.width) || 0), l = Math.max(a.height + r.labelPaddingY * 2, (t == null ? void 0 : t.height) || 0), h = -n / 2, c = -l / 2;
  let u, { rx: f, ry: d } = t;
  const { cssStyles: p } = t;
  if (r != null && r.rx && r.ry && (f = r.rx, d = r.ry), t.look === "handDrawn") {
    const m = rt.svg(o), y = et(t, {}), x = f || d ? m.path(_r(h, c, n, l, f || 0), y) : m.rectangle(h, c, n, l, y);
    u = o.insert(() => x, ":first-child"), u.attr("class", "basic label-container").attr("style", Yt(p));
  } else
    u = o.insert("rect", ":first-child"), u.attr("class", "basic label-container").attr("style", s).attr("rx", Yt(f)).attr("ry", Yt(d)).attr("x", h).attr("y", c).attr("width", n).attr("height", l);
  return nt(t, u), t.calcIntersect = function(m, y) {
    return tt.rect(m, y);
  }, t.intersect = function(m) {
    return tt.rect(t, m);
  }, o;
}
g(Yi, "drawRect");
async function Am(e, t) {
  const { cssClasses: r, labelPaddingX: i, labelPaddingY: s, padding: o, width: a, height: n } = t, l = {
    rx: 0,
    ry: 0,
    labelPaddingX: i ?? (o ?? 0) * 2,
    labelPaddingY: s ?? o ?? 0
  }, h = await Yi(e, t, l);
  if (t.look === "handDrawn") {
    const d = rt.svg(h), p = et(t, {}), m = h.select(".basic.label-container > path:nth-child(2)"), y = m.node();
    if (!y)
      return h;
    let x = null;
    if (y instanceof SVGGraphicsElement)
      x = y.getBBox();
    else
      return h;
    return h.insert(
      () => d.line(x.x, x.y, x.x + x.width, x.y, p),
      ".basic.label-container g.label"
    ), h.insert(
      () => d.line(
        x.x,
        x.y + x.height,
        x.x + x.width,
        x.y + x.height,
        p
      ),
      ".basic.label-container g.label"
    ), m.remove(), h;
  }
  const c = h.select(".basic.label-container"), u = (Number(c.attr("width")) || a) ?? 0, f = (Number(c.attr("height")) || n) ?? 0;
  return u > 0 && f > 0 && c.attr("stroke-dasharray", `${u} ${f}`), h;
}
g(Am, "datastore");
async function Fm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 16 : t.padding ?? 0, { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = n.width + s, c = n.height + o, u = c * 0.2, f = -h / 2, d = -c / 2 - u / 2, { cssStyles: p } = t, m = rt.svg(a), y = et(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: f, y: d + u },
    { x: -f, y: d + u },
    { x: -f, y: -d },
    { x: f, y: -d },
    { x: f, y: d },
    { x: -f, y: d },
    { x: -f, y: d + u }
  ], C = m.polygon(
    x.map((w) => [w.x, w.y]),
    y
  ), k = a.insert(() => C, ":first-child");
  return k.attr("class", "basic label-container outer-path"), p && t.look !== "handDrawn" && k.selectAll("path").attr("style", p), i && t.look !== "handDrawn" && k.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${f + (t.padding ?? 0) / 2 - (n.x - (n.left ?? 0))}, ${d + u + (t.padding ?? 0) / 2 - (n.y - (n.top ?? 0))})`
  ), nt(t, k), t.intersect = function(w) {
    return tt.rect(t, w);
  }, a;
}
g(Fm, "dividedRectangle");
async function Em(e, t) {
  var d, p;
  const { labelStyles: r, nodeStyles: i } = it(t), s = t.look === "neo" ? 12 : 5;
  t.labelStyle = r;
  const o = t.padding ?? 0, a = t.look === "neo" ? 16 : o, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = (t != null && t.width ? (t == null ? void 0 : t.width) / 2 : l.width / 2) + (a ?? 0), c = h - s;
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = rt.svg(n), y = et(t, { roughness: 0.2, strokeWidth: 2.5 }), x = et(t, { roughness: 0.2, strokeWidth: 1.5 }), C = m.circle(0, 0, h * 2, y), k = m.circle(0, 0, c * 2, x);
    u = n.insert("g", ":first-child"), u.attr("class", Yt(t.cssClasses)).attr("style", Yt(f)), (d = u.node()) == null || d.appendChild(C), (p = u.node()) == null || p.appendChild(k);
  } else {
    u = n.insert("g", ":first-child");
    const m = u.insert("circle", ":first-child"), y = u.insert("circle");
    u.attr("class", "basic label-container").attr("style", i), m.attr("class", "outer-circle").attr("style", i).attr("r", h).attr("cx", 0).attr("cy", 0), y.attr("class", "inner-circle").attr("style", i).attr("r", c).attr("cx", 0).attr("cy", 0);
  }
  return nt(t, u), t.intersect = function(m) {
    return H.info("DoubleCircle intersect", t, h, m), tt.circle(t, h, m);
  }, n;
}
g(Em, "doublecircle");
function Mm(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = it(t);
  t.label = "", t.labelStyle = i;
  const o = e.insert("g").attr("class", ct(t)).attr("id", t.domId ?? t.id), a = 7, { cssStyles: n } = t, l = rt.svg(o), { nodeBorder: h } = r, c = et(t, { fillStyle: "solid" });
  t.look !== "handDrawn" && (c.roughness = 0);
  const u = l.circle(0, 0, a * 2, c), f = o.insert(() => u, ":first-child");
  return f.selectAll("path").attr("style", `fill: ${h} !important;`), n && n.length > 0 && t.look !== "handDrawn" && f.selectAll("path").attr("style", n), s && t.look !== "handDrawn" && f.selectAll("path").attr("style", s), nt(t, f), t.intersect = function(d) {
    return H.info("filledCircle intersect", t, { radius: a, point: d }), tt.circle(t, a, d);
  }, o;
}
g(Mm, "filledCircle");
var Cu = 10, bu = 10;
async function $m(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.height = (t == null ? void 0 : t.height) ?? 0, t.height < Cu && (t.height = Cu), t.width = ((t == null ? void 0 : t.width) ?? 0) - o - o / 2, t.width < bu && (t.width = bu));
  const { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = (t != null && t.width ? t == null ? void 0 : t.width : n.width) + (o ?? 0), c = t != null && t.height ? t == null ? void 0 : t.height : h + n.height, u = c, f = [
    { x: 0, y: -c },
    { x: u, y: -c },
    { x: u / 2, y: 0 }
  ], { cssStyles: d } = t, p = rt.svg(a), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = St(f), x = p.path(y, m), C = a.insert(() => x, ":first-child").attr("transform", `translate(${-c / 2}, ${c / 2})`).attr("class", "outer-path");
  return d && t.look !== "handDrawn" && C.selectChildren("path").attr("style", d), i && t.look !== "handDrawn" && C.selectChildren("path").attr("style", i), t.width = h, t.height = c, nt(t, C), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${-c / 2 + (t.padding ?? 0) / 2 + (n.y - (n.top ?? 0))})`
  ), t.intersect = function(k) {
    return H.info("Triangle intersect", t, f, k), tt.polygon(t, f, k);
  }, a;
}
g($m, "flippedTriangle");
function Om(e, t, { dir: r, config: { state: i, themeVariables: s } }) {
  const { nodeStyles: o } = it(t);
  t.label = "";
  const a = e.insert("g").attr("class", ct(t)).attr("id", t.domId ?? t.id), { cssStyles: n } = t;
  let l = Math.max(70, (t == null ? void 0 : t.width) ?? 0), h = Math.max(10, (t == null ? void 0 : t.height) ?? 0);
  r === "LR" && (l = Math.max(10, (t == null ? void 0 : t.width) ?? 0), h = Math.max(70, (t == null ? void 0 : t.height) ?? 0));
  const c = -1 * l / 2, u = -1 * h / 2, f = rt.svg(a), d = et(t, {
    stroke: s.lineColor,
    fill: s.lineColor
  });
  t.look !== "handDrawn" && (d.roughness = 0, d.fillStyle = "solid");
  const p = f.rectangle(c, u, l, h, d), m = a.insert(() => p, ":first-child");
  n && t.look !== "handDrawn" && m.selectAll("path").attr("style", n), o && t.look !== "handDrawn" && m.selectAll("path").attr("style", o), nt(t, m);
  const y = (i == null ? void 0 : i.padding) ?? 0;
  return t.width && t.height && (t.width += y / 2 || 0, t.height += y / 2 || 0), t.intersect = function(x) {
    return tt.rect(t, x);
  }, a;
}
g(Om, "forkJoin");
async function Im(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = 15, o = 10, a = t.look === "neo" ? 16 : t.padding ?? 0, n = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.height = ((t == null ? void 0 : t.height) ?? 0) - n * 2, t.height < o && (t.height = o), t.width = ((t == null ? void 0 : t.width) ?? 0) - a * 2, t.width < s && (t.width = s));
  const { shapeSvg: l, bbox: h } = await ut(e, t, ct(t)), c = (t != null && t.width ? t == null ? void 0 : t.width : Math.max(s, h.width)) + a * 2, u = (t != null && t.height ? t == null ? void 0 : t.height : Math.max(o, h.height)) + n * 2, f = u / 2, { cssStyles: d } = t, p = rt.svg(l), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = [
    { x: -c / 2, y: -u / 2 },
    { x: c / 2 - f, y: -u / 2 },
    ...Fs(-c / 2 + f, 0, f, 50, 90, 270),
    { x: c / 2 - f, y: u / 2 },
    { x: -c / 2, y: u / 2 }
  ], x = St(y), C = p.path(x, m), k = l.insert(() => C, ":first-child");
  return k.attr("class", "basic label-container outer-path"), d && t.look !== "handDrawn" && k.selectChildren("path").attr("style", d), i && t.look !== "handDrawn" && k.selectChildren("path").attr("style", i), nt(t, k), t.intersect = function(w) {
    return H.info("Pill intersect", t, { radius: f, point: w }), tt.polygon(t, y, w);
  }, l;
}
g(Im, "halfRoundedRectangle");
var SB = /* @__PURE__ */ g((e, t, r, i, s) => [
  `M${e + s},${t}`,
  `L${e + r - s},${t}`,
  `L${e + r},${t - i / 2}`,
  `L${e + r - s},${t - i}`,
  `L${e + s},${t - i}`,
  `L${e},${t - i / 2}`,
  "Z"
].join(" "), "createHexagonPathD");
async function Dm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t), s = t.look === "neo" ? 3.5 : 4;
  t.labelStyle = r;
  const o = t.padding ?? 0, a = 70, n = 32, l = t.look === "neo" ? a : o, h = t.look === "neo" ? n : o;
  if (t.width || t.height) {
    const k = (t.height ?? 0) / s;
    t.width = ((t == null ? void 0 : t.width) ?? 0) - 2 * k - h, t.height = (t.height ?? 0) - l;
  }
  const { shapeSvg: c, bbox: u } = await ut(e, t, ct(t)), f = (t != null && t.height ? t == null ? void 0 : t.height : u.height) + l, d = f / s, p = (t != null && t.width ? t == null ? void 0 : t.width : u.width) + 2 * d + h, m = [
    { x: d, y: 0 },
    { x: p - d, y: 0 },
    { x: p, y: -f / 2 },
    { x: p - d, y: -f },
    { x: d, y: -f },
    { x: 0, y: -f / 2 }
  ];
  let y;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = rt.svg(c), k = et(t, {}), w = SB(0, 0, p, f, d), T = C.path(w, k);
    y = c.insert(() => T, ":first-child").attr("transform", `translate(${-p / 2}, ${f / 2})`), x && y.attr("style", x);
  } else
    y = nr(c, p, f, m);
  return i && y.attr("style", i), t.width = p, t.height = f, nt(t, y), t.intersect = function(C) {
    return tt.polygon(t, m, C);
  }, c;
}
g(Dm, "hexagon");
async function Rm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.label = "", t.labelStyle = r;
  const { shapeSvg: s } = await ut(e, t, ct(t)), o = Math.max(30, (t == null ? void 0 : t.width) ?? 0), a = Math.max(30, (t == null ? void 0 : t.height) ?? 0), { cssStyles: n } = t, l = rt.svg(s), h = et(t, {});
  t.look !== "handDrawn" && (h.roughness = 0, h.fillStyle = "solid");
  const c = [
    { x: 0, y: 0 },
    { x: o, y: 0 },
    { x: 0, y: a },
    { x: o, y: a }
  ], u = St(c), f = l.path(u, h), d = s.insert(() => f, ":first-child");
  return d.attr("class", "basic label-container outer-path"), n && t.look !== "handDrawn" && d.selectChildren("path").attr("style", n), i && t.look !== "handDrawn" && d.selectChildren("path").attr("style", i), d.attr("transform", `translate(${-o / 2}, ${-a / 2})`), nt(t, d), t.intersect = function(p) {
    return H.info("Pill intersect", t, { points: c }), tt.polygon(t, c, p);
  }, s;
}
g(Rm, "hourglass");
async function Pm(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = it(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i == null ? void 0 : i.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: h, bbox: c, label: u } = await ut(e, t, "icon-shape default"), f = t.pos === "t", d = n, p = n, { nodeBorder: m } = r, { stylesMap: y } = Hi(t), x = -p / 2, C = -d / 2, k = t.label ? 8 : 0, w = rt.svg(h), T = et(t, { stroke: "none", fill: "none" });
  t.look !== "handDrawn" && (T.roughness = 0, T.fillStyle = "solid");
  const _ = w.rectangle(x, C, p, d, T), v = Math.max(p, c.width), L = d + c.height + k, W = w.rectangle(-v / 2, -L / 2, v, L, {
    ...T,
    fill: "transparent",
    stroke: "none"
  }), O = h.insert(() => _, ":first-child"), M = h.insert(() => W);
  if (t.icon) {
    const U = h.append("g");
    U.html(
      `<g>${await Ws(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const z = U.node().getBBox(), D = z.width, E = z.height, A = z.x, $ = z.y;
    U.attr(
      "transform",
      `translate(${-D / 2 - A},${f ? c.height / 2 + k / 2 - E / 2 - $ : -c.height / 2 - k / 2 - E / 2 - $})`
    ), U.attr("style", `color: ${y.get("stroke") ?? m};`);
  }
  return u.attr(
    "transform",
    `translate(${-c.width / 2 - (c.x - (c.left ?? 0))},${f ? -L / 2 : L / 2 - c.height})`
  ), O.attr(
    "transform",
    `translate(0,${f ? c.height / 2 + k / 2 : -c.height / 2 - k / 2})`
  ), nt(t, M), t.intersect = function(U) {
    if (H.info("iconSquare intersect", t, U), !t.label)
      return tt.rect(t, U);
    const z = t.x ?? 0, D = t.y ?? 0, E = t.height ?? 0;
    let A = [];
    return f ? A = [
      { x: z - c.width / 2, y: D - E / 2 },
      { x: z + c.width / 2, y: D - E / 2 },
      { x: z + c.width / 2, y: D - E / 2 + c.height + k },
      { x: z + p / 2, y: D - E / 2 + c.height + k },
      { x: z + p / 2, y: D + E / 2 },
      { x: z - p / 2, y: D + E / 2 },
      { x: z - p / 2, y: D - E / 2 + c.height + k },
      { x: z - c.width / 2, y: D - E / 2 + c.height + k }
    ] : A = [
      { x: z - p / 2, y: D - E / 2 },
      { x: z + p / 2, y: D - E / 2 },
      { x: z + p / 2, y: D - E / 2 + d },
      { x: z + c.width / 2, y: D - E / 2 + d },
      { x: z + c.width / 2 / 2, y: D + E / 2 },
      { x: z - c.width / 2, y: D + E / 2 },
      { x: z - c.width / 2, y: D - E / 2 + d },
      { x: z - p / 2, y: D - E / 2 + d }
    ], tt.polygon(t, A, U);
  }, h;
}
g(Pm, "icon");
async function Nm(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = it(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i == null ? void 0 : i.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: h, bbox: c, label: u } = await ut(e, t, "icon-shape default"), f = 20, d = t.label ? 8 : 0, p = t.pos === "t", { nodeBorder: m, mainBkg: y } = r, { stylesMap: x } = Hi(t), C = rt.svg(h), k = et(t, {});
  t.look !== "handDrawn" && (k.roughness = 0, k.fillStyle = "solid");
  const w = x.get("fill");
  k.stroke = w ?? y;
  const T = h.append("g");
  t.icon && T.html(
    `<g>${await Ws(t.icon, {
      height: n,
      width: n,
      fallbackPrefix: ""
    })}</g>`
  );
  const _ = T.node().getBBox(), v = _.width, L = _.height, W = _.x, O = _.y, M = Math.max(v, L) * Math.SQRT2 + f * 2, U = C.circle(0, 0, M, k), z = Math.max(M, c.width), D = M + c.height + d, E = C.rectangle(-z / 2, -D / 2, z, D, {
    ...k,
    fill: "transparent",
    stroke: "none"
  }), A = h.insert(() => U, ":first-child"), $ = h.insert(() => E);
  return T.attr(
    "transform",
    `translate(${-v / 2 - W},${p ? c.height / 2 + d / 2 - L / 2 - O : -c.height / 2 - d / 2 - L / 2 - O})`
  ), T.attr("style", `color: ${x.get("stroke") ?? m};`), u.attr(
    "transform",
    `translate(${-c.width / 2 - (c.x - (c.left ?? 0))},${p ? -D / 2 : D / 2 - c.height})`
  ), A.attr(
    "transform",
    `translate(0,${p ? c.height / 2 + d / 2 : -c.height / 2 - d / 2})`
  ), nt(t, $), t.intersect = function(B) {
    return H.info("iconSquare intersect", t, B), tt.rect(t, B);
  }, h;
}
g(Nm, "iconCircle");
async function qm(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = it(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i == null ? void 0 : i.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: h, bbox: c, halfPadding: u, label: f } = await ut(
    e,
    t,
    "icon-shape default"
  ), d = t.pos === "t", p = n + u * 2, m = n + u * 2, { nodeBorder: y, mainBkg: x } = r, { stylesMap: C } = Hi(t), k = -m / 2, w = -p / 2, T = t.label ? 8 : 0, _ = rt.svg(h), v = et(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const L = C.get("fill");
  v.stroke = L ?? x;
  const W = _.path(_r(k, w, m, p, 5), v), O = Math.max(m, c.width), M = p + c.height + T, U = _.rectangle(-O / 2, -M / 2, O, M, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), z = h.insert(() => W, ":first-child").attr("class", "icon-shape2"), D = h.insert(() => U);
  if (t.icon) {
    const E = h.append("g");
    E.html(
      `<g>${await Ws(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const A = E.node().getBBox(), $ = A.width, B = A.height, I = A.x, Y = A.y;
    E.attr(
      "transform",
      `translate(${-$ / 2 - I},${d ? c.height / 2 + T / 2 - B / 2 - Y : -c.height / 2 - T / 2 - B / 2 - Y})`
    ), E.attr("style", `color: ${C.get("stroke") ?? y};`);
  }
  return f.attr(
    "transform",
    `translate(${-c.width / 2 - (c.x - (c.left ?? 0))},${d ? -M / 2 : M / 2 - c.height})`
  ), z.attr(
    "transform",
    `translate(0,${d ? c.height / 2 + T / 2 : -c.height / 2 - T / 2})`
  ), nt(t, D), t.intersect = function(E) {
    if (H.info("iconSquare intersect", t, E), !t.label)
      return tt.rect(t, E);
    const A = t.x ?? 0, $ = t.y ?? 0, B = t.height ?? 0;
    let I = [];
    return d ? I = [
      { x: A - c.width / 2, y: $ - B / 2 },
      { x: A + c.width / 2, y: $ - B / 2 },
      { x: A + c.width / 2, y: $ - B / 2 + c.height + T },
      { x: A + m / 2, y: $ - B / 2 + c.height + T },
      { x: A + m / 2, y: $ + B / 2 },
      { x: A - m / 2, y: $ + B / 2 },
      { x: A - m / 2, y: $ - B / 2 + c.height + T },
      { x: A - c.width / 2, y: $ - B / 2 + c.height + T }
    ] : I = [
      { x: A - m / 2, y: $ - B / 2 },
      { x: A + m / 2, y: $ - B / 2 },
      { x: A + m / 2, y: $ - B / 2 + p },
      { x: A + c.width / 2, y: $ - B / 2 + p },
      { x: A + c.width / 2 / 2, y: $ + B / 2 },
      { x: A - c.width / 2, y: $ + B / 2 },
      { x: A - c.width / 2, y: $ - B / 2 + p },
      { x: A - m / 2, y: $ - B / 2 + p }
    ], tt.polygon(t, I, E);
  }, h;
}
g(qm, "iconRounded");
async function Wm(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = it(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i == null ? void 0 : i.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: h, bbox: c, halfPadding: u, label: f } = await ut(
    e,
    t,
    "icon-shape default"
  ), d = t.pos === "t", p = n + u * 2, m = n + u * 2, { nodeBorder: y, mainBkg: x } = r, { stylesMap: C } = Hi(t), k = -m / 2, w = -p / 2, T = t.label ? 8 : 0, _ = rt.svg(h), v = et(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const L = C.get("fill");
  v.stroke = L ?? x;
  const W = _.path(_r(k, w, m, p, 0.1), v), O = Math.max(m, c.width), M = p + c.height + T, U = _.rectangle(-O / 2, -M / 2, O, M, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), z = h.insert(() => W, ":first-child"), D = h.insert(() => U);
  if (t.icon) {
    const E = h.append("g");
    E.html(
      `<g>${await Ws(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const A = E.node().getBBox(), $ = A.width, B = A.height, I = A.x, Y = A.y;
    E.attr(
      "transform",
      `translate(${-$ / 2 - I},${d ? c.height / 2 + T / 2 - B / 2 - Y : -c.height / 2 - T / 2 - B / 2 - Y})`
    ), E.attr("style", `color: ${C.get("stroke") ?? y};`);
  }
  return f.attr(
    "transform",
    `translate(${-c.width / 2 - (c.x - (c.left ?? 0))},${d ? -M / 2 : M / 2 - c.height})`
  ), z.attr(
    "transform",
    `translate(0,${d ? c.height / 2 + T / 2 : -c.height / 2 - T / 2})`
  ), nt(t, D), t.intersect = function(E) {
    if (H.info("iconSquare intersect", t, E), !t.label)
      return tt.rect(t, E);
    const A = t.x ?? 0, $ = t.y ?? 0, B = t.height ?? 0;
    let I = [];
    return d ? I = [
      { x: A - c.width / 2, y: $ - B / 2 },
      { x: A + c.width / 2, y: $ - B / 2 },
      { x: A + c.width / 2, y: $ - B / 2 + c.height + T },
      { x: A + m / 2, y: $ - B / 2 + c.height + T },
      { x: A + m / 2, y: $ + B / 2 },
      { x: A - m / 2, y: $ + B / 2 },
      { x: A - m / 2, y: $ - B / 2 + c.height + T },
      { x: A - c.width / 2, y: $ - B / 2 + c.height + T }
    ] : I = [
      { x: A - m / 2, y: $ - B / 2 },
      { x: A + m / 2, y: $ - B / 2 },
      { x: A + m / 2, y: $ - B / 2 + p },
      { x: A + c.width / 2, y: $ - B / 2 + p },
      { x: A + c.width / 2 / 2, y: $ + B / 2 },
      { x: A - c.width / 2, y: $ + B / 2 },
      { x: A - c.width / 2, y: $ - B / 2 + p },
      { x: A - m / 2, y: $ - B / 2 + p }
    ], tt.polygon(t, I, E);
  }, h;
}
g(Wm, "iconSquare");
async function zm(e, t, { config: { flowchart: r } }) {
  const i = new Image();
  i.src = (t == null ? void 0 : t.img) ?? "", await i.decode();
  const s = Number(i.naturalWidth.toString().replace("px", "")), o = Number(i.naturalHeight.toString().replace("px", ""));
  t.imageAspectRatio = s / o;
  const { labelStyles: a } = it(t);
  t.labelStyle = a;
  const n = r == null ? void 0 : r.wrappingWidth;
  t.defaultWidth = r == null ? void 0 : r.wrappingWidth;
  const l = Math.max(
    t.label ? n ?? 0 : 0,
    (t == null ? void 0 : t.assetWidth) ?? s
  ), h = t.constraint === "on" && t != null && t.assetHeight ? t.assetHeight * t.imageAspectRatio : l, c = t.constraint === "on" ? h / t.imageAspectRatio : (t == null ? void 0 : t.assetHeight) ?? o;
  t.width = Math.max(h, n ?? 0);
  const { shapeSvg: u, bbox: f, label: d } = await ut(e, t, "image-shape default"), p = t.pos === "t", m = -h / 2, y = -c / 2, x = t.label ? 8 : 0, C = rt.svg(u), k = et(t, {});
  t.look !== "handDrawn" && (k.roughness = 0, k.fillStyle = "solid");
  const w = C.rectangle(m, y, h, c, k), T = Math.max(h, f.width), _ = c + f.height + x, v = C.rectangle(-T / 2, -_ / 2, T, _, {
    ...k,
    fill: "none",
    stroke: "none"
  }), L = u.insert(() => w, ":first-child"), W = u.insert(() => v);
  if (t.img) {
    const O = u.append("image");
    O.attr("href", t.img), O.attr("width", h), O.attr("height", c), O.attr("preserveAspectRatio", "none"), O.attr(
      "transform",
      `translate(${-h / 2},${p ? _ / 2 - c : -_ / 2})`
    );
  }
  return d.attr(
    "transform",
    `translate(${-f.width / 2 - (f.x - (f.left ?? 0))},${p ? -c / 2 - f.height / 2 - x / 2 : c / 2 - f.height / 2 + x / 2})`
  ), L.attr(
    "transform",
    `translate(0,${p ? f.height / 2 + x / 2 : -f.height / 2 - x / 2})`
  ), nt(t, W), t.intersect = function(O) {
    if (H.info("iconSquare intersect", t, O), !t.label)
      return tt.rect(t, O);
    const M = t.x ?? 0, U = t.y ?? 0, z = t.height ?? 0;
    let D = [];
    return p ? D = [
      { x: M - f.width / 2, y: U - z / 2 },
      { x: M + f.width / 2, y: U - z / 2 },
      { x: M + f.width / 2, y: U - z / 2 + f.height + x },
      { x: M + h / 2, y: U - z / 2 + f.height + x },
      { x: M + h / 2, y: U + z / 2 },
      { x: M - h / 2, y: U + z / 2 },
      { x: M - h / 2, y: U - z / 2 + f.height + x },
      { x: M - f.width / 2, y: U - z / 2 + f.height + x }
    ] : D = [
      { x: M - h / 2, y: U - z / 2 },
      { x: M + h / 2, y: U - z / 2 },
      { x: M + h / 2, y: U - z / 2 + c },
      { x: M + f.width / 2, y: U - z / 2 + c },
      { x: M + f.width / 2 / 2, y: U + z / 2 },
      { x: M - f.width / 2, y: U + z / 2 },
      { x: M - f.width / 2, y: U - z / 2 + c },
      { x: M - h / 2, y: U - z / 2 + c }
    ], tt.polygon(t, D, O);
  }, u;
}
g(zm, "imageSquare");
async function Hm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = Math.max(l.width + (a ?? 0) * 2, (t == null ? void 0 : t.width) ?? 0), c = Math.max(l.height + (o ?? 0) * 2, (t == null ? void 0 : t.height) ?? 0), u = [
    { x: 0, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: -3 * c / 6, y: -c }
  ];
  let f;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const p = rt.svg(n), m = et(t, {}), y = St(u), x = p.path(y, m);
    f = n.insert(() => x, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), d && f.attr("style", d);
  } else
    f = nr(n, h, c, u);
  return i && f.attr("style", i), t.width = h, t.height = c, nt(t, f), t.intersect = function(p) {
    return tt.polygon(t, u, p);
  }, n;
}
g(Hm, "inv_trapezoid");
async function Ym(e, t) {
  const { shapeSvg: r, bbox: i, label: s } = await ut(e, t, "label"), o = r.insert("rect", ":first-child");
  return o.attr("width", 0.1).attr("height", 0.1), r.attr("class", "label edgeLabel"), s.attr(
    "transform",
    `translate(${-(i.width / 2) - (i.x - (i.left ?? 0))}, ${-(i.height / 2) - (i.y - (i.top ?? 0))})`
  ), nt(t, o), t.intersect = function(l) {
    return tt.rect(t, l);
  }, r;
}
g(Ym, "labelRect");
async function Um(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = ((t == null ? void 0 : t.height) ?? l.height) + o, c = ((t == null ? void 0 : t.width) ?? l.width) + a, u = [
    { x: 0, y: 0 },
    { x: c + 3 * h / 6, y: 0 },
    { x: c, y: -h },
    { x: -(3 * h) / 6, y: -h }
  ];
  let f;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const p = rt.svg(n), m = et(t, {}), y = St(u), x = p.path(y, m);
    f = n.insert(() => x, ":first-child").attr("transform", `translate(${-c / 2}, ${h / 2})`), d && f.attr("style", d);
  } else
    f = nr(n, c, h, u);
  return i && f.attr("style", i), t.width = c, t.height = h, nt(t, f), t.intersect = function(p) {
    return tt.polygon(t, u, p);
  }, n;
}
g(Um, "lean_left");
async function Xm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = ((t == null ? void 0 : t.height) ?? l.height) + o, c = ((t == null ? void 0 : t.width) ?? l.width) + a, u = [
    { x: -3 * h / 6, y: 0 },
    { x: c, y: 0 },
    { x: c + 3 * h / 6, y: -h },
    { x: 0, y: -h }
  ];
  let f;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const p = rt.svg(n), m = et(t, {}), y = St(u), x = p.path(y, m);
    f = n.insert(() => x, ":first-child").attr("transform", `translate(${-c / 2}, ${h / 2})`), d && f.attr("style", d);
  } else
    f = nr(n, c, h, u);
  return i && f.attr("style", i), t.width = c, t.height = h, nt(t, f), t.intersect = function(p) {
    return tt.polygon(t, u, p);
  }, n;
}
g(Xm, "lean_right");
function Gm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.label = "", t.labelStyle = r;
  const s = e.insert("g").attr("class", ct(t)).attr("id", t.domId ?? t.id), { cssStyles: o } = t, a = Math.max(35, (t == null ? void 0 : t.width) ?? 0), n = Math.max(35, (t == null ? void 0 : t.height) ?? 0), l = 7, h = [
    { x: a, y: 0 },
    { x: 0, y: n + l / 2 },
    { x: a - 2 * l, y: n + l / 2 },
    { x: 0, y: 2 * n },
    { x: a, y: n - l / 2 },
    { x: 2 * l, y: n - l / 2 }
  ], c = rt.svg(s), u = et(t, {});
  t.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
  const f = St(h), d = c.path(f, u), p = s.insert(() => d, ":first-child");
  return p.attr("class", "outer-path"), o && t.look !== "handDrawn" && p.selectAll("path").attr("style", o), i && t.look !== "handDrawn" && p.selectAll("path").attr("style", i), p.attr("transform", `translate(-${a / 2},${-n})`), nt(t, p), t.intersect = function(m) {
    return H.info("lightningBolt intersect", t, m), tt.polygon(t, h, m);
  }, s;
}
g(Gm, "lightningBolt");
var wB = /* @__PURE__ */ g((e, t, r, i, s, o, a) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + a}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createCylinderPathD"), TB = /* @__PURE__ */ g((e, t, r, i, s, o, a) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + a}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createOuterCylinderPathD"), _B = /* @__PURE__ */ g((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), ku = 10, Su = 10;
async function jm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 24 : s;
  if (t.width || t.height) {
    const x = t.width ?? 0;
    t.width = (t.width ?? 0) - o, t.width < Su && (t.width = Su);
    const k = x / 2 / (2.5 + x / 50);
    t.height = (t.height ?? 0) - a - k * 3, t.height < ku && (t.height = ku);
  }
  const { shapeSvg: n, bbox: l, label: h } = await ut(e, t, ct(t)), c = (t != null && t.width ? t == null ? void 0 : t.width : l.width) + o * 2, u = c / 2, f = u / (2.5 + c / 50), d = (t != null && t.height ? t == null ? void 0 : t.height : l.height) + f + a * 2, p = d * 0.1;
  let m;
  const { cssStyles: y } = t;
  if (t.look === "handDrawn") {
    const x = rt.svg(n), C = TB(0, 0, c, d, u, f, p), k = _B(0, f, c, d, u, f), w = et(t, {}), T = x.path(C, w), _ = x.path(k, w);
    n.insert(() => _, ":first-child").attr("class", "line"), m = n.insert(() => T, ":first-child"), m.attr("class", "basic label-container"), y && m.attr("style", y);
  } else {
    const x = wB(0, 0, c, d, u, f, p);
    m = n.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container outer-path").attr("style", Yt(y)).attr("style", i);
  }
  return m.attr("label-offset-y", f), m.attr("transform", `translate(${-c / 2}, ${-(d / 2 + f)})`), nt(t, m), h.attr(
    "transform",
    `translate(${-(l.width / 2) - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + f - (l.y - (l.top ?? 0))})`
  ), t.intersect = function(x) {
    const C = tt.rect(t, x), k = C.x - (t.x ?? 0);
    if (u != 0 && (Math.abs(k) < (t.width ?? 0) / 2 || Math.abs(k) == (t.width ?? 0) / 2 && Math.abs(C.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
      let w = f * f * (1 - k * k / (u * u));
      w > 0 && (w = Math.sqrt(w)), w = f - w, x.y - (t.y ?? 0) > 0 && (w = -w), C.y += w;
    }
    return C;
  }, n;
}
g(jm, "linedCylinder");
async function Vm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  if (t.width || t.height) {
    const w = t.width;
    t.width = (w ?? 0) * 10 / 11 - o * 2, t.width < 10 && (t.width = 10), t.height = ((t == null ? void 0 : t.height) ?? 0) - a * 2, t.height < 10 && (t.height = 10);
  }
  const { shapeSvg: n, bbox: l, label: h } = await ut(e, t, ct(t)), c = (t != null && t.width ? t == null ? void 0 : t.width : l.width) + (o ?? 0) * 2, u = (t != null && t.height ? t == null ? void 0 : t.height : l.height) + (a ?? 0) * 2, f = t.look === "neo" ? u / 4 : u / 8, d = u + f, { cssStyles: p } = t, m = rt.svg(n), y = et(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -c / 2 - c / 2 * 0.1, y: -d / 2 },
    { x: -c / 2 - c / 2 * 0.1, y: d / 2 },
    ...Tr(
      -c / 2 - c / 2 * 0.1,
      d / 2,
      c / 2 + c / 2 * 0.1,
      d / 2,
      f,
      0.8
    ),
    { x: c / 2 + c / 2 * 0.1, y: -d / 2 },
    { x: -c / 2 - c / 2 * 0.1, y: -d / 2 },
    { x: -c / 2, y: -d / 2 },
    { x: -c / 2, y: d / 2 * 1.1 },
    { x: -c / 2, y: -d / 2 }
  ], C = m.polygon(
    x.map((w) => [w.x, w.y]),
    y
  ), k = n.insert(() => C, ":first-child");
  return k.attr("class", "basic label-container outer-path"), p && t.look !== "handDrawn" && k.selectAll("path").attr("style", p), i && t.look !== "handDrawn" && k.selectAll("path").attr("style", i), k.attr("transform", `translate(0,${-f / 2})`), h.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) + c / 2 * 0.1 / 2 - (l.x - (l.left ?? 0))},${-u / 2 + (t.padding ?? 0) - f / 2 - (l.y - (l.top ?? 0))})`
  ), nt(t, k), t.intersect = function(w) {
    return tt.polygon(t, x, w);
  }, n;
}
g(Vm, "linedWaveEdgedRect");
async function Zm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = t.look === "neo" ? 10 : 5;
  (t.width || t.height) && (t.width = Math.max(((t == null ? void 0 : t.width) ?? 0) - o * 2 - 2 * n, 10), t.height = Math.max(((t == null ? void 0 : t.height) ?? 0) - a * 2 - 2 * n, 10));
  const { shapeSvg: l, bbox: h, label: c } = await ut(e, t, ct(t)), u = (t != null && t.width ? t == null ? void 0 : t.width : h.width) + o * 2 + 2 * n, f = (t != null && t.height ? t == null ? void 0 : t.height : h.height) + a * 2 + 2 * n, d = u - 2 * n, p = f - 2 * n, m = -d / 2, y = -p / 2, { cssStyles: x } = t, C = rt.svg(l), k = et(t, {}), w = [
    { x: m - n, y: y + n },
    { x: m - n, y: y + p + n },
    { x: m + d - n, y: y + p + n },
    { x: m + d - n, y: y + p },
    { x: m + d, y: y + p },
    { x: m + d, y: y + p - n },
    { x: m + d + n, y: y + p - n },
    { x: m + d + n, y: y - n },
    { x: m + n, y: y - n },
    { x: m + n, y },
    { x: m, y },
    { x: m, y: y + n }
  ], T = [
    { x: m, y: y + n },
    { x: m + d - n, y: y + n },
    { x: m + d - n, y: y + p },
    { x: m + d, y: y + p },
    { x: m + d, y },
    { x: m, y }
  ];
  t.look !== "handDrawn" && (k.roughness = 0, k.fillStyle = "solid");
  const _ = St(w);
  let v = C.path(_, k);
  const L = St(T);
  let W = C.path(L, k);
  t.look !== "handDrawn" && (v = cl(v), W = cl(W));
  const O = l.insert("g", ":first-child");
  return O.insert(() => v), O.insert(() => W), O.attr("class", "basic label-container outer-path"), x && t.look !== "handDrawn" && O.selectAll("path").attr("style", x), i && t.look !== "handDrawn" && O.selectAll("path").attr("style", i), c.attr(
    "transform",
    `translate(${-(h.width / 2) - n - (h.x - (h.left ?? 0))}, ${-(h.height / 2) + n - (h.y - (h.top ?? 0))})`
  ), nt(t, O), t.intersect = function(M) {
    return tt.polygon(t, w, M);
  }, l;
}
g(Zm, "multiRect");
async function Km(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ut(e, t, ct(t)), n = t.padding ?? 0, l = t.look === "neo" ? 16 : n, h = t.look === "neo" ? 12 : n;
  let c = !0;
  (t.width || t.height) && (c = !1, t.width = ((t == null ? void 0 : t.width) ?? 0) - l * 2, t.height = ((t == null ? void 0 : t.height) ?? 0) - h * 3);
  const u = Math.max(o.width, (t == null ? void 0 : t.width) ?? 0) + l * 2, f = Math.max(o.height, (t == null ? void 0 : t.height) ?? 0) + h * 3, d = t.look === "neo" ? f / 4 : f / 8, p = f + (c ? d / 2 : -d / 2), m = -u / 2, y = -p / 2, x = 10, { cssStyles: C } = t, k = Tr(
    m - x,
    y + p + x,
    m + u - x,
    y + p + x,
    d,
    0.8
  ), w = k == null ? void 0 : k[k.length - 1], T = [
    { x: m - x, y: y + x },
    { x: m - x, y: y + p + x },
    ...k,
    { x: m + u - x, y: w.y - x },
    { x: m + u, y: w.y - x },
    { x: m + u, y: w.y - 2 * x },
    { x: m + u + x, y: w.y - 2 * x },
    { x: m + u + x, y: y - x },
    { x: m + x, y: y - x },
    { x: m + x, y },
    { x: m, y },
    { x: m, y: y + x }
  ], _ = [
    { x: m, y: y + x },
    { x: m + u - x, y: y + x },
    { x: m + u - x, y: w.y - x },
    { x: m + u, y: w.y - x },
    { x: m + u, y },
    { x: m, y }
  ], v = rt.svg(s), L = et(t, {});
  t.look !== "handDrawn" && (L.roughness = 0, L.fillStyle = "solid");
  const W = St(T), O = v.path(W, L), M = St(_), U = v.path(M, L), z = s.insert(() => O, ":first-child");
  return z.insert(() => U), z.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && z.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && z.selectAll("path").attr("style", i), z.attr("transform", `translate(0,${-d / 2})`), a.attr(
    "transform",
    `translate(${-(o.width / 2) - x - (o.x - (o.left ?? 0))}, ${-(o.height / 2) + x - d / 2 - (o.y - (o.top ?? 0))})`
  ), nt(t, z), t.intersect = function(D) {
    return tt.polygon(t, T, D);
  }, s;
}
g(Km, "multiWaveEdgedRectangle");
async function Qm(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = it(t);
  t.labelStyle = i, t.useHtmlLabels || ne($t()) || (t.centerLabel = !0);
  const { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = Math.max(n.width + (t.padding ?? 0) * 2, (t == null ? void 0 : t.width) ?? 0), c = Math.max(n.height + (t.padding ?? 0) * 2, (t == null ? void 0 : t.height) ?? 0), u = -h / 2, f = -c / 2, { cssStyles: d } = t, p = rt.svg(a), m = et(t, {
    fill: r.noteBkgColor,
    stroke: r.noteBorderColor
  });
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = p.rectangle(u, f, h, c, m), x = a.insert(() => y, ":first-child");
  return x.attr("class", "basic label-container outer-path"), l.attr("class", "label noteLabel"), d && t.look !== "handDrawn" && x.selectAll("path").attr("style", d), s && t.look !== "handDrawn" && x.selectAll("path").attr("style", s), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), nt(t, x), t.intersect = function(C) {
    return tt.rect(t, C);
  }, a;
}
g(Qm, "note");
var BB = /* @__PURE__ */ g((e, t, r) => [
  `M${e + r / 2},${t}`,
  `L${e + r},${t - r / 2}`,
  `L${e + r / 2},${t - r}`,
  `L${e},${t - r / 2}`,
  "Z"
].join(" "), "createDecisionBoxPathD");
async function Jm(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await ut(e, t, ct(t)), a = o.width + (t.padding ?? 0), n = o.height + (t.padding ?? 0), l = a + n, h = 0.5, c = [
    { x: l / 2, y: 0 },
    { x: l, y: -l / 2 },
    { x: l / 2, y: -l },
    { x: 0, y: -l / 2 }
  ];
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const d = rt.svg(s), p = et(t, {}), m = BB(0, 0, l), y = d.path(m, p);
    u = s.insert(() => y, ":first-child").attr("transform", `translate(${-l / 2 + h}, ${l / 2})`), f && u.attr("style", f);
  } else
    u = nr(s, l, l, c), u.attr("transform", `translate(${-l / 2 + h}, ${l / 2})`);
  return i && u.attr("style", i), nt(t, u), t.calcIntersect = function(d, p) {
    const m = d.width, y = [
      { x: m / 2, y: 0 },
      { x: m, y: -m / 2 },
      { x: m / 2, y: -m },
      { x: 0, y: -m / 2 }
    ], x = tt.polygon(d, y, p);
    return { x: x.x - 0.5, y: x.y - 0.5 };
  }, t.intersect = function(d) {
    return this.calcIntersect(t, d);
  }, s;
}
g(Jm, "question");
async function ty(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 21 : s ?? 0, a = t.look === "neo" ? 12 : s ?? 0, { shapeSvg: n, bbox: l, label: h } = await ut(e, t, ct(t)), c = ((t == null ? void 0 : t.width) ?? l.width) + (t.look === "neo" ? o * 2 : o), u = ((t == null ? void 0 : t.height) ?? l.height) + (t.look === "neo" ? a * 2 : a), f = -c / 2, d = -u / 2, p = d / 2, m = [
    { x: f + p, y: d },
    { x: f, y: 0 },
    { x: f + p, y: -d },
    { x: -f, y: -d },
    { x: -f, y: d }
  ], { cssStyles: y } = t, x = rt.svg(n), C = et(t, {});
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const k = St(m), w = x.path(k, C), T = n.insert(() => w, ":first-child");
  return T.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && T.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && T.selectAll("path").attr("style", i), T.attr("transform", `translate(${-p / 2},0)`), h.attr(
    "transform",
    `translate(${-p / 2 - l.width / 2 - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), nt(t, T), t.intersect = function(_) {
    return tt.polygon(t, m, _);
  }, n;
}
g(ty, "rect_left_inv_arrow");
async function ey(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  let s;
  t.cssClasses ? s = "node " + t.cssClasses : s = "node default";
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), a = o.insert("g"), n = o.insert("g").attr("class", "label").attr("style", i), l = t.description, h = t.label, c = await yr(n, h, t.labelStyle, !0, !0);
  let u = { width: 0, height: 0 };
  if (ne(_t())) {
    const L = c.children[0], W = bt(c);
    u = L.getBoundingClientRect(), W.attr("width", u.width), W.attr("height", u.height);
  }
  H.info("Text 2", l);
  const f = l || [], d = c.getBBox(), p = await yr(
    n,
    Array.isArray(f) ? f.join("<br/>") : f,
    t.labelStyle,
    !0,
    !0
  ), m = p.children[0], y = bt(p);
  u = m.getBoundingClientRect(), y.attr("width", u.width), y.attr("height", u.height);
  const x = (t.padding || 0) / 2;
  bt(p).attr(
    "transform",
    "translate( " + (u.width > d.width ? 0 : (d.width - u.width) / 2) + ", " + (d.height + x + 5) + ")"
  ), bt(c).attr(
    "transform",
    "translate( " + (u.width < d.width ? 0 : -(d.width - u.width) / 2) + ", 0)"
  ), u = n.node().getBBox(), n.attr(
    "transform",
    "translate(" + -u.width / 2 + ", " + (-u.height / 2 - x + 3) + ")"
  );
  const C = u.width + (t.padding || 0), k = u.height + (t.padding || 0), w = -u.width / 2 - x, T = -u.height / 2 - x;
  let _, v;
  if (t.look === "handDrawn") {
    const L = rt.svg(o), W = et(t, {}), O = L.path(
      _r(w, T, C, k, t.rx || 0),
      W
    ), M = L.line(
      -u.width / 2 - x,
      -u.height / 2 - x + d.height + x,
      u.width / 2 + x,
      -u.height / 2 - x + d.height + x,
      W
    );
    v = o.insert(() => (H.debug("Rough node insert CXC", O), M), ":first-child"), _ = o.insert(() => (H.debug("Rough node insert CXC", O), O), ":first-child");
  } else
    _ = a.insert("rect", ":first-child"), v = a.insert("line"), _.attr("class", "outer title-state").attr("style", i).attr("x", -u.width / 2 - x).attr("y", -u.height / 2 - x).attr("width", u.width + (t.padding || 0)).attr("height", u.height + (t.padding || 0)), v.attr("class", "divider").attr("x1", -u.width / 2 - x).attr("x2", u.width / 2 + x).attr("y1", -u.height / 2 - x + d.height + x).attr("y2", -u.height / 2 - x + d.height + x);
  return nt(t, _), t.intersect = function(L) {
    return tt.rect(t, L);
  }, o;
}
g(ey, "rectWithTitle");
async function ry(e, t, { config: { themeVariables: r } }) {
  const i = (r == null ? void 0 : r.radius) ?? 5, s = {
    rx: i,
    ry: i,
    labelPaddingX: ((t == null ? void 0 : t.padding) ?? 0) * 1,
    labelPaddingY: ((t == null ? void 0 : t.padding) ?? 0) * 1
  };
  return Yi(e, t, s);
}
g(ry, "roundedRect");
var Er = 8;
async function iy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0, { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = ((t == null ? void 0 : t.width) ?? n.width) + s * 2 + (t.look === "neo" ? Er : Er * 2), c = ((t == null ? void 0 : t.height) ?? n.height) + o * 2, u = h - Er, f = c, d = Er - h / 2, p = -c / 2, { cssStyles: m } = t, y = rt.svg(a), x = et(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: d, y: p },
    { x: d + u, y: p },
    { x: d + u, y: p + f },
    { x: d - Er, y: p + f },
    { x: d - Er, y: p },
    { x: d, y: p },
    { x: d, y: p + f }
  ], k = y.polygon(
    C.map((T) => [T.x, T.y]),
    x
  ), w = a.insert(() => k, ":first-child");
  return w.attr("class", "basic label-container outer-path").attr("style", Yt(m)), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), m && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${Er / 2 - n.width / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), nt(t, w), t.intersect = function(T) {
    return tt.rect(t, T);
  }, a;
}
g(iy, "shadedProcess");
async function sy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.width = Math.max(((t == null ? void 0 : t.width) ?? 0) - o * 2, 10), t.height = Math.max(((t == null ? void 0 : t.height) ?? 0) / 1.5 - a * 2, 10));
  const { shapeSvg: n, bbox: l, label: h } = await ut(e, t, ct(t)), c = (t != null && t.width ? t == null ? void 0 : t.width : l.width) + o * 2, u = ((t != null && t.height ? t == null ? void 0 : t.height : l.height) + a * 2) * 1.5, f = c, d = u / 1.5, p = -f / 2, m = -d / 2, { cssStyles: y } = t, x = rt.svg(n), C = et(t, {});
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const k = [
    { x: p, y: m },
    { x: p, y: m + d },
    { x: p + f, y: m + d },
    { x: p + f, y: m - d / 2 }
  ], w = St(k), T = x.path(w, C), _ = n.insert(() => T, ":first-child");
  return _.attr("class", "basic label-container  outer-path"), y && t.look !== "handDrawn" && _.selectChildren("path").attr("style", y), i && t.look !== "handDrawn" && _.selectChildren("path").attr("style", i), _.attr("transform", `translate(0, ${d / 4})`), h.attr(
    "transform",
    `translate(${-f / 2 + (t.padding ?? 0) - (l.x - (l.left ?? 0))}, ${-d / 4 + (t.padding ?? 0) - (l.y - (l.top ?? 0))})`
  ), nt(t, _), t.intersect = function(v) {
    return tt.polygon(t, k, v);
  }, n;
}
g(sy, "slopedRect");
async function oy(e, t) {
  const r = t.padding ?? 0, i = t.look === "neo" ? 16 : r * 2, s = t.look === "neo" ? 12 : r, o = {
    rx: 0,
    ry: 0,
    labelPaddingX: t.labelPaddingX ?? i,
    labelPaddingY: s
  };
  return Yi(e, t, o);
}
g(oy, "squareRect");
async function ay(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 20 : s, a = t.look === "neo" ? 12 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = l.height + (t.look === "neo" ? a * 2 : a), c = l.width + h / 4 + (t.look === "neo" ? o * 2 : o), u = h / 2, { cssStyles: f } = t, d = rt.svg(n), p = et(t, {});
  t.look !== "handDrawn" && (p.roughness = 0, p.fillStyle = "solid");
  const m = [
    { x: -c / 2 + u, y: -h / 2 },
    { x: c / 2 - u, y: -h / 2 },
    ...Fs(-c / 2 + u, 0, u, 50, 90, 270),
    { x: c / 2 - u, y: h / 2 },
    ...Fs(c / 2 - u, 0, u, 50, 270, 450)
  ], y = St(m), x = d.path(y, p), C = n.insert(() => x, ":first-child");
  return C.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && C.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && C.selectChildren("path").attr("style", i), nt(t, C), t.intersect = function(k) {
    return tt.polygon(t, m, k);
  }, n;
}
g(ay, "stadium");
async function ny(e, t) {
  const r = {
    rx: t.look === "neo" ? 3 : 5,
    ry: t.look === "neo" ? 3 : 5
  };
  return Yi(e, t, r);
}
g(ny, "state");
function ly(e, t, { config: { themeVariables: r } }) {
  var C, k;
  const { labelStyles: i, nodeStyles: s } = it(t);
  t.labelStyle = i;
  const { cssStyles: o } = t, { lineColor: a, stateBorder: n, nodeBorder: l, nodeShadow: h } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const c = e.insert("g").attr("class", "node default").attr("id", t.domId ?? t.id), u = rt.svg(c), f = et(t, {});
  t.look !== "handDrawn" && (f.roughness = 0, f.fillStyle = "solid");
  const d = u.circle(0, 0, t.width, {
    ...f,
    stroke: a,
    strokeWidth: 2
  }), p = n ?? l, m = (t.width ?? 0) * 5 / 14, y = u.circle(0, 0, m, {
    ...f,
    fill: p,
    stroke: p,
    strokeWidth: 2,
    fillStyle: "solid"
  }), x = c.insert(() => d, ":first-child");
  if (x.insert(() => y), t.look !== "handDrawn" && x.attr("class", "outer-path"), o && x.selectAll("path").attr("style", o), s && x.selectAll("path").attr("style", s), t.width < 25 && h && t.look !== "handDrawn") {
    const w = ((k = (C = e.node()) == null ? void 0 : C.ownerSVGElement) == null ? void 0 : k.id) ?? "", T = w ? `${w}-drop-shadow-small` : "drop-shadow-small";
    x.attr("style", `filter:url(#${T})`);
  }
  return nt(t, x), t.intersect = function(w) {
    return tt.circle(t, (t.width ?? 0) / 2, w);
  }, c;
}
g(ly, "stateEnd");
function hy(e, t, { config: { themeVariables: r } }) {
  var n, l;
  const { lineColor: i, nodeShadow: s } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const o = e.insert("g").attr("class", "node default").attr("id", t.domId || t.id);
  let a;
  if (t.look === "handDrawn") {
    const c = rt.svg(o).circle(0, 0, t.width, Dw(i));
    a = o.insert(() => c), a.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  } else
    a = o.insert("circle", ":first-child"), a.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  if (t.width < 25 && s && t.look !== "handDrawn") {
    const h = ((l = (n = e.node()) == null ? void 0 : n.ownerSVGElement) == null ? void 0 : l.id) ?? "", c = h ? `${h}-drop-shadow-small` : "drop-shadow-small";
    a.attr("style", `filter:url(#${c})`);
  }
  return nt(t, a), t.intersect = function(h) {
    return tt.circle(t, (t.width ?? 7) / 2, h);
  }, o;
}
g(hy, "stateStart");
var li = 8;
async function cy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = (t == null ? void 0 : t.padding) ?? 8, o = t.look === "neo" ? 28 : s, a = t.look === "neo" ? 12 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = ((t == null ? void 0 : t.width) ?? l.width) + 2 * li + o, c = ((t == null ? void 0 : t.height) ?? l.height) + a, u = h - 2 * li, f = c, d = -h / 2, p = -c / 2, m = [
    { x: 0, y: 0 },
    { x: u, y: 0 },
    { x: u, y: -f },
    { x: 0, y: -f },
    { x: 0, y: 0 },
    { x: -8, y: 0 },
    { x: u + 8, y: 0 },
    { x: u + 8, y: -f },
    { x: -8, y: -f },
    { x: -8, y: 0 }
  ];
  if (t.look === "handDrawn") {
    const y = rt.svg(n), x = et(t, {}), C = y.rectangle(d, p, u + 16, f, x), k = y.line(d + li, p, d + li, p + f, x), w = y.line(d + li + u, p, d + li + u, p + f, x);
    n.insert(() => k, ":first-child"), n.insert(() => w, ":first-child");
    const T = n.insert(() => C, ":first-child"), { cssStyles: _ } = t;
    T.attr("class", "basic label-container").attr("style", Yt(_)), nt(t, T);
  } else {
    const y = nr(n, u, f, m);
    i && y.attr("style", i), nt(t, y);
  }
  return t.intersect = function(y) {
    return tt.polygon(t, m, y);
  }, n;
}
g(cy, "subroutine");
var un = 0.2;
async function uy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.height = Math.max(((t == null ? void 0 : t.height) ?? 0) - a * 2, 10), t.width = Math.max(
    ((t == null ? void 0 : t.width) ?? 0) - o * 2 - un * (t.height + a * 2),
    10
  ));
  const { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = (t != null && t.height ? t == null ? void 0 : t.height : l.height) + a * 2, c = un * h, u = un * h, d = (t != null && t.width ? t == null ? void 0 : t.width : l.width) + o * 2 + c - c, p = h, m = -d / 2, y = -p / 2, { cssStyles: x } = t, C = rt.svg(n), k = et(t, {}), w = [
    { x: m - c / 2, y },
    { x: m + d + c / 2, y },
    { x: m + d + c / 2, y: y + p },
    { x: m - c / 2, y: y + p }
  ], T = [
    { x: m + d - c / 2, y: y + p },
    { x: m + d + c / 2, y: y + p },
    { x: m + d + c / 2, y: y + p - u }
  ];
  t.look !== "handDrawn" && (k.roughness = 0, k.fillStyle = "solid");
  const _ = St(w), v = C.path(_, k), L = St(T), W = C.path(L, { ...k, fillStyle: "solid" }), O = n.insert(() => W, ":first-child");
  return O.insert(() => v, ":first-child"), O.attr("class", "basic label-container outer-path"), x && t.look !== "handDrawn" && O.selectAll("path").attr("style", x), i && t.look !== "handDrawn" && O.selectAll("path").attr("style", i), nt(t, O), t.intersect = function(M) {
    return tt.polygon(t, w, M);
  }, n;
}
g(uy, "taggedRect");
async function dy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ut(e, t, ct(t)), n = Math.max(o.width + (t.padding ?? 0) * 2, (t == null ? void 0 : t.width) ?? 0), l = Math.max(o.height + (t.padding ?? 0) * 2, (t == null ? void 0 : t.height) ?? 0), h = l / 8, c = 0.2 * n, u = 0.2 * l, f = l + h, { cssStyles: d } = t, p = rt.svg(s), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = [
    { x: -n / 2 - n / 2 * 0.1, y: f / 2 },
    ...Tr(
      -n / 2 - n / 2 * 0.1,
      f / 2,
      n / 2 + n / 2 * 0.1,
      f / 2,
      h,
      0.8
    ),
    { x: n / 2 + n / 2 * 0.1, y: -f / 2 },
    { x: -n / 2 - n / 2 * 0.1, y: -f / 2 }
  ], x = -n / 2 + n / 2 * 0.1, C = -f / 2 - u * 0.4, k = [
    { x: x + n - c, y: (C + l) * 1.3 },
    { x: x + n, y: C + l - u },
    { x: x + n, y: (C + l) * 0.9 },
    ...Tr(
      x + n,
      (C + l) * 1.25,
      x + n - c,
      (C + l) * 1.3,
      -l * 0.02,
      0.5
    )
  ], w = St(y), T = p.path(w, m), _ = St(k), v = p.path(_, {
    ...m,
    fillStyle: "solid"
  }), L = s.insert(() => v, ":first-child");
  return L.insert(() => T, ":first-child"), L.attr("class", "basic label-container outer-path"), d && t.look !== "handDrawn" && L.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(0,${-h / 2})`), a.attr(
    "transform",
    `translate(${-n / 2 + (t.padding ?? 0) - (o.x - (o.left ?? 0))},${-l / 2 + (t.padding ?? 0) - h / 2 - (o.y - (o.top ?? 0))})`
  ), nt(t, L), t.intersect = function(W) {
    return tt.polygon(t, y, W);
  }, s;
}
g(dy, "taggedWaveEdgedRectangle");
async function fy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await ut(e, t, ct(t)), a = Math.max(o.width + (t.padding ?? 0), (t == null ? void 0 : t.width) || 0), n = Math.max(o.height + (t.padding ?? 0), (t == null ? void 0 : t.height) || 0), l = -a / 2, h = -n / 2, c = s.insert("rect", ":first-child");
  return c.attr("class", "text").attr("style", i).attr("rx", 0).attr("ry", 0).attr("x", l).attr("y", h).attr("width", a).attr("height", n), nt(t, c), t.intersect = function(u) {
    return tt.rect(t, u);
  }, s;
}
g(fy, "text");
var vB = /* @__PURE__ */ g((e, t, r, i, s, o) => `M${e},${t}
    a${s},${o} 0,0,1 0,${-i}
    l${r},0
    a${s},${o} 0,0,1 0,${i}
    M${r},${-i}
    a${s},${o} 0,0,0 0,${i}
    l${-r},0`, "createCylinderPathD"), LB = /* @__PURE__ */ g((e, t, r, i, s, o) => [
  `M${e},${t}`,
  `M${e + r},${t}`,
  `a${s},${o} 0,0,0 0,${-i}`,
  `l${-r},0`,
  `a${s},${o} 0,0,0 0,${i}`,
  `l${r},0`
].join(" "), "createOuterCylinderPathD"), AB = /* @__PURE__ */ g((e, t, r, i, s, o) => [`M${e + r / 2},${-i / 2}`, `a${s},${o} 0,0,0 0,${i}`].join(" "), "createInnerCylinderPathD"), wu = 5, Tu = 10;
async function py(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 12 : s / 2;
  if (t.width || t.height) {
    const m = t.height ?? 0;
    t.height = (t.height ?? 0) - o, t.height < wu && (t.height = wu);
    const x = m / 2 / (2.5 + m / 50);
    t.width = (t.width ?? 0) - o - x * 3, t.width < Tu && (t.width = Tu);
  }
  const { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = (t.height ? t.height : n.height) + o, c = h / 2, u = c / (2.5 + h / 50), f = (t.width ? t.width : n.width) + u + o, { cssStyles: d } = t;
  let p;
  if (t.look === "handDrawn") {
    const m = rt.svg(a), y = LB(0, 0, f, h, u, c), x = AB(0, 0, f, h, u, c), C = m.path(y, et(t, {})), k = m.path(x, et(t, { fill: "none" }));
    p = a.insert(() => k, ":first-child"), p = a.insert(() => C, ":first-child"), p.attr("class", "basic label-container"), d && p.attr("style", d);
  } else {
    const m = vB(0, 0, f, h, u, c);
    p = a.insert("path", ":first-child").attr("d", m).attr("class", "basic label-container").attr("style", Yt(d)).attr("style", i), p.attr("class", "basic label-container outer-path"), d && p.selectAll("path").attr("style", d), i && p.selectAll("path").attr("style", i);
  }
  return p.attr("label-offset-x", u), p.attr("transform", `translate(${-f / 2}, ${h / 2} )`), l.attr(
    "transform",
    `translate(${-(n.width / 2) - u - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), nt(t, p), t.intersect = function(m) {
    const y = tt.rect(t, m), x = y.y - (t.y ?? 0);
    if (c != 0 && (Math.abs(x) < (t.height ?? 0) / 2 || Math.abs(x) == (t.height ?? 0) / 2 && Math.abs(y.x - (t.x ?? 0)) > (t.width ?? 0) / 2 - u)) {
      let C = u * u * (1 - x * x / (c * c));
      C != 0 && (C = Math.sqrt(Math.abs(C))), C = u - C, m.x - (t.x ?? 0) > 0 && (C = -C), y.x += C;
    }
    return y;
  }, a;
}
g(py, "tiltedCylinder");
async function gy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = (t.look === "neo", s), a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = ((t == null ? void 0 : t.height) ?? l.height) + o, c = ((t == null ? void 0 : t.width) ?? l.width) + a, u = [
    { x: -3 * h / 6, y: 0 },
    { x: c + 3 * h / 6, y: 0 },
    { x: c, y: -h },
    { x: 0, y: -h }
  ];
  let f;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const p = rt.svg(n), m = et(t, {}), y = St(u), x = p.path(y, m);
    f = n.insert(() => x, ":first-child").attr("transform", `translate(${-c / 2}, ${h / 2})`), d && f.attr("style", d);
  } else
    f = nr(n, c, h, u);
  return i && f.attr("style", i), t.width = c, t.height = h, nt(t, f), t.intersect = function(p) {
    return tt.polygon(t, u, p);
  }, n;
}
g(gy, "trapezoid");
async function my(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = 15, l = 5;
  (t.width || t.height) && (t.height = (t.height ?? 0) - a * 2, t.height < l && (t.height = l), t.width = (t.width ?? 0) - o * 2, t.width < n && (t.width = n));
  const { shapeSvg: h, bbox: c } = await ut(e, t, ct(t)), u = (t != null && t.width ? t == null ? void 0 : t.width : c.width) + o * 2, f = (t != null && t.height ? t == null ? void 0 : t.height : c.height) + a * 2, { cssStyles: d } = t, p = rt.svg(h), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = [
    { x: -u / 2 * 0.8, y: -f / 2 },
    { x: u / 2 * 0.8, y: -f / 2 },
    { x: u / 2, y: -f / 2 * 0.6 },
    { x: u / 2, y: f / 2 },
    { x: -u / 2, y: f / 2 },
    { x: -u / 2, y: -f / 2 * 0.6 }
  ], x = St(y), C = p.path(x, m), k = h.insert(() => C, ":first-child");
  return k.attr("class", "basic label-container outer-path"), d && t.look !== "handDrawn" && k.selectChildren("path").attr("style", d), i && t.look !== "handDrawn" && k.selectChildren("path").attr("style", i), nt(t, k), t.intersect = function(w) {
    return tt.polygon(t, y, w);
  }, h;
}
g(my, "trapezoidalPentagon");
var _u = 10, Bu = 10;
async function yy(e, t) {
  var w;
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.width = (((t == null ? void 0 : t.width) ?? 0) - o) / 2, t.width < Bu && (t.width = Bu), t.height = (t == null ? void 0 : t.height) ?? 0, t.height < _u && (t.height = _u));
  const { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = Ve((w = _t().flowchart) == null ? void 0 : w.htmlLabels), c = (t != null && t.width ? t == null ? void 0 : t.width : n.width) + o, u = t != null && t.height ? t == null ? void 0 : t.height : c + n.height, f = u, d = [
    { x: 0, y: 0 },
    { x: f, y: 0 },
    { x: f / 2, y: -u }
  ], { cssStyles: p } = t, m = rt.svg(a), y = et(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = St(d), C = m.path(x, y), k = a.insert(() => C, ":first-child").attr("transform", `translate(${-u / 2}, ${u / 2})`).attr("class", "outer-path");
  return p && t.look !== "handDrawn" && k.selectChildren("path").attr("style", p), i && t.look !== "handDrawn" && k.selectChildren("path").attr("style", i), t.width = c, t.height = u, nt(t, k), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${u / 2 - (n.height + (t.padding ?? 0) / (h ? 2 : 1) - (n.y - (n.top ?? 0)))})`
  ), t.intersect = function(T) {
    return H.info("Triangle intersect", t, d, T), tt.polygon(t, d, T);
  }, a;
}
g(yy, "triangle");
async function xy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  let n = !0;
  (t.width || t.height) && (n = !1, t.width = ((t == null ? void 0 : t.width) ?? 0) - o * 2, t.width < 10 && (t.width = 10), t.height = ((t == null ? void 0 : t.height) ?? 0) - a * 2, t.height < 10 && (t.height = 10));
  const { shapeSvg: l, bbox: h, label: c } = await ut(e, t, ct(t)), u = (t != null && t.width ? t == null ? void 0 : t.width : h.width) + (o ?? 0) * 2, f = (t != null && t.height ? t == null ? void 0 : t.height : h.height) + (a ?? 0) * 2, d = t.look === "neo" ? f / 4 : f / 8, p = f + (n ? d : -d), { cssStyles: m } = t, x = 14 - u, C = x > 0 ? x / 2 : 0, k = rt.svg(l), w = et(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const T = [
    { x: -u / 2 - C, y: p / 2 },
    ...Tr(
      -u / 2 - C,
      p / 2,
      u / 2 + C,
      p / 2,
      d,
      0.8
    ),
    { x: u / 2 + C, y: -p / 2 },
    { x: -u / 2 - C, y: -p / 2 }
  ], _ = St(T), v = k.path(_, w), L = l.insert(() => v, ":first-child");
  return L.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && L.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(0,${-d / 2})`), c.attr(
    "transform",
    `translate(${-u / 2 + (t.padding ?? 0) - (h.x - (h.left ?? 0))},${-f / 2 + (t.padding ?? 0) - d - (h.y - (h.top ?? 0))})`
  ), nt(t, L), t.intersect = function(W) {
    return tt.polygon(t, T, W);
  }, l;
}
g(xy, "waveEdgedRectangle");
async function Cy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 20 : s;
  if (t.width || t.height) {
    t.width = (t == null ? void 0 : t.width) ?? 0, t.width < 20 && (t.width = 20), t.height = (t == null ? void 0 : t.height) ?? 0, t.height < 10 && (t.height = 10);
    const w = Math.min(t.height * 0.2, t.height / 4);
    t.height = Math.ceil(t.height - a - w * (20 / 9)), t.width = t.width - o * 2;
  }
  const { shapeSvg: n, bbox: l } = await ut(e, t, ct(t)), h = (t != null && t.width ? t == null ? void 0 : t.width : l.width) + o * 2, c = (t != null && t.height ? t == null ? void 0 : t.height : l.height) + a, u = c / 8, f = c + u * 2, { cssStyles: d } = t, p = rt.svg(n), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = [
    { x: -h / 2, y: f / 2 },
    ...Tr(-h / 2, f / 2, h / 2, f / 2, u, 1),
    { x: h / 2, y: -f / 2 },
    ...Tr(h / 2, -f / 2, -h / 2, -f / 2, u, -1)
  ], x = St(y), C = p.path(x, m), k = n.insert(() => C, ":first-child");
  return k.attr("class", "basic label-container"), d && t.look !== "handDrawn" && k.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && k.selectAll("path").attr("style", i), nt(t, k), t.intersect = function(w) {
    return tt.polygon(t, y, w);
  }, n;
}
g(Cy, "waveRectangle");
var It = 10;
async function by(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.width = Math.max(((t == null ? void 0 : t.width) ?? 0) - s * 2 - It, 10), t.height = Math.max(((t == null ? void 0 : t.height) ?? 0) - o * 2 - It, 10));
  const { shapeSvg: a, bbox: n, label: l } = await ut(e, t, ct(t)), h = (t != null && t.width ? t == null ? void 0 : t.width : n.width) + s * 2 + It, c = (t != null && t.height ? t == null ? void 0 : t.height : n.height) + o * 2 + It, u = h - It, f = c - It, d = -u / 2, p = -f / 2, { cssStyles: m } = t, y = rt.svg(a), x = et(t, {}), C = [
    { x: d - It, y: p - It },
    { x: d - It, y: p + f },
    { x: d + u, y: p + f },
    { x: d + u, y: p - It }
  ], k = `M${d - It},${p - It} L${d + u},${p - It} L${d + u},${p + f} L${d - It},${p + f} L${d - It},${p - It}
                M${d - It},${p} L${d + u},${p}
                M${d},${p - It} L${d},${p + f}`;
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const w = y.path(k, x), T = a.insert(() => w, ":first-child");
  return T.attr("transform", `translate(${It / 2}, ${It / 2})`), T.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && T.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && T.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${-(n.width / 2) + It / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) + It / 2 - (n.y - (n.top ?? 0))})`
  ), nt(t, T), t.intersect = function(_) {
    return tt.polygon(t, C, _);
  }, a;
}
g(by, "windowPane");
var vu = /* @__PURE__ */ new Set(["redux-color", "redux-dark-color"]), FB = /* @__PURE__ */ new Set(["redux", "redux-dark", "redux-color", "redux-dark-color"]);
async function Th(e, t) {
  var gt, mt, Tt, At;
  const r = t;
  r.alias && (t.label = r.alias);
  const { theme: i, themeVariables: s } = $t(), { rowEven: o, rowOdd: a, nodeBorder: n, borderColorArray: l } = s;
  if (t.look === "handDrawn") {
    const { themeVariables: K } = $t(), { background: V } = K, Ct = {
      ...t,
      id: t.id + "-background",
      domId: (t.domId || t.id) + "-background",
      look: "default",
      cssStyles: ["stroke: none", `fill: ${V}`]
    };
    await Th(e, Ct);
  }
  const h = $t();
  t.useHtmlLabels = h.htmlLabels;
  let c = ((gt = h.er) == null ? void 0 : gt.diagramPadding) ?? 10, u = ((mt = h.er) == null ? void 0 : mt.entityPadding) ?? 6;
  const { cssStyles: f } = t, { labelStyles: d, nodeStyles: p } = it(t);
  if (r.attributes.length === 0 && t.label) {
    const K = {
      rx: 0,
      ry: 0,
      labelPaddingX: c,
      labelPaddingY: c * 1.5
    };
    or(t.label, h) + K.labelPaddingX * 2 < h.er.minEntityWidth && (t.width = h.er.minEntityWidth);
    const V = await Yi(e, t, K);
    if (i != null && vu.has(i)) {
      const Ct = r.colorIndex ?? 0;
      V.attr("data-color-id", `color-${Ct % l.length}`);
    }
    if (!Ve(h.htmlLabels)) {
      const Ct = V.select("text"), ht = (Tt = Ct.node()) == null ? void 0 : Tt.getBBox();
      Ct.attr("transform", `translate(${-ht.width / 2}, 0)`);
    }
    return V;
  }
  h.htmlLabels || (c *= 1.25, u *= 1.25);
  let m = ct(t);
  m || (m = "node default");
  const y = e.insert("g").attr("class", m).attr("id", t.domId || t.id), x = await ui(y, t.label ?? "", h, 0, 0, ["name"], d);
  x.height += u;
  let C = 0;
  const k = [], w = [];
  let T = 0, _ = 0, v = 0, L = 0, W = !0, O = !0;
  for (const K of r.attributes) {
    const V = await ui(
      y,
      K.type,
      h,
      0,
      C,
      ["attribute-type"],
      d
    );
    T = Math.max(T, V.width + c);
    const Ct = await ui(
      y,
      K.name,
      h,
      0,
      C,
      ["attribute-name"],
      d
    );
    _ = Math.max(_, Ct.width + c);
    const ht = await ui(
      y,
      K.keys.join(),
      h,
      0,
      C,
      ["attribute-keys"],
      d
    );
    v = Math.max(v, ht.width + c);
    const P = await ui(
      y,
      K.comment,
      h,
      0,
      C,
      ["attribute-comment"],
      d
    );
    L = Math.max(L, P.width + c);
    const J = Math.max(V.height, Ct.height, ht.height, P.height) + u;
    w.push({ yOffset: C, rowHeight: J }), C += J;
  }
  let M = 4;
  v <= c && (W = !1, v = 0, M--), L <= c && (O = !1, L = 0, M--);
  const U = y.node().getBBox();
  if (x.width + c * 2 - (T + _ + v + L) > 0) {
    const K = x.width + c * 2 - (T + _ + v + L);
    T += K / M, _ += K / M, v > 0 && (v += K / M), L > 0 && (L += K / M);
  }
  const z = T + _ + v + L, D = rt.svg(y), E = et(t, {});
  t.look !== "handDrawn" && (E.roughness = 0, E.fillStyle = "solid");
  let A = 0;
  w.length > 0 && (A = w.reduce((K, V) => K + ((V == null ? void 0 : V.rowHeight) ?? 0), 0));
  const $ = Math.max(U.width + c * 2, (t == null ? void 0 : t.width) || 0, z), B = Math.max((A ?? 0) + x.height, (t == null ? void 0 : t.height) || 0), I = -$ / 2, Y = -B / 2;
  if (y.selectAll("g:not(:first-child)").each((K, V, Ct) => {
    const ht = bt(Ct[V]), P = ht.attr("transform");
    let J = 0, lr = 0;
    if (P) {
      const xe = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(P);
      xe && (J = parseFloat(xe[1]), lr = parseFloat(xe[2]), ht.attr("class").includes("attribute-name") ? J += T : ht.attr("class").includes("attribute-keys") ? J += T + _ : ht.attr("class").includes("attribute-comment") && (J += T + _ + v));
    }
    ht.attr(
      "transform",
      `translate(${I + c / 2 + J}, ${lr + Y + x.height + u / 2})`
    );
  }), y.select(".name").attr("transform", "translate(" + -x.width / 2 + ", " + (Y + u / 2) + ")"), i != null && vu.has(i)) {
    const K = r.colorIndex ?? 0;
    y.attr("data-color-id", `color-${K % l.length}`);
  }
  const X = D.rectangle(I, Y, $, B, E), Z = y.insert(() => X, ":first-child").attr("class", "outer-path").attr("style", f.join(""));
  k.push(0);
  for (const [K, V] of w.entries()) {
    const ht = (K + 1) % 2 === 0 && V.yOffset !== 0, P = D.rectangle(I, x.height + Y + (V == null ? void 0 : V.yOffset), $, V == null ? void 0 : V.rowHeight, {
      ...E,
      fill: ht ? o : a,
      stroke: n
    });
    y.insert(() => P, "g.label").attr("style", f.join("")).attr("class", `row-rect-${ht ? "even" : "odd"}`);
  }
  const ot = 1e-4;
  let Q = di(I, x.height + Y, $ + I, x.height + Y, ot), at = D.polygon(
    Q.map((K) => [K.x, K.y]),
    E
  );
  if (y.insert(() => at).attr("class", "divider"), Q = di(T + I, x.height + Y, T + I, B + Y, ot), at = D.polygon(
    Q.map((K) => [K.x, K.y]),
    E
  ), y.insert(() => at).attr("class", "divider"), W) {
    const K = T + _ + I;
    Q = di(K, x.height + Y, K, B + Y, ot), at = D.polygon(
      Q.map((V) => [V.x, V.y]),
      E
    ), y.insert(() => at).attr("class", "divider");
  }
  if (O) {
    const K = T + _ + v + I;
    Q = di(K, x.height + Y, K, B + Y, ot), at = D.polygon(
      Q.map((V) => [V.x, V.y]),
      E
    ), y.insert(() => at).attr("class", "divider");
  }
  for (const K of k) {
    const V = x.height + Y + K;
    Q = di(I, V, $ + I, V, ot), at = D.polygon(
      Q.map((Ct) => [Ct.x, Ct.y]),
      E
    ), y.insert(() => at).attr("class", "divider");
  }
  if (nt(t, Z), p && t.look !== "handDrawn")
    if (i != null && FB.has(i))
      y.selectAll("path").attr("style", p);
    else {
      const K = p.split(";"), V = (At = K == null ? void 0 : K.filter((Ct) => Ct.includes("stroke"))) == null ? void 0 : At.map((Ct) => `${Ct}`).join("; ");
      y.selectAll("path").attr("style", V ?? ""), y.selectAll(".row-rect-even path").attr("style", p);
    }
  return t.intersect = function(K) {
    return tt.rect(t, K);
  }, y;
}
g(Th, "erBox");
async function ui(e, t, r, i = 0, s = 0, o = [], a = "") {
  const n = e.insert("g").attr("class", `label ${o.join(" ")}`).attr("transform", `translate(${i}, ${s})`).attr("style", a);
  t !== Cc(t) && (t = Cc(t), t = t.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  const l = n.node().appendChild(
    await Ke(
      n,
      t,
      {
        width: or(t, r) + 100,
        style: a,
        useHtmlLabels: r.htmlLabels
      },
      r
    )
  );
  if (t.includes("&lt;") || t.includes("&gt;")) {
    let c = l.children[0];
    for (c.textContent = c.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">"); c.childNodes[0]; )
      c = c.childNodes[0], c.textContent = c.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
  }
  let h = l.getBBox();
  if (Ve(r.htmlLabels)) {
    const c = l.children[0];
    c.style.textAlign = "start";
    const u = bt(l);
    h = c.getBoundingClientRect(), u.attr("width", h.width), u.attr("height", h.height);
  }
  return h;
}
g(ui, "addText");
function di(e, t, r, i, s) {
  return e === r ? [
    { x: e - s / 2, y: t },
    { x: e + s / 2, y: t },
    { x: r + s / 2, y: i },
    { x: r - s / 2, y: i }
  ] : [
    { x: e, y: t - s / 2 },
    { x: e, y: t + s / 2 },
    { x: r, y: i + s / 2 },
    { x: r, y: i - s / 2 }
  ];
}
g(di, "lineToPolygon");
async function ky(e, t, r, i, s = r.class.padding ?? 12) {
  const o = i ? 0 : 3, a = e.insert("g").attr("class", ct(t)).attr("id", t.domId || t.id);
  let n = null, l = null, h = null, c = null, u = 0, f = 0, d = 0;
  if (n = a.insert("g").attr("class", "annotation-group text"), t.annotations.length > 0) {
    const C = t.annotations[0];
    await cs(n, { text: `«${C}»` }, 0), u = n.node().getBBox().height;
  }
  l = a.insert("g").attr("class", "label-group text"), await cs(l, t, 0, ["font-weight: bolder"]);
  const p = l.node().getBBox();
  f = p.height, h = a.insert("g").attr("class", "members-group text");
  let m = 0;
  for (const C of t.members) {
    const k = await cs(h, C, m, [C.parseClassifier()]);
    m += k + o;
  }
  d = h.node().getBBox().height, d <= 0 && (d = s / 2), c = a.insert("g").attr("class", "methods-group text");
  let y = 0;
  for (const C of t.methods) {
    const k = await cs(c, C, y, [C.parseClassifier()]);
    y += k + o;
  }
  let x = a.node().getBBox();
  if (n !== null) {
    const C = n.node().getBBox();
    n.attr("transform", `translate(${-C.width / 2})`);
  }
  return l.attr("transform", `translate(${-p.width / 2}, ${u})`), x = a.node().getBBox(), h.attr(
    "transform",
    `translate(0, ${u + f + s * 2})`
  ), x = a.node().getBBox(), c.attr(
    "transform",
    `translate(0, ${u + f + (d ? d + s * 4 : s * 2)})`
  ), x = a.node().getBBox(), { shapeSvg: a, bbox: x };
}
g(ky, "textHelper");
async function cs(e, t, r, i = []) {
  const s = e.insert("g").attr("class", "label").attr("style", i.join("; ")), o = $t();
  let a = "useHtmlLabels" in t ? t.useHtmlLabels : Ve(o.htmlLabels) ?? !0, n = "";
  "text" in t ? n = t.text : n = t.label, !a && n.startsWith("\\") && (n = n.substring(1)), ks(n) && (a = !0);
  const l = await Ke(
    s,
    $l(Gr(n)),
    {
      width: or(n, o) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: a
    },
    o
  );
  let h, c = 1;
  if (a) {
    const u = l.children[0], f = bt(l);
    c = u.innerHTML.split("<br>").length, u.innerHTML.includes("</math>") && (c += u.innerHTML.split("<mrow>").length - 1);
    const d = u.getElementsByTagName("img");
    if (d) {
      const p = n.replace(/<img[^>]*>/g, "").trim() === "";
      await Promise.all(
        [...d].map(
          (m) => new Promise((y) => {
            function x() {
              var C;
              if (m.style.display = "flex", m.style.flexDirection = "column", p) {
                const k = ((C = o.fontSize) == null ? void 0 : C.toString()) ?? window.getComputedStyle(document.body).fontSize, T = parseInt(k, 10) * 5 + "px";
                m.style.minWidth = T, m.style.maxWidth = T;
              } else
                m.style.width = "100%";
              y(m);
            }
            g(x, "setupImage"), setTimeout(() => {
              m.complete && x();
            }), m.addEventListener("error", x), m.addEventListener("load", x);
          })
        )
      );
    }
    h = u.getBoundingClientRect(), f.attr("width", h.width), f.attr("height", h.height);
  } else {
    i.includes("font-weight: bolder") && bt(l).selectAll("tspan").attr("font-weight", ""), c = l.children.length;
    const u = l.children[0];
    (l.textContent === "" || l.textContent.includes("&gt")) && (u.textContent = n[0] + n.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim(), n[1] === " " && (u.textContent = u.textContent[0] + " " + u.textContent.substring(1))), u.textContent === "undefined" && (u.textContent = ""), h = l.getBBox();
  }
  return s.attr("transform", "translate(0," + (-h.height / (2 * c) + r) + ")"), h.height;
}
g(cs, "addText");
async function Sy(e, t) {
  var D, E;
  const r = _t(), { themeVariables: i } = r, { useGradient: s } = i, o = r.class.padding ?? 12, a = o, n = t.useHtmlLabels ?? Ve(r.htmlLabels) ?? !0, l = t;
  l.annotations = l.annotations ?? [], l.members = l.members ?? [], l.methods = l.methods ?? [];
  const { shapeSvg: h, bbox: c } = await ky(e, t, r, n, a), { labelStyles: u, nodeStyles: f } = it(t);
  t.labelStyle = u, t.cssStyles = l.styles || "";
  const d = ((D = l.styles) == null ? void 0 : D.join(";")) || f || "";
  t.cssStyles || (t.cssStyles = d.replaceAll("!important", "").split(";"));
  const p = l.members.length === 0 && l.methods.length === 0 && !((E = r.class) != null && E.hideEmptyMembersBox), m = rt.svg(h), y = et(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = Math.max(t.width ?? 0, c.width);
  let C = Math.max(t.height ?? 0, c.height);
  const k = (t.height ?? 0) > c.height;
  l.members.length === 0 && l.methods.length === 0 ? C += a : l.members.length > 0 && l.methods.length === 0 && (C += a * 2);
  const w = -x / 2, T = -C / 2;
  let _ = p ? o * 2 : l.members.length === 0 && l.methods.length === 0 ? -o : 0;
  k && (_ = o * 2);
  const v = m.rectangle(
    w - o,
    T - o - (p ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0),
    x + 2 * o,
    C + 2 * o + _,
    y
  ), L = h.insert(() => v, ":first-child");
  L.attr("class", "basic label-container outer-path");
  const W = L.node().getBBox(), O = h.select(".annotation-group").node().getBBox().height - (p ? o / 2 : 0) || 0, M = h.select(".label-group").node().getBBox().height - (p ? o / 2 : 0) || 0, U = h.select(".members-group").node().getBBox().height - (p ? o / 2 : 0) || 0, z = (O + M + T + o - (T - o - (p ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0))) / 2;
  if (h.selectAll(".text").each((A, $, B) => {
    var Q, at;
    const I = bt(B[$]), Y = I.attr("transform");
    let X = 0;
    if (Y) {
      const mt = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(Y);
      mt && (X = parseFloat(mt[2]));
    }
    let Z = X + T + o - (p ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0);
    if (I.attr("class").includes("methods-group")) {
      const gt = Math.max(U, a / 2);
      k ? Z = Math.max(
        z,
        O + M + gt + T + a * 2 + o
      ) + a * 2 : Z = O + M + gt + T + a * 4 + o;
    }
    l.members.length === 0 && l.methods.length === 0 && ((Q = r.class) != null && Q.hideEmptyMembersBox) && (l.annotations.length > 0 ? Z = X - a : Z = X), n || (Z -= 4);
    let ot = w;
    (I.attr("class").includes("label-group") || I.attr("class").includes("annotation-group")) && (ot = -((at = I.node()) == null ? void 0 : at.getBBox().width) / 2 || 0, h.selectAll("text").each(function(gt, mt, Tt) {
      window.getComputedStyle(Tt[mt]).textAnchor === "middle" && (ot = 0);
    })), I.attr("transform", `translate(${ot}, ${Z})`);
  }), l.members.length > 0 || l.methods.length > 0 || p) {
    const A = O + M + T + o, $ = m.line(
      W.x,
      A,
      W.x + W.width,
      A + 1e-3,
      y
    );
    h.insert(() => $).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", d);
  }
  if (p || l.members.length > 0 || l.methods.length > 0) {
    const A = O + M + U + T + a * 2 + o, $ = m.line(
      W.x,
      k ? Math.max(z, A) : A,
      W.x + W.width,
      (k ? Math.max(z, A) : A) + 1e-3,
      y
    );
    h.insert(() => $).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", d);
  }
  if (l.look !== "handDrawn" && h.selectAll("path").attr("style", d), L.select(":nth-child(2)").attr("style", d), h.selectAll(".divider").select("path").attr("style", d), t.labelStyle ? h.selectAll("span").attr("style", t.labelStyle) : h.selectAll("span").attr("style", d), !n) {
    const A = RegExp(/color\s*:\s*([^;]*)/), $ = A.exec(d);
    if ($) {
      const B = $[0].replace("color", "fill");
      h.selectAll("tspan").attr("style", B);
    } else if (u) {
      const B = A.exec(u);
      if (B) {
        const I = B[0].replace("color", "fill");
        h.selectAll("tspan").attr("style", I);
      }
    }
  }
  return nt(t, L), t.intersect = function(A) {
    return tt.rect(t, A);
  }, h;
}
g(Sy, "classBox");
async function wy(e, t) {
  var W, O;
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const s = t, o = t, a = 20, n = 20, l = "verifyMethod" in t, h = ct(t), { themeVariables: c } = _t(), { borderColorArray: u, requirementEdgeLabelBackground: f } = c, d = e.insert("g").attr("class", h).attr("id", t.domId ?? t.id);
  let p;
  l ? p = await We(
    d,
    `&lt;&lt;${s.type}&gt;&gt;`,
    0,
    t.labelStyle
  ) : p = await We(d, "&lt;&lt;Element&gt;&gt;", 0, t.labelStyle);
  let m = p;
  const y = await We(
    d,
    s.name,
    m,
    t.labelStyle + "; font-weight: bold;"
  );
  if (m += y + n, l) {
    const M = await We(
      d,
      `${s.requirementId ? `ID: ${s.requirementId}` : ""}`,
      m,
      t.labelStyle
    );
    m += M;
    const U = await We(
      d,
      `${s.text ? `Text: ${s.text}` : ""}`,
      m,
      t.labelStyle
    );
    m += U;
    const z = await We(
      d,
      `${s.risk ? `Risk: ${s.risk}` : ""}`,
      m,
      t.labelStyle
    );
    m += z, await We(
      d,
      `${s.verifyMethod ? `Verification: ${s.verifyMethod}` : ""}`,
      m,
      t.labelStyle
    );
  } else {
    const M = await We(
      d,
      `${o.type ? `Type: ${o.type}` : ""}`,
      m,
      t.labelStyle
    );
    m += M, await We(
      d,
      `${o.docRef ? `Doc Ref: ${o.docRef}` : ""}`,
      m,
      t.labelStyle
    );
  }
  const x = (((W = d.node()) == null ? void 0 : W.getBBox().width) ?? 200) + a, C = (((O = d.node()) == null ? void 0 : O.getBBox().height) ?? 200) + a, k = -x / 2, w = -C / 2, T = rt.svg(d), _ = et(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const v = T.rectangle(k, w, x, C, _), L = d.insert(() => v, ":first-child");
  if (L.attr("class", "basic label-container outer-path").attr("style", i), u != null && u.length) {
    const M = t.colorIndex ?? 0;
    d.attr("data-color-id", `color-${M % u.length}`);
  }
  if (d.selectAll(".label").each((M, U, z) => {
    const D = bt(z[U]), E = D.attr("transform");
    let A = 0, $ = 0;
    if (E) {
      const X = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(E);
      X && (A = parseFloat(X[1]), $ = parseFloat(X[2]));
    }
    const B = $ - C / 2;
    let I = k + a / 2;
    (U === 0 || U === 1) && (I = A), D.attr("transform", `translate(${I}, ${B + a})`);
  }), m > p + y + n) {
    const M = w + p + y + n;
    let U;
    if (t.look === "neo") {
      const E = [
        [k, M],
        [k + x, M],
        [k + x, M + 1e-3],
        [k, M + 1e-3]
      ];
      U = T.polygon(E, _);
    } else
      U = T.line(k, M, k + x, M, _);
    d.insert(() => U).attr("class", "divider");
  }
  return nt(t, L), t.intersect = function(M) {
    return tt.rect(t, M);
  }, i && t.look !== "handDrawn" && (f || u != null && u.length) && d.selectAll("path").attr("style", i), d;
}
g(wy, "requirementBox");
async function We(e, t, r, i = "") {
  if (t === "")
    return 0;
  const s = e.insert("g").attr("class", "label").attr("style", i), o = _t(), a = o.htmlLabels ?? !0, n = await Ke(
    s,
    $l(Gr(t)),
    {
      width: or(t, o) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: a,
      style: i
    },
    o
  );
  let l;
  if (a) {
    const h = n.children[0], c = bt(n);
    l = h.getBoundingClientRect(), c.attr("width", l.width), c.attr("height", l.height);
  } else {
    const h = n.children[0];
    for (const c of h.children)
      i && c.setAttribute("style", i);
    l = n.getBBox(), l.height += 6;
  }
  return s.attr("transform", `translate(${-l.width / 2},${-l.height / 2 + r})`), l.height;
}
g(We, "addText");
var EB = /* @__PURE__ */ g((e) => {
  switch (e) {
    case "Very High":
      return "red";
    case "High":
      return "orange";
    case "Medium":
      return null;
    case "Low":
      return "blue";
    case "Very Low":
      return "lightblue";
  }
}, "colorFromPriority");
async function Ty(e, t, { config: r }) {
  var U, z;
  const { labelStyles: i, nodeStyles: s } = it(t);
  t.labelStyle = i || "";
  const o = 10, a = t.width;
  t.width = (t.width ?? 200) - 10;
  const {
    shapeSvg: n,
    bbox: l,
    label: h
  } = await ut(e, t, ct(t)), c = t.padding || 10;
  let u = "", f;
  "ticket" in t && t.ticket && ((U = r == null ? void 0 : r.kanban) != null && U.ticketBaseUrl) && (u = (z = r == null ? void 0 : r.kanban) == null ? void 0 : z.ticketBaseUrl.replace("#TICKET#", t.ticket), f = n.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", u).attr("target", "_blank"));
  const d = {
    useHtmlLabels: t.useHtmlLabels,
    labelStyle: t.labelStyle || "",
    width: t.width,
    img: t.img,
    padding: t.padding || 8,
    centerLabel: !1
  };
  let p, m;
  f ? { label: p, bbox: m } = await cn(
    f,
    "ticket" in t && t.ticket || "",
    d
  ) : { label: p, bbox: m } = await cn(
    n,
    "ticket" in t && t.ticket || "",
    d
  );
  const { label: y, bbox: x } = await cn(
    n,
    "assigned" in t && t.assigned || "",
    d
  );
  t.width = a;
  const C = 10, k = (t == null ? void 0 : t.width) || 0, w = Math.max(m.height, x.height) / 2, T = Math.max(l.height + C * 2, (t == null ? void 0 : t.height) || 0) + w, _ = -k / 2, v = -T / 2;
  h.attr(
    "transform",
    "translate(" + (c - k / 2) + ", " + (-w - l.height / 2) + ")"
  ), p.attr(
    "transform",
    "translate(" + (c - k / 2) + ", " + (-w + l.height / 2) + ")"
  ), y.attr(
    "transform",
    "translate(" + (c + k / 2 - x.width - 2 * o) + ", " + (-w + l.height / 2) + ")"
  );
  let L;
  const { rx: W, ry: O } = t, { cssStyles: M } = t;
  if (t.look === "handDrawn") {
    const D = rt.svg(n), E = et(t, {}), A = W || O ? D.path(_r(_, v, k, T, W || 0), E) : D.rectangle(_, v, k, T, E);
    L = n.insert(() => A, ":first-child"), L.attr("class", "basic label-container").attr("style", M || null);
  } else {
    L = n.insert("rect", ":first-child"), L.attr("class", "basic label-container __APA__").attr("style", s).attr("rx", W ?? 5).attr("ry", O ?? 5).attr("x", _).attr("y", v).attr("width", k).attr("height", T);
    const D = "priority" in t && t.priority;
    if (D) {
      const E = n.append("line"), A = _ + 2, $ = v + Math.floor((W ?? 0) / 2), B = v + T - Math.floor((W ?? 0) / 2);
      E.attr("x1", A).attr("y1", $).attr("x2", A).attr("y2", B).attr("stroke-width", "4").attr("stroke", EB(D));
    }
  }
  return nt(t, L), t.height = T, t.intersect = function(D) {
    return tt.rect(t, D);
  }, n;
}
g(Ty, "kanbanItem");
async function _y(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await ut(
    e,
    t,
    ct(t)
  ), l = o.width + 10 * a, h = o.height + 8 * a, c = 0.15 * l, { cssStyles: u } = t, f = o.width + 20, d = o.height + 20, p = Math.max(l, f), m = Math.max(h, d);
  n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`);
  let y;
  const x = `M0 0 
    a${c},${c} 1 0,0 ${p * 0.25},${-1 * m * 0.1}
    a${c},${c} 1 0,0 ${p * 0.25},0
    a${c},${c} 1 0,0 ${p * 0.25},0
    a${c},${c} 1 0,0 ${p * 0.25},${m * 0.1}

    a${c},${c} 1 0,0 ${p * 0.15},${m * 0.33}
    a${c * 0.8},${c * 0.8} 1 0,0 0,${m * 0.34}
    a${c},${c} 1 0,0 ${-1 * p * 0.15},${m * 0.33}

    a${c},${c} 1 0,0 ${-1 * p * 0.25},${m * 0.15}
    a${c},${c} 1 0,0 ${-1 * p * 0.25},0
    a${c},${c} 1 0,0 ${-1 * p * 0.25},0
    a${c},${c} 1 0,0 ${-1 * p * 0.25},${-1 * m * 0.15}

    a${c},${c} 1 0,0 ${-1 * p * 0.1},${-1 * m * 0.33}
    a${c * 0.8},${c * 0.8} 1 0,0 0,${-1 * m * 0.34}
    a${c},${c} 1 0,0 ${p * 0.1},${-1 * m * 0.33}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const C = rt.svg(s), k = et(t, {}), w = C.path(x, k);
    y = s.insert(() => w, ":first-child"), y.attr("class", "basic label-container").attr("style", Yt(u));
  } else
    y = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", x);
  return y.attr("transform", `translate(${-p / 2}, ${-m / 2})`), nt(t, y), t.calcIntersect = function(C, k) {
    return tt.rect(C, k);
  }, t.intersect = function(C) {
    return H.info("Bang intersect", t, C), tt.rect(t, C);
  }, s;
}
g(_y, "bang");
async function By(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await ut(
    e,
    t,
    ct(t)
  ), l = o.width + 2 * a, h = o.height + 2 * a, c = 0.15 * l, u = 0.25 * l, f = 0.35 * l, d = 0.2 * l, { cssStyles: p } = t;
  let m;
  const y = `M0 0 
    a${c},${c} 0 0,1 ${l * 0.25},${-1 * l * 0.1}
    a${f},${f} 1 0,1 ${l * 0.4},${-1 * l * 0.1}
    a${u},${u} 1 0,1 ${l * 0.35},${l * 0.2}

    a${c},${c} 1 0,1 ${l * 0.15},${h * 0.35}
    a${d},${d} 1 0,1 ${-1 * l * 0.15},${h * 0.65}

    a${u},${c} 1 0,1 ${-1 * l * 0.25},${l * 0.15}
    a${f},${f} 1 0,1 ${-1 * l * 0.5},0
    a${c},${c} 1 0,1 ${-1 * l * 0.25},${-1 * l * 0.15}

    a${c},${c} 1 0,1 ${-1 * l * 0.1},${-1 * h * 0.35}
    a${d},${d} 1 0,1 ${l * 0.1},${-1 * h * 0.65}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const x = rt.svg(s), C = et(t, {}), k = x.path(y, C);
    m = s.insert(() => k, ":first-child"), m.attr("class", "basic label-container").attr("style", Yt(p));
  } else
    m = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", y);
  return n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), m.attr("transform", `translate(${-l / 2}, ${-h / 2})`), nt(t, m), t.calcIntersect = function(x, C) {
    return tt.rect(x, C);
  }, t.intersect = function(x) {
    return H.info("Cloud intersect", t, x), tt.rect(t, x);
  }, s;
}
g(By, "cloud");
async function vy(e, t) {
  const { labelStyles: r, nodeStyles: i } = it(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await ut(
    e,
    t,
    ct(t)
  ), l = o.width + 8 * a, h = o.height + 2 * a, c = 5, u = t.look === "neo" ? `
    M${-l / 2} ${h / 2 - c}
    v${-h + 2 * c}
    q0,-${c} ${c},-${c}
    h${l - 2 * c}
    q${c},0 ${c},${c}
    v${h - c}
    H${-l / 2}
    Z
  ` : `
    M${-l / 2} ${h / 2 - c}
    v${-h + 2 * c}
    q0,-${c} ${c},-${c}
    h${l - 2 * c}
    q${c},0 ${c},${c}
    v${h - 2 * c}
    q0,${c} ${-c},${c}
    h${-(l - 2 * c)}
    q${-c},0 ${-c},${-c}
    Z
  `;
  if (!t.domId)
    throw new Error(
      `defaultMindmapNode: node "${t.id}" is missing a domId — was render.ts domId prefixing skipped?`
    );
  const f = s.append("path").attr("id", t.domId).attr("class", "node-bkg node-" + t.type).attr("style", i).attr("d", u);
  return s.append("line").attr("class", "node-line-").attr("x1", -l / 2).attr("y1", h / 2).attr("x2", l / 2).attr("y2", h / 2), n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), s.append(() => n.node()), nt(t, f), t.calcIntersect = function(d, p) {
    return tt.rect(d, p);
  }, t.intersect = function(d) {
    return tt.rect(t, d);
  }, s;
}
g(vy, "defaultMindmapNode");
async function Ly(e, t) {
  const r = {
    padding: t.padding ?? 0
  };
  return wh(e, t, r);
}
g(Ly, "mindmapCircle");
var MB = [
  {
    semanticName: "Process",
    name: "Rectangle",
    shortName: "rect",
    description: "Standard process shape",
    aliases: ["proc", "process", "rectangle"],
    internalAliases: ["squareRect"],
    handler: oy
  },
  {
    semanticName: "Event",
    name: "Rounded Rectangle",
    shortName: "rounded",
    description: "Represents an event",
    aliases: ["event"],
    internalAliases: ["roundedRect"],
    handler: ry
  },
  {
    semanticName: "Terminal Point",
    name: "Stadium",
    shortName: "stadium",
    description: "Terminal point",
    aliases: ["terminal", "pill"],
    handler: ay
  },
  {
    semanticName: "Subprocess",
    name: "Framed Rectangle",
    shortName: "fr-rect",
    description: "Subprocess",
    aliases: ["subprocess", "subproc", "framed-rectangle", "subroutine"],
    handler: cy
  },
  {
    semanticName: "Database",
    name: "Cylinder",
    shortName: "cyl",
    description: "Database storage",
    aliases: ["db", "database", "cylinder"],
    handler: Lm
  },
  {
    semanticName: "Data Store",
    name: "Data Store",
    shortName: "datastore",
    description: "Data flow diagram data store",
    aliases: ["data-store"],
    handler: Am
  },
  {
    semanticName: "Start",
    name: "Circle",
    shortName: "circle",
    description: "Starting point",
    aliases: ["circ"],
    handler: wh
  },
  {
    semanticName: "Bang",
    name: "Bang",
    shortName: "bang",
    description: "Bang",
    aliases: ["bang"],
    handler: _y
  },
  {
    semanticName: "Cloud",
    name: "Cloud",
    shortName: "cloud",
    description: "cloud",
    aliases: ["cloud"],
    handler: By
  },
  {
    semanticName: "Decision",
    name: "Diamond",
    shortName: "diam",
    description: "Decision-making step",
    aliases: ["decision", "diamond", "question"],
    handler: Jm
  },
  {
    semanticName: "Prepare Conditional",
    name: "Hexagon",
    shortName: "hex",
    description: "Preparation or condition step",
    aliases: ["hexagon", "prepare"],
    handler: Dm
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Right",
    shortName: "lean-r",
    description: "Represents input or output",
    aliases: ["lean-right", "in-out"],
    internalAliases: ["lean_right"],
    handler: Xm
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Left",
    shortName: "lean-l",
    description: "Represents output or input",
    aliases: ["lean-left", "out-in"],
    internalAliases: ["lean_left"],
    handler: Um
  },
  {
    semanticName: "Priority Action",
    name: "Trapezoid Base Bottom",
    shortName: "trap-b",
    description: "Priority action",
    aliases: ["priority", "trapezoid-bottom", "trapezoid"],
    handler: gy
  },
  {
    semanticName: "Manual Operation",
    name: "Trapezoid Base Top",
    shortName: "trap-t",
    description: "Represents a manual task",
    aliases: ["manual", "trapezoid-top", "inv-trapezoid"],
    internalAliases: ["inv_trapezoid"],
    handler: Hm
  },
  {
    semanticName: "Stop",
    name: "Double Circle",
    shortName: "dbl-circ",
    description: "Represents a stop point",
    aliases: ["double-circle"],
    internalAliases: ["doublecircle"],
    handler: Em
  },
  {
    semanticName: "Text Block",
    name: "Text Block",
    shortName: "text",
    description: "Text block",
    handler: fy
  },
  {
    semanticName: "Card",
    name: "Notched Rectangle",
    shortName: "notch-rect",
    description: "Represents a card",
    aliases: ["card", "notched-rectangle"],
    handler: bm
  },
  {
    semanticName: "Lined/Shaded Process",
    name: "Lined Rectangle",
    shortName: "lin-rect",
    description: "Lined process shape",
    aliases: ["lined-rectangle", "lined-process", "lin-proc", "shaded-process"],
    handler: iy
  },
  {
    semanticName: "Start",
    name: "Small Circle",
    shortName: "sm-circ",
    description: "Small starting point",
    aliases: ["start", "small-circle"],
    internalAliases: ["stateStart"],
    handler: hy
  },
  {
    semanticName: "Stop",
    name: "Framed Circle",
    shortName: "fr-circ",
    description: "Stop point",
    aliases: ["stop", "framed-circle"],
    internalAliases: ["stateEnd"],
    handler: ly
  },
  {
    semanticName: "Fork/Join",
    name: "Filled Rectangle",
    shortName: "fork",
    description: "Fork or join in process flow",
    aliases: ["join"],
    internalAliases: ["forkJoin"],
    handler: Om
  },
  {
    semanticName: "Collate",
    name: "Hourglass",
    shortName: "hourglass",
    description: "Represents a collate operation",
    aliases: ["hourglass", "collate"],
    handler: Rm
  },
  {
    semanticName: "Comment",
    name: "Curly Brace",
    shortName: "brace",
    description: "Adds a comment",
    aliases: ["comment", "brace-l"],
    handler: Tm
  },
  {
    semanticName: "Comment Right",
    name: "Curly Brace",
    shortName: "brace-r",
    description: "Adds a comment",
    handler: _m
  },
  {
    semanticName: "Comment with braces on both sides",
    name: "Curly Braces",
    shortName: "braces",
    description: "Adds a comment",
    handler: Bm
  },
  {
    semanticName: "Com Link",
    name: "Lightning Bolt",
    shortName: "bolt",
    description: "Communication link",
    aliases: ["com-link", "lightning-bolt"],
    handler: Gm
  },
  {
    semanticName: "Document",
    name: "Document",
    shortName: "doc",
    description: "Represents a document",
    aliases: ["doc", "document"],
    handler: xy
  },
  {
    semanticName: "Delay",
    name: "Half-Rounded Rectangle",
    shortName: "delay",
    description: "Represents a delay",
    aliases: ["half-rounded-rectangle"],
    handler: Im
  },
  {
    semanticName: "Direct Access Storage",
    name: "Horizontal Cylinder",
    shortName: "h-cyl",
    description: "Direct access storage",
    aliases: ["das", "horizontal-cylinder"],
    handler: py
  },
  {
    semanticName: "Disk Storage",
    name: "Lined Cylinder",
    shortName: "lin-cyl",
    description: "Disk storage",
    aliases: ["disk", "lined-cylinder"],
    handler: jm
  },
  {
    semanticName: "Display",
    name: "Curved Trapezoid",
    shortName: "curv-trap",
    description: "Represents a display",
    aliases: ["curved-trapezoid", "display"],
    handler: vm
  },
  {
    semanticName: "Divided Process",
    name: "Divided Rectangle",
    shortName: "div-rect",
    description: "Divided process shape",
    aliases: ["div-proc", "divided-rectangle", "divided-process"],
    handler: Fm
  },
  {
    semanticName: "Extract",
    name: "Triangle",
    shortName: "tri",
    description: "Extraction process",
    aliases: ["extract", "triangle"],
    handler: yy
  },
  {
    semanticName: "Internal Storage",
    name: "Window Pane",
    shortName: "win-pane",
    description: "Internal storage",
    aliases: ["internal-storage", "window-pane"],
    handler: by
  },
  {
    semanticName: "Junction",
    name: "Filled Circle",
    shortName: "f-circ",
    description: "Junction point",
    aliases: ["junction", "filled-circle"],
    handler: Mm
  },
  {
    semanticName: "Loop Limit",
    name: "Trapezoidal Pentagon",
    shortName: "notch-pent",
    description: "Loop limit step",
    aliases: ["loop-limit", "notched-pentagon"],
    handler: my
  },
  {
    semanticName: "Manual File",
    name: "Flipped Triangle",
    shortName: "flip-tri",
    description: "Manual file operation",
    aliases: ["manual-file", "flipped-triangle"],
    handler: $m
  },
  {
    semanticName: "Manual Input",
    name: "Sloped Rectangle",
    shortName: "sl-rect",
    description: "Manual input step",
    aliases: ["manual-input", "sloped-rectangle"],
    handler: sy
  },
  {
    semanticName: "Multi-Document",
    name: "Stacked Document",
    shortName: "docs",
    description: "Multiple documents",
    aliases: ["documents", "st-doc", "stacked-document"],
    handler: Km
  },
  {
    semanticName: "Multi-Process",
    name: "Stacked Rectangle",
    shortName: "st-rect",
    description: "Multiple processes",
    aliases: ["procs", "processes", "stacked-rectangle"],
    handler: Zm
  },
  {
    semanticName: "Stored Data",
    name: "Bow Tie Rectangle",
    shortName: "bow-rect",
    description: "Stored data",
    aliases: ["stored-data", "bow-tie-rectangle"],
    handler: Cm
  },
  {
    semanticName: "Summary",
    name: "Crossed Circle",
    shortName: "cross-circ",
    description: "Summary",
    aliases: ["summary", "crossed-circle"],
    handler: wm
  },
  {
    semanticName: "Tagged Document",
    name: "Tagged Document",
    shortName: "tag-doc",
    description: "Tagged document",
    aliases: ["tag-doc", "tagged-document"],
    handler: dy
  },
  {
    semanticName: "Tagged Process",
    name: "Tagged Rectangle",
    shortName: "tag-rect",
    description: "Tagged process",
    aliases: ["tagged-rectangle", "tag-proc", "tagged-process"],
    handler: uy
  },
  {
    semanticName: "Paper Tape",
    name: "Flag",
    shortName: "flag",
    description: "Paper tape",
    aliases: ["paper-tape"],
    handler: Cy
  },
  {
    semanticName: "Odd",
    name: "Odd",
    shortName: "odd",
    description: "Odd shape",
    internalAliases: ["rect_left_inv_arrow"],
    handler: ty
  },
  {
    semanticName: "Lined Document",
    name: "Lined Document",
    shortName: "lin-doc",
    description: "Lined document",
    aliases: ["lined-document"],
    handler: Vm
  }
], $B = /* @__PURE__ */ g(() => {
  const t = [
    ...Object.entries({
      // States
      state: ny,
      choice: km,
      note: Qm,
      // Rectangles
      rectWithTitle: ey,
      labelRect: Ym,
      // Icons
      iconSquare: Wm,
      iconCircle: Nm,
      icon: Pm,
      iconRounded: qm,
      imageSquare: zm,
      anchor: ym,
      // Kanban diagram
      kanbanItem: Ty,
      //Mindmap diagram
      mindmapCircle: Ly,
      defaultMindmapNode: vy,
      // class diagram
      classBox: Sy,
      // er diagram
      erBox: Th,
      // Requirement diagram
      requirementBox: wy
    }),
    ...MB.flatMap((r) => [
      r.shortName,
      ..."aliases" in r ? r.aliases : [],
      ..."internalAliases" in r ? r.internalAliases : []
    ].map((s) => [s, r.handler]))
  ];
  return Object.fromEntries(t);
}, "generateShapeMap"), Ay = $B();
function OB(e) {
  return e in Ay;
}
g(OB, "isValidShape");
var wa = /* @__PURE__ */ new Map();
async function Fy(e, t, r) {
  let i, s;
  t.shape === "rect" && (t.rx && t.ry ? t.shape = "roundedRect" : t.shape = "squareRect");
  const o = t.shape ? Ay[t.shape] : void 0;
  if (!o)
    throw new Error(`No such shape: ${t.shape}. Please check your syntax.`);
  if (t.link) {
    let a;
    r.config.securityLevel === "sandbox" ? a = "_top" : t.linkTarget && (a = t.linkTarget || "_blank"), i = e.insert("svg:a").attr("xlink:href", t.link).attr("target", a ?? null), s = await o(i, t, r);
  } else
    s = await o(e, t, r), i = s;
  return i.attr("data-look", Yt(t.look)), t.tooltip && s.attr("title", t.tooltip), wa.set(t.id, i), t.haveCallback && i.attr("class", i.attr("class") + " clickable"), i;
}
g(Fy, "insertNode");
var PM = /* @__PURE__ */ g((e, t) => {
  wa.set(t.id, e);
}, "setNodeElem"), NM = /* @__PURE__ */ g(() => {
  wa.clear();
}, "clear"), qM = /* @__PURE__ */ g((e) => {
  const t = wa.get(e.id);
  H.trace(
    "Transforming node",
    e.diff,
    e,
    "translate(" + (e.x - e.width / 2 - 5) + ", " + e.width / 2 + ")"
  );
  const r = 8, i = e.diff || 0;
  return e.clusterNode ? t.attr(
    "transform",
    "translate(" + (e.x + i - e.width / 2) + ", " + (e.y - e.height / 2 - r) + ")"
  ) : t.attr("transform", "translate(" + e.x + ", " + e.y + ")"), i;
}, "positionNode"), es = /* @__PURE__ */ g((e, t) => {
  if (t)
    return "translate(" + -e.width / 2 + ", " + -e.height / 2 + ")";
  const r = e.x ?? 0, i = e.y ?? 0;
  return "translate(" + -(r + e.width / 2) + ", " + -(i + e.height / 2) + ")";
}, "computeLabelTransform"), Jt = {
  aggregation: 17.25,
  extension: 17.25,
  composition: 17.25,
  dependency: 6,
  lollipop: 13.5,
  arrow_point: 4,
  arrow_barb: 0,
  arrow_barb_neo: 5.5
  //arrow_cross: 24,
}, Lu = {
  arrow_point: 4,
  arrow_cross: 12.5,
  arrow_circle: 12.5
};
function us(e, t) {
  if (e === void 0 || t === void 0)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  e = Et(e), t = Et(t);
  const [r, i] = [e.x, e.y], [s, o] = [t.x, t.y], a = s - r, n = o - i;
  return { angle: Math.atan(n / a), deltaX: a, deltaY: n };
}
g(us, "calculateDeltaAndAngle");
var Et = /* @__PURE__ */ g((e) => Array.isArray(e) ? { x: e[0], y: e[1] } : e, "pointTransformer"), IB = /* @__PURE__ */ g((e) => ({
  x: /* @__PURE__ */ g(function(t, r, i) {
    let s = 0;
    const o = Et(i[0]).x < Et(i[i.length - 1]).x ? "left" : "right";
    if (r === 0 && Object.hasOwn(Jt, e.arrowTypeStart)) {
      const { angle: d, deltaX: p } = us(i[0], i[1]);
      s = Jt[e.arrowTypeStart] * Math.cos(d) * (p >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(Jt, e.arrowTypeEnd)) {
      const { angle: d, deltaX: p } = us(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = Jt[e.arrowTypeEnd] * Math.cos(d) * (p >= 0 ? 1 : -1);
    }
    const a = Math.abs(
      Et(t).x - Et(i[i.length - 1]).x
    ), n = Math.abs(
      Et(t).y - Et(i[i.length - 1]).y
    ), l = Math.abs(Et(t).x - Et(i[0]).x), h = Math.abs(Et(t).y - Et(i[0]).y), c = Jt[e.arrowTypeStart], u = Jt[e.arrowTypeEnd], f = 1;
    if (a < u && a > 0 && n < u) {
      let d = u + f - a;
      d *= o === "right" ? -1 : 1, s -= d;
    }
    if (l < c && l > 0 && h < c) {
      let d = c + f - l;
      d *= o === "right" ? -1 : 1, s += d;
    }
    return Et(t).x + s;
  }, "x"),
  y: /* @__PURE__ */ g(function(t, r, i) {
    let s = 0;
    const o = Et(i[0]).y < Et(i[i.length - 1]).y ? "down" : "up";
    if (r === 0 && Object.hasOwn(Jt, e.arrowTypeStart)) {
      const { angle: d, deltaY: p } = us(i[0], i[1]);
      s = Jt[e.arrowTypeStart] * Math.abs(Math.sin(d)) * (p >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(Jt, e.arrowTypeEnd)) {
      const { angle: d, deltaY: p } = us(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = Jt[e.arrowTypeEnd] * Math.abs(Math.sin(d)) * (p >= 0 ? 1 : -1);
    }
    const a = Math.abs(
      Et(t).y - Et(i[i.length - 1]).y
    ), n = Math.abs(
      Et(t).x - Et(i[i.length - 1]).x
    ), l = Math.abs(Et(t).y - Et(i[0]).y), h = Math.abs(Et(t).x - Et(i[0]).x), c = Jt[e.arrowTypeStart], u = Jt[e.arrowTypeEnd], f = 1;
    if (a < u && a > 0 && n < u) {
      let d = u + f - a;
      d *= o === "up" ? -1 : 1, s -= d;
    }
    if (l < c && l > 0 && h < c) {
      let d = c + f - l;
      d *= o === "up" ? -1 : 1, s += d;
    }
    return Et(t).y + s;
  }, "y")
}), "getLineFunctionsWithOffset"), DB = /* @__PURE__ */ g((e, t, r, i, s, o = !1, a) => {
  t.arrowTypeStart && Au(
    e,
    "start",
    t.arrowTypeStart,
    r,
    i,
    s,
    o,
    a
  ), t.arrowTypeEnd && Au(e, "end", t.arrowTypeEnd, r, i, s, o, a);
}, "addEdgeMarkers"), RB = {
  arrow_cross: { type: "cross", fill: !1 },
  arrow_point: { type: "point", fill: !0 },
  arrow_barb: { type: "barb", fill: !0 },
  arrow_barb_neo: { type: "barb", fill: !0 },
  arrow_circle: { type: "circle", fill: !1 },
  aggregation: { type: "aggregation", fill: !1 },
  extension: { type: "extension", fill: !1 },
  composition: { type: "composition", fill: !0 },
  dependency: { type: "dependency", fill: !0 },
  lollipop: { type: "lollipop", fill: !1 },
  only_one: { type: "onlyOne", fill: !1 },
  zero_or_one: { type: "zeroOrOne", fill: !1 },
  one_or_more: { type: "oneOrMore", fill: !1 },
  zero_or_more: { type: "zeroOrMore", fill: !1 },
  requirement_arrow: { type: "requirement_arrow", fill: !1 },
  requirement_contains: { type: "requirement_contains", fill: !1 }
}, PB = [
  "cross",
  "point",
  "circle",
  "lollipop",
  "aggregation",
  "extension",
  "composition",
  "dependency",
  "barb"
], Au = /* @__PURE__ */ g((e, t, r, i, s, o, a = !1, n) => {
  var p;
  const l = RB[r], h = l && PB.includes(l.type);
  if (!l) {
    H.warn(`Unknown arrow type: ${r}`);
    return;
  }
  const c = l.type, d = `${s}_${o}-${c}${t === "start" ? "Start" : "End"}${a && h ? "-margin" : ""}`;
  if (n && n.trim() !== "") {
    const m = n.replace(/[^\dA-Za-z]/g, "_"), y = `${d}_${m}`;
    if (!document.getElementById(y)) {
      const x = document.getElementById(d);
      if (x) {
        const C = x.cloneNode(!0);
        C.id = y, C.querySelectorAll("path, circle, line").forEach((w) => {
          w.setAttribute("stroke", n), l.fill && w.setAttribute("fill", n);
        }), (p = x.parentNode) == null || p.appendChild(C);
      }
    }
    e.attr(`marker-${t}`, `url(${i}#${y})`);
  } else
    e.attr(`marker-${t}`, `url(${i}#${d})`);
}, "addEdgeMarker"), NB = /* @__PURE__ */ g((e) => {
  var t, r;
  return typeof e == "string" ? e : (r = (t = _t()) == null ? void 0 : t.flowchart) == null ? void 0 : r.curve;
}, "resolveEdgeCurveType"), ia = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), WM = /* @__PURE__ */ g(() => {
  ia.clear(), Gt.clear();
}, "clear"), rs = /* @__PURE__ */ g((e) => e ? typeof e == "string" ? e : e.reduce((t, r) => t + ";" + r, "") : "", "getLabelStyles"), qB = /* @__PURE__ */ g(async (e, t) => {
  const r = _t();
  let i = ne(r);
  const { labelStyles: s } = it(t);
  t.labelStyle = s;
  const o = e.insert("g").attr("class", "edgeLabel"), a = o.insert("g").attr("class", "label").attr("data-id", t.id), n = t.labelType === "markdown", h = await Ke(
    e,
    t.label,
    {
      style: rs(t.labelStyle),
      useHtmlLabels: i,
      addSvgBackground: !0,
      isNode: !1,
      markdown: n,
      // Plain text edge labels should auto-wrap, markdown edge labels respect markdownAutoWrap config
      width: n ? void 0 : void 0
    },
    r
  );
  a.node().appendChild(h), H.info("abc82", t, t.labelType);
  let c = h.getBBox(), u = c;
  if (i) {
    const d = h.children[0], p = bt(h);
    c = d.getBoundingClientRect(), u = c, p.attr("width", c.width), p.attr("height", c.height);
  } else {
    const d = bt(h).select("text").node();
    d && typeof d.getBBox == "function" && (u = d.getBBox());
  }
  a.attr("transform", es(u, i)), ia.set(t.id, o), t.width = c.width, t.height = c.height;
  let f;
  if (t.startLabelLeft) {
    const d = e.insert("g").attr("class", "edgeTerminals"), p = d.insert("g").attr("class", "inner"), m = await yr(
      p,
      t.startLabelLeft,
      rs(t.labelStyle) || "",
      !1,
      !1
    );
    f = m;
    let y = m.getBBox();
    if (i) {
      const x = m.children[0], C = bt(m);
      y = x.getBoundingClientRect(), C.attr("width", y.width), C.attr("height", y.height);
    }
    p.attr("transform", es(y, i)), Gt.get(t.id) || Gt.set(t.id, {}), Gt.get(t.id).startLeft = d, ds(f, t.startLabelLeft);
  }
  if (t.startLabelRight) {
    const d = e.insert("g").attr("class", "edgeTerminals"), p = d.insert("g").attr("class", "inner"), m = await yr(
      p,
      t.startLabelRight,
      rs(t.labelStyle) || "",
      !1,
      !1
    );
    f = m;
    let y = m.getBBox();
    if (i) {
      const x = m.children[0], C = bt(m);
      y = x.getBoundingClientRect(), C.attr("width", y.width), C.attr("height", y.height);
    }
    p.attr("transform", es(y, i)), Gt.get(t.id) || Gt.set(t.id, {}), Gt.get(t.id).startRight = d, ds(f, t.startLabelRight);
  }
  if (t.endLabelLeft) {
    const d = e.insert("g").attr("class", "edgeTerminals"), p = d.insert("g").attr("class", "inner"), m = await yr(
      d,
      t.endLabelLeft,
      rs(t.labelStyle) || "",
      !1,
      !1
    );
    f = m;
    let y = m.getBBox();
    if (i) {
      const x = m.children[0], C = bt(m);
      y = x.getBoundingClientRect(), C.attr("width", y.width), C.attr("height", y.height);
    }
    p.attr("transform", es(y, i)), Gt.get(t.id) || Gt.set(t.id, {}), Gt.get(t.id).endLeft = d, ds(f, t.endLabelLeft);
  }
  if (t.endLabelRight) {
    const d = e.insert("g").attr("class", "edgeTerminals"), p = d.insert("g").attr("class", "inner"), m = await yr(
      d,
      t.endLabelRight,
      rs(t.labelStyle) || "",
      !1,
      !1
    );
    f = m;
    let y = m.getBBox();
    if (i) {
      const x = m.children[0], C = bt(m);
      y = x.getBoundingClientRect(), C.attr("width", y.width), C.attr("height", y.height);
    }
    p.attr("transform", es(y, i)), Gt.get(t.id) || Gt.set(t.id, {}), Gt.get(t.id).endRight = d, ds(f, t.endLabelRight);
  }
  return h;
}, "insertEdgeLabel");
function ds(e, t) {
  ne(_t()) && e && (e.style.width = t.length * 9 + "px", e.style.height = "12px");
}
g(ds, "setTerminalWidth");
var WB = /* @__PURE__ */ g((e, t) => {
  H.debug("Moving label abc88 ", e.id, e.label, ia.get(e.id), t);
  let r = t.updatedPath ? t.updatedPath : t.originalPath;
  const i = _t(), { subGraphTitleTotalMargin: s } = ch(i);
  if (e.label) {
    const o = ia.get(e.id);
    let a = e.x, n = e.y;
    if (r) {
      const l = Fe.calcLabelPosition(r);
      H.debug(
        "Moving label " + e.label + " from (",
        a,
        ",",
        n,
        ") to (",
        l.x,
        ",",
        l.y,
        ") abc88"
      ), t.updatedPath && (a = l.x, n = l.y);
    }
    o.attr("transform", `translate(${a}, ${n + s / 2})`);
  }
  if (e.startLabelLeft) {
    const o = Gt.get(e.id).startLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = Fe.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.startLabelRight) {
    const o = Gt.get(e.id).startRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = Fe.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelLeft) {
    const o = Gt.get(e.id).endLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = Fe.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelRight) {
    const o = Gt.get(e.id).endRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = Fe.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
}, "positionEdgeLabel"), zB = /* @__PURE__ */ g((e, t) => {
  var a;
  if (!(e != null && e.isLabelEdge) || !((a = e == null ? void 0 : e.id) != null && a.endsWith("-to-label")) || !Array.isArray(t) || t.length !== 2)
    return t;
  const [r, i] = t, s = Math.abs(i.x - r.x), o = Math.abs(i.y - r.y);
  return s < 1e-3 || o < 1e-3 ? t : o >= s ? [r, { x: r.x, y: i.y }, i] : [r, { x: i.x, y: r.y }, i];
}, "orthogonalizeToLabelClippedPoints"), HB = /* @__PURE__ */ g((e, t) => {
  const r = e.x, i = e.y, s = Math.abs(t.x - r), o = Math.abs(t.y - i), a = e.width / 2, n = e.height / 2;
  return s >= a || o >= n;
}, "outsideNode"), YB = /* @__PURE__ */ g((e, t, r) => {
  H.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(t)}
  insidePoint : ${JSON.stringify(r)}
  node        : x:${e.x} y:${e.y} w:${e.width} h:${e.height}`);
  const i = e.x, s = e.y, o = Math.abs(i - r.x), a = e.width / 2;
  let n = r.x < t.x ? a - o : a + o;
  const l = e.height / 2, h = Math.abs(t.y - r.y), c = Math.abs(t.x - r.x);
  if (Math.abs(s - t.y) * a > Math.abs(i - t.x) * l) {
    let u = r.y < t.y ? t.y - l - s : s - l - t.y;
    n = c * u / h;
    const f = {
      x: r.x < t.x ? r.x + n : r.x - c + n,
      y: r.y < t.y ? r.y + h - u : r.y - h + u
    };
    return n === 0 && (f.x = t.x, f.y = t.y), c === 0 && (f.x = t.x), h === 0 && (f.y = t.y), H.debug(`abc89 top/bottom calc, Q ${h}, q ${u}, R ${c}, r ${n}`, f), f;
  } else {
    r.x < t.x ? n = t.x - a - i : n = i - a - t.x;
    let u = h * n / c, f = r.x < t.x ? r.x + c - n : r.x - c + n, d = r.y < t.y ? r.y + u : r.y - u;
    return H.debug(`sides calc abc89, Q ${h}, q ${u}, R ${c}, r ${n}`, { _x: f, _y: d }), n === 0 && (f = t.x, d = t.y), c === 0 && (f = t.x), h === 0 && (d = t.y), { x: f, y: d };
  }
}, "intersection"), Fu = /* @__PURE__ */ g((e, t) => {
  H.warn("abc88 cutPathAtIntersect", e, t);
  let r = [], i = e[0], s = !1;
  return e.forEach((o) => {
    if (H.info("abc88 checking point", o, t), !HB(t, o) && !s) {
      const a = YB(t, i, o);
      H.debug("abc88 inside", o, i, a), H.debug("abc88 intersection", a, t);
      let n = !1;
      r.forEach((l) => {
        n = n || l.x === a.x && l.y === a.y;
      }), r.some((l) => l.x === a.x && l.y === a.y) ? H.warn("abc88 no intersect", a, r) : r.push(a), s = !0;
    } else
      H.warn("abc88 outside", o, i), i = o, s || r.push(o);
  }), H.debug("returning points", r), r;
}, "cutPathAtIntersect");
function Ey(e) {
  const t = [], r = [];
  for (let i = 1; i < e.length - 1; i++) {
    const s = e[i - 1], o = e[i], a = e[i + 1];
    (s.x === o.x && o.y === a.y && Math.abs(o.x - a.x) > 5 && Math.abs(o.y - s.y) > 5 || s.y === o.y && o.x === a.x && Math.abs(o.x - s.x) > 5 && Math.abs(o.y - a.y) > 5) && (t.push(o), r.push(i));
  }
  return { cornerPoints: t, cornerPointPositions: r };
}
g(Ey, "extractCornerPoints");
var Eu = /* @__PURE__ */ g(function(e, t, r) {
  const i = t.x - e.x, s = t.y - e.y, o = Math.sqrt(i * i + s * s), a = r / o;
  return { x: t.x - a * i, y: t.y - a * s };
}, "findAdjacentPoint"), UB = /* @__PURE__ */ g(function(e) {
  const { cornerPointPositions: t } = Ey(e), r = [];
  for (let i = 0; i < e.length; i++)
    if (t.includes(i)) {
      const s = e[i - 1], o = e[i + 1], a = e[i], n = Eu(s, a, 5), l = Eu(o, a, 5), h = l.x - n.x, c = l.y - n.y;
      r.push(n);
      const u = Math.sqrt(2) * 2;
      let f = { x: a.x, y: a.y };
      if (Math.abs(o.x - s.x) > 10 && Math.abs(o.y - s.y) >= 10) {
        H.debug(
          "Corner point fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
        const d = 5;
        a.x === n.x ? f = {
          x: h < 0 ? n.x - d + u : n.x + d - u,
          y: c < 0 ? n.y - u : n.y + u
        } : f = {
          x: h < 0 ? n.x - u : n.x + u,
          y: c < 0 ? n.y - d + u : n.y + d - u
        };
      } else
        H.debug(
          "Corner point skipping fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
      r.push(f, l);
    } else
      r.push(e[i]);
  return r;
}, "fixCorners"), XB = /* @__PURE__ */ g((e, t, r) => {
  const i = e - t - r, s = 2, o = 2, a = s + o, n = Math.floor(i / a), l = Array(n).fill(`${s} ${o}`).join(" ");
  return `0 ${t} ${l} ${r}`;
}, "generateDashArray"), GB = /* @__PURE__ */ g(function(e, t, r, i, s, o, a, n = !1) {
  var B;
  if (!a)
    throw new Error(
      `insertEdge: missing diagramId for edge "${t.id}" — edge IDs require a diagram prefix for uniqueness`
    );
  const { handDrawnSeed: l, layout: h } = _t();
  let c = t.points, u = !1;
  const f = s;
  var d = o;
  const p = [];
  for (const I in t.cssCompiledStyles)
    dg(I) || p.push(t.cssCompiledStyles[I]);
  if (h === "swimlane") {
    if (d.intersect && f.intersect && Array.isArray(c) && c.length >= 2)
      if (c.length === 2)
        c = [f.intersect(c[0]), d.intersect(c[1])];
      else {
        const I = c.slice(1, -1), Y = I[0], X = I[I.length - 1], Z = 0.5, ot = Math.abs(c[c.length - 1].x - X.x) < Z && Math.abs(c[c.length - 1].y - X.y) < Z, Q = f.intersect(Y), at = ot ? X : d.intersect(X), gt = Math.abs(at.x - X.x) < Z && Math.abs(at.y - X.y) < Z, Tt = Math.abs(Q.x - Y.x) < Z && Math.abs(Q.y - Y.y) < Z ? [] : [Q], At = gt ? [] : [at];
        c = [...Tt, ...I, ...At];
      }
    c = zB(t, c);
  } else d.intersect && f.intersect && !n && (c = c.slice(1, t.points.length - 1), c.unshift(f.intersect(c[0])), c.push(d.intersect(c[c.length - 1])));
  const m = btoa(JSON.stringify(c));
  t.toCluster && (H.info("to cluster abc88", r.get(t.toCluster)), c = Fu(t.points, r.get(t.toCluster).node), u = !0), t.fromCluster && (H.debug(
    "from cluster abc88",
    r.get(t.fromCluster),
    JSON.stringify(c, null, 2)
  ), c = Fu(c.reverse(), r.get(t.fromCluster).node).reverse(), u = !0);
  let y = c.filter((I) => !Number.isNaN(I.y));
  const x = NB(t.curve);
  x !== "rounded" && (y = UB(y));
  let C = ys;
  switch (x) {
    case "linear":
      C = ys;
      break;
    case "basis":
      C = Rn;
      break;
    case "cardinal":
      C = mf;
      break;
    case "bumpX":
      C = uf;
      break;
    case "bumpY":
      C = df;
      break;
    case "catmullRom":
      C = xf;
      break;
    case "monotoneX":
      C = Tf;
      break;
    case "monotoneY":
      C = _f;
      break;
    case "natural":
      C = vf;
      break;
    case "step":
      C = Lf;
      break;
    case "stepAfter":
      C = Ff;
      break;
    case "stepBefore":
      C = Af;
      break;
    case "rounded":
      C = ys;
      break;
    default:
      C = Rn;
  }
  const { x: k, y: w } = IB(t), T = CS().x(k).y(w).curve(C);
  let _;
  switch (t.thickness) {
    case "normal":
      _ = "edge-thickness-normal";
      break;
    case "thick":
      _ = "edge-thickness-thick";
      break;
    case "invisible":
      _ = "edge-thickness-invisible";
      break;
    default:
      _ = "edge-thickness-normal";
  }
  switch (t.pattern) {
    case "solid":
      _ += " edge-pattern-solid";
      break;
    case "dotted":
      _ += " edge-pattern-dotted";
      break;
    case "dashed":
      _ += " edge-pattern-dashed";
      break;
    default:
      _ += " edge-pattern-solid";
  }
  let v, L = x === "rounded" ? My($y(y, t), 5) : T(y);
  const W = Array.isArray(t.style) ? t.style : [t.style];
  let O = W.find((I) => I == null ? void 0 : I.startsWith("stroke:")), M = "";
  t.animate && (M = "edge-animation-fast"), t.animation && (M = "edge-animation-" + t.animation);
  let U = !1;
  if (t.look === "handDrawn") {
    const I = rt.svg(e);
    Object.assign([], y);
    const Y = I.path(L, {
      roughness: 0.3,
      seed: l
    });
    _ += " transition", v = bt(Y).select("path").attr("id", `${a}-${t.id}`).attr(
      "class",
      " " + _ + (t.classes ? " " + t.classes : "") + (M ? " " + M : "")
    ).attr("style", W ? W.reduce((Z, ot) => Z + ";" + ot, "") : "");
    let X = v.attr("d");
    v.attr("d", X), e.node().appendChild(v.node());
  } else {
    const I = p.join(";"), Y = W ? W.reduce((gt, mt) => gt + mt + ";", "") : "", X = (I ? I + ";" + Y + ";" : Y) + ";" + (W ? W.reduce((gt, mt) => gt + ";" + mt, "") : "");
    v = e.append("path").attr("d", L).attr("id", `${a}-${t.id}`).attr(
      "class",
      " " + _ + (t.classes ? " " + t.classes : "") + (M ? " " + M : "")
    ).attr("style", X), O = (B = X.match(/stroke:([^;]+)/)) == null ? void 0 : B[1], U = t.animate === !0 || !!t.animation || I.includes("animation");
    const Z = v.node(), ot = typeof Z.getTotalLength == "function" ? Z.getTotalLength() : 0, Q = Lu[t.arrowTypeStart] || 0, at = Lu[t.arrowTypeEnd] || 0;
    if (t.look === "neo" && !U) {
      const mt = `stroke-dasharray: ${t.pattern === "dotted" || t.pattern === "dashed" ? XB(ot, Q, at) : `0 ${Q} ${ot - Q - at} ${at}`}; stroke-dashoffset: 0;`;
      v.attr("style", mt + v.attr("style"));
    }
  }
  v.attr("data-edge", !0), v.attr("data-et", "edge"), v.attr("data-id", t.id), v.attr("data-points", m), v.attr("data-look", Yt(t.look)), t.showPoints && y.forEach((I) => {
    e.append("circle").style("stroke", "red").style("fill", "red").attr("r", 1).attr("cx", I.x).attr("cy", I.y);
  });
  let z = "";
  (_t().flowchart.arrowMarkerAbsolute || _t().state.arrowMarkerAbsolute) && (z = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, z = z.replace(/\(/g, "\\(").replace(/\)/g, "\\)")), H.info("arrowTypeStart", t.arrowTypeStart), H.info("arrowTypeEnd", t.arrowTypeEnd);
  const D = !U && (t == null ? void 0 : t.look) === "neo";
  DB(v, t, z, a, i, D, O);
  const E = Math.floor(c.length / 2), A = c[E];
  Fe.isLabelCoordinateInPath(A, v.attr("d")) || (u = !0);
  let $ = {};
  return u && ($.updatedPath = c), $.originalPath = t.points, $;
}, "insertEdge");
function My(e, t) {
  if (e.length < 2)
    return "";
  let r = "";
  const i = e.length, s = 1e-5;
  for (let o = 0; o < i; o++) {
    const a = e[o], n = e[o - 1], l = e[o + 1];
    if (o === 0)
      r += `M${a.x},${a.y}`;
    else if (o === i - 1)
      r += `L${a.x},${a.y}`;
    else {
      const h = a.x - n.x, c = a.y - n.y, u = l.x - a.x, f = l.y - a.y, d = Math.hypot(h, c), p = Math.hypot(u, f);
      if (d < s || p < s) {
        r += `L${a.x},${a.y}`;
        continue;
      }
      const m = h / d, y = c / d, x = u / p, C = f / p, k = m * x + y * C, w = Math.max(-1, Math.min(1, k)), T = Math.acos(w);
      if (T < s || Math.abs(Math.PI - T) < s) {
        r += `L${a.x},${a.y}`;
        continue;
      }
      const _ = Math.min(t / Math.sin(T / 2), d / 2, p / 2), v = a.x - m * _, L = a.y - y * _, W = a.x + x * _, O = a.y + C * _;
      r += `L${v},${L}`, r += `Q${a.x},${a.y} ${W},${O}`;
    }
  }
  return r;
}
g(My, "generateRoundedPath");
function fl(e, t) {
  if (!e || !t)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  const r = t.x - e.x, i = t.y - e.y;
  return { angle: Math.atan2(i, r), deltaX: r, deltaY: i };
}
g(fl, "calculateDeltaAndAngle");
function $y(e, t) {
  const r = e.map((s) => ({ ...s }));
  if (e.length >= 2 && Jt[t.arrowTypeStart]) {
    const s = Jt[t.arrowTypeStart], o = e[0], a = e[1], { angle: n } = fl(o, a), l = s * Math.cos(n), h = s * Math.sin(n);
    r[0].x = o.x + l, r[0].y = o.y + h;
  }
  const i = e.length;
  if (i >= 2 && Jt[t.arrowTypeEnd]) {
    const s = Jt[t.arrowTypeEnd], o = e[i - 1], a = e[i - 2], { angle: n } = fl(a, o), l = s * Math.cos(n), h = s * Math.sin(n);
    r[i - 1].x = o.x - l, r[i - 1].y = o.y - h;
  }
  return r;
}
g($y, "applyMarkerOffsetsToPoints");
var jB = /* @__PURE__ */ g((e, t, r, i) => {
  t.forEach((s) => {
    yv[s](e, r, i);
  });
}, "insertMarkers"), VB = /* @__PURE__ */ g((e, t, r) => {
  H.trace("Making markers for ", r), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionStart").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,7 L18,13 V 1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd").attr("class", "marker extension " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 1,1 V 13 L18,7 Z"), e.append("marker").attr("id", r + "_" + t + "-extensionStart-margin").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,7 18,13 18,1").style("stroke-width", 2).style("stroke-dasharray", "0"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd-margin").attr("class", "marker extension " + t).attr("refX", 9).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,1 10,13 18,7").style("stroke-width", 2).style("stroke-dasharray", "0");
}, "extension"), ZB = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart").attr("class", "marker composition " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd").attr("class", "marker composition " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart-margin").attr("class", "marker composition " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("viewBox", "0 0 15 15").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd-margin").attr("class", "marker composition " + t).attr("refX", 3.5).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "composition"), KB = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart").attr("class", "marker aggregation " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart-margin").attr("class", "marker aggregation " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd-margin").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "aggregation"), QB = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart").attr("class", "marker dependency " + t).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd").attr("class", "marker dependency " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart-margin").attr("class", "marker dependency " + t).attr("refX", 4).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd-margin").attr("class", "marker dependency " + t).attr("refX", 16).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
}, "dependency"), JB = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart-margin").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd-margin").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
}, "lollipop"), tv = /* @__PURE__ */ g((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-pointEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 11.5).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 10.5).attr("markerHeight", 14).attr("orient", "auto").append("path").attr("d", "M 0 0 L 11.5 7 L 0 14 z").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 1).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11.5).attr("markerHeight", 14).attr("orient", "auto").append("polygon").attr("points", "0,7 11.5,14 11.5,0").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "point"), ev = /* @__PURE__ */ g((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-circleEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refY", 5).attr("refX", 12.25).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -2).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "circle"), rv = /* @__PURE__ */ g((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-crossEnd").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossStart").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossEnd-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", 17.7).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5), e.append("marker").attr("id", r + "_" + t + "-crossStart-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", -3.5).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5).style("stroke-dasharray", "1,0");
}, "cross"), iv = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
}, "barb"), sv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { transitionColor: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd-margin").attr("refX", 17).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z").attr("fill", `${o}`);
}, "barbNeo"), ov = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18"), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18");
}, "only_one"), av = /* @__PURE__ */ g((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 21).attr("cy", 9).attr("r", 6), i.append("path").attr("d", "M9,0 L9,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 9).attr("r", 6), s.append("path").attr("d", "M21,0 L21,18");
}, "zero_or_one"), nv = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18");
}, "one_or_more"), lv = /* @__PURE__ */ g((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 48).attr("cy", 18).attr("r", 6), i.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 18).attr("r", 6), s.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18");
}, "zero_or_more"), hv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18").attr("stroke-width", `${o}`);
}, "only_one_neo"), cv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: a } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  n.append("circle").attr("fill", a ?? "white").attr("cx", 21).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), n.append("path").attr("d", "M9,0 L9,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  l.append("circle").attr("fill", a ?? "white").attr("cx", 9).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), l.append("path").attr("d", "M21,0 L21,18").attr("stroke-width", `${o}`);
}, "zero_or_one_neo"), uv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18").attr("stroke-width", `${o}`);
}, "one_or_more_neo"), dv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: a } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  n.append("circle").attr("fill", a ?? "white").attr("cx", 45.5).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), n.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  l.append("circle").attr("fill", a ?? "white").attr("cx", 11).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), l.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18").attr("stroke-width", `${o}`);
}, "zero_or_more_neo"), fv = /* @__PURE__ */ g((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  );
}, "requirement_arrow"), pv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("stroke-width", `${o}`).attr("viewBox", "0 0 25 20").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  ).attr("stroke-linejoin", "miter");
}, "requirement_arrow_neo"), gv = /* @__PURE__ */ g((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("g");
  i.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), i.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), i.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
}, "requirement_contains"), mv = /* @__PURE__ */ g((e, t, r) => {
  const i = $t(), { themeVariables: s } = i, { strokeWidth: o } = s, a = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("g");
  a.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), a.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), a.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10), a.selectAll("*").attr("stroke-width", `${o}`);
}, "requirement_contains_neo"), yv = {
  extension: VB,
  composition: ZB,
  aggregation: KB,
  dependency: QB,
  lollipop: JB,
  point: tv,
  circle: ev,
  cross: rv,
  barb: iv,
  barbNeo: sv,
  only_one: ov,
  zero_or_one: av,
  one_or_more: nv,
  zero_or_more: lv,
  only_one_neo: hv,
  zero_or_one_neo: cv,
  one_or_more_neo: uv,
  zero_or_more_neo: dv,
  requirement_arrow: fv,
  requirement_contains: gv,
  requirement_arrow_neo: pv,
  requirement_contains_neo: mv
}, xv = jB, Cv = {
  common: Ds,
  getConfig: $t,
  insertCluster: pB,
  insertEdge: GB,
  insertEdgeLabel: qB,
  insertMarkers: xv,
  insertNode: Fy,
  interpolateToCurve: sh,
  labelHelper: ut,
  log: H,
  positionEdgeLabel: WB
}, Es = {}, Oy = /* @__PURE__ */ g((e) => {
  for (const t of e)
    Es[t.name] = t;
}, "registerLayoutLoaders"), bv = /* @__PURE__ */ g(() => {
  Oy([
    {
      name: "dagre",
      loader: /* @__PURE__ */ g(async () => await import("./dagre-VKFMJZFB-DPHFcx74.js"), "loader")
    },
    {
      name: "swimlane",
      loader: /* @__PURE__ */ g(async () => await import("./swimlanes-5IMT3BWC-DnrYdwmN.js"), "loader")
    },
    {
      name: "cose-bilkent",
      loader: /* @__PURE__ */ g(async () => await import("./cose-bilkent-JH36ORCC-BWkjYCFg.js"), "loader")
    }
  ]);
}, "registerDefaultLayoutLoaders");
bv();
var zM = /* @__PURE__ */ g(async (e, t, r) => {
  if (!(e.layoutAlgorithm in Es))
    throw new Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
  if (e.diagramId)
    for (const u of e.nodes) {
      const f = u.domId || u.id;
      u.domId = `${e.diagramId}-${f}`;
    }
  const i = Es[e.layoutAlgorithm], s = await i.loader(), { theme: o, themeVariables: a } = e.config, { useGradient: n, gradientStart: l, gradientStop: h } = a, c = t.attr("id");
  if (t.append("defs").append("filter").attr("id", `${c}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${o != null && o.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${c}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${o != null && o.includes("dark") ? "#FFFFFF" : "#000000"}`), n) {
    const u = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    u.append("svg:stop").attr("offset", "0%").attr("stop-color", l).attr("stop-opacity", 1), u.append("svg:stop").attr("offset", "100%").attr("stop-color", h).attr("stop-opacity", 1);
  }
  return s.render(
    e,
    t,
    Cv,
    {
      algorithm: i.algorithm
    },
    r
  );
}, "render"), HM = /* @__PURE__ */ g((e = "", { fallback: t = "dagre" } = {}) => {
  if (e in Es)
    return e;
  if (t in Es)
    return H.warn(`Layout algorithm ${e} is not registered. Using ${t} as fallback.`), t;
  throw new Error(`Both layout algorithms ${e} and ${t} are not registered.`);
}, "getRegisteredLayoutAlgorithm"), _h = "comm", Iy = "rule", Dy = "decl", kv = "@media", Sv = "@import", wv = "@supports", Tv = "@namespace", pl = "@keyframes", Ry = "@layer", _v = "@scope", Bv = Math.abs, Cs = String.fromCharCode;
function Py(e) {
  return e.trim();
}
function gl(e, t, r) {
  return e.replace(t, r);
}
function xi(e, t) {
  return e.charCodeAt(t) | 0;
}
function qi(e, t, r) {
  return e.slice(t, r);
}
function He(e) {
  return e.length;
}
function Ny(e) {
  return e.length;
}
function co(e, t) {
  return t.push(e), e;
}
var Ta = 1, Wi = 1, qy = 0, ke = 0, Rt = 0, Ui = "";
function Bh(e, t, r, i, s, o, a, n) {
  return { value: e, root: t, parent: r, type: i, props: s, children: o, line: Ta, column: Wi, length: a, return: "", siblings: n };
}
function vv() {
  return Rt;
}
function Lv() {
  return Rt = ke > 0 ? xi(Ui, --ke) : 0, Wi--, Rt === 10 && (Wi = 1, Ta--), Rt;
}
function Me() {
  return Rt = ke < qy ? xi(Ui, ke++) : 0, Wi++, Rt === 10 && (Wi = 1, Ta++), Rt;
}
function xr() {
  return xi(Ui, ke);
}
function _o() {
  return ke;
}
function _a(e, t) {
  return qi(Ui, e, t);
}
function Ms(e) {
  switch (e) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function Av(e) {
  return Ta = Wi = 1, qy = He(Ui = e), ke = 0, [];
}
function Fv(e) {
  return Ui = "", e;
}
function dn(e) {
  return Py(_a(ke - 1, ml(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Ev(e) {
  for (; (Rt = xr()) && Rt < 33; )
    Me();
  return Ms(e) > 2 || Ms(Rt) > 3 ? "" : " ";
}
function Mv(e, t) {
  for (; --t && Me() && !(Rt < 48 || Rt > 102 || Rt > 57 && Rt < 65 || Rt > 70 && Rt < 97); )
    ;
  return _a(e, _o() + (t < 6 && xr() == 32 && Me() == 32));
}
function ml(e) {
  for (; Me(); )
    switch (Rt) {
      case e:
        return ke;
      case 34:
      case 39:
        e !== 34 && e !== 39 && ml(Rt);
        break;
      case 40:
        e === 41 && ml(e);
        break;
      case 92:
        Me();
        break;
    }
  return ke;
}
function $v(e, t) {
  for (; Me() && e + Rt !== 57; )
    if (e + Rt === 84 && xr() === 47)
      break;
  return "/*" + _a(t, ke - 1) + "*" + Cs(e === 47 ? e : Me());
}
function Ov(e) {
  for (; !Ms(xr()); )
    Me();
  return _a(e, ke);
}
function Iv(e) {
  return Fv(Bo("", null, null, null, [""], e = Av(e), 0, [0], e));
}
function Bo(e, t, r, i, s, o, a, n, l) {
  for (var h = 0, c = 0, u = a, f = 0, d = 0, p = 0, m = 1, y = 1, x = 1, C = 0, k = 0, w = "", T = s, _ = o, v = i, L = w; y; )
    switch (p = k, k = Me()) {
      case 40:
        p != 108 && xi(L, u - 1) == 58 ? (C++, L += "(") : L += dn(k);
        break;
      case 41:
        C--, L += ")";
        break;
      case 34:
      case 39:
      case 91:
        L += dn(k);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        if (C > 0) {
          L += Cs(k);
          break;
        }
        L += Ev(p);
        break;
      case 92:
        L += Mv(_o() - 1, 7);
        continue;
      case 47:
        switch (xr()) {
          case 42:
          case 47:
            co(Dv($v(Me(), _o()), t, r, l), l), (Ms(p || 1) == 5 || Ms(xr() || 1) == 5) && He(L) && qi(L, -1, void 0) !== " " && (L += " ");
            break;
          default:
            L += "/";
        }
        break;
      case 123 * m:
        n[h++] = He(L) * x;
      case 125 * m:
      case 59:
      case 0:
        if (C > 0 && k) {
          L += Cs(k);
          break;
        }
        switch (k) {
          case 0:
          case 125:
            y = 0;
          case 59 + c:
            x == -1 && (L = gl(L, /\f/g, "")), d > 0 && (He(L) - u || m === 0) && co(d > 32 ? $u(L + ";", i, r, u - 1, l) : $u(gl(L, " ", "") + ";", i, r, u - 2, l), l);
            break;
          case 59:
            L += ";";
          default:
            if (co(v = Mu(L, t, r, h, c, s, n, w, T = [], _ = [], u, o), o), k === 123)
              if (c === 0)
                Bo(L, t, v, v, T, o, u, n, _);
              else {
                switch (f) {
                  case 99:
                    if (xi(L, 3) === 110) break;
                  case 108:
                    if (xi(L, 2) === 97) break;
                  default:
                    c = 0;
                  case 100:
                  case 109:
                  case 115:
                }
                c ? Bo(e, v, v, i && co(Mu(e, v, v, 0, 0, s, n, w, s, T = [], u, _), _), s, _, u, n, i ? T : _) : Bo(L, v, v, v, [""], _, 0, n, _);
              }
        }
        h = c = d = 0, m = x = 1, w = L = "", u = a;
        break;
      case 58:
        u = 1 + He(L), d = p;
      default:
        if (m < 1) {
          if (k == 123)
            --m;
          else if (k == 125 && m++ == 0 && Lv() == 125)
            continue;
        }
        switch (L += Cs(k), k * m) {
          case 38:
            x = c > 0 ? 1 : (L += "\f", -1);
            break;
          case 44:
            if (C > 0) break;
            n[h++] = (He(L) - 1) * x, x = 1;
            break;
          case 64:
            xr() === 45 && (L += dn(Me())), f = xr(), c = u = He(w = L += Ov(_o())), k++;
            break;
          case 45:
            p === 45 && He(L) == 2 && (m = 0);
        }
    }
  return o;
}
function Mu(e, t, r, i, s, o, a, n, l, h, c, u) {
  for (var f = s - 1, d = s === 0 ? o : [""], p = Ny(d), m = 0, y = 0, x = 0; m < i; ++m)
    for (var C = 0, k = qi(e, f + 1, f = Bv(y = a[m])), w = e; C < p; ++C)
      (w = Py(y > 0 ? d[C] + " " + k : gl(k, /&\f/g, d[C]))) && (l[x++] = w);
  return Bh(e, t, r, s === 0 ? Iy : n, l, h, c, u);
}
function Dv(e, t, r, i) {
  return Bh(e, t, r, _h, Cs(vv()), qi(e, 2, -2), 0, i);
}
function $u(e, t, r, i, s) {
  return Bh(e, t, r, Dy, qi(e, 0, i), qi(e, i + 1, -1), i, s);
}
function yl(e, t) {
  for (var r = "", i = 0; i < e.length; i++)
    r += t(e[i], i, e, t) || "";
  return r;
}
function Rv(e, t, r, i) {
  switch (e.type) {
    case Ry:
      if (e.children.length) break;
    case Sv:
    case Tv:
    case Dy:
      return e.return = e.return || e.value;
    case _h:
      return "";
    case pl:
      return e.return = e.value + "{" + yl(e.children, i) + "}";
    case Iy:
      if (!He(e.value = e.props.join(","))) return "";
  }
  return He(r = yl(e.children, i)) ? e.return = e.value + "{" + r + "}" : "";
}
function Pv(e) {
  var t = Ny(e);
  return function(r, i, s, o) {
    for (var a = "", n = 0; n < t; n++)
      a += e[n](r, i, s, o) || "";
    return a;
  };
}
var Wy = "c4", Nv = /* @__PURE__ */ g((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"), qv = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./c4Diagram-LMCZKHZV-DIzoiZdW.js");
  return { id: Wy, diagram: e };
}, "loader"), Wv = {
  id: Wy,
  detector: Nv,
  loader: qv
}, zv = Wv, zy = "flowchart", Hv = /* @__PURE__ */ g((e, t) => {
  var r, i;
  return ((r = t == null ? void 0 : t.flowchart) == null ? void 0 : r.defaultRenderer) === "dagre-wrapper" || ((i = t == null ? void 0 : t.flowchart) == null ? void 0 : i.defaultRenderer) === "elk" ? !1 : /^\s*graph/.test(e);
}, "detector"), Yv = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./flowDiagram-23GEKE2U-CHEWLjMx.js").then((t) => t.f);
  return { id: zy, diagram: e };
}, "loader"), Uv = {
  id: zy,
  detector: Hv,
  loader: Yv
}, Xv = Uv, Hy = "flowchart-v2", Gv = /* @__PURE__ */ g((e, t) => {
  var r, i, s;
  return ((r = t == null ? void 0 : t.flowchart) == null ? void 0 : r.defaultRenderer) === "dagre-d3" ? !1 : (((i = t == null ? void 0 : t.flowchart) == null ? void 0 : i.defaultRenderer) === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && ((s = t == null ? void 0 : t.flowchart) == null ? void 0 : s.defaultRenderer) === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e));
}, "detector"), jv = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./flowDiagram-23GEKE2U-CHEWLjMx.js").then((t) => t.f);
  return { id: Hy, diagram: e };
}, "loader"), Vv = {
  id: Hy,
  detector: Gv,
  loader: jv
}, Zv = Vv, Yy = "swimlane", Kv = /* @__PURE__ */ g((e) => /^\s*swimlane-beta\b/.test(e), "detector"), Qv = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./swimlanesDiagram-G3AALYLV-CrF-y1lO.js");
  return { id: Yy, diagram: e };
}, "loader"), Jv = {
  id: Yy,
  detector: Kv,
  loader: Qv
}, tL = Jv, Uy = "er", eL = /* @__PURE__ */ g((e) => /^\s*erDiagram/.test(e), "detector"), rL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./erDiagram-Q63AITRT-tvjbJlMa.js");
  return { id: Uy, diagram: e };
}, "loader"), iL = {
  id: Uy,
  detector: eL,
  loader: rL
}, sL = iL, Xy = "gitGraph", oL = /* @__PURE__ */ g((e) => /^\s*gitGraph/.test(e), "detector"), aL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./gitGraphDiagram-IHSO6WYX-B4z6iv22.js");
  return { id: Xy, diagram: e };
}, "loader"), nL = {
  id: Xy,
  detector: oL,
  loader: aL
}, lL = nL, Gy = "gantt", hL = /* @__PURE__ */ g((e) => /^\s*gantt/.test(e), "detector"), cL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./ganttDiagram-NO4QXBWP-DMEfiJCw.js");
  return { id: Gy, diagram: e };
}, "loader"), uL = {
  id: Gy,
  detector: hL,
  loader: cL
}, dL = uL, jy = "info", fL = /* @__PURE__ */ g((e) => /^\s*info/.test(e), "detector"), pL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./infoDiagram-FWYZ7A6U-v7rSqy9h.js");
  return { id: jy, diagram: e };
}, "loader"), gL = {
  id: jy,
  detector: fL,
  loader: pL
}, Vy = "pie", mL = /* @__PURE__ */ g((e) => /^\s*pie/.test(e), "detector"), yL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./pieDiagram-ENE6RG2P-omkyHxN4.js");
  return { id: Vy, diagram: e };
}, "loader"), xL = {
  id: Vy,
  detector: mL,
  loader: yL
}, Zy = "quadrantChart", CL = /* @__PURE__ */ g((e) => /^\s*quadrantChart/.test(e), "detector"), bL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./quadrantDiagram-ABIIQ3AL-DPa-quvh.js");
  return { id: Zy, diagram: e };
}, "loader"), kL = {
  id: Zy,
  detector: CL,
  loader: bL
}, SL = kL, Ky = "xychart", wL = /* @__PURE__ */ g((e) => /^\s*xychart(-beta)?/.test(e), "detector"), TL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./xychartDiagram-FW5EYKEG-B-JSvdvU.js");
  return { id: Ky, diagram: e };
}, "loader"), _L = {
  id: Ky,
  detector: wL,
  loader: TL
}, BL = _L, Qy = "requirement", vL = /* @__PURE__ */ g((e) => /^\s*requirement(Diagram)?/.test(e), "detector"), LL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./requirementDiagram-TGXJPOKE-B9Hy49RW.js");
  return { id: Qy, diagram: e };
}, "loader"), AL = {
  id: Qy,
  detector: vL,
  loader: LL
}, FL = AL, Jy = "sequence", EL = /* @__PURE__ */ g((e) => /^\s*sequenceDiagram/.test(e), "detector"), ML = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./sequenceDiagram-DBY2YBRQ-BjiAodC8.js");
  return { id: Jy, diagram: e };
}, "loader"), $L = {
  id: Jy,
  detector: EL,
  loader: ML
}, OL = $L, t0 = "class", IL = /* @__PURE__ */ g((e, t) => {
  var r;
  return ((r = t == null ? void 0 : t.class) == null ? void 0 : r.defaultRenderer) === "dagre-wrapper" ? !1 : /^\s*classDiagram/.test(e);
}, "detector"), DL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./classDiagram-OUVF2IWQ-CaX8X2Ac.js");
  return { id: t0, diagram: e };
}, "loader"), RL = {
  id: t0,
  detector: IL,
  loader: DL
}, PL = RL, e0 = "classDiagram", NL = /* @__PURE__ */ g((e, t) => {
  var r;
  return /^\s*classDiagram/.test(e) && ((r = t == null ? void 0 : t.class) == null ? void 0 : r.defaultRenderer) === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e);
}, "detector"), qL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./classDiagram-v2-EOCWNBFH-CaX8X2Ac.js");
  return { id: e0, diagram: e };
}, "loader"), WL = {
  id: e0,
  detector: NL,
  loader: qL
}, zL = WL, r0 = "state", HL = /* @__PURE__ */ g((e, t) => {
  var r;
  return ((r = t == null ? void 0 : t.state) == null ? void 0 : r.defaultRenderer) === "dagre-wrapper" ? !1 : /^\s*stateDiagram/.test(e);
}, "detector"), YL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./stateDiagram-2N3HPSRC-BBp2bCFm.js");
  return { id: r0, diagram: e };
}, "loader"), UL = {
  id: r0,
  detector: HL,
  loader: YL
}, XL = UL, i0 = "stateDiagram", GL = /* @__PURE__ */ g((e, t) => {
  var r;
  return !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && ((r = t == null ? void 0 : t.state) == null ? void 0 : r.defaultRenderer) === "dagre-wrapper");
}, "detector"), jL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./stateDiagram-v2-6OUMAXLB-DwGggu8V.js");
  return { id: i0, diagram: e };
}, "loader"), VL = {
  id: i0,
  detector: GL,
  loader: jL
}, ZL = VL, s0 = "journey", KL = /* @__PURE__ */ g((e) => /^\s*journey/.test(e), "detector"), QL = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./journeyDiagram-5HDEW3XC-CkA_V355.js");
  return { id: s0, diagram: e };
}, "loader"), JL = {
  id: s0,
  detector: KL,
  loader: QL
}, tA = JL, eA = /* @__PURE__ */ g((e, t, r) => {
  H.debug(`rendering svg for syntax error
`);
  const i = LS(t), s = i.append("g");
  i.attr("viewBox", "0 0 2412 512"), $d(i, 100, 512, !0), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"
  ), s.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), s.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${r}`);
}, "draw"), o0 = { draw: eA }, rA = o0, iA = {
  db: {},
  renderer: o0,
  parser: {
    parse: /* @__PURE__ */ g(() => {
    }, "parse")
  }
}, sA = iA, a0 = "flowchart-elk", oA = /* @__PURE__ */ g((e, t = {}) => {
  var r;
  return (
    // If diagram explicitly states flowchart-elk
    /^\s*flowchart-elk/.test(e) || // If a flowchart/graph diagram has their default renderer set to elk
    /^\s*(flowchart|graph)/.test(e) && ((r = t == null ? void 0 : t.flowchart) == null ? void 0 : r.defaultRenderer) === "elk" ? (t.layout = "elk", !0) : !1
  );
}, "detector"), aA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./flowDiagram-23GEKE2U-CHEWLjMx.js").then((t) => t.f);
  return { id: a0, diagram: e };
}, "loader"), nA = {
  id: a0,
  detector: oA,
  loader: aA
}, lA = nA, n0 = "timeline", hA = /* @__PURE__ */ g((e) => /^\s*timeline/.test(e), "detector"), cA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./timeline-definition-FHXFAJF6-CVM7rUqY.js");
  return { id: n0, diagram: e };
}, "loader"), uA = {
  id: n0,
  detector: hA,
  loader: cA
}, dA = uA, l0 = "mindmap", fA = /* @__PURE__ */ g((e) => /^\s*mindmap/.test(e), "detector"), pA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./mindmap-definition-LN4V7U3C-Cn5fJAWF.js");
  return { id: l0, diagram: e };
}, "loader"), gA = {
  id: l0,
  detector: fA,
  loader: pA
}, mA = gA, h0 = "kanban", yA = /* @__PURE__ */ g((e) => /^\s*kanban/.test(e), "detector"), xA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./kanban-definition-HUTT4EX6-BeW-4lz_.js");
  return { id: h0, diagram: e };
}, "loader"), CA = {
  id: h0,
  detector: yA,
  loader: xA
}, bA = CA, c0 = "sankey", kA = /* @__PURE__ */ g((e) => /^\s*sankey(-beta)?/.test(e), "detector"), SA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./sankeyDiagram-HTMAVEWB-BqOWwbg4.js");
  return { id: c0, diagram: e };
}, "loader"), wA = {
  id: c0,
  detector: kA,
  loader: SA
}, TA = wA, u0 = "packet", _A = /* @__PURE__ */ g((e) => /^\s*packet(-beta)?/.test(e), "detector"), BA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./diagram-NH7WQ7WH-B6y73plT.js");
  return { id: u0, diagram: e };
}, "loader"), vA = {
  id: u0,
  detector: _A,
  loader: BA
}, d0 = "radar", LA = /* @__PURE__ */ g((e) => /^\s*radar-beta/.test(e), "detector"), AA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./diagram-WEI45ONY-CtirADxZ.js");
  return { id: d0, diagram: e };
}, "loader"), FA = {
  id: d0,
  detector: LA,
  loader: AA
}, f0 = "block", EA = /* @__PURE__ */ g((e) => /^\s*block(-beta)?/.test(e), "detector"), MA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./blockDiagram-677ZJIJ3-DtkyDTX1.js");
  return { id: f0, diagram: e };
}, "loader"), $A = {
  id: f0,
  detector: EA,
  loader: MA
}, OA = $A, p0 = "treeView", IA = /* @__PURE__ */ g((e) => /^\s*treeView-beta/.test(e), "detector"), DA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./diagram-OA4YK3LP-ywTq3X6R.js");
  return { id: p0, diagram: e };
}, "loader"), RA = {
  id: p0,
  detector: IA,
  loader: DA
}, PA = RA, g0 = "architecture", NA = /* @__PURE__ */ g((e) => /^\s*architecture/.test(e), "detector"), qA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./architectureDiagram-ZJ3FMSHR-CR8yyETf.js");
  return { id: g0, diagram: e };
}, "loader"), WA = {
  id: g0,
  detector: NA,
  loader: qA
}, zA = WA, m0 = "eventmodeling", HA = /* @__PURE__ */ g((e) => /^\s*eventmodeling/.test(e), "detector"), YA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./diagram-FQU43EPY-wE-dQMgA.js");
  return { id: m0, diagram: e };
}, "loader"), UA = {
  id: m0,
  detector: HA,
  loader: YA
}, XA = UA, y0 = "ishikawa", GA = /* @__PURE__ */ g((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"), jA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./ishikawaDiagram-FXEZZL3T-D-iQXf7b.js");
  return { id: y0, diagram: e };
}, "loader"), VA = {
  id: y0,
  detector: GA,
  loader: jA
}, x0 = "venn", ZA = /* @__PURE__ */ g((e) => /^\s*venn-beta/.test(e), "detector"), KA = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./vennDiagram-L72KCM5P-uT83LU5y.js");
  return { id: x0, diagram: e };
}, "loader"), QA = {
  id: x0,
  detector: ZA,
  loader: KA
}, JA = QA, C0 = "treemap", tF = /* @__PURE__ */ g((e) => /^\s*treemap/.test(e), "detector"), eF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./diagram-G47NLZAW-BfmzpWr9.js");
  return { id: C0, diagram: e };
}, "loader"), rF = {
  id: C0,
  detector: tF,
  loader: eF
}, b0 = "wardley", iF = /* @__PURE__ */ g((e) => /^\s*wardley-beta/i.test(e), "detector"), sF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./wardleyDiagram-EHGQE667-BgDGu3B2.js");
  return { id: b0, diagram: e };
}, "loader"), oF = {
  id: b0,
  detector: iF,
  loader: sF
}, aF = oF, k0 = "cynefin", nF = /* @__PURE__ */ g((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"), lF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./cynefinDiagram-TSTJHNR4-moBu_FNU.js");
  return { id: k0, diagram: e };
}, "loader"), hF = {
  id: k0,
  detector: nF,
  loader: lF
}, S0 = "railroad", cF = /* @__PURE__ */ g((e) => /^\s*railroad-beta/i.test(e), "detector"), uF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./railroadDiagram-RFXS5EU6-J0EkU5Us.js");
  return { id: S0, diagram: e };
}, "loader"), dF = {
  id: S0,
  detector: cF,
  loader: uF
}, w0 = "railroadEbnf", fF = /* @__PURE__ */ g((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"), pF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./ebnfDiagram-CCIWWBDH-D5y9SVD8.js");
  return { id: w0, diagram: e };
}, "loader"), gF = {
  id: w0,
  detector: fF,
  loader: pF
}, T0 = "railroadAbnf", mF = /* @__PURE__ */ g((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"), yF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./abnfDiagram-VRR7QNED-BOXcHZ_o.js");
  return { id: T0, diagram: e };
}, "loader"), xF = {
  id: T0,
  detector: mF,
  loader: yF
}, _0 = "railroadPeg", CF = /* @__PURE__ */ g((e) => /^\s*railroad-peg-beta/i.test(e), "detector"), bF = /* @__PURE__ */ g(async () => {
  const { diagram: e } = await import("./pegDiagram-2B236MQR-CgYrNP5U.js");
  return { id: _0, diagram: e };
}, "loader"), kF = {
  id: _0,
  detector: CF,
  loader: bF
}, Ou = !1, Ba = /* @__PURE__ */ g(() => {
  Ou || (Ou = !0, Mo("error", sA, (e) => e.toLowerCase().trim() === "error"), Mo(
    "---",
    // --- diagram type may appear if YAML front-matter is not parsed correctly
    {
      db: {
        clear: /* @__PURE__ */ g(() => {
        }, "clear")
      },
      styles: {},
      // should never be used
      renderer: {
        draw: /* @__PURE__ */ g(() => {
        }, "draw")
      },
      parser: {
        parse: /* @__PURE__ */ g(() => {
          throw new Error(
            "Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks"
          );
        }, "parse")
      },
      init: /* @__PURE__ */ g(() => null, "init")
      // no op
    },
    (e) => e.toLowerCase().trimStart().startsWith("---")
  ), wn(lA, mA, zA), wn(
    zv,
    bA,
    zL,
    PL,
    sL,
    dL,
    gL,
    xL,
    FL,
    OL,
    tL,
    Zv,
    Xv,
    dA,
    lL,
    ZL,
    XL,
    tA,
    SL,
    TA,
    vA,
    BL,
    OA,
    XA,
    PA,
    FA,
    VA,
    rF,
    dF,
    gF,
    xF,
    kF,
    JA,
    aF,
    hF
  ));
}, "addDiagrams"), SF = /* @__PURE__ */ g(async () => {
  H.debug("Loading registered diagrams");
  const t = (await Promise.allSettled(
    Object.entries(Yr).map(async ([r, { detector: i, loader: s }]) => {
      if (s)
        try {
          vn(r);
        } catch {
          try {
            const { diagram: o, id: a } = await s();
            Mo(a, o, i);
          } catch (o) {
            throw H.error(`Failed to load external diagram with key ${r}. Removing from detectors.`), delete Yr[r], o;
          }
        }
    })
  )).filter((r) => r.status === "rejected");
  if (t.length > 0) {
    H.error(`Failed to load ${t.length} external diagrams`);
    for (const r of t)
      H.error(r);
    throw new Error(`Failed to load ${t.length} external diagrams`);
  }
}, "loadRegisteredDiagrams"), wF = "graphics-document document";
function B0(e, t) {
  e.attr("role", wF), t !== "" && e.attr("aria-roledescription", t);
}
g(B0, "setA11yDiagramInfo");
function v0(e, t, r, i) {
  if (e.insert !== void 0) {
    if (r) {
      const s = `chart-desc-${i}`;
      e.attr("aria-describedby", s), e.insert("desc", ":first-child").attr("id", s).text(r);
    }
    if (t) {
      const s = `chart-title-${i}`;
      e.attr("aria-labelledby", s), e.insert("title", ":first-child").attr("id", s).text(t);
    }
  }
}
g(v0, "addSVGa11yTitleDescription");
var zr, xl = (zr = class {
  constructor(t, r, i, s, o) {
    this.type = t, this.text = r, this.db = i, this.parser = s, this.renderer = o;
  }
  static async fromText(t, r = {}) {
    var h, c;
    const i = $t(), s = Ll(t, i);
    t = DT(t) + `
`;
    try {
      vn(s);
    } catch {
      const u = Sb(s);
      if (!u)
        throw new vd(`Diagram ${s} not found.`);
      const { id: f, diagram: d } = await u();
      Mo(f, d);
    }
    const { db: o, parser: a, renderer: n, init: l } = vn(s);
    return a.parser && (a.parser.yy = o), (h = o.clear) == null || h.call(o), l == null || l(i), r.title && ((c = o.setDiagramTitle) == null || c.call(o, r.title)), await a.parse(t), new zr(s, t, o, a, n);
  }
  async render(t, r) {
    await this.renderer.draw(this.text, t, r, this);
  }
  getParser() {
    return this.parser;
  }
  getType() {
    return this.type;
  }
}, g(zr, "Diagram"), zr), Iu = [], TF = /* @__PURE__ */ g(() => {
  Iu.forEach((e) => {
    e();
  }), Iu = [];
}, "attachFunctions"), _F = /* @__PURE__ */ g((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function L0(e) {
  const t = e.match(Bd);
  if (!t)
    return {
      text: e,
      metadata: {}
    };
  const r = t[1], i = r ? t[2].split(`
`).map((a) => a.startsWith(r) ? a.slice(r.length) : a).join(`
`) : t[2];
  let s = Iw(i, {
    // To support config, we need JSON schema.
    // https://www.yaml.org/spec/1.2/spec.html#id2803231
    schema: Ow
  }) ?? {};
  s = typeof s == "object" && !Array.isArray(s) ? s : {};
  const o = {};
  return s.displayMode && (o.displayMode = s.displayMode.toString()), s.title && (o.title = s.title.toString()), s.config && (o.config = s.config), {
    text: e.slice(t[0].length),
    metadata: o
  };
}
g(L0, "extractFrontMatter");
var BF = /* @__PURE__ */ g((e) => e.replace(/\r\n?/g, `
`).replace(
  /<(\w+)([^>]*)>/g,
  (t, r, i) => "<" + r + i.replace(/="([^"]*)"/g, "='$1'") + ">"
), "cleanupText"), vF = /* @__PURE__ */ g((e) => {
  const { text: t, metadata: r } = L0(e), { displayMode: i, title: s, config: o = {} } = r;
  return i && (o.gantt || (o.gantt = {}), o.gantt.displayMode = i), { title: s, config: o, text: t };
}, "processFrontmatter"), LF = /* @__PURE__ */ g((e) => {
  const t = Fe.detectInit(e) ?? {}, r = Fe.detectDirective(e, "wrap");
  return Array.isArray(r) ? t.wrap = r.some(({ type: i }) => i === "wrap") : (r == null ? void 0 : r.type) === "wrap" && (t.wrap = !0), {
    text: wT(e),
    directive: t
  };
}, "processDirectives");
function vh(e) {
  const t = BF(e), r = vF(t), i = LF(r.text), s = hh(r.config, i.directive);
  return e = _F(i.text), {
    code: e,
    title: r.title,
    config: s
  };
}
g(vh, "preprocessDiagram");
function A0(e) {
  const t = new TextEncoder().encode(e), r = Array.from(t, (i) => String.fromCodePoint(i)).join("");
  return btoa(r);
}
g(A0, "toBase64");
var AF = 5e4, FF = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", EF = "sandbox", MF = "loose", $F = "http://www.w3.org/2000/svg", OF = "http://www.w3.org/1999/xlink", IF = "http://www.w3.org/1999/xhtml", DF = "100%", RF = "100%", PF = "border:0;margin:0;", NF = "margin:0", qF = "allow-top-navigation-by-user-activation allow-popups", WF = 'The "iframe" tag is not supported by your browser.', zF = ["foreignobject"], HF = ["dominant-baseline"];
function Lh(e) {
  const t = vh(e);
  return Fo(), Cb(t.config ?? {}), t;
}
g(Lh, "processAndSetConfigs");
async function F0(e, t) {
  Ba();
  try {
    const { code: r, config: i } = Lh(e);
    return { diagramType: (await M0(r)).type, config: i };
  } catch (r) {
    if (t != null && t.suppressErrors)
      return !1;
    throw r;
  }
}
g(F0, "parse");
var Du = /* @__PURE__ */ g((e, t, r = []) => {
  const i = bd(`{ ${r.join(" !important; ")} !important; }`);
  return `.${e} ${t} ${i}`;
}, "cssImportantStyles"), YF = /* @__PURE__ */ g((e, t = /* @__PURE__ */ new Map()) => {
  const r = new CSSStyleSheet();
  if (e.fontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-font-family: ${e.fontFamily}}`,
    r.cssRules.length
  ), e.altFontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-alt-font-family: ${e.altFontFamily}}`,
    r.cssRules.length
  ), t instanceof Map) {
    const n = ne(e) ? ["> *", "span"] : ["rect", "polygon", "ellipse", "circle", "path"];
    t.forEach((l) => {
      Vc(l.styles) || n.forEach((h) => {
        r.insertRule(
          Du(l.id, h, l.styles),
          r.cssRules.length
        );
      }), Vc(l.textStyles) || r.insertRule(
        Du(
          l.id,
          "tspan",
          ((l == null ? void 0 : l.textStyles) || []).map((h) => h.replace("color", "fill"))
        ),
        r.cssRules.length
      );
    });
  }
  let i = "";
  if (e.themeCSS !== void 0)
    if (typeof r.replaceSync == "function") {
      const s = new CSSStyleSheet();
      s.replaceSync(e.themeCSS), i = Bn(s) + `
`;
    } else
      i += `${e.themeCSS}
`;
  return i + Bn(r);
}, "createCssStyles"), UF = /* @__PURE__ */ g((e, t) => yl(
  Iv(`${e}{${t}}`),
  Pv([
    /* @__PURE__ */ g(function(i, s, o, a) {
      if (i.type === "rule" && Array.isArray(i.props)) {
        if (i.parent && i.parent.type === pl)
          return;
        i.props = i.props.map((n) => n.startsWith(e) ? n : `${e} ${n}`);
      } else i.type.startsWith("@") && ([
        ...[
          kv,
          wv,
          Ry,
          _v,
          "@container",
          "@starting-style"
        ],
        pl
        // needed for Mermaid's animation feature
      ].includes(i.type) || (H.warn(`Removing unsupported at-rule ${i.type} from CSS`), i.type = _h));
    }, "addNamespace"),
    Rv
  ])
), "compileCSS"), XF = /* @__PURE__ */ g((e, t, r, i) => {
  const s = YF(e, r), o = qb(
    t,
    s,
    { ...e.themeVariables, theme: e.theme, look: e.look },
    i
  );
  return UF(i, o);
}, "createUserStyles"), GF = /* @__PURE__ */ g((e = "", t, r) => {
  let i = e;
  return !r && !t && (i = i.replace(
    /marker-end="url\([\d+./:=?A-Za-z-]*?#/g,
    'marker-end="url(#'
  )), i = Gr(i), i = i.replace(/<br>/g, "<br/>"), i;
}, "cleanUpSvgCode"), jF = /* @__PURE__ */ g((e = "", t) => {
  var s, o;
  const r = (o = (s = t == null ? void 0 : t.viewBox) == null ? void 0 : s.baseVal) != null && o.height ? t.viewBox.baseVal.height + "px" : RF, i = A0(`<body style="${NF}">${e}</body>`);
  return `<iframe style="width:${DF};height:${r};${PF}" src="data:text/html;charset=UTF-8;base64,${i}" sandbox="${qF}">
  ${WF}
</iframe>`;
}, "putIntoIFrame"), Ru = /* @__PURE__ */ g((e, t, r, i, s) => {
  const o = e.append("div");
  o.attr("id", r), i && o.attr("style", i);
  const a = o.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", $F);
  return s && a.attr("xmlns:xlink", s), a.append("g"), e;
}, "appendDivSvgG");
function Cl(e, t) {
  return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
g(Cl, "sandboxedIframe");
var VF = /* @__PURE__ */ g((e, t, r, i) => {
  var s, o, a;
  (s = e.getElementById(t)) == null || s.remove(), (o = e.getElementById(r)) == null || o.remove(), (a = e.getElementById(i)) == null || a.remove();
}, "removeExistingElements"), ZF = /* @__PURE__ */ g(async function(e, t, r) {
  var U, z, D, E, A, $;
  Ba();
  const i = Lh(t);
  t = i.code;
  const s = $t();
  H.debug(s), t.length > ((s == null ? void 0 : s.maxTextSize) ?? AF) && (t = FF);
  const o = `#${e}`, a = "i" + e, n = "#" + a, l = "d" + e, h = "#" + l, c = /* @__PURE__ */ g(() => {
    const I = bt(f ? n : h).node();
    I && "remove" in I && I.remove();
  }, "removeTempElements");
  let u = bt(document.body);
  const f = s.securityLevel === EF, d = s.securityLevel === MF, p = s.fontFamily;
  if (r !== void 0) {
    if (r && (r.innerHTML = ""), f) {
      const B = Cl(bt(r), a);
      u = bt(B.nodes()[0].contentDocument.body), u.node().style.margin = "0";
    } else
      u = bt(r);
    Ru(u, e, l, `font-family: ${p}`, OF);
  } else {
    if (VF(document, e, l, a), f) {
      const B = Cl(bt(document.body), a);
      u = bt(B.nodes()[0].contentDocument.body), u.node().style.margin = "0";
    } else
      u = bt("body");
    Ru(u, e, l);
  }
  let m, y;
  try {
    m = await xl.fromText(t, { title: i.title });
  } catch (B) {
    if (s.suppressErrorRendering)
      throw c(), B;
    m = await xl.fromText("error"), y = B;
  }
  const x = u.select(h).node(), C = m.type, k = x.firstChild, w = k.firstChild, T = (z = (U = m.renderer).getClasses) == null ? void 0 : z.call(U, t, m), _ = XF(s, C, T, o), v = document.createElement("style");
  v.innerHTML = _, k.insertBefore(v, w);
  try {
    await m.renderer.draw(t, e, "11.16.0", m);
  } catch (B) {
    throw s.suppressErrorRendering ? c() : rA.draw(t, e, "11.16.0"), B;
  }
  const L = u.select(`${h} svg`), W = (E = (D = m.db).getAccTitle) == null ? void 0 : E.call(D), O = ($ = (A = m.db).getAccDescription) == null ? void 0 : $.call(A);
  $0(C, L, W, O), u.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", IF);
  let M = u.select(h).node().innerHTML;
  if (H.debug("config.arrowMarkerAbsolute", s.arrowMarkerAbsolute), M = GF(M, f, Ve(s.arrowMarkerAbsolute)), f) {
    const B = u.select(h + " svg").node();
    M = jF(M, B);
  } else d || (M = Oi.sanitize(M, {
    ADD_TAGS: zF,
    ADD_ATTR: HF,
    HTML_INTEGRATION_POINTS: { foreignobject: !0 }
  }));
  if (TF(), y)
    throw y;
  return c(), {
    diagramType: C,
    svg: M,
    bindFunctions: m.db.bindFunctions
  };
}, "render");
function E0(e = {}) {
  var i;
  const t = Nt({}, e);
  t != null && t.fontFamily && !((i = t.themeVariables) != null && i.fontFamily) && (t.themeVariables || (t.themeVariables = {}), t.themeVariables.fontFamily = t.fontFamily), yb(t), t != null && t.theme && t.theme in rr ? t.themeVariables = rr[t.theme].getThemeVariables(
    t.themeVariables
  ) : t && (t.themeVariables = rr.default.getThemeVariables(t.themeVariables));
  const r = typeof t == "object" ? mb(t) : kd();
  vl(r.logLevel), Ba();
}
g(E0, "initialize");
var M0 = /* @__PURE__ */ g((e, t = {}) => {
  const { code: r } = vh(e);
  return xl.fromText(r, t);
}, "getDiagramFromText");
function $0(e, t, r, i) {
  B0(t, e), v0(t, r, i, t.attr("id"));
}
g($0, "addA11yInfo");
var Vr = Object.freeze({
  render: ZF,
  parse: F0,
  getDiagramFromText: M0,
  initialize: E0,
  getConfig: $t,
  setConfig: Sd,
  getSiteConfig: kd,
  updateSiteConfig: xb,
  reset: /* @__PURE__ */ g(() => {
    Fo();
  }, "reset"),
  globalReset: /* @__PURE__ */ g(() => {
    Fo(Ii);
  }, "globalReset"),
  defaultConfig: Ii
});
vl($t().logLevel);
Fo($t());
var KF = /* @__PURE__ */ g((e, t, r) => {
  H.warn(e), lh(e) ? (r && r(e.str, e.hash), t.push({ ...e, message: e.str, error: e })) : (r && r(e), e instanceof Error && t.push({
    str: e.message,
    message: e.message,
    hash: e.name,
    error: e
  }));
}, "handleError"), O0 = /* @__PURE__ */ g(async function(e = {
  querySelector: ".mermaid"
}) {
  try {
    await QF(e);
  } catch (t) {
    if (lh(t) && H.error(t.str), me.parseError && me.parseError(t), !e.suppressErrors)
      throw H.error("Use the suppressErrors option to suppress these errors"), t;
  }
}, "run"), QF = /* @__PURE__ */ g(async function({ postRenderCallback: e, querySelector: t, nodes: r } = {
  querySelector: ".mermaid"
}) {
  const i = Vr.getConfig();
  H.debug(`${e ? "" : "No "}Callback function found`);
  let s;
  if (r)
    s = r;
  else if (t)
    s = document.querySelectorAll(t);
  else
    throw new Error("Nodes and querySelector are both undefined");
  H.debug(`Found ${s.length} diagrams`), (i == null ? void 0 : i.startOnLoad) !== void 0 && (H.debug("Start On Load: " + (i == null ? void 0 : i.startOnLoad)), Vr.updateSiteConfig({ startOnLoad: i == null ? void 0 : i.startOnLoad }));
  const o = new Fe.InitIDGenerator(i.deterministicIds, i.deterministicIDSeed);
  let a;
  const n = [];
  for (const l of Array.from(s)) {
    if (H.info("Rendering diagram: " + l.id), l.getAttribute("data-processed"))
      continue;
    l.setAttribute("data-processed", "true");
    const h = `mermaid-${o.next()}`;
    a = l.innerHTML, a = Yg(Fe.entityDecode(a)).trim().replace(/<br\s*\/?>/gi, "<br/>");
    const c = Fe.detectInit(a);
    c && H.debug("Detected early reinit: ", c);
    try {
      const { svg: u, bindFunctions: f } = await P0(h, a, l);
      l.innerHTML = u, e && await e(h), f && f(l);
    } catch (u) {
      KF(u, n, me.parseError);
    }
  }
  if (n.length > 0)
    throw n[0];
}, "runThrowsErrors"), I0 = /* @__PURE__ */ g(function(e) {
  Vr.initialize(e);
}, "initialize"), JF = /* @__PURE__ */ g(async function(e, t, r) {
  H.warn("mermaid.init is deprecated. Please use run instead."), e && I0(e);
  const i = { postRenderCallback: r, querySelector: ".mermaid" };
  typeof t == "string" ? i.querySelector = t : t && (t instanceof HTMLElement ? i.nodes = [t] : i.nodes = t), await O0(i);
}, "init"), tE = /* @__PURE__ */ g(async (e, {
  lazyLoad: t = !0
} = {}) => {
  Ba(), wn(...e), t === !1 && await SF();
}, "registerExternalDiagrams"), D0 = /* @__PURE__ */ g(function() {
  if (me.startOnLoad) {
    const { startOnLoad: e } = Vr.getConfig();
    e && me.run().catch((t) => H.error("Mermaid failed to initialize", t));
  }
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", D0, !1);
var eE = /* @__PURE__ */ g(function(e) {
  me.parseError = e;
}, "setParseErrorHandler"), sa = [], fn = !1, R0 = /* @__PURE__ */ g(async () => {
  if (!fn) {
    for (fn = !0; sa.length > 0; ) {
      const e = sa.shift();
      if (e)
        try {
          await e();
        } catch (t) {
          H.error("Error executing queue", t);
        }
    }
    fn = !1;
  }
}, "executeQueue"), rE = /* @__PURE__ */ g(async (e, t) => new Promise((r, i) => {
  const s = /* @__PURE__ */ g(() => new Promise((o, a) => {
    Vr.parse(e, t).then(
      (n) => {
        o(n), r(n);
      },
      (n) => {
        var l;
        H.error("Error parsing", n), (l = me.parseError) == null || l.call(me, n), a(n), i(n);
      }
    );
  }), "performCall");
  sa.push(s), R0().catch(i);
}), "parse"), P0 = /* @__PURE__ */ g((e, t, r) => new Promise((i, s) => {
  const o = /* @__PURE__ */ g(() => new Promise((a, n) => {
    Vr.render(e, t, r).then(
      (l) => {
        a(l), i(l);
      },
      (l) => {
        var h;
        H.error("Error parsing", l), (h = me.parseError) == null || h.call(me, l), n(l), s(l);
      }
    );
  }), "performCall");
  sa.push(o), R0().catch(s);
}), "render"), iE = /* @__PURE__ */ g(() => Object.keys(Yr).map((e) => ({
  id: e
})), "getRegisteredDiagramsMetadata"), me = {
  startOnLoad: !0,
  mermaidAPI: Vr,
  parse: rE,
  render: P0,
  init: JF,
  run: O0,
  registerExternalDiagrams: tE,
  registerLayoutLoaders: Oy,
  initialize: I0,
  parseError: void 0,
  contentLoaded: D0,
  setParseErrorHandler: eE,
  detectType: Ll,
  registerIconPacks: i_,
  getRegisteredDiagramsMetadata: iE
}, pn = me;
/*! Check if previously processed */
/*!
 * Wait for document loaded before starting the execution
 */
const kt = (e) => e.replace(/\s*!important\s*$/i, "").trim(), sE = (e, t) => {
  let r = t;
  for (; r < e.length && /\s/.test(e[r]); )
    r += 1;
  const i = r;
  for (; r < e.length && /[a-z-]/i.test(e[r]); )
    r += 1;
  if (r === i)
    return !1;
  for (; r < e.length && /\s/.test(e[r]); )
    r += 1;
  return e[r] === ":";
}, Se = (e) => {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    for (; r < e.length && /[\s;,]/.test(e[r]); )
      r += 1;
    if (r >= e.length)
      break;
    const i = r;
    for (; r < e.length && e[r] !== ":" && !(e[r] === ";" || e[r] === ","); )
      r += 1;
    if (r >= e.length || e[r] !== ":")
      break;
    const s = e.substring(i, r).trim().toLowerCase();
    r += 1;
    const o = r;
    let a = 0, n = null;
    for (; r < e.length; ) {
      const h = e[r];
      if (n) {
        h === n && e[r - 1] !== "\\" && (n = null), r += 1;
        continue;
      }
      if (h === '"' || h === "'") {
        n = h, r += 1;
        continue;
      }
      if (h === "(") {
        a += 1, r += 1;
        continue;
      }
      if (h === ")") {
        a = Math.max(0, a - 1), r += 1;
        continue;
      }
      if (a === 0 && (h === ";" || h === "," || /\s/.test(h) && sE(e, r)))
        break;
      r += 1;
    }
    const l = kt(e.substring(o, r));
    s && l && t.push({ property: s, value: l }), r < e.length && (e[r] === ";" || e[r] === ",") && (r += 1);
  }
  return t;
}, we = (e) => {
  const t = kt(e);
  if (!t)
    return !1;
  if (typeof CSS < "u" && typeof CSS.supports == "function")
    return CSS.supports("color", t);
  if (typeof document < "u") {
    const r = document.createElement("div");
    return r.style.color = "", r.style.color = t, r.style.color !== "";
  }
  return !1;
}, Pu = (e, t) => {
  var i;
  const r = e.getAttribute("style");
  return r && ((i = Se(r).find((s) => s.property === t)) == null ? void 0 : i.value) || "";
}, gn = (...e) => {
  for (const t of e) {
    const r = kt(t || "");
    if (we(r))
      return r;
  }
}, Ah = (e, t) => {
  var a, n, l, h;
  const r = e.querySelector("text, foreignObject, div, span, p") || e, i = gn((a = r.getAttribute) == null ? void 0 : a.call(r, "fill"), Pu(r, "fill"), (n = r.style) == null ? void 0 : n.fill);
  if (i)
    return i;
  const s = gn((l = r.getAttribute) == null ? void 0 : l.call(r, "color"), Pu(r, "color"), (h = r.style) == null ? void 0 : h.color);
  if (s)
    return s;
  const o = gn(t);
  if (o)
    return o;
}, Fh = (e, t, r) => {
  switch (t) {
    case Bt.FILL:
    case Bt.STROKE:
      we(r) && (e[t] = r);
      break;
    case Bt.STROKE_WIDTH:
    case Bt.STROKE_DASHARRAY:
      e[t] = r;
      break;
  }
}, oa = (e, t, r) => {
  t === se.COLOR && we(r) && (e[se.COLOR] = r);
}, aa = (e, t, r) => {
  e && Se(e).forEach(({ property: i, value: s }) => {
    Fh(t, i, s), oa(r, i, s);
  });
}, N0 = (e, t) => {
  e && Se(e).forEach(({ property: r, value: i }) => {
    if (r === "fill" && we(i)) {
      t[se.COLOR] = i;
      return;
    }
    oa(t, r, i);
  });
}, q0 = (e, t) => {
  if (!e)
    return;
  [
    [Bt.FILL, e.getAttribute("fill")],
    [Bt.STROKE, e.getAttribute("stroke")],
    [
      Bt.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      Bt.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([i, s]) => {
    const o = kt(s || "");
    o && Fh(t, i, o);
  });
}, W0 = (e, t) => {
  if (!e)
    return;
  const r = e.getAttribute("fill") || e.getAttribute("color"), i = kt(r || "");
  we(i) && (t[se.COLOR] = i);
}, bl = (e, t, r, i) => {
  var o, a;
  if (!(t instanceof Map))
    return;
  const s = t.get(e);
  s && ((o = s.styles) == null || o.forEach((n) => {
    Se(n).forEach(({ property: l, value: h }) => {
      Fh(r, l, h), oa(i, l, h);
    });
  }), (a = s.textStyles) == null || a.forEach((n) => {
    Se(n).forEach(({ property: l, value: h }) => {
      oa(i, l, h);
    });
  }));
}, oE = (e, t, r) => {
  var f;
  const i = e.nodes.map((d) => d.startsWith("flowchart-") ? d.split("-")[1] : d), s = t.querySelector(`[id='${e.id}']`);
  if (!s)
    throw new Error("SubGraph element not found");
  const o = Eh(s, t), a = s.getBBox(), n = {
    width: a.width,
    height: a.height
  }, l = {}, h = {}, c = s.querySelector(":scope > rect, :scope > path, :scope > polygon, :scope > ellipse") || s.querySelector(".cluster > rect, .cluster > path, .cluster > polygon, .cluster > ellipse") || s.querySelector("rect, path, polygon, ellipse");
  aa(s.getAttribute("style"), l, h), aa(c == null ? void 0 : c.getAttribute("style"), l, h), q0(c, l);
  const u = s.querySelector(".cluster-label text, .cluster-label tspan") || s.querySelector("text");
  return N0(u == null ? void 0 : u.getAttribute("style"), h), W0(u, h), bl(e.id, r, l, h), (f = e.classes) == null || f.forEach((d) => {
    bl(d, r, l, h);
  }), {
    id: e.id,
    nodeIds: i,
    text: fe(e.title),
    labelType: "text",
    ...o,
    ...n,
    containerStyle: l,
    labelStyle: h
  };
}, Nu = (e, t, r) => {
  var f, d;
  const i = t.querySelector(`[id*="${e.domId}"]`);
  if (!i)
    return;
  let s;
  ((f = i.parentElement) == null ? void 0 : f.tagName.toLowerCase()) === "a" && (s = i.parentElement.getAttribute("xlink:href"));
  const o = Eh(s ? i.parentElement : i, t), a = i.getBBox(), n = {
    width: a.width,
    height: a.height
  }, l = {}, h = {};
  e.classes && r instanceof Map && (Array.isArray(e.classes) ? e.classes : [e.classes]).forEach((p) => {
    bl(p, r, l, h);
  }), (d = e.styles) == null || d.forEach((p) => {
    aa(p, l, h);
  });
  const c = i.querySelector(".label-container");
  return aa(c == null ? void 0 : c.getAttribute("style"), l, h), q0(c, l), Array.from(i.querySelectorAll(".label, .nodeLabel, .label text, .label tspan, .label span, .label div")).forEach((p) => {
    N0(p.getAttribute("style"), h), W0(p, h);
  }), {
    id: e.id,
    labelType: e.labelType,
    text: fe(e.text || ""),
    type: e.type,
    link: s || void 0,
    ...o,
    ...n,
    containerStyle: l,
    labelStyle: h
  };
}, aE = (e, t, r) => {
  const i = r.querySelector(`[id*="${e.id}"]`);
  if (!i)
    throw new Error("Edge element not found");
  const s = Eh(i, r), o = hd(i, s);
  return e.length = void 0, {
    ...e,
    ...o,
    text: fe(e.text)
  };
}, Eh = (e, t) => {
  var l;
  if (!e)
    throw new Error("Element not found");
  let r = (l = e.parentElement) == null ? void 0 : l.parentElement;
  const i = e.childNodes[0];
  let s = { x: 0, y: 0 };
  if (i) {
    const { transformX: h, transformY: c } = qr(i), u = i.getBBox();
    s = {
      x: Number(i.getAttribute("x")) || h + u.x || 0,
      y: Number(i.getAttribute("y")) || c + u.y || 0
    };
  }
  const { transformX: o, transformY: a } = qr(e), n = {
    x: o + s.x,
    y: a + s.y
  };
  for (; r && r.id !== t.id; ) {
    if (r.classList.value === "root" && r.hasAttribute("transform")) {
      const { transformX: h, transformY: c } = qr(r);
      n.x += h, n.y += c;
    }
    r = r.parentElement;
  }
  return n;
}, nE = (e, t) => {
  const r = e.getVertices(), i = e.getEdges(), s = e.getSubGraphs(), o = e.getClasses(), a = {}, n = o instanceof Map ? o : {};
  r instanceof Map ? r.forEach((u, f) => {
    a[f] = Nu(u, t, n);
  }) : typeof r == "object" && r !== null && Object.entries(r).forEach(([u, f]) => {
    a[u] = Nu(f, t, n);
  });
  const l = /* @__PURE__ */ new Map(), h = (Array.isArray(i) ? i : []).map((u) => {
    if (!t.querySelector(`[id*="${u.id}"]`))
      return null;
    const f = `${u.start}-${u.end}`, d = l.get(f) || 0;
    return l.set(f, d + 1), aE(u, d, t);
  }).filter((u) => u !== null && u.reflectionPoints.length > 1);
  return {
    type: "flowchart",
    subGraphs: (Array.isArray(s) ? s : []).map((u) => oE(u, t, n)),
    vertices: a,
    edges: h
  };
}, lE = (e, t) => {
  const r = {};
  t != null && t.label && (r.label = { text: fe(t.label), fontSize: 16 });
  const i = e.tagName;
  if (i === "line")
    r.startX = Number(e.getAttribute("x1")), r.startY = Number(e.getAttribute("y1")), r.endX = Number(e.getAttribute("x2")), r.endY = Number(e.getAttribute("y2"));
  else if (i === "path") {
    const a = e.getAttribute("d");
    if (!a)
      throw new Error('Path element does not contain a "d" attribute');
    const n = a.split(/(?=[LC])/), l = n[0].substring(1).split(",").map((u) => parseFloat(u)), h = [];
    n.forEach((u) => {
      const f = u.substring(1).trim().split(" ").map((d) => {
        const [p, m] = d.split(",");
        return [
          parseFloat(p) - l[0],
          parseFloat(m) - l[1]
        ];
      });
      h.push(...f);
    });
    const c = h[h.length - 1];
    r.startX = l[0], r.startY = l[1], r.endX = c[0], r.endY = c[1], r.points = h;
  }
  t != null && t.label && (r.startY = r.startY - 10, r.endY = r.endY - 10);
  const s = e.getAttribute("stroke"), o = (s && s !== "none" ? s : "") || getComputedStyle(e).stroke || "";
  return r.strokeColor = o ? kt(o) : null, r.strokeWidth = Number(e.getAttribute("stroke-width")), r.type = "arrow", r.strokeStyle = (t == null ? void 0 : t.strokeStyle) || "solid", r.startArrowhead = (t == null ? void 0 : t.startArrowhead) || null, r.endArrowhead = (t == null ? void 0 : t.endArrowhead) || null, r;
}, Mh = (e, t, r, i, s) => {
  const o = {};
  return o.type = "arrow", o.startX = e, o.startY = t, o.endX = r, o.endY = i, Object.assign(o, { ...s }), o;
}, na = (e, t, r, i) => ({
  type: "text",
  x: e,
  y: t,
  text: r,
  width: (i == null ? void 0 : i.width) || 20,
  height: (i == null ? void 0 : i.height) || 20,
  fontSize: (i == null ? void 0 : i.fontSize) || Os,
  id: i == null ? void 0 : i.id,
  color: i == null ? void 0 : i.color,
  groupId: i == null ? void 0 : i.groupId,
  metadata: i == null ? void 0 : i.metadata
}), z0 = (e, t, r) => {
  const i = {}, s = Number(e.getAttribute("x")), o = Number(e.getAttribute("y"));
  i.type = "text", i.text = fe(t), r != null && r.id && (i.id = r.id), r != null && r.groupId && (i.groupId = r.groupId);
  const a = e.getBBox();
  i.width = a.width, i.height = a.height, i.x = s - a.width / 2, i.y = o;
  const n = parseInt(getComputedStyle(e).fontSize);
  return i.fontSize = n, i.color = Ah(e), i;
}, ar = (e, t, r = {}) => {
  const i = {};
  i.type = t;
  const { label: s, subtype: o, id: a, groupId: n } = r;
  i.id = a, n && (i.groupId = n), s && (i.label = {
    text: fe(s.text),
    fontSize: 16,
    textAlign: s == null ? void 0 : s.textAlign,
    verticalAlign: s == null ? void 0 : s.verticalAlign
  });
  const l = e.getBBox();
  switch (i.x = l.x, i.y = l.y, i.width = l.width, i.height = l.height, i.subtype = o, o) {
    case "highlight":
      const h = e.getAttribute("fill");
      h && (i.bgColor = kt(h));
      break;
    case "note":
      i.strokeStyle = "dashed";
      break;
  }
  return i;
}, $s = (e, t, r, i, s, o) => {
  const a = {};
  a.startX = t, a.startY = r, a.endX = i, o != null && o.groupId && (a.groupId = o.groupId), o != null && o.id && (a.id = o.id), a.endY = s;
  const n = e.getAttribute("stroke");
  return a.strokeColor = n ? kt(n) : null, a.strokeWidth = Number(e.getAttribute("stroke-width")), a.type = "line", a;
}, qu = {
  0: "SOLID",
  1: "DOTTED",
  3: "SOLID_CROSS",
  4: "DOTTED_CROSS",
  5: "SOLID_OPEN",
  6: "DOTTED_OPEN",
  24: "SOLID_POINT",
  25: "DOTTED_POINT"
}, ze = {
  SOLID: 0,
  DOTTED: 1,
  NOTE: 2,
  SOLID_CROSS: 3,
  DOTTED_CROSS: 4,
  SOLID_OPEN: 5,
  DOTTED_OPEN: 6,
  SOLID_POINT: 24,
  DOTTED_POINT: 25,
  CRITICAL_START: 27
}, hE = (e) => {
  let t;
  switch (e) {
    case ze.SOLID:
    case ze.SOLID_CROSS:
    case ze.SOLID_OPEN:
    case ze.SOLID_POINT:
      t = "solid";
      break;
    case ze.DOTTED:
    case ze.DOTTED_CROSS:
    case ze.DOTTED_OPEN:
    case ze.DOTTED_POINT:
      t = "dotted";
      break;
    default:
      t = "solid";
      break;
  }
  return t;
}, cE = (e, t) => {
  var i, s;
  if (!!((i = e.nextElementSibling) != null && i.classList.contains("sequenceNumber"))) {
    const o = (s = e.nextElementSibling) == null ? void 0 : s.textContent;
    if (!o)
      throw new Error("sequence number not present");
    const a = 30, n = a / 2, h = {
      type: "rectangle",
      x: t.startX - 10,
      y: t.startY - n,
      label: { text: o, fontSize: 14 },
      bgColor: "#e9ecef",
      height: a,
      subtype: "sequence"
    };
    Object.assign(t, { sequenceNumber: h });
  }
}, Wu = (e, t, r) => {
  if (!e)
    throw "root node not found";
  const i = be(), s = Array.from(e.children), o = [];
  return s.forEach((a, n) => {
    const l = `${r == null ? void 0 : r.id}-${n}`;
    let h;
    switch (a.tagName) {
      case "line":
        const c = Number(a.getAttribute("x1")), u = Number(a.getAttribute("y1")), f = Number(a.getAttribute("x2")), d = Number(a.getAttribute("y2"));
        h = $s(a, c, u, f, d, { groupId: i, id: l });
        break;
      case "text":
        h = z0(a, t, {
          groupId: i,
          id: l
        });
        break;
      case "circle":
        h = ar(a, "ellipse", {
          label: a.textContent ? { text: a.textContent } : void 0,
          groupId: i,
          id: l
        });
      default:
        h = ar(a, gx[a.tagName], {
          label: a.textContent ? { text: a.textContent } : void 0,
          groupId: i,
          id: l
        });
    }
    o.push(h);
  }), o;
}, zu = (e, t) => {
  const r = t.getAttribute("fill"), i = t.getAttribute("stroke"), s = t.getAttribute("stroke-width"), o = t.getAttribute("stroke-dasharray");
  r && r !== "none" && (e.bgColor = kt(r)), i && i !== "none" && (e.strokeColor = kt(i)), s && (e.strokeWidth = Number(s)), o && o.trim() && (e.strokeStyle = "dashed");
}, uE = (e, t) => {
  const r = Array.from(t.querySelectorAll(".actor-top")), i = Array.from(t.querySelectorAll(".actor-bottom")), s = [], o = [], a = {}, n = e instanceof Map ? Array.from(e.values()) : Object.values(e), l = Array.from(t.querySelectorAll(".actor-line")), h = (c, u) => {
    var m;
    const f = c.name, d = l.find((y) => y.getAttribute("name") === f);
    if (d)
      return d;
    const p = c.type === "participant" ? (m = u.parentElement) == null ? void 0 : m.previousElementSibling : u.previousElementSibling;
    return p ? p.tagName === "line" ? p : p.querySelector("line") : null;
  };
  return n.forEach((c) => {
    const u = r.find((p) => p.getAttribute("name") === c.name), f = i.find((p) => p.getAttribute("name") === c.name);
    if (!u || !f)
      throw "root not found";
    const d = c.description;
    if (c.type === "participant") {
      const p = ar(u, "rectangle", { id: `${c.name}-top`, label: { text: d }, subtype: "actor" });
      if (zu(p, u), !p)
        throw "Top Node element not found!";
      s.push([p]);
      const m = ar(f, "rectangle", { id: `${c.name}-bottom`, label: { text: d }, subtype: "actor" });
      a[c.name] = {
        topId: `${c.name}-top`,
        bottomId: `${c.name}-bottom`,
        bindType: "rectangle"
      }, zu(m, f), s.push([m]);
      const y = h(c, u);
      if ((y == null ? void 0 : y.tagName) !== "line")
        throw "Line not found";
      const x = Number(y.getAttribute("x1"));
      if (!p.height)
        throw "Top node element height is null";
      const C = p.y + p.height, k = m.y, w = Number(y.getAttribute("x2")), T = $s(y, x, C, w, k);
      o.push(T);
    } else if (c.type === "actor") {
      const p = Wu(u, d, {
        id: `${c.name}-top`
      });
      s.push(p);
      const m = Wu(f, d, {
        id: `${c.name}-bottom`
      });
      s.push(m);
      const y = h(c, u);
      if ((y == null ? void 0 : y.tagName) !== "line")
        throw "Line not found";
      const x = Number(y.getAttribute("x1")), C = Number(y.getAttribute("y1")), k = Number(y.getAttribute("x2")), w = m.find((v) => v.type === "ellipse");
      if (w) {
        const v = w.y, L = $s(y, x, C, k, v);
        o.push(L);
      }
      const T = p.find((v) => v.type === "ellipse"), _ = m.find((v) => v.type === "ellipse");
      T != null && T.id && (_ != null && _.id) && (a[c.name] = {
        topId: T.id,
        bottomId: _.id,
        bindType: "ellipse"
      });
    }
  }), { nodes: s, lines: o, actorMap: a };
}, dE = (e, t, r) => {
  const i = [], s = Array.from(t.querySelectorAll('[class*="messageLine"]')), o = Object.keys(qu), a = e.filter((n) => o.includes(n.type.toString()));
  return s.forEach((n, l) => {
    const h = a[l], c = qu[h.type], u = lE(n, {
      label: h == null ? void 0 : h.message,
      strokeStyle: hE(h.type),
      endArrowhead: c === "SOLID_OPEN" || c === "DOTTED_OPEN" ? null : "arrow"
    }), f = r[h.from], d = r[h.to];
    f != null && f.topId && (d != null && d.topId) && (u.start = { type: f.bindType || "rectangle", id: f.topId }, u.end = { type: d.bindType || "rectangle", id: d.topId }), cE(n, u), i.push(u);
  }), i;
}, fE = (e, t) => {
  const r = Array.from(t.querySelectorAll(".note")).map((o) => o.parentElement), i = e.filter((o) => o.type === ze.NOTE), s = [];
  return r.forEach((o, a) => {
    if (!o)
      return;
    const n = o.firstChild, l = i[a].message, h = ar(n, "rectangle", {
      label: { text: l },
      subtype: "note"
    }), c = n.getAttribute("fill"), u = n.getAttribute("stroke"), f = n.getAttribute("stroke-width"), d = n.getAttribute("stroke-dasharray");
    c && c !== "none" && (h.bgColor = kt(c)), u && u !== "none" && (h.strokeColor = kt(u)), f && (h.strokeWidth = Number(f)), d && d.trim() && (h.strokeStyle = "dashed"), s.push(h);
  }), s;
}, pE = (e) => {
  const t = Array.from(e.querySelectorAll("[class*=activation]")), r = [];
  return t.forEach((i) => {
    const s = ar(i, "rectangle", {
      label: { text: "" },
      subtype: "activation"
    });
    (() => {
      const a = i.getAttribute("fill"), n = i.getAttribute("stroke"), l = i.getAttribute("stroke-width"), h = i.getAttribute("stroke-dasharray");
      a && a !== "none" && (s.bgColor = kt(a)), n && n !== "none" && (s.strokeColor = kt(n)), l && (s.strokeWidth = Number(l)), h && h.trim() && (s.strokeStyle = "dashed");
    })(), r.push(s);
  }), r;
}, gE = (e, t) => {
  const r = Array.from(t.querySelectorAll(".loopLine")), i = [], s = [], o = [];
  r.forEach((c) => {
    const u = Number(c.getAttribute("x1")), f = Number(c.getAttribute("y1")), d = Number(c.getAttribute("x2")), p = Number(c.getAttribute("y2")), m = $s(c, u, f, d, p);
    m.strokeStyle = "dotted", m.strokeColor = "#adb5bd", m.strokeWidth = 2, i.push(m);
  });
  const a = Array.from(t.querySelectorAll(".loopText")), n = e.filter((c) => c.type === ze.CRITICAL_START).map((c) => c.message);
  a.forEach((c) => {
    var m;
    const u = c.textContent || "", f = z0(c, u), d = ((m = u.match(/\[(.*?)\]/)) == null ? void 0 : m[1]) || "";
    n.includes(d) && (f.x += 16), s.push(f);
  });
  const l = Array.from(t == null ? void 0 : t.querySelectorAll(".labelBox")), h = Array.from(t == null ? void 0 : t.querySelectorAll(".labelText"));
  return l.forEach((c, u) => {
    var p;
    const f = ((p = h[u]) == null ? void 0 : p.textContent) || "", d = ar(c, "rectangle", {
      label: { text: f }
    });
    d.strokeColor = "#adb5bd", d.bgColor = "#e9ecef", d.width = void 0, o.push(d);
  }), { lines: i, texts: s, nodes: o };
}, mE = (e) => {
  const t = Array.from(e.querySelectorAll(".rect")).filter((i) => {
    var s;
    return ((s = i.parentElement) == null ? void 0 : s.tagName) !== "g";
  }), r = [];
  return t.forEach((i) => {
    const s = ar(i, "rectangle", {
      label: { text: "" },
      subtype: "highlight"
    });
    r.push(s);
  }), r;
}, yE = (e, t) => {
  const r = e.db, i = [], o = r.getBoxes().map((y) => ({
    ...y,
    fill: kt(y.fill || "")
  })), a = mE(t), n = r.getActors(), { nodes: l, lines: h, actorMap: c } = uE(n, t), u = r.getMessages(), f = dE(u, t, c), d = fE(u, t), p = pE(t), m = gE(u, t);
  return i.push(a), i.push(...l), i.push(d), i.push(p), { type: "sequence", lines: h, arrows: f, nodes: i, loops: m, groups: o };
}, xE = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    Se(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = kt(s));
    });
  }), t;
}, uo = {
  AGGREGATION: 0,
  EXTENSION: 1,
  COMPOSITION: 2,
  DEPENDENCY: 3
}, Hu = {
  LINE: 0,
  DOTTED_LINE: 1
}, Yu = 16, CE = (e) => {
  let t;
  switch (e) {
    case Hu.LINE:
      t = "solid";
      break;
    case Hu.DOTTED_LINE:
      t = "dotted";
      break;
    default:
      t = "solid";
  }
  return t;
}, Uu = (e) => {
  let t;
  switch (e) {
    case uo.AGGREGATION:
      t = "diamond_outline";
      break;
    case uo.COMPOSITION:
      t = "diamond";
      break;
    case uo.EXTENSION:
      t = "triangle_outline";
      break;
    case "none":
      t = null;
      break;
    case uo.DEPENDENCY:
    default:
      t = "arrow";
      break;
  }
  return t;
}, mn = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = qr(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, Xu = /* @__PURE__ */ new Set([
  "triangle_outline",
  "diamond",
  "diamond_outline"
]), H0 = (e, t = 0.5) => {
  if (e.length <= 2)
    return [...e];
  const r = [e[0]];
  for (let i = 1; i < e.length - 1; i++) {
    const s = r[r.length - 1], o = e[i], a = e[i + 1], n = a.x - s.x, l = a.y - s.y, h = Math.hypot(n, l);
    if (!h)
      continue;
    const u = Math.abs(n * (o.y - s.y) - l * (o.x - s.x)) / h, f = ((o.x - s.x) * n + (o.y - s.y) * l) / (h * h);
    u <= t && f >= -t && f <= 1 + t || r.push(o);
  }
  return r.push(e[e.length - 1]), r;
}, Y0 = (e) => {
  const t = _l(ld(e).map((i) => [i.x, i.y])).map(([i, s]) => ({ x: i, y: s })), r = Bl(e);
  return r && t.length >= 2 && (t[0] = {
    x: r.startX,
    y: r.startY
  }, t[t.length - 1] = {
    x: r.endX,
    y: r.endY
  }), H0(t);
}, Gu = (e, t, r) => {
  const i = e.x - t.x, s = e.y - t.y, o = Math.hypot(i, s);
  return o ? {
    x: e.x + i / o * r,
    y: e.y + s / o * r
  } : e;
}, bE = (e, t) => {
  const r = _l(t.map((o) => [o.x, o.y])).map(([o, a]) => ({ x: o, y: a }));
  if (r.length < 2)
    throw new Error("Arrow route must contain at least two points");
  const i = r[0], s = r[r.length - 1];
  e.startX = i.x, e.startY = i.y, e.endX = s.x, e.endY = s.y, e.points = r.map((o) => [
    o.x - i.x,
    o.y - i.y
  ]);
}, kE = (e) => {
  var o;
  const t = (o = e.points) == null ? void 0 : o.map(([a, n]) => ({ x: e.startX + a, y: e.startY + n })).filter((a) => Number.isFinite(a.x) && Number.isFinite(a.y));
  if (!t || t.length < 2)
    return e;
  const r = [...t], i = !!e.startArrowhead && Xu.has(e.startArrowhead), s = !!e.endArrowhead && Xu.has(e.endArrowhead);
  if (!i && !s)
    return e;
  if (i && (r[0] = Gu(r[0], r[1], Yu)), s) {
    const a = r.length - 1;
    r[a] = Gu(r[a], r[a - 1], Yu);
  }
  return bE(e, r), e;
}, SE = (e, t) => {
  const r = kt(e.getAttribute("stroke") || getComputedStyle(e).stroke || ""), i = parseFloat(e.getAttribute("stroke-width") || getComputedStyle(e).strokeWidth || "1");
  we(r) && r !== "none" && (t.strokeColor = r), Number.isFinite(i) && i > 0 && (t.strokeWidth = i);
}, wE = (e) => {
  const t = [];
  return e.forEach((r) => {
    Y0(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), H0(t);
}, U0 = (e, t, r) => {
  if (e.length < 2)
    throw new Error(`Class diagram edge ${(t == null ? void 0 : t.id) || "<unknown>"} is missing usable path points`);
  const i = e[0], s = e[e.length - 1], o = Mh(i.x, i.y, s.x, s.y, {
    id: (t == null ? void 0 : t.getAttribute("data-id")) || (t == null ? void 0 : t.id) || void 0,
    ...r,
    points: e.map((a) => [
      a.x - i.x,
      a.y - i.y
    ])
  });
  return t && SE(t, o), kE(o);
}, X0 = (e, t) => U0(wE(e), e[0], t), TE = (e, t) => {
  const r = Y0(e);
  return U0([r[0], r[r.length - 1]], e, t);
}, _E = (e, t) => X0([e], t), BE = (e, t) => [
  `${e}-cyclic-special-1`,
  `${e}-cyclic-special-mid`,
  `${e}-cyclic-special-2`
].map((i) => t.querySelector(`path[id="${i}"][data-edge="true"]`)).filter((i) => i !== null), vE = (e) => {
  var t;
  return ((t = e.points) == null ? void 0 : t.map(([r, i]) => ({ x: e.startX + r, y: e.startY + i })).filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y))) || [];
}, ju = (e, t) => {
  const r = vE(e);
  if (r.length < 2)
    return null;
  const i = t === "start", s = i ? r[0] : r[r.length - 1], o = i ? r[1] : r[r.length - 2], a = o.x === s.x ? i ? -1 : 1 : Math.sign(o.x - s.x), n = o.y === s.y ? 1 : Math.sign(o.y - s.y);
  return {
    x: s.x + a * 20,
    y: s.y + (n >= 0 ? 12 : -28)
  };
}, LE = (e, t) => {
  let r = e;
  for (; r && r !== t; ) {
    if (r.classList.contains("annotation-group") || r.classList.contains("label-group"))
      return "header";
    if (r.classList.contains("members-group"))
      return "members";
    if (r.classList.contains("methods-group"))
      return "methods";
    r = r.parentElement;
  }
  return "other";
}, AE = (e, t, r) => {
  const i = [], s = [], o = [];
  return Object.values(e).forEach((a) => {
    var $;
    const { domId: n, id: l } = a, h = be(), c = xE(
      // @ts-ignore
      a.styles || a.cssStyles
    );
    let u;
    try {
      u = r ? r(l) : void 0;
    } catch {
      u = void 0;
    }
    const f = (B) => {
      const I = new RegExp(`^classId-${B}(?:-|$)`);
      return Array.from(t.querySelectorAll("[id]")).filter((X) => I.test(X.id))[0];
    }, d = u && t.querySelector(`#${u}`) || t.querySelector(`#${n}`) || t.querySelector(`[data-id='${l}']`) || f(l);
    if (!d)
      throw Error(`DOM Node with id ${n} not found`);
    const p = d.querySelector("rect") || d, m = p.getBBox(), { tx: y, ty: x } = mn(p, t), C = {
      type: "rectangle",
      id: l,
      groupId: h,
      x: m.x + y,
      y: m.y + x,
      width: m.width,
      height: m.height,
      metadata: { classId: l }
    }, k = p.getAttribute("fill"), w = p.getAttribute("stroke"), T = p.getAttribute("stroke-width"), _ = p.getAttribute("stroke-dasharray"), v = getComputedStyle(p), L = kt(k || c.fill || (k ? v.fill : "")), W = kt(w || c.stroke || (w ? v.stroke : "")), O = T || c["stroke-width"] || (T ? v.strokeWidth : ""), M = _ || c["stroke-dasharray"] || (_ ? v.strokeDasharray === "none" ? "" : v.strokeDasharray : ""), U = (B) => {
      if (!B || !we(B))
        return !1;
      const I = B.toLowerCase();
      return !(I === "none" || I === "transparent" || I === "rgba(0, 0, 0, 0)" || I === "black" || I === "#000" || I === "#000000" || I === "rgb(0, 0, 0)" || I === "rgba(0, 0, 0, 1)");
    };
    U(L) ? C.bgColor = L : C.bgColor = void 0, U(W) ? C.strokeColor = W : C.strokeColor = void 0, O ? C.strokeWidth = Number(O) : C.strokeWidth = void 0, M && M.trim().length > 0 ? C.strokeStyle = "dashed" : C.strokeStyle = void 0, i.push(C), [
      ...Array.from(d.querySelectorAll("line")),
      ...Array.from(d.querySelectorAll("g.divider path"))
    ].forEach((B) => {
      const { tx: I, ty: Y } = mn(B, t);
      let X, Z, ot, Q;
      if (B.tagName.toLowerCase() === "line")
        X = Number(B.getAttribute("x1")) + I, Z = Number(B.getAttribute("y1")) + Y, ot = Number(B.getAttribute("x2")) + I, Q = Number(B.getAttribute("y2")) + Y;
      else {
        const gt = B.getBBox();
        X = gt.x + I, ot = gt.x + gt.width + I;
        const mt = gt.y + gt.height / 2 + Y;
        Z = mt, Q = mt;
      }
      if (X === ot && Z === Q)
        return;
      const at = $s(
        // @ts-ignore
        B,
        X,
        Z,
        ot,
        Q,
        {
          groupId: h,
          id: be()
        }
      );
      C.strokeColor ? at.strokeColor = C.strokeColor : at.strokeColor = void 0, C.strokeWidth !== void 0 ? at.strokeWidth = C.strokeWidth : at.strokeWidth = void 0, C.strokeStyle ? at.strokeStyle = C.strokeStyle : at.strokeStyle = void 0, at.metadata = { classId: l }, s.push(at);
    });
    const D = Array.from(d.querySelectorAll("text, foreignObject")), E = [];
    D.forEach((B) => {
      var gt;
      const I = B.tagName.toLowerCase() === "foreignobject", Y = I ? [] : Array.from(B.querySelectorAll("tspan")), X = Y.length ? Y.map((mt) => {
        var Tt;
        return (Tt = mt.textContent) == null ? void 0 : Tt.trim();
      }).filter(Boolean).join(`
`) : ((gt = B.textContent) == null ? void 0 : gt.trim()) || "";
      if (!X)
        return;
      const Z = B.getBBox(), { ty: ot } = mn(B, t);
      let Q = parseFloat(getComputedStyle(B).fontSize || "");
      if (I && (!Number.isFinite(Q) || !Q)) {
        const mt = B.querySelector("div, span, p");
        mt && (Q = parseFloat(getComputedStyle(mt).fontSize || ""));
      }
      (!Number.isFinite(Q) || Q <= 0) && (Q = Math.max(12, Z.height * 0.6)), Q = Q * 0.9;
      const at = Ah(B, c.color);
      E.push({
        section: LE(B, d),
        text: fe(X),
        x: Z.x,
        y: Z.y + ot,
        width: C && C.width ? Math.max(C.width - 8, Z.width) : Z.width,
        height: Z.height,
        fontSize: Q,
        color: at
      });
    });
    const A = E.filter((B) => B.section === "header").sort((B, I) => B.y - I.y || B.x - I.x);
    if (!C.label) {
      const B = A.length === 0 && E.length === 1 ? E : A;
      B.length > 0 && (C.label = {
        text: B.map((I) => I.text).join(`
`),
        fontSize: Math.max(...B.map((I) => I.fontSize)),
        color: ($ = B.find((I) => I.color)) == null ? void 0 : $.color,
        verticalAlign: "top"
      });
    }
    E.filter((B) => A.length > 0 ? B.section !== "header" : !(C.label && E.length === 1)).forEach((B) => {
      const I = na(((C == null ? void 0 : C.x) || 0) + 4, B.y, B.text, {
        width: B.width,
        height: B.height,
        fontSize: B.fontSize,
        color: B.color,
        id: be(),
        groupId: h,
        metadata: { classId: l }
      });
      o.push(I);
    });
  }), { nodes: i, lines: s, text: o };
}, FE = (e, t, r, i) => {
  const s = Array.from(r.querySelectorAll('.edgePaths path[data-edge="true"]:not([id^="edgeNote"]):not([id*="-cyclic-special-"])'));
  if (e.length === 0)
    return { arrows: [], text: [] };
  const o = [], a = [];
  let n = 0;
  return e.forEach((l) => {
    const { id1: h, id2: c, relation: u } = l, f = t.find((O) => O.id === h), d = t.find((O) => O.id === c);
    if (!f)
      throw new Error(`parseRelations: Cannot find node with id ${h}`);
    if (!d)
      throw new Error(`parseRelations: Cannot find node with id ${c}`);
    const p = CE(u.lineType), m = Uu(u.type1), y = Uu(u.type2);
    let x;
    if (h === c) {
      const O = BE(h, r);
      if (!O.length)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${h} -> ${c}`);
      x = X0(O, {
        strokeStyle: p,
        startArrowhead: m,
        endArrowhead: y,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: f.id },
        end: { type: "rectangle", id: d.id }
      });
    } else {
      const O = s[n];
      if (!O)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${h} -> ${c}`);
      n += 1, x = TE(O, {
        strokeStyle: p,
        startArrowhead: m,
        endArrowhead: y,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: f.id },
        end: { type: "rectangle", id: d.id }
      });
    }
    o.push(x);
    const { relationTitle1: C, relationTitle2: k } = l, w = h === c, T = 20, _ = 15, v = 15;
    let L, W;
    if (C && C !== "none") {
      if (w) {
        const M = ju(x, "start");
        M && (L = M.x, W = M.y);
      } else
        switch (i) {
          case "TB":
            L = x.startX - T, x.endX < x.startX && (L -= v), W = x.startY + _;
            break;
          case "BT":
            L = x.startX + T, x.endX > x.startX && (L += v), W = x.startY - _;
            break;
          case "LR":
            L = x.startX + T, W = x.startY + _, x.endY > x.startY && (W += v);
            break;
          case "RL":
            L = x.startX - T, W = x.startY - _, x.startY > x.endY && (W -= v);
            break;
          default:
            L = x.startX - T, W = x.startY + _;
        }
      L ?? (L = x.startX - T), W ?? (W = x.startY + _);
      const O = na(L, W, C, {
        fontSize: 16
      });
      a.push(O);
    }
    if (k && k !== "none") {
      if (w) {
        const M = ju(x, "end");
        M && (L = M.x, W = M.y);
      } else
        switch (i) {
          case "TB":
            L = x.endX + T, x.endX < x.startX && (L += v), W = x.endY - _;
            break;
          case "BT":
            L = x.endX - T, x.endX > x.startX && (L -= v), W = x.endY + _;
            break;
          case "LR":
            L = x.endX - T, W = x.endY - _, x.endY > x.startY && (W -= v);
            break;
          case "RL":
            L = x.endX + T, W = x.endY + _, x.startY > x.endY && (W += v);
            break;
          default:
            L = x.endX + T, W = x.endY - _;
        }
      L ?? (L = x.endX + T), W ?? (W = x.endY + _);
      const O = na(L, W, k, {
        fontSize: 16
      });
      a.push(O);
    }
  }), { arrows: o, text: a };
}, EE = (e, t, r) => {
  const i = [], s = [];
  return e.forEach((o, a) => {
    const { id: n, text: l, class: h } = o, c = t.querySelector(`#${n}`);
    if (!c)
      throw new Error(`Node with id ${n} not found!`);
    const { transformX: u, transformY: f } = qr(c), d = c.firstChild, p = ar(d, "rectangle", {
      id: n,
      subtype: "note",
      label: { text: l }
    });
    if (Object.assign(p, {
      x: p.x + u,
      y: p.y + f
    }), i.push(p), h) {
      const m = r.find((_) => _.id === h);
      if (!m)
        throw new Error(`class node with id ${h} not found!`);
      const y = t.querySelector(`path[id="edgeNote${a + 1}"][data-edge="true"]`);
      if (y) {
        s.push(_E(y, {
          strokeStyle: "dotted",
          startArrowhead: null,
          endArrowhead: null,
          start: { id: p.id, type: "rectangle" },
          end: { id: m.id, type: "rectangle" }
        }));
        return;
      }
      const x = p.x + (p.width || 0) / 2, C = p.y + (p.height || 0), k = x, w = m.y, T = Mh(x, C, k, w, {
        strokeStyle: "dotted",
        startArrowhead: null,
        endArrowhead: null,
        start: { id: p.id, type: "rectangle" },
        end: { id: m.id, type: "rectangle" }
      });
      s.push(T);
    }
  }), { notes: i, connectors: s };
}, ME = (e, t) => {
  var x, C, k, w, T;
  const r = e.db, i = ((x = r.getDirection) == null ? void 0 : x.call(r)) || "TB", s = [], o = [], a = [], n = [], l = ((C = r.getNamespaces) == null ? void 0 : C.call(r)) || [], h = ((k = r.getClasses) == null ? void 0 : k.call(r)) || {}, c = h instanceof Map ? Object.fromEntries(h) : h;
  if (c && Object.keys(c).length) {
    const _ = (
      //@ts-ignore
      typeof r.lookUpDomId == "function" ? (
        //@ts-ignore
        r.lookUpDomId.bind(r)
      ) : void 0
    ), v = AE(c, t, _);
    s.push(v.nodes), o.push(...v.lines), a.push(...v.text), n.push(...v.nodes);
  }
  const u = ((w = r.getRelations) == null ? void 0 : w.call(r)) || [], { arrows: f, text: d } = FE(u, n, t, i), p = ((T = r.getNotes) == null ? void 0 : T.call(r)) || [], { notes: m, connectors: y } = EE(p, t, n);
  return s.push(m), f.push(...y), a.push(...d), { type: "class", nodes: s, lines: o, arrows: f, text: a, namespaces: l };
}, Vu = 18, $E = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    Se(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = kt(s));
    });
  }), t;
}, OE = (e) => {
  if (e == null || e === "")
    return;
  const t = typeof e == "number" ? e : parseFloat(kt(e));
  if (!(!Number.isFinite(t) || t <= 0))
    return t;
}, $h = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = qr(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, IE = (e) => {
  var i;
  const t = Array.from(e.querySelectorAll("tspan")), r = t.length ? t.map((s) => {
    var o;
    return (o = s.textContent) == null ? void 0 : o.trim();
  }).filter(Boolean).join(`
`) : ((i = e.textContent) == null ? void 0 : i.trim()) || "";
  return fe(r);
}, DE = (e) => {
  const t = e.querySelector("text, foreignObject, div, span, p") || e;
  let r = parseFloat(getComputedStyle(t).fontSize || "");
  return (!Number.isFinite(r) || r <= 0) && (r = Math.max(12, e.getBBox().height * 0.75)), r;
}, RE = (e, t, r) => {
  const i = IE(e);
  if (!i)
    return null;
  const s = e.getBBox(), { tx: o, ty: a } = $h(e, t);
  return {
    className: e.getAttribute("class") || "",
    text: i,
    x: s.x + o,
    y: s.y + a,
    width: s.width,
    height: s.height,
    fontSize: DE(e),
    color: Ah(e, r)
  };
}, PE = (e, t, r, i, s, o, a) => {
  const { tx: n, ty: l } = $h(e, t);
  let h = 0, c = 0, u = 0, f = 0;
  if (e.tagName.toLowerCase() === "line")
    h = Number(e.getAttribute("x1")) + n, c = Number(e.getAttribute("y1")) + l, u = Number(e.getAttribute("x2")) + n, f = Number(e.getAttribute("y2")) + l;
  else {
    const p = Bl(e);
    if (!p)
      return null;
    h = p.startX + n, c = p.startY + l, u = p.endX + n, f = p.endY + l;
  }
  const d = {
    type: "line",
    id: be(),
    groupId: r,
    startX: h,
    startY: c,
    endX: u,
    endY: f,
    metadata: { entityId: i }
  };
  return s && we(s) && s !== "none" && (d.strokeColor = s), o !== void 0 && (d.strokeWidth = o), a && (d.strokeStyle = a), d;
}, Zu = (e) => {
  switch (e == null ? void 0 : e.toLowerCase()) {
    case "one":
      return "cardinality_one";
    case "many":
      return "cardinality_many";
    case "only_one":
      return "cardinality_exactly_one";
    case "one_or_more":
      return "cardinality_one_or_many";
    case "zero_or_one":
      return "cardinality_zero_or_one";
    case "zero_or_more":
      return "cardinality_zero_or_many";
    default:
      return null;
  }
}, NE = (e) => {
  switch (e) {
    case "dotted":
      return "dotted";
    case "dashed":
      return "dashed";
    default:
      return "solid";
  }
}, qE = (e, t) => {
  const r = t.querySelector(`path[id="${e.id}"][data-edge="true"]`);
  return r ? [r] : e.start !== e.end ? [] : [
    `${e.start}-cyclic-special-1`,
    `${e.start}-cyclic-special-mid`,
    `${e.start}-cyclic-special-2`
  ].map((s) => t.querySelector(`path[id="${s}"][data-edge="true"]`)).filter((s) => s !== null);
}, WE = (e) => {
  const t = [];
  return e.forEach((r) => {
    ld(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), t;
}, zE = (e, t) => {
  const r = t.querySelector(`[id="${e.id}"]`);
  if (!r)
    throw new Error(`ER entity ${e.id} not found in rendered SVG`);
  const i = e.attributes.length ? be() : void 0, s = r.getBBox(), { tx: o, ty: a } = $h(r, t), n = $E([
    ...e.cssStyles || [],
    ...e.cssCompiledStyles || []
  ]), l = kt(n.fill || ""), h = kt(n.stroke || ""), c = OE(n["stroke-width"]), u = kt(n["stroke-dasharray"] || ""), f = Array.from(r.querySelectorAll("g.label")).map((k) => RE(k, t, n.color)).filter((k) => k !== null), d = f.find((k) => k.className.includes("name")) || f[0], p = f.filter((k) => k !== d), m = (d == null ? void 0 : d.text) || fe(e.alias || e.label || ""), y = {
    type: "rectangle",
    id: e.id,
    groupId: i,
    x: s.x + o,
    y: s.y + a,
    width: s.width,
    height: s.height,
    label: {
      text: m,
      fontSize: e.attributes.length ? Vu : (d == null ? void 0 : d.fontSize) || 16,
      color: d == null ? void 0 : d.color,
      textAlign: "center",
      verticalAlign: e.attributes.length ? "top" : "middle"
    },
    metadata: {
      entityId: e.id,
      entityLabel: e.label,
      entityAlias: e.alias
    }
  };
  we(l) && l !== "none" && (y.bgColor = l), we(h) && h !== "none" && (y.strokeColor = h), c && Number.isFinite(c) && c > 0 && (y.strokeWidth = c), u && u !== "none" && (y.strokeStyle = "dashed");
  const x = Array.from(r.querySelectorAll(".divider path, path.divider, line.divider")).map((k) => PE(k, t, i, e.id, y.strokeColor, y.strokeWidth, y.strokeStyle)).filter((k) => k !== null), C = p.map((k) => na(k.x, k.y, k.text, {
    id: be(),
    groupId: i,
    width: k.width,
    height: k.height,
    fontSize: Vu,
    color: k.color,
    metadata: { entityId: e.id }
  }));
  return { container: y, lines: x, text: C };
}, HE = (e, t) => {
  const r = qE(e, t);
  if (!r.length)
    throw new Error(`ER relationship ${e.id} not found in rendered SVG`);
  const i = WE(r);
  if (i.length < 2)
    throw new Error(`ER relationship ${e.id} is missing usable path points`);
  const s = i[0], o = i[i.length - 1], a = r[0], n = kt(a.getAttribute("stroke") || getComputedStyle(a).stroke || ""), l = Number(a.getAttribute("stroke-width") || getComputedStyle(a).strokeWidth || 1), h = Mh(s.x, s.y, o.x, o.y, {
    id: e.id,
    label: e.label ? {
      text: fe(e.label),
      fontSize: 16,
      textAlign: "center"
    } : void 0,
    strokeStyle: NE(e.pattern),
    startArrowhead: Zu(e.arrowTypeStart),
    endArrowhead: Zu(e.arrowTypeEnd),
    start: { type: "rectangle", id: e.start },
    end: { type: "rectangle", id: e.end },
    points: i.map((c) => [
      c.x - s.x,
      c.y - s.y
    ])
  });
  return we(n) && n !== "none" && (h.strokeColor = n), Number.isFinite(l) && l > 0 && (h.strokeWidth = l), h;
}, YE = (e, t) => {
  const r = e.getData(), i = r.nodes, s = r.edges, o = [], a = [], n = [];
  i.forEach((h) => {
    const c = zE(h, t);
    o.push(c.container), a.push(...c.lines), n.push(...c.text);
  });
  const l = s.map((h) => HE(h, t));
  return {
    type: "erd",
    nodes: [o],
    lines: a,
    arrows: l,
    text: n
  };
}, Zr = (e) => {
  const t = kt(e || "");
  return !t || t === "none" || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)" ? !1 : we(t);
}, G0 = (e, t, r) => {
  switch (t) {
    case Bt.FILL:
    case Bt.STROKE:
      Zr(r) && (e[t] = kt(r));
      break;
    case Bt.STROKE_WIDTH:
    case Bt.STROKE_DASHARRAY:
      kt(r) && (e[t] = kt(r));
      break;
  }
}, j0 = (e, t, r) => {
  t === se.COLOR && Zr(r) && (e[se.COLOR] = kt(r));
}, UE = (e, t, r) => {
  e && Se(e).forEach(({ property: i, value: s }) => {
    G0(t, i, s), j0(r, i, s);
  });
}, XE = (e, t) => {
  e && Se(e).forEach(({ property: r, value: i }) => {
    if (r === Bt.FILL && Zr(i)) {
      t[se.COLOR] = kt(i);
      return;
    }
    j0(t, r, i);
  });
}, GE = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.filter(Boolean).forEach((r) => {
    Se(r || "").forEach(({ property: i }) => {
      t.add(i);
    });
  }), t;
}, jE = (e, t, r) => {
  if (!e)
    return;
  [
    [Bt.FILL, e.getAttribute("fill")],
    [Bt.STROKE, e.getAttribute("stroke")],
    [
      Bt.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      Bt.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([s, o]) => {
    if (!r.has(s) || t[s])
      return;
    const a = kt(o || "");
    a && G0(t, s, a);
  });
}, VE = (e, t, r) => {
  if (!e)
    return;
  const i = [
    e,
    ...Array.from(e.querySelectorAll("text, foreignObject, div, span, p"))
  ];
  for (const s of i) {
    if (t[se.COLOR] || (r.has(se.COLOR) || r.has(Bt.FILL)) && (XE(s.getAttribute("style"), t), t[se.COLOR]))
      break;
    const o = kt(s.getAttribute("fill") || s.getAttribute("color") || "");
    (r.has(se.COLOR) || r.has(Bt.FILL)) && Zr(o) && (t[se.COLOR] = o);
  }
}, Oh = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = qr(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, ZE = (e, t) => {
  const r = e.getBBox(), { tx: i, ty: s } = Oh(e, t);
  return {
    x: r.x + i,
    y: r.y + s,
    width: r.width,
    height: r.height
  };
}, KE = (e, t) => {
  const r = e.querySelector("line.divider");
  if (!r)
    return;
  const { tx: i, ty: s } = Oh(r, t);
  return {
    startX: Number(r.getAttribute("x1")) + i,
    startY: Number(r.getAttribute("y1")) + s,
    endX: Number(r.getAttribute("x2")) + i,
    endY: Number(r.getAttribute("y2")) + s
  };
}, QE = (e) => {
  const t = e.getBBox();
  return Math.abs(t.width * t.height);
}, Ku = (e, t) => {
  const r = e.getAttribute("style");
  if (!r)
    return;
  const i = Se(r).find((s) => s.property === t);
  if (i)
    return kt(i.value);
}, kl = (e, t) => {
  const r = e.map((s) => ({ element: s, area: QE(s) })).filter(({ area: s }) => Number.isFinite(s) && s > 0);
  return r.length === 0 ? null : r.sort((s, o) => t === "largest" ? o.area - s.area : s.area - o.area)[0].element;
}, JE = (e, t) => {
  if (!e || !t.has(Bt.FILL) && !t.has(Bt.STROKE))
    return;
  const r = kt(e.getAttribute("fill") || Ku(e, Bt.FILL) || ""), i = kt(e.getAttribute("stroke") || Ku(e, Bt.STROKE) || "");
  if (Zr(r))
    return r;
  if (Zr(i))
    return i;
}, tM = (e, t) => {
  const r = Array.from(e.querySelectorAll("circle, ellipse, path")), i = kl(r, "smallest");
  return JE(i, t);
}, eM = (e) => {
  if (e.length < 2)
    return e;
  const t = e.slice(1), r = t.filter((i) => i.trim().length > 0).reduce((i, s) => {
    var a;
    const o = ((a = s.match(/^\s*/)) == null ? void 0 : a[0].length) ?? 0;
    return Math.min(i, o);
  }, Number.POSITIVE_INFINITY);
  return !Number.isFinite(r) || r <= 0 ? e.map((i) => i.trimEnd()) : [
    e[0].trimEnd(),
    ...t.map((i) => i.replace(new RegExp(`^\\s{0,${r}}`), "").trimEnd())
  ];
}, rM = (e) => {
  const t = Array.isArray(e.label) ? e.label.map((i) => fe(i)) : fe(e.label || "").split(`
`);
  return eM(t).join(`
`);
}, iM = (e) => e.description ? (Array.isArray(e.description) ? e.description : [e.description]).map((r) => fe(r)).filter((r) => r.length > 0) : [], sM = (e) => {
  const t = /* @__PURE__ */ new Set(), r = (s) => (s && t.add(s), s), i = (s) => {
    const o = s.find((a) => !t.has(a));
    return r(o || null);
  };
  return (s) => {
    const o = [
      `[id='${s.domId}']`,
      `[id='${s.id}']`,
      `[data-id='${s.id}']`
    ];
    for (const a of o) {
      const n = e.querySelector(a);
      if (n)
        return r(n);
    }
    switch (s.shape) {
      case "divider":
        return i(Array.from(e.querySelectorAll("g.statediagram-cluster-alt")));
      case "stateStart":
        return i(Array.from(e.querySelectorAll("g.node.default")).filter((a) => a.querySelector("circle.state-start")));
      case "stateEnd":
        return i(Array.from(e.querySelectorAll("g.node.default")).filter((a) => !a.querySelector("circle.state-start")));
      default:
        return null;
    }
  };
}, oM = (e, t) => {
  switch (t) {
    case "roundedWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "divider":
      return e.querySelector("rect.divider") || e.querySelector("rect") || e;
    case "rectWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "stateStart":
      return kl(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    case "stateEnd":
      return kl(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    case "choice":
    case "fork":
    case "join":
    case "note":
    case "rect":
    default:
      return e.querySelector("rect, path, circle, ellipse, polygon") || e;
  }
}, aM = (e, t, r) => {
  const i = r(e);
  if (!i)
    throw new Error(`State node element not found for "${e.id}"`);
  const s = oM(i, e.shape), o = {}, a = {}, n = [
    e.labelStyle,
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || []
  ], l = GE(n);
  n.filter(Boolean).forEach((c) => {
    UE(c, o, a);
  }), jE(s, o, l), VE(i, a, l);
  const h = ZE(s, t);
  return {
    id: e.id,
    shape: e.shape,
    text: rM(e),
    description: iM(e),
    x: h.x,
    y: h.y,
    width: h.width,
    height: h.height,
    parentId: e.parentId,
    position: e.position,
    containerStyle: o,
    labelStyle: a,
    dividerLine: e.shape === "rectWithTitle" ? KE(i, t) : void 0,
    endInnerColor: e.shape === "stateEnd" ? tM(i, l) : void 0,
    isRenderable: e.shape !== "noteGroup"
  };
}, nM = (e, t) => {
  var h;
  const r = t.querySelector(`[id='${e.id}']`);
  if (!r)
    return null;
  const { tx: i, ty: s } = Oh(r, t), o = hd(r, { x: i, y: s }, "MCL");
  if (o.reflectionPoints.length < 2)
    return null;
  const a = {}, n = (c, u) => {
    switch (c) {
      case Bt.STROKE:
        Zr(u) && (a.strokeColor = kt(u));
        break;
      case Bt.STROKE_WIDTH: {
        const f = parseFloat(kt(u));
        Number.isFinite(f) && f > 0 && (a.strokeWidth = f);
        break;
      }
      case Bt.STROKE_DASHARRAY:
        kt(u) && (a.strokeStyle = "dashed");
        break;
    }
  };
  [e.style].filter(Boolean).forEach((c) => {
    Se(c || "").forEach(({ property: u, value: f }) => {
      n(u, f);
    });
  });
  const l = e.arrowhead === "none" || ((h = e.classes) == null ? void 0 : h.includes("note-edge"));
  return {
    id: e.id,
    start: e.start,
    end: e.end,
    text: fe(e.label || ""),
    ...o,
    strokeColor: a.strokeColor,
    strokeWidth: a.strokeWidth,
    strokeStyle: l ? "dashed" : a.strokeStyle,
    isNoteEdge: l
  };
}, lM = (e, t) => {
  const { nodes: r, edges: i } = e.getData(), s = sM(t);
  return {
    type: "state",
    nodes: r.map((o) => aM(o, t, s)),
    edges: i.map((o) => nM(o, t)).filter((o) => o !== null)
  };
};
let Qu = Promise.resolve();
const hM = (e) => {
  const t = Qu.then(e, e);
  return Qu = t.then(() => {
  }, () => {
  }), t;
};
let Ju = null, cM = 0;
const uM = (e) => JSON.stringify(e), td = (e) => {
  const t = e.querySelector("svg");
  if (!t)
    throw new Error("SVG element not found");
  const r = t.getBoundingClientRect(), i = r.width, s = r.height;
  t.setAttribute("width", `${i}`), t.setAttribute("height", `${s}`);
  const o = "image/svg+xml", a = unescape(encodeURIComponent(t.outerHTML)), l = `data:image/svg+xml;base64,${btoa(a)}`;
  return {
    type: "graphImage",
    mimeType: o,
    dataURL: l,
    width: i,
    height: s
  };
}, dM = async (e, t = Qs) => hM(async () => {
  var h, c;
  const r = ((h = t.themeVariables) == null ? void 0 : h.fontSize) ?? Qs.themeVariables.fontSize, i = {
    ...Qs,
    ...t,
    fontSize: r,
    themeVariables: {
      ...Qs.themeVariables,
      ...t.themeVariables,
      fontSize: r
    }
  }, s = uM(i);
  s !== Ju && (pn.initialize(i), Ju = s);
  const o = await pn.mermaidAPI.getDiagramFromText(Qx(e)), a = `mermaid-to-excalidraw-${cM++}`, n = document.createElement("div");
  n.setAttribute("style", "opacity: 0; position: fixed; z-index: -1; left: -99999px; top: -99999px;");
  const l = `${a}-container`;
  n.id = l, (c = document.getElementById(l)) == null || c.remove(), document.body.appendChild(n);
  try {
    const { svg: u } = await pn.render(a, e, n);
    n.innerHTML = u;
    let f;
    try {
      switch (o.type) {
        case "flowchart-v2":
        case "graph": {
          f = nE(o.db, n);
          break;
        }
        case "sequence": {
          f = yE(o, n);
          break;
        }
        case "class":
        case "classDiagram": {
          f = ME(o, n);
          break;
        }
        case "er": {
          f = YE(o.db, n);
          break;
        }
        case "state":
        case "stateDiagram": {
          f = lM(o.db, n);
          break;
        }
        default:
          f = td(n);
      }
    } catch (d) {
      console.error("Error processing Mermaid diagram:", d), f = td(n);
    }
    return f;
  } finally {
    n.remove();
  }
}), fM = async (e, t) => {
  var a;
  const r = t || {}, i = parseInt(((a = r.themeVariables) == null ? void 0 : a.fontSize) ?? "") || Os, s = await dM(e, {
    ...r,
    themeVariables: {
      ...r.themeVariables
    }
  });
  return rC(s, {
    fontSize: i
  });
}, YM = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseMermaidToExcalidraw: fM
}, Symbol.toStringTag, { value: "Module" }));
export {
  ks as $,
  Vb as A,
  hh as B,
  Ue as C,
  Cd as D,
  LT as E,
  LS as F,
  gS as G,
  Nc as H,
  Pc as I,
  LM as J,
  wM as K,
  BM as L,
  _M as M,
  kM as N,
  Wl as O,
  vM as P,
  SM as Q,
  ai as R,
  FM as S,
  AM as T,
  yt as U,
  TM as V,
  ZC as W,
  xM as X,
  Iw as Y,
  Ow as Z,
  g as _,
  Hb as a,
  Ke as a$,
  yM as a0,
  ya as a1,
  CT as a2,
  Ab as a3,
  Md as a4,
  Oi as a5,
  Cc as a6,
  CS as a7,
  Rn as a8,
  vT as a9,
  rh as aA,
  th as aB,
  ko as aC,
  iT as aD,
  rT as aE,
  eT as aF,
  tT as aG,
  Xw as aH,
  gg as aI,
  Vw as aJ,
  Uw as aK,
  Qw as aL,
  mg as aM,
  jw as aN,
  aT as aO,
  oT as aP,
  sT as aQ,
  lT as aR,
  nT as aS,
  Gw as aT,
  yg as aU,
  Jw as aV,
  Kw as aW,
  Zw as aX,
  xg as aY,
  IB as aZ,
  ne as a_,
  Oe as aa,
  N as ab,
  q as ac,
  Rb as ad,
  Od as ae,
  pB as af,
  Fy as ag,
  qM as ah,
  Ws as ai,
  i_ as aj,
  nh as ak,
  rt as al,
  xv as am,
  NM as an,
  WM as ao,
  RM as ap,
  nt as aq,
  PM as ar,
  ch as as,
  GB as at,
  WB as au,
  qB as av,
  ia as aw,
  Gt as ax,
  Jt as ay,
  z_ as az,
  zb as b,
  es as b0,
  _g as b1,
  Gr as b2,
  Ag as b3,
  fd as b4,
  mS as b5,
  mM as b6,
  r_ as b7,
  CM as b8,
  Rl as b9,
  pr as ba,
  Ts as bb,
  Mc as bc,
  V1 as bd,
  it as be,
  dg as bf,
  de as bg,
  z1 as bh,
  Dl as bi,
  jd as bj,
  Ps as bk,
  Kd as bl,
  bM as bm,
  oC as bn,
  OB as bo,
  YM as bp,
  _t as c,
  bt as d,
  $d as e,
  Nt as f,
  Ub as g,
  or as h,
  $e as i,
  Nw as j,
  Ds as k,
  H as l,
  vg as m,
  Is as n,
  Xb as o,
  Gb as p,
  Wb as q,
  EM as r,
  Yb as s,
  Cr as t,
  iC as u,
  HM as v,
  ET as w,
  zM as x,
  Fe as y,
  $t as z
};
