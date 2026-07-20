import { o as xt, p as _t, s as vt, g as bt, b as St, a as wt, _ as d, c as lt, b8 as Lt, d as H, ad as Et, q as At, k as Tt } from "./index-B7JHeflJ.js";
import { m as pt, a as ct } from "./min-DLf0xQMm.js";
import { o as Mt } from "./ordinal-DfAQgscy.js";
function nt(t, i) {
  let a = 0;
  if (i === void 0)
    for (let f of t)
      (f = +f) && (a += f);
  else {
    let f = -1;
    for (let y of t)
      (y = +i(y, ++f, t)) && (a += y);
  }
  return a;
}
function Nt(t) {
  for (var i = t.length / 6 | 0, a = new Array(i), f = 0; f < i; ) a[f] = "#" + t.slice(f * 6, ++f * 6);
  return a;
}
const Ct = Nt("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");
function Pt(t) {
  return t.target.depth;
}
function It(t) {
  return t.depth;
}
function Ot(t, i) {
  return i - 1 - t.height;
}
function kt(t, i) {
  return t.sourceLinks.length ? t.depth : i - 1;
}
function $t(t) {
  return t.targetLinks.length ? t.depth : t.sourceLinks.length ? pt(t.sourceLinks, Pt) - 1 : 0;
}
function X(t) {
  return function() {
    return t;
  };
}
function ut(t, i) {
  return Q(t.source, i.source) || t.index - i.index;
}
function ht(t, i) {
  return Q(t.target, i.target) || t.index - i.index;
}
function Q(t, i) {
  return t.y0 - i.y0;
}
function it(t) {
  return t.value;
}
function Dt(t) {
  return t.index;
}
function jt(t) {
  return t.nodes;
}
function zt(t) {
  return t.links;
}
function ft(t, i) {
  const a = t.get(i);
  if (!a) throw new Error("missing: " + i);
  return a;
}
function yt({ nodes: t }) {
  for (const i of t) {
    let a = i.y0, f = a;
    for (const y of i.sourceLinks)
      y.y0 = a + y.width / 2, a += y.width;
    for (const y of i.targetLinks)
      y.y1 = f + y.width / 2, f += y.width;
  }
}
function Bt() {
  let t = 0, i = 0, a = 1, f = 1, y = 24, h = 8, p, m = Dt, s = kt, o, c, x = jt, _ = zt, g = 6;
  function v() {
    const n = { nodes: x.apply(null, arguments), links: _.apply(null, arguments) };
    return T(n), A(n), M(n), I(n), S(n), yt(n), n;
  }
  v.update = function(n) {
    return yt(n), n;
  }, v.nodeId = function(n) {
    return arguments.length ? (m = typeof n == "function" ? n : X(n), v) : m;
  }, v.nodeAlign = function(n) {
    return arguments.length ? (s = typeof n == "function" ? n : X(n), v) : s;
  }, v.nodeSort = function(n) {
    return arguments.length ? (o = n, v) : o;
  }, v.nodeWidth = function(n) {
    return arguments.length ? (y = +n, v) : y;
  }, v.nodePadding = function(n) {
    return arguments.length ? (h = p = +n, v) : h;
  }, v.nodes = function(n) {
    return arguments.length ? (x = typeof n == "function" ? n : X(n), v) : x;
  }, v.links = function(n) {
    return arguments.length ? (_ = typeof n == "function" ? n : X(n), v) : _;
  }, v.linkSort = function(n) {
    return arguments.length ? (c = n, v) : c;
  }, v.size = function(n) {
    return arguments.length ? (t = i = 0, a = +n[0], f = +n[1], v) : [a - t, f - i];
  }, v.extent = function(n) {
    return arguments.length ? (t = +n[0][0], a = +n[1][0], i = +n[0][1], f = +n[1][1], v) : [[t, i], [a, f]];
  }, v.iterations = function(n) {
    return arguments.length ? (g = +n, v) : g;
  };
  function T({ nodes: n, links: u }) {
    for (const [e, r] of n.entries())
      r.index = e, r.sourceLinks = [], r.targetLinks = [];
    const l = new Map(n.map((e, r) => [m(e, r, n), e]));
    for (const [e, r] of u.entries()) {
      r.index = e;
      let { source: k, target: b } = r;
      typeof k != "object" && (k = r.source = ft(l, k)), typeof b != "object" && (b = r.target = ft(l, b)), k.sourceLinks.push(r), b.targetLinks.push(r);
    }
    if (c != null)
      for (const { sourceLinks: e, targetLinks: r } of n)
        e.sort(c), r.sort(c);
  }
  function A({ nodes: n }) {
    for (const u of n)
      u.value = u.fixedValue === void 0 ? Math.max(nt(u.sourceLinks, it), nt(u.targetLinks, it)) : u.fixedValue;
  }
  function M({ nodes: n }) {
    const u = n.length;
    let l = new Set(n), e = /* @__PURE__ */ new Set(), r = 0;
    for (; l.size; ) {
      for (const k of l) {
        k.depth = r;
        for (const { target: b } of k.sourceLinks)
          e.add(b);
      }
      if (++r > u) throw new Error("circular link");
      l = e, e = /* @__PURE__ */ new Set();
    }
  }
  function I({ nodes: n }) {
    const u = n.length;
    let l = new Set(n), e = /* @__PURE__ */ new Set(), r = 0;
    for (; l.size; ) {
      for (const k of l) {
        k.height = r;
        for (const { source: b } of k.targetLinks)
          e.add(b);
      }
      if (++r > u) throw new Error("circular link");
      l = e, e = /* @__PURE__ */ new Set();
    }
  }
  function N({ nodes: n }) {
    const u = ct(n, (r) => r.depth) + 1, l = (a - t - y) / (u - 1), e = new Array(u);
    for (const r of n) {
      const k = Math.max(0, Math.min(u - 1, Math.floor(s.call(null, r, u))));
      r.layer = k, r.x0 = t + k * l, r.x1 = r.x0 + y, e[k] ? e[k].push(r) : e[k] = [r];
    }
    if (o) for (const r of e)
      r.sort(o);
    return e;
  }
  function D(n) {
    const u = pt(n, (l) => (f - i - (l.length - 1) * p) / nt(l, it));
    for (const l of n) {
      let e = i;
      for (const r of l) {
        r.y0 = e, r.y1 = e + r.value * u, e = r.y1 + p;
        for (const k of r.sourceLinks)
          k.width = k.value * u;
      }
      e = (f - e + p) / (l.length + 1);
      for (let r = 0; r < l.length; ++r) {
        const k = l[r];
        k.y0 += e * (r + 1), k.y1 += e * (r + 1);
      }
      w(l);
    }
  }
  function S(n) {
    const u = N(n);
    p = Math.min(h, (f - i) / (ct(u, (l) => l.length) - 1)), D(u);
    for (let l = 0; l < g; ++l) {
      const e = Math.pow(0.99, l), r = Math.max(1 - e, (l + 1) / g);
      R(u, e, r), C(u, e, r);
    }
  }
  function C(n, u, l) {
    for (let e = 1, r = n.length; e < r; ++e) {
      const k = n[e];
      for (const b of k) {
        let L = 0, B = 0;
        for (const { source: Y, value: et } of b.targetLinks) {
          let q = et * (b.layer - Y.layer);
          L += P(Y, b) * q, B += q;
        }
        if (!(B > 0)) continue;
        let U = (L / B - b.y0) * u;
        b.y0 += U, b.y1 += U, z(b);
      }
      o === void 0 && k.sort(Q), j(k, l);
    }
  }
  function R(n, u, l) {
    for (let e = n.length, r = e - 2; r >= 0; --r) {
      const k = n[r];
      for (const b of k) {
        let L = 0, B = 0;
        for (const { target: Y, value: et } of b.sourceLinks) {
          let q = et * (Y.layer - b.layer);
          L += E(b, Y) * q, B += q;
        }
        if (!(B > 0)) continue;
        let U = (L / B - b.y0) * u;
        b.y0 += U, b.y1 += U, z(b);
      }
      o === void 0 && k.sort(Q), j(k, l);
    }
  }
  function j(n, u) {
    const l = n.length >> 1, e = n[l];
    O(n, e.y0 - p, l - 1, u), V(n, e.y1 + p, l + 1, u), O(n, f, n.length - 1, u), V(n, i, 0, u);
  }
  function V(n, u, l, e) {
    for (; l < n.length; ++l) {
      const r = n[l], k = (u - r.y0) * e;
      k > 1e-6 && (r.y0 += k, r.y1 += k), u = r.y1 + p;
    }
  }
  function O(n, u, l, e) {
    for (; l >= 0; --l) {
      const r = n[l], k = (r.y1 - u) * e;
      k > 1e-6 && (r.y0 -= k, r.y1 -= k), u = r.y0 - p;
    }
  }
  function z({ sourceLinks: n, targetLinks: u }) {
    if (c === void 0) {
      for (const { source: { sourceLinks: l } } of u)
        l.sort(ht);
      for (const { target: { targetLinks: l } } of n)
        l.sort(ut);
    }
  }
  function w(n) {
    if (c === void 0)
      for (const { sourceLinks: u, targetLinks: l } of n)
        u.sort(ht), l.sort(ut);
  }
  function P(n, u) {
    let l = n.y0 - (n.sourceLinks.length - 1) * p / 2;
    for (const { target: e, width: r } of n.sourceLinks) {
      if (e === u) break;
      l += r + p;
    }
    for (const { source: e, width: r } of u.targetLinks) {
      if (e === n) break;
      l -= r;
    }
    return l;
  }
  function E(n, u) {
    let l = u.y0 - (u.targetLinks.length - 1) * p / 2;
    for (const { source: e, width: r } of u.targetLinks) {
      if (e === n) break;
      l += r + p;
    }
    for (const { target: e, width: r } of n.sourceLinks) {
      if (e === u) break;
      l -= r;
    }
    return l;
  }
  return v;
}
var rt = Math.PI, st = 2 * rt, F = 1e-6, Ft = st - F;
function ot() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null, this._ = "";
}
function mt() {
  return new ot();
}
ot.prototype = mt.prototype = {
  constructor: ot,
  moveTo: function(t, i) {
    this._ += "M" + (this._x0 = this._x1 = +t) + "," + (this._y0 = this._y1 = +i);
  },
  closePath: function() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._ += "Z");
  },
  lineTo: function(t, i) {
    this._ += "L" + (this._x1 = +t) + "," + (this._y1 = +i);
  },
  quadraticCurveTo: function(t, i, a, f) {
    this._ += "Q" + +t + "," + +i + "," + (this._x1 = +a) + "," + (this._y1 = +f);
  },
  bezierCurveTo: function(t, i, a, f, y, h) {
    this._ += "C" + +t + "," + +i + "," + +a + "," + +f + "," + (this._x1 = +y) + "," + (this._y1 = +h);
  },
  arcTo: function(t, i, a, f, y) {
    t = +t, i = +i, a = +a, f = +f, y = +y;
    var h = this._x1, p = this._y1, m = a - t, s = f - i, o = h - t, c = p - i, x = o * o + c * c;
    if (y < 0) throw new Error("negative radius: " + y);
    if (this._x1 === null)
      this._ += "M" + (this._x1 = t) + "," + (this._y1 = i);
    else if (x > F) if (!(Math.abs(c * m - s * o) > F) || !y)
      this._ += "L" + (this._x1 = t) + "," + (this._y1 = i);
    else {
      var _ = a - h, g = f - p, v = m * m + s * s, T = _ * _ + g * g, A = Math.sqrt(v), M = Math.sqrt(x), I = y * Math.tan((rt - Math.acos((v + x - T) / (2 * A * M))) / 2), N = I / M, D = I / A;
      Math.abs(N - 1) > F && (this._ += "L" + (t + N * o) + "," + (i + N * c)), this._ += "A" + y + "," + y + ",0,0," + +(c * _ > o * g) + "," + (this._x1 = t + D * m) + "," + (this._y1 = i + D * s);
    }
  },
  arc: function(t, i, a, f, y, h) {
    t = +t, i = +i, a = +a, h = !!h;
    var p = a * Math.cos(f), m = a * Math.sin(f), s = t + p, o = i + m, c = 1 ^ h, x = h ? f - y : y - f;
    if (a < 0) throw new Error("negative radius: " + a);
    this._x1 === null ? this._ += "M" + s + "," + o : (Math.abs(this._x1 - s) > F || Math.abs(this._y1 - o) > F) && (this._ += "L" + s + "," + o), a && (x < 0 && (x = x % st + st), x > Ft ? this._ += "A" + a + "," + a + ",0,1," + c + "," + (t - p) + "," + (i - m) + "A" + a + "," + a + ",0,1," + c + "," + (this._x1 = s) + "," + (this._y1 = o) : x > F && (this._ += "A" + a + "," + a + ",0," + +(x >= rt) + "," + c + "," + (this._x1 = t + a * Math.cos(y)) + "," + (this._y1 = i + a * Math.sin(y))));
  },
  rect: function(t, i, a, f) {
    this._ += "M" + (this._x0 = this._x1 = +t) + "," + (this._y0 = this._y1 = +i) + "h" + +a + "v" + +f + "h" + -a + "Z";
  },
  toString: function() {
    return this._;
  }
};
function dt(t) {
  return function() {
    return t;
  };
}
function Rt(t) {
  return t[0];
}
function Vt(t) {
  return t[1];
}
var Wt = Array.prototype.slice;
function Gt(t) {
  return t.source;
}
function Ut(t) {
  return t.target;
}
function Yt(t) {
  var i = Gt, a = Ut, f = Rt, y = Vt, h = null;
  function p() {
    var m, s = Wt.call(arguments), o = i.apply(this, s), c = a.apply(this, s);
    if (h || (h = m = mt()), t(h, +f.apply(this, (s[0] = o, s)), +y.apply(this, s), +f.apply(this, (s[0] = c, s)), +y.apply(this, s)), m) return h = null, m + "" || null;
  }
  return p.source = function(m) {
    return arguments.length ? (i = m, p) : i;
  }, p.target = function(m) {
    return arguments.length ? (a = m, p) : a;
  }, p.x = function(m) {
    return arguments.length ? (f = typeof m == "function" ? m : dt(+m), p) : f;
  }, p.y = function(m) {
    return arguments.length ? (y = typeof m == "function" ? m : dt(+m), p) : y;
  }, p.context = function(m) {
    return arguments.length ? (h = m ?? null, p) : h;
  }, p;
}
function qt(t, i, a, f, y) {
  t.moveTo(i, a), t.bezierCurveTo(i = (i + f) / 2, a, i, y, f, y);
}
function Ht() {
  return Yt(qt);
}
function Xt(t) {
  return [t.source.x1, t.y0];
}
function Qt(t) {
  return [t.target.x0, t.y1];
}
function Kt() {
  return Ht().source(Xt).target(Qt);
}
var at = function() {
  var t = /* @__PURE__ */ d(function(m, s, o, c) {
    for (o = o || {}, c = m.length; c--; o[m[c]] = s) ;
    return o;
  }, "o"), i = [1, 9], a = [1, 10], f = [1, 5, 10, 12], y = {
    trace: /* @__PURE__ */ d(function() {
    }, "trace"),
    yy: {},
    symbols_: { error: 2, start: 3, SANKEY: 4, NEWLINE: 5, csv: 6, opt_eof: 7, record: 8, csv_tail: 9, EOF: 10, "field[source]": 11, COMMA: 12, "field[target]": 13, "field[value]": 14, field: 15, escaped: 16, non_escaped: 17, DQUOTE: 18, ESCAPED_TEXT: 19, NON_ESCAPED_TEXT: 20, $accept: 0, $end: 1 },
    terminals_: { 2: "error", 4: "SANKEY", 5: "NEWLINE", 10: "EOF", 11: "field[source]", 12: "COMMA", 13: "field[target]", 14: "field[value]", 18: "DQUOTE", 19: "ESCAPED_TEXT", 20: "NON_ESCAPED_TEXT" },
    productions_: [0, [3, 4], [6, 2], [9, 2], [9, 0], [7, 1], [7, 0], [8, 5], [15, 1], [15, 1], [16, 3], [17, 1]],
    performAction: /* @__PURE__ */ d(function(s, o, c, x, _, g, v) {
      var T = g.length - 1;
      switch (_) {
        case 7:
          const A = x.findOrCreateNode(g[T - 4].trim().replaceAll('""', '"')), M = x.findOrCreateNode(g[T - 2].trim().replaceAll('""', '"')), I = parseFloat(g[T].trim());
          x.addLink(A, M, I);
          break;
        case 8:
        case 9:
        case 11:
          this.$ = g[T];
          break;
        case 10:
          this.$ = g[T - 1];
          break;
      }
    }, "anonymous"),
    table: [{ 3: 1, 4: [1, 2] }, { 1: [3] }, { 5: [1, 3] }, { 6: 4, 8: 5, 15: 6, 16: 7, 17: 8, 18: i, 20: a }, { 1: [2, 6], 7: 11, 10: [1, 12] }, t(a, [2, 4], { 9: 13, 5: [1, 14] }), { 12: [1, 15] }, t(f, [2, 8]), t(f, [2, 9]), { 19: [1, 16] }, t(f, [2, 11]), { 1: [2, 1] }, { 1: [2, 5] }, t(a, [2, 2]), { 6: 17, 8: 5, 15: 6, 16: 7, 17: 8, 18: i, 20: a }, { 15: 18, 16: 7, 17: 8, 18: i, 20: a }, { 18: [1, 19] }, t(a, [2, 3]), { 12: [1, 20] }, t(f, [2, 10]), { 15: 21, 16: 7, 17: 8, 18: i, 20: a }, t([1, 5, 10], [2, 7])],
    defaultActions: { 11: [2, 1], 12: [2, 5] },
    parseError: /* @__PURE__ */ d(function(s, o) {
      if (o.recoverable)
        this.trace(s);
      else {
        var c = new Error(s);
        throw c.hash = o, c;
      }
    }, "parseError"),
    parse: /* @__PURE__ */ d(function(s) {
      var o = this, c = [0], x = [], _ = [null], g = [], v = this.table, T = "", A = 0, M = 0, I = 2, N = 1, D = g.slice.call(arguments, 1), S = Object.create(this.lexer), C = { yy: {} };
      for (var R in this.yy)
        Object.prototype.hasOwnProperty.call(this.yy, R) && (C.yy[R] = this.yy[R]);
      S.setInput(s, C.yy), C.yy.lexer = S, C.yy.parser = this, typeof S.yylloc > "u" && (S.yylloc = {});
      var j = S.yylloc;
      g.push(j);
      var V = S.options && S.options.ranges;
      typeof C.yy.parseError == "function" ? this.parseError = C.yy.parseError : this.parseError = Object.getPrototypeOf(this).parseError;
      function O(L) {
        c.length = c.length - 2 * L, _.length = _.length - L, g.length = g.length - L;
      }
      d(O, "popStack");
      function z() {
        var L;
        return L = x.pop() || S.lex() || N, typeof L != "number" && (L instanceof Array && (x = L, L = x.pop()), L = o.symbols_[L] || L), L;
      }
      d(z, "lex");
      for (var w, P, E, n, u = {}, l, e, r, k; ; ) {
        if (P = c[c.length - 1], this.defaultActions[P] ? E = this.defaultActions[P] : ((w === null || typeof w > "u") && (w = z()), E = v[P] && v[P][w]), typeof E > "u" || !E.length || !E[0]) {
          var b = "";
          k = [];
          for (l in v[P])
            this.terminals_[l] && l > I && k.push("'" + this.terminals_[l] + "'");
          S.showPosition ? b = "Parse error on line " + (A + 1) + `:
` + S.showPosition() + `
Expecting ` + k.join(", ") + ", got '" + (this.terminals_[w] || w) + "'" : b = "Parse error on line " + (A + 1) + ": Unexpected " + (w == N ? "end of input" : "'" + (this.terminals_[w] || w) + "'"), this.parseError(b, {
            text: S.match,
            token: this.terminals_[w] || w,
            line: S.yylineno,
            loc: j,
            expected: k
          });
        }
        if (E[0] instanceof Array && E.length > 1)
          throw new Error("Parse Error: multiple actions possible at state: " + P + ", token: " + w);
        switch (E[0]) {
          case 1:
            c.push(w), _.push(S.yytext), g.push(S.yylloc), c.push(E[1]), w = null, M = S.yyleng, T = S.yytext, A = S.yylineno, j = S.yylloc;
            break;
          case 2:
            if (e = this.productions_[E[1]][1], u.$ = _[_.length - e], u._$ = {
              first_line: g[g.length - (e || 1)].first_line,
              last_line: g[g.length - 1].last_line,
              first_column: g[g.length - (e || 1)].first_column,
              last_column: g[g.length - 1].last_column
            }, V && (u._$.range = [
              g[g.length - (e || 1)].range[0],
              g[g.length - 1].range[1]
            ]), n = this.performAction.apply(u, [
              T,
              M,
              A,
              C.yy,
              E[1],
              _,
              g
            ].concat(D)), typeof n < "u")
              return n;
            e && (c = c.slice(0, -1 * e * 2), _ = _.slice(0, -1 * e), g = g.slice(0, -1 * e)), c.push(this.productions_[E[1]][0]), _.push(u.$), g.push(u._$), r = v[c[c.length - 2]][c[c.length - 1]], c.push(r);
            break;
          case 3:
            return !0;
        }
      }
      return !0;
    }, "parse")
  }, h = /* @__PURE__ */ function() {
    var m = {
      EOF: 1,
      parseError: /* @__PURE__ */ d(function(o, c) {
        if (this.yy.parser)
          this.yy.parser.parseError(o, c);
        else
          throw new Error(o);
      }, "parseError"),
      // resets the lexer, sets new input
      setInput: /* @__PURE__ */ d(function(s, o) {
        return this.yy = o || this.yy || {}, this._input = s, this._more = this._backtrack = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this;
      }, "setInput"),
      // consumes and returns one char from the input
      input: /* @__PURE__ */ d(function() {
        var s = this._input[0];
        this.yytext += s, this.yyleng++, this.offset++, this.match += s, this.matched += s;
        var o = s.match(/(?:\r\n?|\n).*/g);
        return o ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), s;
      }, "input"),
      // unshifts one char (or a string) into the input
      unput: /* @__PURE__ */ d(function(s) {
        var o = s.length, c = s.split(/(?:\r\n?|\n)/g);
        this._input = s + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - o), this.offset -= o;
        var x = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), c.length - 1 && (this.yylineno -= c.length - 1);
        var _ = this.yylloc.range;
        return this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: c ? (c.length === x.length ? this.yylloc.first_column : 0) + x[x.length - c.length].length - c[0].length : this.yylloc.first_column - o
        }, this.options.ranges && (this.yylloc.range = [_[0], _[0] + this.yyleng - o]), this.yyleng = this.yytext.length, this;
      }, "unput"),
      // When called from action, caches matched text and appends it on next action
      more: /* @__PURE__ */ d(function() {
        return this._more = !0, this;
      }, "more"),
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: /* @__PURE__ */ d(function() {
        if (this.options.backtrack_lexer)
          this._backtrack = !0;
        else
          return this.parseError("Lexical error on line " + (this.yylineno + 1) + `. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
` + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        return this;
      }, "reject"),
      // retain first n characters of the match
      less: /* @__PURE__ */ d(function(s) {
        this.unput(this.match.slice(s));
      }, "less"),
      // displays already matched input, i.e. for error messages
      pastInput: /* @__PURE__ */ d(function() {
        var s = this.matched.substr(0, this.matched.length - this.match.length);
        return (s.length > 20 ? "..." : "") + s.substr(-20).replace(/\n/g, "");
      }, "pastInput"),
      // displays upcoming input, i.e. for error messages
      upcomingInput: /* @__PURE__ */ d(function() {
        var s = this.match;
        return s.length < 20 && (s += this._input.substr(0, 20 - s.length)), (s.substr(0, 20) + (s.length > 20 ? "..." : "")).replace(/\n/g, "");
      }, "upcomingInput"),
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: /* @__PURE__ */ d(function() {
        var s = this.pastInput(), o = new Array(s.length + 1).join("-");
        return s + this.upcomingInput() + `
` + o + "^";
      }, "showPosition"),
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: /* @__PURE__ */ d(function(s, o) {
        var c, x, _;
        if (this.options.backtrack_lexer && (_ = {
          yylineno: this.yylineno,
          yylloc: {
            first_line: this.yylloc.first_line,
            last_line: this.last_line,
            first_column: this.yylloc.first_column,
            last_column: this.yylloc.last_column
          },
          yytext: this.yytext,
          match: this.match,
          matches: this.matches,
          matched: this.matched,
          yyleng: this.yyleng,
          offset: this.offset,
          _more: this._more,
          _input: this._input,
          yy: this.yy,
          conditionStack: this.conditionStack.slice(0),
          done: this.done
        }, this.options.ranges && (_.yylloc.range = this.yylloc.range.slice(0))), x = s[0].match(/(?:\r\n?|\n).*/g), x && (this.yylineno += x.length), this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: x ? x[x.length - 1].length - x[x.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + s[0].length
        }, this.yytext += s[0], this.match += s[0], this.matches = s, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._backtrack = !1, this._input = this._input.slice(s[0].length), this.matched += s[0], c = this.performAction.call(this, this.yy, this, o, this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), c)
          return c;
        if (this._backtrack) {
          for (var g in _)
            this[g] = _[g];
          return !1;
        }
        return !1;
      }, "test_match"),
      // return next match in input
      next: /* @__PURE__ */ d(function() {
        if (this.done)
          return this.EOF;
        this._input || (this.done = !0);
        var s, o, c, x;
        this._more || (this.yytext = "", this.match = "");
        for (var _ = this._currentRules(), g = 0; g < _.length; g++)
          if (c = this._input.match(this.rules[_[g]]), c && (!o || c[0].length > o[0].length)) {
            if (o = c, x = g, this.options.backtrack_lexer) {
              if (s = this.test_match(c, _[g]), s !== !1)
                return s;
              if (this._backtrack) {
                o = !1;
                continue;
              } else
                return !1;
            } else if (!this.options.flex)
              break;
          }
        return o ? (s = this.test_match(o, _[x]), s !== !1 ? s : !1) : this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + `. Unrecognized text.
` + this.showPosition(), {
          text: "",
          token: null,
          line: this.yylineno
        });
      }, "next"),
      // return next match that has a token
      lex: /* @__PURE__ */ d(function() {
        var o = this.next();
        return o || this.lex();
      }, "lex"),
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: /* @__PURE__ */ d(function(o) {
        this.conditionStack.push(o);
      }, "begin"),
      // pop the previously active lexer condition state off the condition stack
      popState: /* @__PURE__ */ d(function() {
        var o = this.conditionStack.length - 1;
        return o > 0 ? this.conditionStack.pop() : this.conditionStack[0];
      }, "popState"),
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: /* @__PURE__ */ d(function() {
        return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1] ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules : this.conditions.INITIAL.rules;
      }, "_currentRules"),
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: /* @__PURE__ */ d(function(o) {
        return o = this.conditionStack.length - 1 - Math.abs(o || 0), o >= 0 ? this.conditionStack[o] : "INITIAL";
      }, "topState"),
      // alias for begin(condition)
      pushState: /* @__PURE__ */ d(function(o) {
        this.begin(o);
      }, "pushState"),
      // return the number of states currently on the stack
      stateStackSize: /* @__PURE__ */ d(function() {
        return this.conditionStack.length;
      }, "stateStackSize"),
      options: { "case-insensitive": !0 },
      performAction: /* @__PURE__ */ d(function(o, c, x, _) {
        switch (x) {
          case 0:
            return this.pushState("csv"), 4;
          case 1:
            return this.pushState("csv"), 4;
          case 2:
            return 10;
          case 3:
            return 5;
          case 4:
            return 12;
          case 5:
            return this.pushState("escaped_text"), 18;
          case 6:
            return 20;
          case 7:
            return this.popState("escaped_text"), 18;
          case 8:
            return 19;
        }
      }, "anonymous"),
      rules: [/^(?:sankey-beta\b)/i, /^(?:sankey\b)/i, /^(?:$)/i, /^(?:((\u000D\u000A)|(\u000A)))/i, /^(?:(\u002C))/i, /^(?:(\u0022))/i, /^(?:([\u0020-\u0021\u0023-\u002B\u002D-\u007E])*)/i, /^(?:(\u0022)(?!(\u0022)))/i, /^(?:(([\u0020-\u0021\u0023-\u002B\u002D-\u007E])|(\u002C)|(\u000D)|(\u000A)|(\u0022)(\u0022))*)/i],
      conditions: { csv: { rules: [2, 3, 4, 5, 6, 7, 8], inclusive: !1 }, escaped_text: { rules: [7, 8], inclusive: !1 }, INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8], inclusive: !0 } }
    };
    return m;
  }();
  y.lexer = h;
  function p() {
    this.yy = {};
  }
  return d(p, "Parser"), p.prototype = y, y.Parser = p, new p();
}();
at.parser = at;
var K = at, J = [], tt = [], Z = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ d(() => {
  J = [], tt = [], Z = /* @__PURE__ */ new Map(), At();
}, "clear"), W, Jt = (W = class {
  constructor(i, a, f = 0) {
    this.source = i, this.target = a, this.value = f;
  }
}, d(W, "SankeyLink"), W), te = /* @__PURE__ */ d((t, i, a) => {
  J.push(new Jt(t, i, a));
}, "addLink"), G, ee = (G = class {
  constructor(i) {
    this.ID = i;
  }
}, d(G, "SankeyNode"), G), ne = /* @__PURE__ */ d((t) => {
  t = Tt.sanitizeText(t, lt());
  let i = Z.get(t);
  return i === void 0 && (i = new ee(t), Z.set(t, i), tt.push(i)), i;
}, "findOrCreateNode"), ie = /* @__PURE__ */ d(() => tt, "getNodes"), re = /* @__PURE__ */ d(() => J, "getLinks"), se = /* @__PURE__ */ d(() => ({
  nodes: tt.map((t) => ({ id: t.ID })),
  links: J.map((t) => ({
    source: t.source.ID,
    target: t.target.ID,
    value: t.value
  }))
}), "getGraph"), oe = {
  nodesMap: Z,
  getConfig: /* @__PURE__ */ d(() => lt().sankey, "getConfig"),
  getNodes: ie,
  getLinks: re,
  getGraph: se,
  addLink: te,
  findOrCreateNode: ne,
  getAccTitle: wt,
  setAccTitle: St,
  getAccDescription: bt,
  setAccDescription: vt,
  getDiagramTitle: _t,
  setDiagramTitle: xt,
  clear: Zt
}, $, gt = ($ = class {
  static next(i) {
    return new $(i + ++$.count);
  }
  constructor(i) {
    this.id = i, this.href = `#${i}`;
  }
  toString() {
    return "url(" + this.href + ")";
  }
}, d($, "Uid"), $.count = 0, $), ae = {
  left: It,
  right: Ot,
  center: $t,
  justify: kt
}, le = /* @__PURE__ */ d((t) => {
  let i = 0, a = 0;
  for (const f of t) {
    const y = f.value ?? 0;
    y > i && (i = y, a = f.layer ?? 0);
  }
  return a;
}, "findCentralNodeLayer"), ce = /* @__PURE__ */ d(function(t, i, a, f) {
  const { securityLevel: y, sankey: h } = lt(), p = Lt.sankey;
  let m;
  y === "sandbox" && (m = H("#i" + i));
  const s = y === "sandbox" ? H(m.nodes()[0].contentDocument.body) : H("body"), o = y === "sandbox" ? s.select(`[id="${i}"]`) : H(`[id="${i}"]`), c = (h == null ? void 0 : h.width) ?? p.width, x = (h == null ? void 0 : h.height) ?? p.width, _ = (h == null ? void 0 : h.useMaxWidth) ?? p.useMaxWidth, g = (h == null ? void 0 : h.nodeAlignment) ?? p.nodeAlignment, v = (h == null ? void 0 : h.prefix) ?? p.prefix, T = (h == null ? void 0 : h.suffix) ?? p.suffix, A = (h == null ? void 0 : h.showValues) ?? p.showValues, M = (h == null ? void 0 : h.nodeWidth) ?? p.nodeWidth ?? 10, I = (h == null ? void 0 : h.nodePadding) ?? p.nodePadding ?? 12, N = (h == null ? void 0 : h.labelStyle) ?? p.labelStyle ?? "legacy", D = (h == null ? void 0 : h.nodeColors) ?? {}, S = f.db.getGraph(), C = ae[g];
  Bt().nodeId((e) => e.id).nodeWidth(M).nodePadding(I + (A ? 15 : 0)).nodeAlign(C).extent([
    [0, 0],
    [c, x]
  ])(S);
  const j = le(S.nodes), V = Mt(Ct), O = /* @__PURE__ */ d((e) => D[e] ?? V(e), "getNodeColor");
  o.append("g").attr("class", "nodes").selectAll(".node").data(S.nodes).join("g").attr("class", "node").attr("id", (e) => (e.uid = gt.next("node-")).id).attr("transform", function(e) {
    return "translate(" + e.x0 + "," + e.y0 + ")";
  }).attr("x", (e) => e.x0).attr("y", (e) => e.y0).append("rect").attr("height", (e) => e.y1 - e.y0).attr("width", (e) => e.x1 - e.x0).attr("fill", (e) => O(e.id));
  const z = /* @__PURE__ */ d(({ id: e, value: r }) => A ? `${e}
${v}${Math.round(r * 100) / 100}${T}` : e, "getText"), w = /* @__PURE__ */ d((e) => N === "outlined" ? (e.layer ?? 0) < j ? { x: e.x0 - 6, anchor: "end" } : { x: e.x1 + 6, anchor: "start" } : e.x0 < c / 2 ? { x: e.x1 + 6, anchor: "start" } : { x: e.x0 - 6, anchor: "end" }, "getLabelPosition"), P = o.append("g").attr("class", "node-labels").attr("font-size", 14), E = /* @__PURE__ */ d((e) => P.selectAll(e ? `.${e}` : "text").data(S.nodes).join("text").attr("class", e ?? null).attr("x", (r) => w(r).x).attr("y", (r) => (r.y1 + r.y0) / 2).attr("dy", `${A ? "0" : "0.35"}em`).attr("text-anchor", (r) => w(r).anchor).text(z), "appendLabel");
  N === "outlined" ? (E("sankey-label-bg"), E("sankey-label-fg")) : E();
  const n = o.append("g").attr("class", "links").attr("fill", "none").attr("stroke-opacity", 0.5).selectAll(".link").data(S.links).join("g").attr("class", "link").style("mix-blend-mode", "multiply"), u = (h == null ? void 0 : h.linkColor) ?? "gradient";
  if (u === "gradient") {
    const e = n.append("linearGradient").attr("id", (r) => (r.uid = gt.next("linearGradient-")).id).attr("gradientUnits", "userSpaceOnUse").attr("x1", (r) => r.source.x1).attr("x2", (r) => r.target.x0);
    e.append("stop").attr("offset", "0%").attr("stop-color", (r) => O(r.source.id)), e.append("stop").attr("offset", "100%").attr("stop-color", (r) => O(r.target.id));
  }
  let l;
  switch (u) {
    case "gradient":
      l = /* @__PURE__ */ d((e) => e.uid, "coloring");
      break;
    case "source":
      l = /* @__PURE__ */ d((e) => O(e.source.id), "coloring");
      break;
    case "target":
      l = /* @__PURE__ */ d((e) => O(e.target.id), "coloring");
      break;
    default:
      l = u;
  }
  n.append("path").attr("d", Kt()).attr("stroke", l).attr("stroke-width", (e) => Math.max(1, e.width)), Et(void 0, o, 0, _);
}, "draw"), ue = {
  draw: ce
}, he = /* @__PURE__ */ d((t) => t.replaceAll(/^[^\S\n\r]+|[^\S\n\r]+$/g, "").replaceAll(/([\n\r])+/g, `
`).trim(), "prepareTextForParsing"), fe = /* @__PURE__ */ d((t) => `.label {
    font-family: ${t.fontFamily};
  }

  .node-labels {
    font-family: ${t.fontFamily};
  }

  /* Outlined label style - background stroke for better readability */
  .sankey-label-bg {
    stroke: ${t.mainBkg || t.background || "#fff"};
    stroke-width: 4px;
    stroke-linejoin: round;
    paint-order: stroke;
  }

  /* Foreground label text */
  .sankey-label-fg {
    fill: ${t.textColor};
  }

  /* Node styling */
  .node rect {
    shape-rendering: crispEdges;
  }

  /* Link styling */
  .link {
    fill: none;
    stroke-opacity: 0.5;
    mix-blend-mode: multiply;
  }
`, "getStyles"), ye = fe, de = K.parse.bind(K);
K.parse = (t) => de(he(t));
var me = {
  styles: ye,
  parser: K,
  db: oe,
  renderer: ue
};
export {
  me as diagram
};
