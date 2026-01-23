import _t, { app as St, BrowserWindow as Mo, ipcMain as ve, shell as If } from "electron";
import Ft from "node:path";
import { fileURLToPath as Nf } from "node:url";
import * as xf from "dotenv";
import Ke from "fs";
import Lf from "constants";
import Ar from "stream";
import Xr from "util";
import Vu from "assert";
import Ie from "path";
import Cr from "child_process";
import Kr from "events";
import Tr from "crypto";
import Yu from "tty";
import bt from "os";
import Vt from "url";
import Ff from "string_decoder";
import Ju from "zlib";
import Xu from "http";
import Uf from "https";
import { chromium as $f } from "playwright";
import ha from "node:fs";
import kf from "axios";
var at = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ku(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Dt = {}, un = {}, $r = {}, pa;
function Qe() {
  return pa || (pa = 1, $r.fromCallback = function(t) {
    return Object.defineProperty(function(...o) {
      if (typeof o[o.length - 1] == "function") t.apply(this, o);
      else
        return new Promise((l, u) => {
          o.push((n, i) => n != null ? u(n) : l(i)), t.apply(this, o);
        });
    }, "name", { value: t.name });
  }, $r.fromPromise = function(t) {
    return Object.defineProperty(function(...o) {
      const l = o[o.length - 1];
      if (typeof l != "function") return t.apply(this, o);
      o.pop(), t.apply(this, o).then((u) => l(null, u), l);
    }, "name", { value: t.name });
  }), $r;
}
var cn, ma;
function qf() {
  if (ma) return cn;
  ma = 1;
  var t = Lf, o = process.cwd, l = null, u = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return l || (l = o.call(process)), l;
  };
  try {
    process.cwd();
  } catch {
  }
  if (typeof process.chdir == "function") {
    var n = process.chdir;
    process.chdir = function(e) {
      l = null, n.call(process, e);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, n);
  }
  cn = i;
  function i(e) {
    t.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && f(e), e.lutimes || r(e), e.chown = d(e.chown), e.fchown = d(e.fchown), e.lchown = d(e.lchown), e.chmod = s(e.chmod), e.fchmod = s(e.fchmod), e.lchmod = s(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = a(e.chmodSync), e.fchmodSync = a(e.fchmodSync), e.lchmodSync = a(e.lchmodSync), e.stat = p(e.stat), e.fstat = p(e.fstat), e.lstat = p(e.lstat), e.statSync = y(e.statSync), e.fstatSync = y(e.fstatSync), e.lstatSync = y(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(m, E, A) {
      A && process.nextTick(A);
    }, e.lchmodSync = function() {
    }), e.chown && !e.lchown && (e.lchown = function(m, E, A, O) {
      O && process.nextTick(O);
    }, e.lchownSync = function() {
    }), u === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : (function(m) {
      function E(A, O, P) {
        var $ = Date.now(), T = 0;
        m(A, O, function _(b) {
          if (b && (b.code === "EACCES" || b.code === "EPERM" || b.code === "EBUSY") && Date.now() - $ < 6e4) {
            setTimeout(function() {
              e.stat(O, function(w, q) {
                w && w.code === "ENOENT" ? m(A, O, _) : P(b);
              });
            }, T), T < 100 && (T += 10);
            return;
          }
          P && P(b);
        });
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(E, m), E;
    })(e.rename)), e.read = typeof e.read != "function" ? e.read : (function(m) {
      function E(A, O, P, $, T, _) {
        var b;
        if (_ && typeof _ == "function") {
          var w = 0;
          b = function(q, U, F) {
            if (q && q.code === "EAGAIN" && w < 10)
              return w++, m.call(e, A, O, P, $, T, b);
            _.apply(this, arguments);
          };
        }
        return m.call(e, A, O, P, $, T, b);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(E, m), E;
    })(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ (function(m) {
      return function(E, A, O, P, $) {
        for (var T = 0; ; )
          try {
            return m.call(e, E, A, O, P, $);
          } catch (_) {
            if (_.code === "EAGAIN" && T < 10) {
              T++;
              continue;
            }
            throw _;
          }
      };
    })(e.readSync);
    function f(m) {
      m.lchmod = function(E, A, O) {
        m.open(
          E,
          t.O_WRONLY | t.O_SYMLINK,
          A,
          function(P, $) {
            if (P) {
              O && O(P);
              return;
            }
            m.fchmod($, A, function(T) {
              m.close($, function(_) {
                O && O(T || _);
              });
            });
          }
        );
      }, m.lchmodSync = function(E, A) {
        var O = m.openSync(E, t.O_WRONLY | t.O_SYMLINK, A), P = !0, $;
        try {
          $ = m.fchmodSync(O, A), P = !1;
        } finally {
          if (P)
            try {
              m.closeSync(O);
            } catch {
            }
          else
            m.closeSync(O);
        }
        return $;
      };
    }
    function r(m) {
      t.hasOwnProperty("O_SYMLINK") && m.futimes ? (m.lutimes = function(E, A, O, P) {
        m.open(E, t.O_SYMLINK, function($, T) {
          if ($) {
            P && P($);
            return;
          }
          m.futimes(T, A, O, function(_) {
            m.close(T, function(b) {
              P && P(_ || b);
            });
          });
        });
      }, m.lutimesSync = function(E, A, O) {
        var P = m.openSync(E, t.O_SYMLINK), $, T = !0;
        try {
          $ = m.futimesSync(P, A, O), T = !1;
        } finally {
          if (T)
            try {
              m.closeSync(P);
            } catch {
            }
          else
            m.closeSync(P);
        }
        return $;
      }) : m.futimes && (m.lutimes = function(E, A, O, P) {
        P && process.nextTick(P);
      }, m.lutimesSync = function() {
      });
    }
    function s(m) {
      return m && function(E, A, O) {
        return m.call(e, E, A, function(P) {
          g(P) && (P = null), O && O.apply(this, arguments);
        });
      };
    }
    function a(m) {
      return m && function(E, A) {
        try {
          return m.call(e, E, A);
        } catch (O) {
          if (!g(O)) throw O;
        }
      };
    }
    function d(m) {
      return m && function(E, A, O, P) {
        return m.call(e, E, A, O, function($) {
          g($) && ($ = null), P && P.apply(this, arguments);
        });
      };
    }
    function c(m) {
      return m && function(E, A, O) {
        try {
          return m.call(e, E, A, O);
        } catch (P) {
          if (!g(P)) throw P;
        }
      };
    }
    function p(m) {
      return m && function(E, A, O) {
        typeof A == "function" && (O = A, A = null);
        function P($, T) {
          T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), O && O.apply(this, arguments);
        }
        return A ? m.call(e, E, A, P) : m.call(e, E, P);
      };
    }
    function y(m) {
      return m && function(E, A) {
        var O = A ? m.call(e, E, A) : m.call(e, E);
        return O && (O.uid < 0 && (O.uid += 4294967296), O.gid < 0 && (O.gid += 4294967296)), O;
      };
    }
    function g(m) {
      if (!m || m.code === "ENOSYS")
        return !0;
      var E = !process.getuid || process.getuid() !== 0;
      return !!(E && (m.code === "EINVAL" || m.code === "EPERM"));
    }
  }
  return cn;
}
var fn, ga;
function Mf() {
  if (ga) return fn;
  ga = 1;
  var t = Ar.Stream;
  fn = o;
  function o(l) {
    return {
      ReadStream: u,
      WriteStream: n
    };
    function u(i, e) {
      if (!(this instanceof u)) return new u(i, e);
      t.call(this);
      var f = this;
      this.path = i, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, e = e || {};
      for (var r = Object.keys(e), s = 0, a = r.length; s < a; s++) {
        var d = r[s];
        this[d] = e[d];
      }
      if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw TypeError("end must be a Number");
        if (this.start > this.end)
          throw new Error("start must be <= end");
        this.pos = this.start;
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          f._read();
        });
        return;
      }
      l.open(this.path, this.flags, this.mode, function(c, p) {
        if (c) {
          f.emit("error", c), f.readable = !1;
          return;
        }
        f.fd = p, f.emit("open", p), f._read();
      });
    }
    function n(i, e) {
      if (!(this instanceof n)) return new n(i, e);
      t.call(this), this.path = i, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, e = e || {};
      for (var f = Object.keys(e), r = 0, s = f.length; r < s; r++) {
        var a = f[r];
        this[a] = e[a];
      }
      if (this.start !== void 0) {
        if (typeof this.start != "number")
          throw TypeError("start must be a Number");
        if (this.start < 0)
          throw new Error("start must be >= zero");
        this.pos = this.start;
      }
      this.busy = !1, this._queue = [], this.fd === null && (this._open = l.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
    }
  }
  return fn;
}
var dn, ya;
function Bf() {
  if (ya) return dn;
  ya = 1, dn = o;
  var t = Object.getPrototypeOf || function(l) {
    return l.__proto__;
  };
  function o(l) {
    if (l === null || typeof l != "object")
      return l;
    if (l instanceof Object)
      var u = { __proto__: t(l) };
    else
      var u = /* @__PURE__ */ Object.create(null);
    return Object.getOwnPropertyNames(l).forEach(function(n) {
      Object.defineProperty(u, n, Object.getOwnPropertyDescriptor(l, n));
    }), u;
  }
  return dn;
}
var kr, va;
function Je() {
  if (va) return kr;
  va = 1;
  var t = Ke, o = qf(), l = Mf(), u = Bf(), n = Xr, i, e;
  typeof Symbol == "function" && typeof Symbol.for == "function" ? (i = /* @__PURE__ */ Symbol.for("graceful-fs.queue"), e = /* @__PURE__ */ Symbol.for("graceful-fs.previous")) : (i = "___graceful-fs.queue", e = "___graceful-fs.previous");
  function f() {
  }
  function r(m, E) {
    Object.defineProperty(m, i, {
      get: function() {
        return E;
      }
    });
  }
  var s = f;
  if (n.debuglog ? s = n.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (s = function() {
    var m = n.format.apply(n, arguments);
    m = "GFS4: " + m.split(/\n/).join(`
GFS4: `), console.error(m);
  }), !t[i]) {
    var a = at[i] || [];
    r(t, a), t.close = (function(m) {
      function E(A, O) {
        return m.call(t, A, function(P) {
          P || y(), typeof O == "function" && O.apply(this, arguments);
        });
      }
      return Object.defineProperty(E, e, {
        value: m
      }), E;
    })(t.close), t.closeSync = (function(m) {
      function E(A) {
        m.apply(t, arguments), y();
      }
      return Object.defineProperty(E, e, {
        value: m
      }), E;
    })(t.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
      s(t[i]), Vu.equal(t[i].length, 0);
    });
  }
  at[i] || r(at, t[i]), kr = d(u(t)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !t.__patched && (kr = d(t), t.__patched = !0);
  function d(m) {
    o(m), m.gracefulify = d, m.createReadStream = de, m.createWriteStream = ce;
    var E = m.readFile;
    m.readFile = A;
    function A(K, ye, S) {
      return typeof ye == "function" && (S = ye, ye = null), v(K, ye, S);
      function v(j, N, ue, he) {
        return E(j, N, function(pe) {
          pe && (pe.code === "EMFILE" || pe.code === "ENFILE") ? c([v, [j, N, ue], pe, he || Date.now(), Date.now()]) : typeof ue == "function" && ue.apply(this, arguments);
        });
      }
    }
    var O = m.writeFile;
    m.writeFile = P;
    function P(K, ye, S, v) {
      return typeof S == "function" && (v = S, S = null), j(K, ye, S, v);
      function j(N, ue, he, pe, Ae) {
        return O(N, ue, he, function(Ee) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? c([j, [N, ue, he, pe], Ee, Ae || Date.now(), Date.now()]) : typeof pe == "function" && pe.apply(this, arguments);
        });
      }
    }
    var $ = m.appendFile;
    $ && (m.appendFile = T);
    function T(K, ye, S, v) {
      return typeof S == "function" && (v = S, S = null), j(K, ye, S, v);
      function j(N, ue, he, pe, Ae) {
        return $(N, ue, he, function(Ee) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? c([j, [N, ue, he, pe], Ee, Ae || Date.now(), Date.now()]) : typeof pe == "function" && pe.apply(this, arguments);
        });
      }
    }
    var _ = m.copyFile;
    _ && (m.copyFile = b);
    function b(K, ye, S, v) {
      return typeof S == "function" && (v = S, S = 0), j(K, ye, S, v);
      function j(N, ue, he, pe, Ae) {
        return _(N, ue, he, function(Ee) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? c([j, [N, ue, he, pe], Ee, Ae || Date.now(), Date.now()]) : typeof pe == "function" && pe.apply(this, arguments);
        });
      }
    }
    var w = m.readdir;
    m.readdir = U;
    var q = /^v[0-5]\./;
    function U(K, ye, S) {
      typeof ye == "function" && (S = ye, ye = null);
      var v = q.test(process.version) ? function(ue, he, pe, Ae) {
        return w(ue, j(
          ue,
          he,
          pe,
          Ae
        ));
      } : function(ue, he, pe, Ae) {
        return w(ue, he, j(
          ue,
          he,
          pe,
          Ae
        ));
      };
      return v(K, ye, S);
      function j(N, ue, he, pe) {
        return function(Ae, Ee) {
          Ae && (Ae.code === "EMFILE" || Ae.code === "ENFILE") ? c([
            v,
            [N, ue, he],
            Ae,
            pe || Date.now(),
            Date.now()
          ]) : (Ee && Ee.sort && Ee.sort(), typeof he == "function" && he.call(this, Ae, Ee));
        };
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var F = l(m);
      D = F.ReadStream, V = F.WriteStream;
    }
    var M = m.ReadStream;
    M && (D.prototype = Object.create(M.prototype), D.prototype.open = Q);
    var I = m.WriteStream;
    I && (V.prototype = Object.create(I.prototype), V.prototype.open = ne), Object.defineProperty(m, "ReadStream", {
      get: function() {
        return D;
      },
      set: function(K) {
        D = K;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(m, "WriteStream", {
      get: function() {
        return V;
      },
      set: function(K) {
        V = K;
      },
      enumerable: !0,
      configurable: !0
    });
    var x = D;
    Object.defineProperty(m, "FileReadStream", {
      get: function() {
        return x;
      },
      set: function(K) {
        x = K;
      },
      enumerable: !0,
      configurable: !0
    });
    var H = V;
    Object.defineProperty(m, "FileWriteStream", {
      get: function() {
        return H;
      },
      set: function(K) {
        H = K;
      },
      enumerable: !0,
      configurable: !0
    });
    function D(K, ye) {
      return this instanceof D ? (M.apply(this, arguments), this) : D.apply(Object.create(D.prototype), arguments);
    }
    function Q() {
      var K = this;
      we(K.path, K.flags, K.mode, function(ye, S) {
        ye ? (K.autoClose && K.destroy(), K.emit("error", ye)) : (K.fd = S, K.emit("open", S), K.read());
      });
    }
    function V(K, ye) {
      return this instanceof V ? (I.apply(this, arguments), this) : V.apply(Object.create(V.prototype), arguments);
    }
    function ne() {
      var K = this;
      we(K.path, K.flags, K.mode, function(ye, S) {
        ye ? (K.destroy(), K.emit("error", ye)) : (K.fd = S, K.emit("open", S));
      });
    }
    function de(K, ye) {
      return new m.ReadStream(K, ye);
    }
    function ce(K, ye) {
      return new m.WriteStream(K, ye);
    }
    var ge = m.open;
    m.open = we;
    function we(K, ye, S, v) {
      return typeof S == "function" && (v = S, S = null), j(K, ye, S, v);
      function j(N, ue, he, pe, Ae) {
        return ge(N, ue, he, function(Ee, Ve) {
          Ee && (Ee.code === "EMFILE" || Ee.code === "ENFILE") ? c([j, [N, ue, he, pe], Ee, Ae || Date.now(), Date.now()]) : typeof pe == "function" && pe.apply(this, arguments);
        });
      }
    }
    return m;
  }
  function c(m) {
    s("ENQUEUE", m[0].name, m[1]), t[i].push(m), g();
  }
  var p;
  function y() {
    for (var m = Date.now(), E = 0; E < t[i].length; ++E)
      t[i][E].length > 2 && (t[i][E][3] = m, t[i][E][4] = m);
    g();
  }
  function g() {
    if (clearTimeout(p), p = void 0, t[i].length !== 0) {
      var m = t[i].shift(), E = m[0], A = m[1], O = m[2], P = m[3], $ = m[4];
      if (P === void 0)
        s("RETRY", E.name, A), E.apply(null, A);
      else if (Date.now() - P >= 6e4) {
        s("TIMEOUT", E.name, A);
        var T = A.pop();
        typeof T == "function" && T.call(null, O);
      } else {
        var _ = Date.now() - $, b = Math.max($ - P, 1), w = Math.min(b * 1.2, 100);
        _ >= w ? (s("RETRY", E.name, A), E.apply(null, A.concat([P]))) : t[i].push(m);
      }
      p === void 0 && (p = setTimeout(g, 0));
    }
  }
  return kr;
}
var wa;
function Yt() {
  return wa || (wa = 1, (function(t) {
    const o = Qe().fromCallback, l = Je(), u = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((n) => typeof l[n] == "function");
    Object.assign(t, l), u.forEach((n) => {
      t[n] = o(l[n]);
    }), t.exists = function(n, i) {
      return typeof i == "function" ? l.exists(n, i) : new Promise((e) => l.exists(n, e));
    }, t.read = function(n, i, e, f, r, s) {
      return typeof s == "function" ? l.read(n, i, e, f, r, s) : new Promise((a, d) => {
        l.read(n, i, e, f, r, (c, p, y) => {
          if (c) return d(c);
          a({ bytesRead: p, buffer: y });
        });
      });
    }, t.write = function(n, i, ...e) {
      return typeof e[e.length - 1] == "function" ? l.write(n, i, ...e) : new Promise((f, r) => {
        l.write(n, i, ...e, (s, a, d) => {
          if (s) return r(s);
          f({ bytesWritten: a, buffer: d });
        });
      });
    }, typeof l.writev == "function" && (t.writev = function(n, i, ...e) {
      return typeof e[e.length - 1] == "function" ? l.writev(n, i, ...e) : new Promise((f, r) => {
        l.writev(n, i, ...e, (s, a, d) => {
          if (s) return r(s);
          f({ bytesWritten: a, buffers: d });
        });
      });
    }), typeof l.realpath.native == "function" ? t.realpath.native = o(l.realpath.native) : process.emitWarning(
      "fs.realpath.native is not a function. Is fs being monkey-patched?",
      "Warning",
      "fs-extra-WARN0003"
    );
  })(un)), un;
}
var qr = {}, hn = {}, Ea;
function jf() {
  if (Ea) return hn;
  Ea = 1;
  const t = Ie;
  return hn.checkPath = function(l) {
    if (process.platform === "win32" && /[<>:"|?*]/.test(l.replace(t.parse(l).root, ""))) {
      const n = new Error(`Path contains invalid characters: ${l}`);
      throw n.code = "EINVAL", n;
    }
  }, hn;
}
var _a;
function Hf() {
  if (_a) return qr;
  _a = 1;
  const t = /* @__PURE__ */ Yt(), { checkPath: o } = /* @__PURE__ */ jf(), l = (u) => {
    const n = { mode: 511 };
    return typeof u == "number" ? u : { ...n, ...u }.mode;
  };
  return qr.makeDir = async (u, n) => (o(u), t.mkdir(u, {
    mode: l(n),
    recursive: !0
  })), qr.makeDirSync = (u, n) => (o(u), t.mkdirSync(u, {
    mode: l(n),
    recursive: !0
  })), qr;
}
var pn, Sa;
function ct() {
  if (Sa) return pn;
  Sa = 1;
  const t = Qe().fromPromise, { makeDir: o, makeDirSync: l } = /* @__PURE__ */ Hf(), u = t(o);
  return pn = {
    mkdirs: u,
    mkdirsSync: l,
    // alias
    mkdirp: u,
    mkdirpSync: l,
    ensureDir: u,
    ensureDirSync: l
  }, pn;
}
var mn, ba;
function Ut() {
  if (ba) return mn;
  ba = 1;
  const t = Qe().fromPromise, o = /* @__PURE__ */ Yt();
  function l(u) {
    return o.access(u).then(() => !0).catch(() => !1);
  }
  return mn = {
    pathExists: t(l),
    pathExistsSync: o.existsSync
  }, mn;
}
var gn, Aa;
function Qu() {
  if (Aa) return gn;
  Aa = 1;
  const t = Je();
  function o(u, n, i, e) {
    t.open(u, "r+", (f, r) => {
      if (f) return e(f);
      t.futimes(r, n, i, (s) => {
        t.close(r, (a) => {
          e && e(s || a);
        });
      });
    });
  }
  function l(u, n, i) {
    const e = t.openSync(u, "r+");
    return t.futimesSync(e, n, i), t.closeSync(e);
  }
  return gn = {
    utimesMillis: o,
    utimesMillisSync: l
  }, gn;
}
var yn, Ca;
function Jt() {
  if (Ca) return yn;
  Ca = 1;
  const t = /* @__PURE__ */ Yt(), o = Ie, l = Xr;
  function u(c, p, y) {
    const g = y.dereference ? (m) => t.stat(m, { bigint: !0 }) : (m) => t.lstat(m, { bigint: !0 });
    return Promise.all([
      g(c),
      g(p).catch((m) => {
        if (m.code === "ENOENT") return null;
        throw m;
      })
    ]).then(([m, E]) => ({ srcStat: m, destStat: E }));
  }
  function n(c, p, y) {
    let g;
    const m = y.dereference ? (A) => t.statSync(A, { bigint: !0 }) : (A) => t.lstatSync(A, { bigint: !0 }), E = m(c);
    try {
      g = m(p);
    } catch (A) {
      if (A.code === "ENOENT") return { srcStat: E, destStat: null };
      throw A;
    }
    return { srcStat: E, destStat: g };
  }
  function i(c, p, y, g, m) {
    l.callbackify(u)(c, p, g, (E, A) => {
      if (E) return m(E);
      const { srcStat: O, destStat: P } = A;
      if (P) {
        if (s(O, P)) {
          const $ = o.basename(c), T = o.basename(p);
          return y === "move" && $ !== T && $.toLowerCase() === T.toLowerCase() ? m(null, { srcStat: O, destStat: P, isChangingCase: !0 }) : m(new Error("Source and destination must not be the same."));
        }
        if (O.isDirectory() && !P.isDirectory())
          return m(new Error(`Cannot overwrite non-directory '${p}' with directory '${c}'.`));
        if (!O.isDirectory() && P.isDirectory())
          return m(new Error(`Cannot overwrite directory '${p}' with non-directory '${c}'.`));
      }
      return O.isDirectory() && a(c, p) ? m(new Error(d(c, p, y))) : m(null, { srcStat: O, destStat: P });
    });
  }
  function e(c, p, y, g) {
    const { srcStat: m, destStat: E } = n(c, p, g);
    if (E) {
      if (s(m, E)) {
        const A = o.basename(c), O = o.basename(p);
        if (y === "move" && A !== O && A.toLowerCase() === O.toLowerCase())
          return { srcStat: m, destStat: E, isChangingCase: !0 };
        throw new Error("Source and destination must not be the same.");
      }
      if (m.isDirectory() && !E.isDirectory())
        throw new Error(`Cannot overwrite non-directory '${p}' with directory '${c}'.`);
      if (!m.isDirectory() && E.isDirectory())
        throw new Error(`Cannot overwrite directory '${p}' with non-directory '${c}'.`);
    }
    if (m.isDirectory() && a(c, p))
      throw new Error(d(c, p, y));
    return { srcStat: m, destStat: E };
  }
  function f(c, p, y, g, m) {
    const E = o.resolve(o.dirname(c)), A = o.resolve(o.dirname(y));
    if (A === E || A === o.parse(A).root) return m();
    t.stat(A, { bigint: !0 }, (O, P) => O ? O.code === "ENOENT" ? m() : m(O) : s(p, P) ? m(new Error(d(c, y, g))) : f(c, p, A, g, m));
  }
  function r(c, p, y, g) {
    const m = o.resolve(o.dirname(c)), E = o.resolve(o.dirname(y));
    if (E === m || E === o.parse(E).root) return;
    let A;
    try {
      A = t.statSync(E, { bigint: !0 });
    } catch (O) {
      if (O.code === "ENOENT") return;
      throw O;
    }
    if (s(p, A))
      throw new Error(d(c, y, g));
    return r(c, p, E, g);
  }
  function s(c, p) {
    return p.ino && p.dev && p.ino === c.ino && p.dev === c.dev;
  }
  function a(c, p) {
    const y = o.resolve(c).split(o.sep).filter((m) => m), g = o.resolve(p).split(o.sep).filter((m) => m);
    return y.reduce((m, E, A) => m && g[A] === E, !0);
  }
  function d(c, p, y) {
    return `Cannot ${y} '${c}' to a subdirectory of itself, '${p}'.`;
  }
  return yn = {
    checkPaths: i,
    checkPathsSync: e,
    checkParentPaths: f,
    checkParentPathsSync: r,
    isSrcSubdir: a,
    areIdentical: s
  }, yn;
}
var vn, Ta;
function Gf() {
  if (Ta) return vn;
  Ta = 1;
  const t = Je(), o = Ie, l = ct().mkdirs, u = Ut().pathExists, n = Qu().utimesMillis, i = /* @__PURE__ */ Jt();
  function e(U, F, M, I) {
    typeof M == "function" && !I ? (I = M, M = {}) : typeof M == "function" && (M = { filter: M }), I = I || function() {
    }, M = M || {}, M.clobber = "clobber" in M ? !!M.clobber : !0, M.overwrite = "overwrite" in M ? !!M.overwrite : M.clobber, M.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0001"
    ), i.checkPaths(U, F, "copy", M, (x, H) => {
      if (x) return I(x);
      const { srcStat: D, destStat: Q } = H;
      i.checkParentPaths(U, D, F, "copy", (V) => V ? I(V) : M.filter ? r(f, Q, U, F, M, I) : f(Q, U, F, M, I));
    });
  }
  function f(U, F, M, I, x) {
    const H = o.dirname(M);
    u(H, (D, Q) => {
      if (D) return x(D);
      if (Q) return a(U, F, M, I, x);
      l(H, (V) => V ? x(V) : a(U, F, M, I, x));
    });
  }
  function r(U, F, M, I, x, H) {
    Promise.resolve(x.filter(M, I)).then((D) => D ? U(F, M, I, x, H) : H(), (D) => H(D));
  }
  function s(U, F, M, I, x) {
    return I.filter ? r(a, U, F, M, I, x) : a(U, F, M, I, x);
  }
  function a(U, F, M, I, x) {
    (I.dereference ? t.stat : t.lstat)(F, (D, Q) => D ? x(D) : Q.isDirectory() ? P(Q, U, F, M, I, x) : Q.isFile() || Q.isCharacterDevice() || Q.isBlockDevice() ? d(Q, U, F, M, I, x) : Q.isSymbolicLink() ? w(U, F, M, I, x) : Q.isSocket() ? x(new Error(`Cannot copy a socket file: ${F}`)) : Q.isFIFO() ? x(new Error(`Cannot copy a FIFO pipe: ${F}`)) : x(new Error(`Unknown file: ${F}`)));
  }
  function d(U, F, M, I, x, H) {
    return F ? c(U, M, I, x, H) : p(U, M, I, x, H);
  }
  function c(U, F, M, I, x) {
    if (I.overwrite)
      t.unlink(M, (H) => H ? x(H) : p(U, F, M, I, x));
    else return I.errorOnExist ? x(new Error(`'${M}' already exists`)) : x();
  }
  function p(U, F, M, I, x) {
    t.copyFile(F, M, (H) => H ? x(H) : I.preserveTimestamps ? y(U.mode, F, M, x) : A(M, U.mode, x));
  }
  function y(U, F, M, I) {
    return g(U) ? m(M, U, (x) => x ? I(x) : E(U, F, M, I)) : E(U, F, M, I);
  }
  function g(U) {
    return (U & 128) === 0;
  }
  function m(U, F, M) {
    return A(U, F | 128, M);
  }
  function E(U, F, M, I) {
    O(F, M, (x) => x ? I(x) : A(M, U, I));
  }
  function A(U, F, M) {
    return t.chmod(U, F, M);
  }
  function O(U, F, M) {
    t.stat(U, (I, x) => I ? M(I) : n(F, x.atime, x.mtime, M));
  }
  function P(U, F, M, I, x, H) {
    return F ? T(M, I, x, H) : $(U.mode, M, I, x, H);
  }
  function $(U, F, M, I, x) {
    t.mkdir(M, (H) => {
      if (H) return x(H);
      T(F, M, I, (D) => D ? x(D) : A(M, U, x));
    });
  }
  function T(U, F, M, I) {
    t.readdir(U, (x, H) => x ? I(x) : _(H, U, F, M, I));
  }
  function _(U, F, M, I, x) {
    const H = U.pop();
    return H ? b(U, H, F, M, I, x) : x();
  }
  function b(U, F, M, I, x, H) {
    const D = o.join(M, F), Q = o.join(I, F);
    i.checkPaths(D, Q, "copy", x, (V, ne) => {
      if (V) return H(V);
      const { destStat: de } = ne;
      s(de, D, Q, x, (ce) => ce ? H(ce) : _(U, M, I, x, H));
    });
  }
  function w(U, F, M, I, x) {
    t.readlink(F, (H, D) => {
      if (H) return x(H);
      if (I.dereference && (D = o.resolve(process.cwd(), D)), U)
        t.readlink(M, (Q, V) => Q ? Q.code === "EINVAL" || Q.code === "UNKNOWN" ? t.symlink(D, M, x) : x(Q) : (I.dereference && (V = o.resolve(process.cwd(), V)), i.isSrcSubdir(D, V) ? x(new Error(`Cannot copy '${D}' to a subdirectory of itself, '${V}'.`)) : U.isDirectory() && i.isSrcSubdir(V, D) ? x(new Error(`Cannot overwrite '${V}' with '${D}'.`)) : q(D, M, x)));
      else
        return t.symlink(D, M, x);
    });
  }
  function q(U, F, M) {
    t.unlink(F, (I) => I ? M(I) : t.symlink(U, F, M));
  }
  return vn = e, vn;
}
var wn, Ra;
function Wf() {
  if (Ra) return wn;
  Ra = 1;
  const t = Je(), o = Ie, l = ct().mkdirsSync, u = Qu().utimesMillisSync, n = /* @__PURE__ */ Jt();
  function i(_, b, w) {
    typeof w == "function" && (w = { filter: w }), w = w || {}, w.clobber = "clobber" in w ? !!w.clobber : !0, w.overwrite = "overwrite" in w ? !!w.overwrite : w.clobber, w.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
      `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
      "Warning",
      "fs-extra-WARN0002"
    );
    const { srcStat: q, destStat: U } = n.checkPathsSync(_, b, "copy", w);
    return n.checkParentPathsSync(_, q, b, "copy"), e(U, _, b, w);
  }
  function e(_, b, w, q) {
    if (q.filter && !q.filter(b, w)) return;
    const U = o.dirname(w);
    return t.existsSync(U) || l(U), r(_, b, w, q);
  }
  function f(_, b, w, q) {
    if (!(q.filter && !q.filter(b, w)))
      return r(_, b, w, q);
  }
  function r(_, b, w, q) {
    const F = (q.dereference ? t.statSync : t.lstatSync)(b);
    if (F.isDirectory()) return E(F, _, b, w, q);
    if (F.isFile() || F.isCharacterDevice() || F.isBlockDevice()) return s(F, _, b, w, q);
    if (F.isSymbolicLink()) return $(_, b, w, q);
    throw F.isSocket() ? new Error(`Cannot copy a socket file: ${b}`) : F.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${b}`) : new Error(`Unknown file: ${b}`);
  }
  function s(_, b, w, q, U) {
    return b ? a(_, w, q, U) : d(_, w, q, U);
  }
  function a(_, b, w, q) {
    if (q.overwrite)
      return t.unlinkSync(w), d(_, b, w, q);
    if (q.errorOnExist)
      throw new Error(`'${w}' already exists`);
  }
  function d(_, b, w, q) {
    return t.copyFileSync(b, w), q.preserveTimestamps && c(_.mode, b, w), g(w, _.mode);
  }
  function c(_, b, w) {
    return p(_) && y(w, _), m(b, w);
  }
  function p(_) {
    return (_ & 128) === 0;
  }
  function y(_, b) {
    return g(_, b | 128);
  }
  function g(_, b) {
    return t.chmodSync(_, b);
  }
  function m(_, b) {
    const w = t.statSync(_);
    return u(b, w.atime, w.mtime);
  }
  function E(_, b, w, q, U) {
    return b ? O(w, q, U) : A(_.mode, w, q, U);
  }
  function A(_, b, w, q) {
    return t.mkdirSync(w), O(b, w, q), g(w, _);
  }
  function O(_, b, w) {
    t.readdirSync(_).forEach((q) => P(q, _, b, w));
  }
  function P(_, b, w, q) {
    const U = o.join(b, _), F = o.join(w, _), { destStat: M } = n.checkPathsSync(U, F, "copy", q);
    return f(M, U, F, q);
  }
  function $(_, b, w, q) {
    let U = t.readlinkSync(b);
    if (q.dereference && (U = o.resolve(process.cwd(), U)), _) {
      let F;
      try {
        F = t.readlinkSync(w);
      } catch (M) {
        if (M.code === "EINVAL" || M.code === "UNKNOWN") return t.symlinkSync(U, w);
        throw M;
      }
      if (q.dereference && (F = o.resolve(process.cwd(), F)), n.isSrcSubdir(U, F))
        throw new Error(`Cannot copy '${U}' to a subdirectory of itself, '${F}'.`);
      if (t.statSync(w).isDirectory() && n.isSrcSubdir(F, U))
        throw new Error(`Cannot overwrite '${F}' with '${U}'.`);
      return T(U, w);
    } else
      return t.symlinkSync(U, w);
  }
  function T(_, b) {
    return t.unlinkSync(b), t.symlinkSync(_, b);
  }
  return wn = i, wn;
}
var En, Oa;
function Bo() {
  if (Oa) return En;
  Oa = 1;
  const t = Qe().fromCallback;
  return En = {
    copy: t(/* @__PURE__ */ Gf()),
    copySync: /* @__PURE__ */ Wf()
  }, En;
}
var _n, Pa;
function zf() {
  if (Pa) return _n;
  Pa = 1;
  const t = Je(), o = Ie, l = Vu, u = process.platform === "win32";
  function n(y) {
    [
      "unlink",
      "chmod",
      "stat",
      "lstat",
      "rmdir",
      "readdir"
    ].forEach((m) => {
      y[m] = y[m] || t[m], m = m + "Sync", y[m] = y[m] || t[m];
    }), y.maxBusyTries = y.maxBusyTries || 3;
  }
  function i(y, g, m) {
    let E = 0;
    typeof g == "function" && (m = g, g = {}), l(y, "rimraf: missing path"), l.strictEqual(typeof y, "string", "rimraf: path should be a string"), l.strictEqual(typeof m, "function", "rimraf: callback function required"), l(g, "rimraf: invalid options argument provided"), l.strictEqual(typeof g, "object", "rimraf: options should be object"), n(g), e(y, g, function A(O) {
      if (O) {
        if ((O.code === "EBUSY" || O.code === "ENOTEMPTY" || O.code === "EPERM") && E < g.maxBusyTries) {
          E++;
          const P = E * 100;
          return setTimeout(() => e(y, g, A), P);
        }
        O.code === "ENOENT" && (O = null);
      }
      m(O);
    });
  }
  function e(y, g, m) {
    l(y), l(g), l(typeof m == "function"), g.lstat(y, (E, A) => {
      if (E && E.code === "ENOENT")
        return m(null);
      if (E && E.code === "EPERM" && u)
        return f(y, g, E, m);
      if (A && A.isDirectory())
        return s(y, g, E, m);
      g.unlink(y, (O) => {
        if (O) {
          if (O.code === "ENOENT")
            return m(null);
          if (O.code === "EPERM")
            return u ? f(y, g, O, m) : s(y, g, O, m);
          if (O.code === "EISDIR")
            return s(y, g, O, m);
        }
        return m(O);
      });
    });
  }
  function f(y, g, m, E) {
    l(y), l(g), l(typeof E == "function"), g.chmod(y, 438, (A) => {
      A ? E(A.code === "ENOENT" ? null : m) : g.stat(y, (O, P) => {
        O ? E(O.code === "ENOENT" ? null : m) : P.isDirectory() ? s(y, g, m, E) : g.unlink(y, E);
      });
    });
  }
  function r(y, g, m) {
    let E;
    l(y), l(g);
    try {
      g.chmodSync(y, 438);
    } catch (A) {
      if (A.code === "ENOENT")
        return;
      throw m;
    }
    try {
      E = g.statSync(y);
    } catch (A) {
      if (A.code === "ENOENT")
        return;
      throw m;
    }
    E.isDirectory() ? c(y, g, m) : g.unlinkSync(y);
  }
  function s(y, g, m, E) {
    l(y), l(g), l(typeof E == "function"), g.rmdir(y, (A) => {
      A && (A.code === "ENOTEMPTY" || A.code === "EEXIST" || A.code === "EPERM") ? a(y, g, E) : A && A.code === "ENOTDIR" ? E(m) : E(A);
    });
  }
  function a(y, g, m) {
    l(y), l(g), l(typeof m == "function"), g.readdir(y, (E, A) => {
      if (E) return m(E);
      let O = A.length, P;
      if (O === 0) return g.rmdir(y, m);
      A.forEach(($) => {
        i(o.join(y, $), g, (T) => {
          if (!P) {
            if (T) return m(P = T);
            --O === 0 && g.rmdir(y, m);
          }
        });
      });
    });
  }
  function d(y, g) {
    let m;
    g = g || {}, n(g), l(y, "rimraf: missing path"), l.strictEqual(typeof y, "string", "rimraf: path should be a string"), l(g, "rimraf: missing options"), l.strictEqual(typeof g, "object", "rimraf: options should be object");
    try {
      m = g.lstatSync(y);
    } catch (E) {
      if (E.code === "ENOENT")
        return;
      E.code === "EPERM" && u && r(y, g, E);
    }
    try {
      m && m.isDirectory() ? c(y, g, null) : g.unlinkSync(y);
    } catch (E) {
      if (E.code === "ENOENT")
        return;
      if (E.code === "EPERM")
        return u ? r(y, g, E) : c(y, g, E);
      if (E.code !== "EISDIR")
        throw E;
      c(y, g, E);
    }
  }
  function c(y, g, m) {
    l(y), l(g);
    try {
      g.rmdirSync(y);
    } catch (E) {
      if (E.code === "ENOTDIR")
        throw m;
      if (E.code === "ENOTEMPTY" || E.code === "EEXIST" || E.code === "EPERM")
        p(y, g);
      else if (E.code !== "ENOENT")
        throw E;
    }
  }
  function p(y, g) {
    if (l(y), l(g), g.readdirSync(y).forEach((m) => d(o.join(y, m), g)), u) {
      const m = Date.now();
      do
        try {
          return g.rmdirSync(y, g);
        } catch {
        }
      while (Date.now() - m < 500);
    } else
      return g.rmdirSync(y, g);
  }
  return _n = i, i.sync = d, _n;
}
var Sn, Da;
function Qr() {
  if (Da) return Sn;
  Da = 1;
  const t = Je(), o = Qe().fromCallback, l = /* @__PURE__ */ zf();
  function u(i, e) {
    if (t.rm) return t.rm(i, { recursive: !0, force: !0 }, e);
    l(i, e);
  }
  function n(i) {
    if (t.rmSync) return t.rmSync(i, { recursive: !0, force: !0 });
    l.sync(i);
  }
  return Sn = {
    remove: o(u),
    removeSync: n
  }, Sn;
}
var bn, Ia;
function Vf() {
  if (Ia) return bn;
  Ia = 1;
  const t = Qe().fromPromise, o = /* @__PURE__ */ Yt(), l = Ie, u = /* @__PURE__ */ ct(), n = /* @__PURE__ */ Qr(), i = t(async function(r) {
    let s;
    try {
      s = await o.readdir(r);
    } catch {
      return u.mkdirs(r);
    }
    return Promise.all(s.map((a) => n.remove(l.join(r, a))));
  });
  function e(f) {
    let r;
    try {
      r = o.readdirSync(f);
    } catch {
      return u.mkdirsSync(f);
    }
    r.forEach((s) => {
      s = l.join(f, s), n.removeSync(s);
    });
  }
  return bn = {
    emptyDirSync: e,
    emptydirSync: e,
    emptyDir: i,
    emptydir: i
  }, bn;
}
var An, Na;
function Yf() {
  if (Na) return An;
  Na = 1;
  const t = Qe().fromCallback, o = Ie, l = Je(), u = /* @__PURE__ */ ct();
  function n(e, f) {
    function r() {
      l.writeFile(e, "", (s) => {
        if (s) return f(s);
        f();
      });
    }
    l.stat(e, (s, a) => {
      if (!s && a.isFile()) return f();
      const d = o.dirname(e);
      l.stat(d, (c, p) => {
        if (c)
          return c.code === "ENOENT" ? u.mkdirs(d, (y) => {
            if (y) return f(y);
            r();
          }) : f(c);
        p.isDirectory() ? r() : l.readdir(d, (y) => {
          if (y) return f(y);
        });
      });
    });
  }
  function i(e) {
    let f;
    try {
      f = l.statSync(e);
    } catch {
    }
    if (f && f.isFile()) return;
    const r = o.dirname(e);
    try {
      l.statSync(r).isDirectory() || l.readdirSync(r);
    } catch (s) {
      if (s && s.code === "ENOENT") u.mkdirsSync(r);
      else throw s;
    }
    l.writeFileSync(e, "");
  }
  return An = {
    createFile: t(n),
    createFileSync: i
  }, An;
}
var Cn, xa;
function Jf() {
  if (xa) return Cn;
  xa = 1;
  const t = Qe().fromCallback, o = Ie, l = Je(), u = /* @__PURE__ */ ct(), n = Ut().pathExists, { areIdentical: i } = /* @__PURE__ */ Jt();
  function e(r, s, a) {
    function d(c, p) {
      l.link(c, p, (y) => {
        if (y) return a(y);
        a(null);
      });
    }
    l.lstat(s, (c, p) => {
      l.lstat(r, (y, g) => {
        if (y)
          return y.message = y.message.replace("lstat", "ensureLink"), a(y);
        if (p && i(g, p)) return a(null);
        const m = o.dirname(s);
        n(m, (E, A) => {
          if (E) return a(E);
          if (A) return d(r, s);
          u.mkdirs(m, (O) => {
            if (O) return a(O);
            d(r, s);
          });
        });
      });
    });
  }
  function f(r, s) {
    let a;
    try {
      a = l.lstatSync(s);
    } catch {
    }
    try {
      const p = l.lstatSync(r);
      if (a && i(p, a)) return;
    } catch (p) {
      throw p.message = p.message.replace("lstat", "ensureLink"), p;
    }
    const d = o.dirname(s);
    return l.existsSync(d) || u.mkdirsSync(d), l.linkSync(r, s);
  }
  return Cn = {
    createLink: t(e),
    createLinkSync: f
  }, Cn;
}
var Tn, La;
function Xf() {
  if (La) return Tn;
  La = 1;
  const t = Ie, o = Je(), l = Ut().pathExists;
  function u(i, e, f) {
    if (t.isAbsolute(i))
      return o.lstat(i, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), f(r)) : f(null, {
        toCwd: i,
        toDst: i
      }));
    {
      const r = t.dirname(e), s = t.join(r, i);
      return l(s, (a, d) => a ? f(a) : d ? f(null, {
        toCwd: s,
        toDst: i
      }) : o.lstat(i, (c) => c ? (c.message = c.message.replace("lstat", "ensureSymlink"), f(c)) : f(null, {
        toCwd: i,
        toDst: t.relative(r, i)
      })));
    }
  }
  function n(i, e) {
    let f;
    if (t.isAbsolute(i)) {
      if (f = o.existsSync(i), !f) throw new Error("absolute srcpath does not exist");
      return {
        toCwd: i,
        toDst: i
      };
    } else {
      const r = t.dirname(e), s = t.join(r, i);
      if (f = o.existsSync(s), f)
        return {
          toCwd: s,
          toDst: i
        };
      if (f = o.existsSync(i), !f) throw new Error("relative srcpath does not exist");
      return {
        toCwd: i,
        toDst: t.relative(r, i)
      };
    }
  }
  return Tn = {
    symlinkPaths: u,
    symlinkPathsSync: n
  }, Tn;
}
var Rn, Fa;
function Kf() {
  if (Fa) return Rn;
  Fa = 1;
  const t = Je();
  function o(u, n, i) {
    if (i = typeof n == "function" ? n : i, n = typeof n == "function" ? !1 : n, n) return i(null, n);
    t.lstat(u, (e, f) => {
      if (e) return i(null, "file");
      n = f && f.isDirectory() ? "dir" : "file", i(null, n);
    });
  }
  function l(u, n) {
    let i;
    if (n) return n;
    try {
      i = t.lstatSync(u);
    } catch {
      return "file";
    }
    return i && i.isDirectory() ? "dir" : "file";
  }
  return Rn = {
    symlinkType: o,
    symlinkTypeSync: l
  }, Rn;
}
var On, Ua;
function Qf() {
  if (Ua) return On;
  Ua = 1;
  const t = Qe().fromCallback, o = Ie, l = /* @__PURE__ */ Yt(), u = /* @__PURE__ */ ct(), n = u.mkdirs, i = u.mkdirsSync, e = /* @__PURE__ */ Xf(), f = e.symlinkPaths, r = e.symlinkPathsSync, s = /* @__PURE__ */ Kf(), a = s.symlinkType, d = s.symlinkTypeSync, c = Ut().pathExists, { areIdentical: p } = /* @__PURE__ */ Jt();
  function y(E, A, O, P) {
    P = typeof O == "function" ? O : P, O = typeof O == "function" ? !1 : O, l.lstat(A, ($, T) => {
      !$ && T.isSymbolicLink() ? Promise.all([
        l.stat(E),
        l.stat(A)
      ]).then(([_, b]) => {
        if (p(_, b)) return P(null);
        g(E, A, O, P);
      }) : g(E, A, O, P);
    });
  }
  function g(E, A, O, P) {
    f(E, A, ($, T) => {
      if ($) return P($);
      E = T.toDst, a(T.toCwd, O, (_, b) => {
        if (_) return P(_);
        const w = o.dirname(A);
        c(w, (q, U) => {
          if (q) return P(q);
          if (U) return l.symlink(E, A, b, P);
          n(w, (F) => {
            if (F) return P(F);
            l.symlink(E, A, b, P);
          });
        });
      });
    });
  }
  function m(E, A, O) {
    let P;
    try {
      P = l.lstatSync(A);
    } catch {
    }
    if (P && P.isSymbolicLink()) {
      const b = l.statSync(E), w = l.statSync(A);
      if (p(b, w)) return;
    }
    const $ = r(E, A);
    E = $.toDst, O = d($.toCwd, O);
    const T = o.dirname(A);
    return l.existsSync(T) || i(T), l.symlinkSync(E, A, O);
  }
  return On = {
    createSymlink: t(y),
    createSymlinkSync: m
  }, On;
}
var Pn, $a;
function Zf() {
  if ($a) return Pn;
  $a = 1;
  const { createFile: t, createFileSync: o } = /* @__PURE__ */ Yf(), { createLink: l, createLinkSync: u } = /* @__PURE__ */ Jf(), { createSymlink: n, createSymlinkSync: i } = /* @__PURE__ */ Qf();
  return Pn = {
    // file
    createFile: t,
    createFileSync: o,
    ensureFile: t,
    ensureFileSync: o,
    // link
    createLink: l,
    createLinkSync: u,
    ensureLink: l,
    ensureLinkSync: u,
    // symlink
    createSymlink: n,
    createSymlinkSync: i,
    ensureSymlink: n,
    ensureSymlinkSync: i
  }, Pn;
}
var Dn, ka;
function jo() {
  if (ka) return Dn;
  ka = 1;
  function t(l, { EOL: u = `
`, finalEOL: n = !0, replacer: i = null, spaces: e } = {}) {
    const f = n ? u : "";
    return JSON.stringify(l, i, e).replace(/\n/g, u) + f;
  }
  function o(l) {
    return Buffer.isBuffer(l) && (l = l.toString("utf8")), l.replace(/^\uFEFF/, "");
  }
  return Dn = { stringify: t, stripBom: o }, Dn;
}
var In, qa;
function ed() {
  if (qa) return In;
  qa = 1;
  let t;
  try {
    t = Je();
  } catch {
    t = Ke;
  }
  const o = Qe(), { stringify: l, stripBom: u } = jo();
  async function n(a, d = {}) {
    typeof d == "string" && (d = { encoding: d });
    const c = d.fs || t, p = "throws" in d ? d.throws : !0;
    let y = await o.fromCallback(c.readFile)(a, d);
    y = u(y);
    let g;
    try {
      g = JSON.parse(y, d ? d.reviver : null);
    } catch (m) {
      if (p)
        throw m.message = `${a}: ${m.message}`, m;
      return null;
    }
    return g;
  }
  const i = o.fromPromise(n);
  function e(a, d = {}) {
    typeof d == "string" && (d = { encoding: d });
    const c = d.fs || t, p = "throws" in d ? d.throws : !0;
    try {
      let y = c.readFileSync(a, d);
      return y = u(y), JSON.parse(y, d.reviver);
    } catch (y) {
      if (p)
        throw y.message = `${a}: ${y.message}`, y;
      return null;
    }
  }
  async function f(a, d, c = {}) {
    const p = c.fs || t, y = l(d, c);
    await o.fromCallback(p.writeFile)(a, y, c);
  }
  const r = o.fromPromise(f);
  function s(a, d, c = {}) {
    const p = c.fs || t, y = l(d, c);
    return p.writeFileSync(a, y, c);
  }
  return In = {
    readFile: i,
    readFileSync: e,
    writeFile: r,
    writeFileSync: s
  }, In;
}
var Nn, Ma;
function td() {
  if (Ma) return Nn;
  Ma = 1;
  const t = ed();
  return Nn = {
    // jsonfile exports
    readJson: t.readFile,
    readJsonSync: t.readFileSync,
    writeJson: t.writeFile,
    writeJsonSync: t.writeFileSync
  }, Nn;
}
var xn, Ba;
function Ho() {
  if (Ba) return xn;
  Ba = 1;
  const t = Qe().fromCallback, o = Je(), l = Ie, u = /* @__PURE__ */ ct(), n = Ut().pathExists;
  function i(f, r, s, a) {
    typeof s == "function" && (a = s, s = "utf8");
    const d = l.dirname(f);
    n(d, (c, p) => {
      if (c) return a(c);
      if (p) return o.writeFile(f, r, s, a);
      u.mkdirs(d, (y) => {
        if (y) return a(y);
        o.writeFile(f, r, s, a);
      });
    });
  }
  function e(f, ...r) {
    const s = l.dirname(f);
    if (o.existsSync(s))
      return o.writeFileSync(f, ...r);
    u.mkdirsSync(s), o.writeFileSync(f, ...r);
  }
  return xn = {
    outputFile: t(i),
    outputFileSync: e
  }, xn;
}
var Ln, ja;
function rd() {
  if (ja) return Ln;
  ja = 1;
  const { stringify: t } = jo(), { outputFile: o } = /* @__PURE__ */ Ho();
  async function l(u, n, i = {}) {
    const e = t(n, i);
    await o(u, e, i);
  }
  return Ln = l, Ln;
}
var Fn, Ha;
function nd() {
  if (Ha) return Fn;
  Ha = 1;
  const { stringify: t } = jo(), { outputFileSync: o } = /* @__PURE__ */ Ho();
  function l(u, n, i) {
    const e = t(n, i);
    o(u, e, i);
  }
  return Fn = l, Fn;
}
var Un, Ga;
function id() {
  if (Ga) return Un;
  Ga = 1;
  const t = Qe().fromPromise, o = /* @__PURE__ */ td();
  return o.outputJson = t(/* @__PURE__ */ rd()), o.outputJsonSync = /* @__PURE__ */ nd(), o.outputJSON = o.outputJson, o.outputJSONSync = o.outputJsonSync, o.writeJSON = o.writeJson, o.writeJSONSync = o.writeJsonSync, o.readJSON = o.readJson, o.readJSONSync = o.readJsonSync, Un = o, Un;
}
var $n, Wa;
function od() {
  if (Wa) return $n;
  Wa = 1;
  const t = Je(), o = Ie, l = Bo().copy, u = Qr().remove, n = ct().mkdirp, i = Ut().pathExists, e = /* @__PURE__ */ Jt();
  function f(c, p, y, g) {
    typeof y == "function" && (g = y, y = {}), y = y || {};
    const m = y.overwrite || y.clobber || !1;
    e.checkPaths(c, p, "move", y, (E, A) => {
      if (E) return g(E);
      const { srcStat: O, isChangingCase: P = !1 } = A;
      e.checkParentPaths(c, O, p, "move", ($) => {
        if ($) return g($);
        if (r(p)) return s(c, p, m, P, g);
        n(o.dirname(p), (T) => T ? g(T) : s(c, p, m, P, g));
      });
    });
  }
  function r(c) {
    const p = o.dirname(c);
    return o.parse(p).root === p;
  }
  function s(c, p, y, g, m) {
    if (g) return a(c, p, y, m);
    if (y)
      return u(p, (E) => E ? m(E) : a(c, p, y, m));
    i(p, (E, A) => E ? m(E) : A ? m(new Error("dest already exists.")) : a(c, p, y, m));
  }
  function a(c, p, y, g) {
    t.rename(c, p, (m) => m ? m.code !== "EXDEV" ? g(m) : d(c, p, y, g) : g());
  }
  function d(c, p, y, g) {
    l(c, p, {
      overwrite: y,
      errorOnExist: !0
    }, (E) => E ? g(E) : u(c, g));
  }
  return $n = f, $n;
}
var kn, za;
function ad() {
  if (za) return kn;
  za = 1;
  const t = Je(), o = Ie, l = Bo().copySync, u = Qr().removeSync, n = ct().mkdirpSync, i = /* @__PURE__ */ Jt();
  function e(d, c, p) {
    p = p || {};
    const y = p.overwrite || p.clobber || !1, { srcStat: g, isChangingCase: m = !1 } = i.checkPathsSync(d, c, "move", p);
    return i.checkParentPathsSync(d, g, c, "move"), f(c) || n(o.dirname(c)), r(d, c, y, m);
  }
  function f(d) {
    const c = o.dirname(d);
    return o.parse(c).root === c;
  }
  function r(d, c, p, y) {
    if (y) return s(d, c, p);
    if (p)
      return u(c), s(d, c, p);
    if (t.existsSync(c)) throw new Error("dest already exists.");
    return s(d, c, p);
  }
  function s(d, c, p) {
    try {
      t.renameSync(d, c);
    } catch (y) {
      if (y.code !== "EXDEV") throw y;
      return a(d, c, p);
    }
  }
  function a(d, c, p) {
    return l(d, c, {
      overwrite: p,
      errorOnExist: !0
    }), u(d);
  }
  return kn = e, kn;
}
var qn, Va;
function sd() {
  if (Va) return qn;
  Va = 1;
  const t = Qe().fromCallback;
  return qn = {
    move: t(/* @__PURE__ */ od()),
    moveSync: /* @__PURE__ */ ad()
  }, qn;
}
var Mn, Ya;
function At() {
  return Ya || (Ya = 1, Mn = {
    // Export promiseified graceful-fs:
    .../* @__PURE__ */ Yt(),
    // Export extra methods:
    .../* @__PURE__ */ Bo(),
    .../* @__PURE__ */ Vf(),
    .../* @__PURE__ */ Zf(),
    .../* @__PURE__ */ id(),
    .../* @__PURE__ */ ct(),
    .../* @__PURE__ */ sd(),
    .../* @__PURE__ */ Ho(),
    .../* @__PURE__ */ Ut(),
    .../* @__PURE__ */ Qr()
  }), Mn;
}
var er = {}, It = {}, Bn = {}, Nt = {}, Ja;
function Go() {
  if (Ja) return Nt;
  Ja = 1, Object.defineProperty(Nt, "__esModule", { value: !0 }), Nt.CancellationError = Nt.CancellationToken = void 0;
  const t = Kr;
  let o = class extends t.EventEmitter {
    get cancelled() {
      return this._cancelled || this._parent != null && this._parent.cancelled;
    }
    set parent(n) {
      this.removeParentCancelHandler(), this._parent = n, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
    }
    // babel cannot compile ... correctly for super calls
    constructor(n) {
      super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, n != null && (this.parent = n);
    }
    cancel() {
      this._cancelled = !0, this.emit("cancel");
    }
    onCancel(n) {
      this.cancelled ? n() : this.once("cancel", n);
    }
    createPromise(n) {
      if (this.cancelled)
        return Promise.reject(new l());
      const i = () => {
        if (e != null)
          try {
            this.removeListener("cancel", e), e = null;
          } catch {
          }
      };
      let e = null;
      return new Promise((f, r) => {
        let s = null;
        if (e = () => {
          try {
            s != null && (s(), s = null);
          } finally {
            r(new l());
          }
        }, this.cancelled) {
          e();
          return;
        }
        this.onCancel(e), n(f, r, (a) => {
          s = a;
        });
      }).then((f) => (i(), f)).catch((f) => {
        throw i(), f;
      });
    }
    removeParentCancelHandler() {
      const n = this._parent;
      n != null && this.parentCancelHandler != null && (n.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
    }
    dispose() {
      try {
        this.removeParentCancelHandler();
      } finally {
        this.removeAllListeners(), this._parent = null;
      }
    }
  };
  Nt.CancellationToken = o;
  class l extends Error {
    constructor() {
      super("cancelled");
    }
  }
  return Nt.CancellationError = l, Nt;
}
var Mr = {}, Xa;
function Zr() {
  if (Xa) return Mr;
  Xa = 1, Object.defineProperty(Mr, "__esModule", { value: !0 }), Mr.newError = t;
  function t(o, l) {
    const u = new Error(o);
    return u.code = l, u;
  }
  return Mr;
}
var je = {}, Br = { exports: {} }, jr = { exports: {} }, jn, Ka;
function ld() {
  if (Ka) return jn;
  Ka = 1;
  var t = 1e3, o = t * 60, l = o * 60, u = l * 24, n = u * 7, i = u * 365.25;
  jn = function(a, d) {
    d = d || {};
    var c = typeof a;
    if (c === "string" && a.length > 0)
      return e(a);
    if (c === "number" && isFinite(a))
      return d.long ? r(a) : f(a);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(a)
    );
  };
  function e(a) {
    if (a = String(a), !(a.length > 100)) {
      var d = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        a
      );
      if (d) {
        var c = parseFloat(d[1]), p = (d[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return c * i;
          case "weeks":
          case "week":
          case "w":
            return c * n;
          case "days":
          case "day":
          case "d":
            return c * u;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return c * l;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return c * o;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return c * t;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return c;
          default:
            return;
        }
      }
    }
  }
  function f(a) {
    var d = Math.abs(a);
    return d >= u ? Math.round(a / u) + "d" : d >= l ? Math.round(a / l) + "h" : d >= o ? Math.round(a / o) + "m" : d >= t ? Math.round(a / t) + "s" : a + "ms";
  }
  function r(a) {
    var d = Math.abs(a);
    return d >= u ? s(a, d, u, "day") : d >= l ? s(a, d, l, "hour") : d >= o ? s(a, d, o, "minute") : d >= t ? s(a, d, t, "second") : a + " ms";
  }
  function s(a, d, c, p) {
    var y = d >= c * 1.5;
    return Math.round(a / c) + " " + p + (y ? "s" : "");
  }
  return jn;
}
var Hn, Qa;
function Zu() {
  if (Qa) return Hn;
  Qa = 1;
  function t(o) {
    u.debug = u, u.default = u, u.coerce = s, u.disable = f, u.enable = i, u.enabled = r, u.humanize = ld(), u.destroy = a, Object.keys(o).forEach((d) => {
      u[d] = o[d];
    }), u.names = [], u.skips = [], u.formatters = {};
    function l(d) {
      let c = 0;
      for (let p = 0; p < d.length; p++)
        c = (c << 5) - c + d.charCodeAt(p), c |= 0;
      return u.colors[Math.abs(c) % u.colors.length];
    }
    u.selectColor = l;
    function u(d) {
      let c, p = null, y, g;
      function m(...E) {
        if (!m.enabled)
          return;
        const A = m, O = Number(/* @__PURE__ */ new Date()), P = O - (c || O);
        A.diff = P, A.prev = c, A.curr = O, c = O, E[0] = u.coerce(E[0]), typeof E[0] != "string" && E.unshift("%O");
        let $ = 0;
        E[0] = E[0].replace(/%([a-zA-Z%])/g, (_, b) => {
          if (_ === "%%")
            return "%";
          $++;
          const w = u.formatters[b];
          if (typeof w == "function") {
            const q = E[$];
            _ = w.call(A, q), E.splice($, 1), $--;
          }
          return _;
        }), u.formatArgs.call(A, E), (A.log || u.log).apply(A, E);
      }
      return m.namespace = d, m.useColors = u.useColors(), m.color = u.selectColor(d), m.extend = n, m.destroy = u.destroy, Object.defineProperty(m, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (y !== u.namespaces && (y = u.namespaces, g = u.enabled(d)), g),
        set: (E) => {
          p = E;
        }
      }), typeof u.init == "function" && u.init(m), m;
    }
    function n(d, c) {
      const p = u(this.namespace + (typeof c > "u" ? ":" : c) + d);
      return p.log = this.log, p;
    }
    function i(d) {
      u.save(d), u.namespaces = d, u.names = [], u.skips = [];
      const c = (typeof d == "string" ? d : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of c)
        p[0] === "-" ? u.skips.push(p.slice(1)) : u.names.push(p);
    }
    function e(d, c) {
      let p = 0, y = 0, g = -1, m = 0;
      for (; p < d.length; )
        if (y < c.length && (c[y] === d[p] || c[y] === "*"))
          c[y] === "*" ? (g = y, m = p, y++) : (p++, y++);
        else if (g !== -1)
          y = g + 1, m++, p = m;
        else
          return !1;
      for (; y < c.length && c[y] === "*"; )
        y++;
      return y === c.length;
    }
    function f() {
      const d = [
        ...u.names,
        ...u.skips.map((c) => "-" + c)
      ].join(",");
      return u.enable(""), d;
    }
    function r(d) {
      for (const c of u.skips)
        if (e(d, c))
          return !1;
      for (const c of u.names)
        if (e(d, c))
          return !0;
      return !1;
    }
    function s(d) {
      return d instanceof Error ? d.stack || d.message : d;
    }
    function a() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return u.enable(u.load()), u;
  }
  return Hn = t, Hn;
}
var Za;
function ud() {
  return Za || (Za = 1, (function(t, o) {
    o.formatArgs = u, o.save = n, o.load = i, o.useColors = l, o.storage = e(), o.destroy = /* @__PURE__ */ (() => {
      let r = !1;
      return () => {
        r || (r = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), o.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function l() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let r;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (r = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(r[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function u(r) {
      if (r[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + r[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors)
        return;
      const s = "color: " + this.color;
      r.splice(1, 0, s, "color: inherit");
      let a = 0, d = 0;
      r[0].replace(/%[a-zA-Z%]/g, (c) => {
        c !== "%%" && (a++, c === "%c" && (d = a));
      }), r.splice(d, 0, s);
    }
    o.log = console.debug || console.log || (() => {
    });
    function n(r) {
      try {
        r ? o.storage.setItem("debug", r) : o.storage.removeItem("debug");
      } catch {
      }
    }
    function i() {
      let r;
      try {
        r = o.storage.getItem("debug") || o.storage.getItem("DEBUG");
      } catch {
      }
      return !r && typeof process < "u" && "env" in process && (r = process.env.DEBUG), r;
    }
    function e() {
      try {
        return localStorage;
      } catch {
      }
    }
    t.exports = Zu()(o);
    const { formatters: f } = t.exports;
    f.j = function(r) {
      try {
        return JSON.stringify(r);
      } catch (s) {
        return "[UnexpectedJSONParseError]: " + s.message;
      }
    };
  })(jr, jr.exports)), jr.exports;
}
var Hr = { exports: {} }, Gn, es;
function cd() {
  return es || (es = 1, Gn = (t, o = process.argv) => {
    const l = t.startsWith("-") ? "" : t.length === 1 ? "-" : "--", u = o.indexOf(l + t), n = o.indexOf("--");
    return u !== -1 && (n === -1 || u < n);
  }), Gn;
}
var Wn, ts;
function fd() {
  if (ts) return Wn;
  ts = 1;
  const t = bt, o = Yu, l = cd(), { env: u } = process;
  let n;
  l("no-color") || l("no-colors") || l("color=false") || l("color=never") ? n = 0 : (l("color") || l("colors") || l("color=true") || l("color=always")) && (n = 1), "FORCE_COLOR" in u && (u.FORCE_COLOR === "true" ? n = 1 : u.FORCE_COLOR === "false" ? n = 0 : n = u.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(u.FORCE_COLOR, 10), 3));
  function i(r) {
    return r === 0 ? !1 : {
      level: r,
      hasBasic: !0,
      has256: r >= 2,
      has16m: r >= 3
    };
  }
  function e(r, s) {
    if (n === 0)
      return 0;
    if (l("color=16m") || l("color=full") || l("color=truecolor"))
      return 3;
    if (l("color=256"))
      return 2;
    if (r && !s && n === void 0)
      return 0;
    const a = n || 0;
    if (u.TERM === "dumb")
      return a;
    if (process.platform === "win32") {
      const d = t.release().split(".");
      return Number(d[0]) >= 10 && Number(d[2]) >= 10586 ? Number(d[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in u)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((d) => d in u) || u.CI_NAME === "codeship" ? 1 : a;
    if ("TEAMCITY_VERSION" in u)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(u.TEAMCITY_VERSION) ? 1 : 0;
    if (u.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in u) {
      const d = parseInt((u.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (u.TERM_PROGRAM) {
        case "iTerm.app":
          return d >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(u.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(u.TERM) || "COLORTERM" in u ? 1 : a;
  }
  function f(r) {
    const s = e(r, r && r.isTTY);
    return i(s);
  }
  return Wn = {
    supportsColor: f,
    stdout: i(e(!0, o.isatty(1))),
    stderr: i(e(!0, o.isatty(2)))
  }, Wn;
}
var rs;
function dd() {
  return rs || (rs = 1, (function(t, o) {
    const l = Yu, u = Xr;
    o.init = a, o.log = f, o.formatArgs = i, o.save = r, o.load = s, o.useColors = n, o.destroy = u.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), o.colors = [6, 2, 3, 4, 5, 1];
    try {
      const c = fd();
      c && (c.stderr || c).level >= 2 && (o.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    o.inspectOpts = Object.keys(process.env).filter((c) => /^debug_/i.test(c)).reduce((c, p) => {
      const y = p.substring(6).toLowerCase().replace(/_([a-z])/g, (m, E) => E.toUpperCase());
      let g = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(g) ? g = !0 : /^(no|off|false|disabled)$/i.test(g) ? g = !1 : g === "null" ? g = null : g = Number(g), c[y] = g, c;
    }, {});
    function n() {
      return "colors" in o.inspectOpts ? !!o.inspectOpts.colors : l.isatty(process.stderr.fd);
    }
    function i(c) {
      const { namespace: p, useColors: y } = this;
      if (y) {
        const g = this.color, m = "\x1B[3" + (g < 8 ? g : "8;5;" + g), E = `  ${m};1m${p} \x1B[0m`;
        c[0] = E + c[0].split(`
`).join(`
` + E), c.push(m + "m+" + t.exports.humanize(this.diff) + "\x1B[0m");
      } else
        c[0] = e() + p + " " + c[0];
    }
    function e() {
      return o.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function f(...c) {
      return process.stderr.write(u.formatWithOptions(o.inspectOpts, ...c) + `
`);
    }
    function r(c) {
      c ? process.env.DEBUG = c : delete process.env.DEBUG;
    }
    function s() {
      return process.env.DEBUG;
    }
    function a(c) {
      c.inspectOpts = {};
      const p = Object.keys(o.inspectOpts);
      for (let y = 0; y < p.length; y++)
        c.inspectOpts[p[y]] = o.inspectOpts[p[y]];
    }
    t.exports = Zu()(o);
    const { formatters: d } = t.exports;
    d.o = function(c) {
      return this.inspectOpts.colors = this.useColors, u.inspect(c, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, d.O = function(c) {
      return this.inspectOpts.colors = this.useColors, u.inspect(c, this.inspectOpts);
    };
  })(Hr, Hr.exports)), Hr.exports;
}
var ns;
function hd() {
  return ns || (ns = 1, typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Br.exports = ud() : Br.exports = dd()), Br.exports;
}
var tr = {}, is;
function ec() {
  if (is) return tr;
  is = 1, Object.defineProperty(tr, "__esModule", { value: !0 }), tr.ProgressCallbackTransform = void 0;
  const t = Ar;
  let o = class extends t.Transform {
    constructor(u, n, i) {
      super(), this.total = u, this.cancellationToken = n, this.onProgress = i, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
    }
    _transform(u, n, i) {
      if (this.cancellationToken.cancelled) {
        i(new Error("cancelled"), null);
        return;
      }
      this.transferred += u.length, this.delta += u.length;
      const e = Date.now();
      e >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = e + 1e3, this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.total * 100,
        bytesPerSecond: Math.round(this.transferred / ((e - this.start) / 1e3))
      }), this.delta = 0), i(null, u);
    }
    _flush(u) {
      if (this.cancellationToken.cancelled) {
        u(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.total,
        delta: this.delta,
        transferred: this.total,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, u(null);
    }
  };
  return tr.ProgressCallbackTransform = o, tr;
}
var os;
function pd() {
  if (os) return je;
  os = 1, Object.defineProperty(je, "__esModule", { value: !0 }), je.DigestTransform = je.HttpExecutor = je.HttpError = void 0, je.createHttpError = s, je.parseJson = c, je.configureRequestOptionsFromUrl = y, je.configureRequestUrl = g, je.safeGetHeader = A, je.configureRequestOptions = P, je.safeStringifyJson = $;
  const t = Tr, o = hd(), l = Ke, u = Ar, n = Vt, i = Go(), e = Zr(), f = ec(), r = (0, o.default)("electron-builder");
  function s(T, _ = null) {
    return new d(T.statusCode || -1, `${T.statusCode} ${T.statusMessage}` + (_ == null ? "" : `
` + JSON.stringify(_, null, "  ")) + `
Headers: ` + $(T.headers), _);
  }
  const a = /* @__PURE__ */ new Map([
    [429, "Too many requests"],
    [400, "Bad request"],
    [403, "Forbidden"],
    [404, "Not found"],
    [405, "Method not allowed"],
    [406, "Not acceptable"],
    [408, "Request timeout"],
    [413, "Request entity too large"],
    [500, "Internal server error"],
    [502, "Bad gateway"],
    [503, "Service unavailable"],
    [504, "Gateway timeout"],
    [505, "HTTP version not supported"]
  ]);
  class d extends Error {
    constructor(_, b = `HTTP error: ${a.get(_) || _}`, w = null) {
      super(b), this.statusCode = _, this.description = w, this.name = "HttpError", this.code = `HTTP_ERROR_${_}`;
    }
    isServerError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
  }
  je.HttpError = d;
  function c(T) {
    return T.then((_) => _ == null || _.length === 0 ? null : JSON.parse(_));
  }
  class p {
    constructor() {
      this.maxRedirects = 10;
    }
    request(_, b = new i.CancellationToken(), w) {
      P(_);
      const q = w == null ? void 0 : JSON.stringify(w), U = q ? Buffer.from(q) : void 0;
      if (U != null) {
        r(q);
        const { headers: F, ...M } = _;
        _ = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": U.length,
            ...F
          },
          ...M
        };
      }
      return this.doApiRequest(_, b, (F) => F.end(U));
    }
    doApiRequest(_, b, w, q = 0) {
      return r.enabled && r(`Request: ${$(_)}`), b.createPromise((U, F, M) => {
        const I = this.createRequest(_, (x) => {
          try {
            this.handleResponse(x, _, b, U, F, q, w);
          } catch (H) {
            F(H);
          }
        });
        this.addErrorAndTimeoutHandlers(I, F, _.timeout), this.addRedirectHandlers(I, _, F, q, (x) => {
          this.doApiRequest(x, b, w, q).then(U).catch(F);
        }), w(I, F), M(() => I.abort());
      });
    }
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line
    addRedirectHandlers(_, b, w, q, U) {
    }
    addErrorAndTimeoutHandlers(_, b, w = 60 * 1e3) {
      this.addTimeOutHandler(_, b, w), _.on("error", b), _.on("aborted", () => {
        b(new Error("Request has been aborted by the server"));
      });
    }
    handleResponse(_, b, w, q, U, F, M) {
      var I;
      if (r.enabled && r(`Response: ${_.statusCode} ${_.statusMessage}, request options: ${$(b)}`), _.statusCode === 404) {
        U(s(_, `method: ${b.method || "GET"} url: ${b.protocol || "https:"}//${b.hostname}${b.port ? `:${b.port}` : ""}${b.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
        return;
      } else if (_.statusCode === 204) {
        q();
        return;
      }
      const x = (I = _.statusCode) !== null && I !== void 0 ? I : 0, H = x >= 300 && x < 400, D = A(_, "location");
      if (H && D != null) {
        if (F > this.maxRedirects) {
          U(this.createMaxRedirectError());
          return;
        }
        this.doApiRequest(p.prepareRedirectUrlOptions(D, b), w, M, F).then(q).catch(U);
        return;
      }
      _.setEncoding("utf8");
      let Q = "";
      _.on("error", U), _.on("data", (V) => Q += V), _.on("end", () => {
        try {
          if (_.statusCode != null && _.statusCode >= 400) {
            const V = A(_, "content-type"), ne = V != null && (Array.isArray(V) ? V.find((de) => de.includes("json")) != null : V.includes("json"));
            U(s(_, `method: ${b.method || "GET"} url: ${b.protocol || "https:"}//${b.hostname}${b.port ? `:${b.port}` : ""}${b.path}

          Data:
          ${ne ? JSON.stringify(JSON.parse(Q)) : Q}
          `));
          } else
            q(Q.length === 0 ? null : Q);
        } catch (V) {
          U(V);
        }
      });
    }
    async downloadToBuffer(_, b) {
      return await b.cancellationToken.createPromise((w, q, U) => {
        const F = [], M = {
          headers: b.headers || void 0,
          // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
          redirect: "manual"
        };
        g(_, M), P(M), this.doDownload(M, {
          destination: null,
          options: b,
          onCancel: U,
          callback: (I) => {
            I == null ? w(Buffer.concat(F)) : q(I);
          },
          responseHandler: (I, x) => {
            let H = 0;
            I.on("data", (D) => {
              if (H += D.length, H > 524288e3) {
                x(new Error("Maximum allowed size is 500 MB"));
                return;
              }
              F.push(D);
            }), I.on("end", () => {
              x(null);
            });
          }
        }, 0);
      });
    }
    doDownload(_, b, w) {
      const q = this.createRequest(_, (U) => {
        if (U.statusCode >= 400) {
          b.callback(new Error(`Cannot download "${_.protocol || "https:"}//${_.hostname}${_.path}", status ${U.statusCode}: ${U.statusMessage}`));
          return;
        }
        U.on("error", b.callback);
        const F = A(U, "location");
        if (F != null) {
          w < this.maxRedirects ? this.doDownload(p.prepareRedirectUrlOptions(F, _), b, w++) : b.callback(this.createMaxRedirectError());
          return;
        }
        b.responseHandler == null ? O(b, U) : b.responseHandler(U, b.callback);
      });
      this.addErrorAndTimeoutHandlers(q, b.callback, _.timeout), this.addRedirectHandlers(q, _, b.callback, w, (U) => {
        this.doDownload(U, b, w++);
      }), q.end();
    }
    createMaxRedirectError() {
      return new Error(`Too many redirects (> ${this.maxRedirects})`);
    }
    addTimeOutHandler(_, b, w) {
      _.on("socket", (q) => {
        q.setTimeout(w, () => {
          _.abort(), b(new Error("Request timed out"));
        });
      });
    }
    static prepareRedirectUrlOptions(_, b) {
      const w = y(_, { ...b }), q = w.headers;
      if (q?.authorization) {
        const U = new n.URL(_);
        (U.hostname.endsWith(".amazonaws.com") || U.searchParams.has("X-Amz-Credential")) && delete q.authorization;
      }
      return w;
    }
    static retryOnServerError(_, b = 3) {
      for (let w = 0; ; w++)
        try {
          return _();
        } catch (q) {
          if (w < b && (q instanceof d && q.isServerError() || q.code === "EPIPE"))
            continue;
          throw q;
        }
    }
  }
  je.HttpExecutor = p;
  function y(T, _) {
    const b = P(_);
    return g(new n.URL(T), b), b;
  }
  function g(T, _) {
    _.protocol = T.protocol, _.hostname = T.hostname, T.port ? _.port = T.port : _.port && delete _.port, _.path = T.pathname + T.search;
  }
  class m extends u.Transform {
    // noinspection JSUnusedGlobalSymbols
    get actual() {
      return this._actual;
    }
    constructor(_, b = "sha512", w = "base64") {
      super(), this.expected = _, this.algorithm = b, this.encoding = w, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, t.createHash)(b);
    }
    // noinspection JSUnusedGlobalSymbols
    _transform(_, b, w) {
      this.digester.update(_), w(null, _);
    }
    // noinspection JSUnusedGlobalSymbols
    _flush(_) {
      if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
        try {
          this.validate();
        } catch (b) {
          _(b);
          return;
        }
      _(null);
    }
    validate() {
      if (this._actual == null)
        throw (0, e.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
      if (this._actual !== this.expected)
        throw (0, e.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
      return null;
    }
  }
  je.DigestTransform = m;
  function E(T, _, b) {
    return T != null && _ != null && T !== _ ? (b(new Error(`checksum mismatch: expected ${_} but got ${T} (X-Checksum-Sha2 header)`)), !1) : !0;
  }
  function A(T, _) {
    const b = T.headers[_];
    return b == null ? null : Array.isArray(b) ? b.length === 0 ? null : b[b.length - 1] : b;
  }
  function O(T, _) {
    if (!E(A(_, "X-Checksum-Sha2"), T.options.sha2, T.callback))
      return;
    const b = [];
    if (T.options.onProgress != null) {
      const F = A(_, "content-length");
      F != null && b.push(new f.ProgressCallbackTransform(parseInt(F, 10), T.options.cancellationToken, T.options.onProgress));
    }
    const w = T.options.sha512;
    w != null ? b.push(new m(w, "sha512", w.length === 128 && !w.includes("+") && !w.includes("Z") && !w.includes("=") ? "hex" : "base64")) : T.options.sha2 != null && b.push(new m(T.options.sha2, "sha256", "hex"));
    const q = (0, l.createWriteStream)(T.destination);
    b.push(q);
    let U = _;
    for (const F of b)
      F.on("error", (M) => {
        q.close(), T.options.cancellationToken.cancelled || T.callback(M);
      }), U = U.pipe(F);
    q.on("finish", () => {
      q.close(T.callback);
    });
  }
  function P(T, _, b) {
    b != null && (T.method = b), T.headers = { ...T.headers };
    const w = T.headers;
    return _ != null && (w.authorization = _.startsWith("Basic") || _.startsWith("Bearer") ? _ : `token ${_}`), w["User-Agent"] == null && (w["User-Agent"] = "electron-builder"), (b == null || b === "GET" || w["Cache-Control"] == null) && (w["Cache-Control"] = "no-cache"), T.protocol == null && process.versions.electron != null && (T.protocol = "https:"), T;
  }
  function $(T, _) {
    return JSON.stringify(T, (b, w) => b.endsWith("Authorization") || b.endsWith("authorization") || b.endsWith("Password") || b.endsWith("PASSWORD") || b.endsWith("Token") || b.includes("password") || b.includes("token") || _ != null && _.has(b) ? "<stripped sensitive data>" : w, 2);
  }
  return je;
}
var rr = {}, as;
function md() {
  if (as) return rr;
  as = 1, Object.defineProperty(rr, "__esModule", { value: !0 }), rr.MemoLazy = void 0;
  let t = class {
    constructor(u, n) {
      this.selector = u, this.creator = n, this.selected = void 0, this._value = void 0;
    }
    get hasValue() {
      return this._value !== void 0;
    }
    get value() {
      const u = this.selector();
      if (this._value !== void 0 && o(this.selected, u))
        return this._value;
      this.selected = u;
      const n = this.creator(u);
      return this.value = n, n;
    }
    set value(u) {
      this._value = u;
    }
  };
  rr.MemoLazy = t;
  function o(l, u) {
    if (typeof l == "object" && l !== null && (typeof u == "object" && u !== null)) {
      const e = Object.keys(l), f = Object.keys(u);
      return e.length === f.length && e.every((r) => o(l[r], u[r]));
    }
    return l === u;
  }
  return rr;
}
var nr = {}, ss;
function gd() {
  if (ss) return nr;
  ss = 1, Object.defineProperty(nr, "__esModule", { value: !0 }), nr.githubUrl = t, nr.getS3LikeProviderBaseUrl = o;
  function t(i, e = "github.com") {
    return `${i.protocol || "https"}://${i.host || e}`;
  }
  function o(i) {
    const e = i.provider;
    if (e === "s3")
      return l(i);
    if (e === "spaces")
      return n(i);
    throw new Error(`Not supported provider: ${e}`);
  }
  function l(i) {
    let e;
    if (i.accelerate == !0)
      e = `https://${i.bucket}.s3-accelerate.amazonaws.com`;
    else if (i.endpoint != null)
      e = `${i.endpoint}/${i.bucket}`;
    else if (i.bucket.includes(".")) {
      if (i.region == null)
        throw new Error(`Bucket name "${i.bucket}" includes a dot, but S3 region is missing`);
      i.region === "us-east-1" ? e = `https://s3.amazonaws.com/${i.bucket}` : e = `https://s3-${i.region}.amazonaws.com/${i.bucket}`;
    } else i.region === "cn-north-1" ? e = `https://${i.bucket}.s3.${i.region}.amazonaws.com.cn` : e = `https://${i.bucket}.s3.amazonaws.com`;
    return u(e, i.path);
  }
  function u(i, e) {
    return e != null && e.length > 0 && (e.startsWith("/") || (i += "/"), i += e), i;
  }
  function n(i) {
    if (i.name == null)
      throw new Error("name is missing");
    if (i.region == null)
      throw new Error("region is missing");
    return u(`https://${i.name}.${i.region}.digitaloceanspaces.com`, i.path);
  }
  return nr;
}
var Gr = {}, ls;
function yd() {
  if (ls) return Gr;
  ls = 1, Object.defineProperty(Gr, "__esModule", { value: !0 }), Gr.retry = o;
  const t = Go();
  async function o(l, u, n, i = 0, e = 0, f) {
    var r;
    const s = new t.CancellationToken();
    try {
      return await l();
    } catch (a) {
      if ((!((r = f?.(a)) !== null && r !== void 0) || r) && u > 0 && !s.cancelled)
        return await new Promise((d) => setTimeout(d, n + i * e)), await o(l, u - 1, n, i, e + 1, f);
      throw a;
    }
  }
  return Gr;
}
var Wr = {}, us;
function vd() {
  if (us) return Wr;
  us = 1, Object.defineProperty(Wr, "__esModule", { value: !0 }), Wr.parseDn = t;
  function t(o) {
    let l = !1, u = null, n = "", i = 0;
    o = o.trim();
    const e = /* @__PURE__ */ new Map();
    for (let f = 0; f <= o.length; f++) {
      if (f === o.length) {
        u !== null && e.set(u, n);
        break;
      }
      const r = o[f];
      if (l) {
        if (r === '"') {
          l = !1;
          continue;
        }
      } else {
        if (r === '"') {
          l = !0;
          continue;
        }
        if (r === "\\") {
          f++;
          const s = parseInt(o.slice(f, f + 2), 16);
          Number.isNaN(s) ? n += o[f] : (f++, n += String.fromCharCode(s));
          continue;
        }
        if (u === null && r === "=") {
          u = n, n = "";
          continue;
        }
        if (r === "," || r === ";" || r === "+") {
          u !== null && e.set(u, n), u = null, n = "";
          continue;
        }
      }
      if (r === " " && !l) {
        if (n.length === 0)
          continue;
        if (f > i) {
          let s = f;
          for (; o[s] === " "; )
            s++;
          i = s;
        }
        if (i >= o.length || o[i] === "," || o[i] === ";" || u === null && o[i] === "=" || u !== null && o[i] === "+") {
          f = i - 1;
          continue;
        }
      }
      n += r;
    }
    return e;
  }
  return Wr;
}
var xt = {}, cs;
function wd() {
  if (cs) return xt;
  cs = 1, Object.defineProperty(xt, "__esModule", { value: !0 }), xt.nil = xt.UUID = void 0;
  const t = Tr, o = Zr(), l = "options.name must be either a string or a Buffer", u = (0, t.randomBytes)(16);
  u[0] = u[0] | 1;
  const n = {}, i = [];
  for (let d = 0; d < 256; d++) {
    const c = (d + 256).toString(16).substr(1);
    n[c] = d, i[d] = c;
  }
  class e {
    constructor(c) {
      this.ascii = null, this.binary = null;
      const p = e.check(c);
      if (!p)
        throw new Error("not a UUID");
      this.version = p.version, p.format === "ascii" ? this.ascii = c : this.binary = c;
    }
    static v5(c, p) {
      return s(c, "sha1", 80, p);
    }
    toString() {
      return this.ascii == null && (this.ascii = a(this.binary)), this.ascii;
    }
    inspect() {
      return `UUID v${this.version} ${this.toString()}`;
    }
    static check(c, p = 0) {
      if (typeof c == "string")
        return c = c.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(c) ? c === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
          version: (n[c[14] + c[15]] & 240) >> 4,
          variant: f((n[c[19] + c[20]] & 224) >> 5),
          format: "ascii"
        } : !1;
      if (Buffer.isBuffer(c)) {
        if (c.length < p + 16)
          return !1;
        let y = 0;
        for (; y < 16 && c[p + y] === 0; y++)
          ;
        return y === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
          version: (c[p + 6] & 240) >> 4,
          variant: f((c[p + 8] & 224) >> 5),
          format: "binary"
        };
      }
      throw (0, o.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
    }
    // read stringified uuid into a Buffer
    static parse(c) {
      const p = Buffer.allocUnsafe(16);
      let y = 0;
      for (let g = 0; g < 16; g++)
        p[g] = n[c[y++] + c[y++]], (g === 3 || g === 5 || g === 7 || g === 9) && (y += 1);
      return p;
    }
  }
  xt.UUID = e, e.OID = e.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
  function f(d) {
    switch (d) {
      case 0:
      case 1:
      case 3:
        return "ncs";
      case 4:
      case 5:
        return "rfc4122";
      case 6:
        return "microsoft";
      default:
        return "future";
    }
  }
  var r;
  (function(d) {
    d[d.ASCII = 0] = "ASCII", d[d.BINARY = 1] = "BINARY", d[d.OBJECT = 2] = "OBJECT";
  })(r || (r = {}));
  function s(d, c, p, y, g = r.ASCII) {
    const m = (0, t.createHash)(c);
    if (typeof d != "string" && !Buffer.isBuffer(d))
      throw (0, o.newError)(l, "ERR_INVALID_UUID_NAME");
    m.update(y), m.update(d);
    const A = m.digest();
    let O;
    switch (g) {
      case r.BINARY:
        A[6] = A[6] & 15 | p, A[8] = A[8] & 63 | 128, O = A;
        break;
      case r.OBJECT:
        A[6] = A[6] & 15 | p, A[8] = A[8] & 63 | 128, O = new e(A);
        break;
      default:
        O = i[A[0]] + i[A[1]] + i[A[2]] + i[A[3]] + "-" + i[A[4]] + i[A[5]] + "-" + i[A[6] & 15 | p] + i[A[7]] + "-" + i[A[8] & 63 | 128] + i[A[9]] + "-" + i[A[10]] + i[A[11]] + i[A[12]] + i[A[13]] + i[A[14]] + i[A[15]];
        break;
    }
    return O;
  }
  function a(d) {
    return i[d[0]] + i[d[1]] + i[d[2]] + i[d[3]] + "-" + i[d[4]] + i[d[5]] + "-" + i[d[6]] + i[d[7]] + "-" + i[d[8]] + i[d[9]] + "-" + i[d[10]] + i[d[11]] + i[d[12]] + i[d[13]] + i[d[14]] + i[d[15]];
  }
  return xt.nil = new e("00000000-0000-0000-0000-000000000000"), xt;
}
var jt = {}, zn = {}, fs;
function Ed() {
  return fs || (fs = 1, (function(t) {
    (function(o) {
      o.parser = function(S, v) {
        return new u(S, v);
      }, o.SAXParser = u, o.SAXStream = a, o.createStream = s, o.MAX_BUFFER_LENGTH = 64 * 1024;
      var l = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      o.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function u(S, v) {
        if (!(this instanceof u))
          return new u(S, v);
        var j = this;
        i(j), j.q = j.c = "", j.bufferCheckPosition = o.MAX_BUFFER_LENGTH, j.opt = v || {}, j.opt.lowercase = j.opt.lowercase || j.opt.lowercasetags, j.looseCase = j.opt.lowercase ? "toLowerCase" : "toUpperCase", j.tags = [], j.closed = j.closedRoot = j.sawRoot = !1, j.tag = j.error = null, j.strict = !!S, j.noscript = !!(S || j.opt.noscript), j.state = w.BEGIN, j.strictEntities = j.opt.strictEntities, j.ENTITIES = j.strictEntities ? Object.create(o.XML_ENTITIES) : Object.create(o.ENTITIES), j.attribList = [], j.opt.xmlns && (j.ns = Object.create(g)), j.opt.unquotedAttributeValues === void 0 && (j.opt.unquotedAttributeValues = !S), j.trackPosition = j.opt.position !== !1, j.trackPosition && (j.position = j.line = j.column = 0), U(j, "onready");
      }
      Object.create || (Object.create = function(S) {
        function v() {
        }
        v.prototype = S;
        var j = new v();
        return j;
      }), Object.keys || (Object.keys = function(S) {
        var v = [];
        for (var j in S) S.hasOwnProperty(j) && v.push(j);
        return v;
      });
      function n(S) {
        for (var v = Math.max(o.MAX_BUFFER_LENGTH, 10), j = 0, N = 0, ue = l.length; N < ue; N++) {
          var he = S[l[N]].length;
          if (he > v)
            switch (l[N]) {
              case "textNode":
                M(S);
                break;
              case "cdata":
                F(S, "oncdata", S.cdata), S.cdata = "";
                break;
              case "script":
                F(S, "onscript", S.script), S.script = "";
                break;
              default:
                x(S, "Max buffer length exceeded: " + l[N]);
            }
          j = Math.max(j, he);
        }
        var pe = o.MAX_BUFFER_LENGTH - j;
        S.bufferCheckPosition = pe + S.position;
      }
      function i(S) {
        for (var v = 0, j = l.length; v < j; v++)
          S[l[v]] = "";
      }
      function e(S) {
        M(S), S.cdata !== "" && (F(S, "oncdata", S.cdata), S.cdata = ""), S.script !== "" && (F(S, "onscript", S.script), S.script = "");
      }
      u.prototype = {
        end: function() {
          H(this);
        },
        write: ye,
        resume: function() {
          return this.error = null, this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          e(this);
        }
      };
      var f;
      try {
        f = require("stream").Stream;
      } catch {
        f = function() {
        };
      }
      f || (f = function() {
      });
      var r = o.EVENTS.filter(function(S) {
        return S !== "error" && S !== "end";
      });
      function s(S, v) {
        return new a(S, v);
      }
      function a(S, v) {
        if (!(this instanceof a))
          return new a(S, v);
        f.apply(this), this._parser = new u(S, v), this.writable = !0, this.readable = !0;
        var j = this;
        this._parser.onend = function() {
          j.emit("end");
        }, this._parser.onerror = function(N) {
          j.emit("error", N), j._parser.error = null;
        }, this._decoder = null, r.forEach(function(N) {
          Object.defineProperty(j, "on" + N, {
            get: function() {
              return j._parser["on" + N];
            },
            set: function(ue) {
              if (!ue)
                return j.removeAllListeners(N), j._parser["on" + N] = ue, ue;
              j.on(N, ue);
            },
            enumerable: !0,
            configurable: !1
          });
        });
      }
      a.prototype = Object.create(f.prototype, {
        constructor: {
          value: a
        }
      }), a.prototype.write = function(S) {
        if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(S)) {
          if (!this._decoder) {
            var v = Ff.StringDecoder;
            this._decoder = new v("utf8");
          }
          S = this._decoder.write(S);
        }
        return this._parser.write(S.toString()), this.emit("data", S), !0;
      }, a.prototype.end = function(S) {
        return S && S.length && this.write(S), this._parser.end(), !0;
      }, a.prototype.on = function(S, v) {
        var j = this;
        return !j._parser["on" + S] && r.indexOf(S) !== -1 && (j._parser["on" + S] = function() {
          var N = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
          N.splice(0, 0, S), j.emit.apply(j, N);
        }), f.prototype.on.call(j, S, v);
      };
      var d = "[CDATA[", c = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", y = "http://www.w3.org/2000/xmlns/", g = { xml: p, xmlns: y }, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, E = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, A = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, O = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function P(S) {
        return S === " " || S === `
` || S === "\r" || S === "	";
      }
      function $(S) {
        return S === '"' || S === "'";
      }
      function T(S) {
        return S === ">" || P(S);
      }
      function _(S, v) {
        return S.test(v);
      }
      function b(S, v) {
        return !_(S, v);
      }
      var w = 0;
      o.STATE = {
        BEGIN: w++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: w++,
        // leading whitespace
        TEXT: w++,
        // general stuff
        TEXT_ENTITY: w++,
        // &amp and such.
        OPEN_WAKA: w++,
        // <
        SGML_DECL: w++,
        // <!BLARG
        SGML_DECL_QUOTED: w++,
        // <!BLARG foo "bar
        DOCTYPE: w++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: w++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: w++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: w++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: w++,
        // <!-
        COMMENT: w++,
        // <!--
        COMMENT_ENDING: w++,
        // <!-- blah -
        COMMENT_ENDED: w++,
        // <!-- blah --
        CDATA: w++,
        // <![CDATA[ something
        CDATA_ENDING: w++,
        // ]
        CDATA_ENDING_2: w++,
        // ]]
        PROC_INST: w++,
        // <?hi
        PROC_INST_BODY: w++,
        // <?hi there
        PROC_INST_ENDING: w++,
        // <?hi "there" ?
        OPEN_TAG: w++,
        // <strong
        OPEN_TAG_SLASH: w++,
        // <strong /
        ATTRIB: w++,
        // <a
        ATTRIB_NAME: w++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: w++,
        // <a foo _
        ATTRIB_VALUE: w++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: w++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: w++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: w++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: w++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: w++,
        // <foo bar=&quot
        CLOSE_TAG: w++,
        // </a
        CLOSE_TAG_SAW_WHITE: w++,
        // </a   >
        SCRIPT: w++,
        // <script> ...
        SCRIPT_ENDING: w++
        // <script> ... <
      }, o.XML_ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'"
      }, o.ENTITIES = {
        amp: "&",
        gt: ">",
        lt: "<",
        quot: '"',
        apos: "'",
        AElig: 198,
        Aacute: 193,
        Acirc: 194,
        Agrave: 192,
        Aring: 197,
        Atilde: 195,
        Auml: 196,
        Ccedil: 199,
        ETH: 208,
        Eacute: 201,
        Ecirc: 202,
        Egrave: 200,
        Euml: 203,
        Iacute: 205,
        Icirc: 206,
        Igrave: 204,
        Iuml: 207,
        Ntilde: 209,
        Oacute: 211,
        Ocirc: 212,
        Ograve: 210,
        Oslash: 216,
        Otilde: 213,
        Ouml: 214,
        THORN: 222,
        Uacute: 218,
        Ucirc: 219,
        Ugrave: 217,
        Uuml: 220,
        Yacute: 221,
        aacute: 225,
        acirc: 226,
        aelig: 230,
        agrave: 224,
        aring: 229,
        atilde: 227,
        auml: 228,
        ccedil: 231,
        eacute: 233,
        ecirc: 234,
        egrave: 232,
        eth: 240,
        euml: 235,
        iacute: 237,
        icirc: 238,
        igrave: 236,
        iuml: 239,
        ntilde: 241,
        oacute: 243,
        ocirc: 244,
        ograve: 242,
        oslash: 248,
        otilde: 245,
        ouml: 246,
        szlig: 223,
        thorn: 254,
        uacute: 250,
        ucirc: 251,
        ugrave: 249,
        uuml: 252,
        yacute: 253,
        yuml: 255,
        copy: 169,
        reg: 174,
        nbsp: 160,
        iexcl: 161,
        cent: 162,
        pound: 163,
        curren: 164,
        yen: 165,
        brvbar: 166,
        sect: 167,
        uml: 168,
        ordf: 170,
        laquo: 171,
        not: 172,
        shy: 173,
        macr: 175,
        deg: 176,
        plusmn: 177,
        sup1: 185,
        sup2: 178,
        sup3: 179,
        acute: 180,
        micro: 181,
        para: 182,
        middot: 183,
        cedil: 184,
        ordm: 186,
        raquo: 187,
        frac14: 188,
        frac12: 189,
        frac34: 190,
        iquest: 191,
        times: 215,
        divide: 247,
        OElig: 338,
        oelig: 339,
        Scaron: 352,
        scaron: 353,
        Yuml: 376,
        fnof: 402,
        circ: 710,
        tilde: 732,
        Alpha: 913,
        Beta: 914,
        Gamma: 915,
        Delta: 916,
        Epsilon: 917,
        Zeta: 918,
        Eta: 919,
        Theta: 920,
        Iota: 921,
        Kappa: 922,
        Lambda: 923,
        Mu: 924,
        Nu: 925,
        Xi: 926,
        Omicron: 927,
        Pi: 928,
        Rho: 929,
        Sigma: 931,
        Tau: 932,
        Upsilon: 933,
        Phi: 934,
        Chi: 935,
        Psi: 936,
        Omega: 937,
        alpha: 945,
        beta: 946,
        gamma: 947,
        delta: 948,
        epsilon: 949,
        zeta: 950,
        eta: 951,
        theta: 952,
        iota: 953,
        kappa: 954,
        lambda: 955,
        mu: 956,
        nu: 957,
        xi: 958,
        omicron: 959,
        pi: 960,
        rho: 961,
        sigmaf: 962,
        sigma: 963,
        tau: 964,
        upsilon: 965,
        phi: 966,
        chi: 967,
        psi: 968,
        omega: 969,
        thetasym: 977,
        upsih: 978,
        piv: 982,
        ensp: 8194,
        emsp: 8195,
        thinsp: 8201,
        zwnj: 8204,
        zwj: 8205,
        lrm: 8206,
        rlm: 8207,
        ndash: 8211,
        mdash: 8212,
        lsquo: 8216,
        rsquo: 8217,
        sbquo: 8218,
        ldquo: 8220,
        rdquo: 8221,
        bdquo: 8222,
        dagger: 8224,
        Dagger: 8225,
        bull: 8226,
        hellip: 8230,
        permil: 8240,
        prime: 8242,
        Prime: 8243,
        lsaquo: 8249,
        rsaquo: 8250,
        oline: 8254,
        frasl: 8260,
        euro: 8364,
        image: 8465,
        weierp: 8472,
        real: 8476,
        trade: 8482,
        alefsym: 8501,
        larr: 8592,
        uarr: 8593,
        rarr: 8594,
        darr: 8595,
        harr: 8596,
        crarr: 8629,
        lArr: 8656,
        uArr: 8657,
        rArr: 8658,
        dArr: 8659,
        hArr: 8660,
        forall: 8704,
        part: 8706,
        exist: 8707,
        empty: 8709,
        nabla: 8711,
        isin: 8712,
        notin: 8713,
        ni: 8715,
        prod: 8719,
        sum: 8721,
        minus: 8722,
        lowast: 8727,
        radic: 8730,
        prop: 8733,
        infin: 8734,
        ang: 8736,
        and: 8743,
        or: 8744,
        cap: 8745,
        cup: 8746,
        int: 8747,
        there4: 8756,
        sim: 8764,
        cong: 8773,
        asymp: 8776,
        ne: 8800,
        equiv: 8801,
        le: 8804,
        ge: 8805,
        sub: 8834,
        sup: 8835,
        nsub: 8836,
        sube: 8838,
        supe: 8839,
        oplus: 8853,
        otimes: 8855,
        perp: 8869,
        sdot: 8901,
        lceil: 8968,
        rceil: 8969,
        lfloor: 8970,
        rfloor: 8971,
        lang: 9001,
        rang: 9002,
        loz: 9674,
        spades: 9824,
        clubs: 9827,
        hearts: 9829,
        diams: 9830
      }, Object.keys(o.ENTITIES).forEach(function(S) {
        var v = o.ENTITIES[S], j = typeof v == "number" ? String.fromCharCode(v) : v;
        o.ENTITIES[S] = j;
      });
      for (var q in o.STATE)
        o.STATE[o.STATE[q]] = q;
      w = o.STATE;
      function U(S, v, j) {
        S[v] && S[v](j);
      }
      function F(S, v, j) {
        S.textNode && M(S), U(S, v, j);
      }
      function M(S) {
        S.textNode = I(S.opt, S.textNode), S.textNode && U(S, "ontext", S.textNode), S.textNode = "";
      }
      function I(S, v) {
        return S.trim && (v = v.trim()), S.normalize && (v = v.replace(/\s+/g, " ")), v;
      }
      function x(S, v) {
        return M(S), S.trackPosition && (v += `
Line: ` + S.line + `
Column: ` + S.column + `
Char: ` + S.c), v = new Error(v), S.error = v, U(S, "onerror", v), S;
      }
      function H(S) {
        return S.sawRoot && !S.closedRoot && D(S, "Unclosed root tag"), S.state !== w.BEGIN && S.state !== w.BEGIN_WHITESPACE && S.state !== w.TEXT && x(S, "Unexpected end"), M(S), S.c = "", S.closed = !0, U(S, "onend"), u.call(S, S.strict, S.opt), S;
      }
      function D(S, v) {
        if (typeof S != "object" || !(S instanceof u))
          throw new Error("bad call to strictFail");
        S.strict && x(S, v);
      }
      function Q(S) {
        S.strict || (S.tagName = S.tagName[S.looseCase]());
        var v = S.tags[S.tags.length - 1] || S, j = S.tag = { name: S.tagName, attributes: {} };
        S.opt.xmlns && (j.ns = v.ns), S.attribList.length = 0, F(S, "onopentagstart", j);
      }
      function V(S, v) {
        var j = S.indexOf(":"), N = j < 0 ? ["", S] : S.split(":"), ue = N[0], he = N[1];
        return v && S === "xmlns" && (ue = "xmlns", he = ""), { prefix: ue, local: he };
      }
      function ne(S) {
        if (S.strict || (S.attribName = S.attribName[S.looseCase]()), S.attribList.indexOf(S.attribName) !== -1 || S.tag.attributes.hasOwnProperty(S.attribName)) {
          S.attribName = S.attribValue = "";
          return;
        }
        if (S.opt.xmlns) {
          var v = V(S.attribName, !0), j = v.prefix, N = v.local;
          if (j === "xmlns")
            if (N === "xml" && S.attribValue !== p)
              D(
                S,
                "xml: prefix must be bound to " + p + `
Actual: ` + S.attribValue
              );
            else if (N === "xmlns" && S.attribValue !== y)
              D(
                S,
                "xmlns: prefix must be bound to " + y + `
Actual: ` + S.attribValue
              );
            else {
              var ue = S.tag, he = S.tags[S.tags.length - 1] || S;
              ue.ns === he.ns && (ue.ns = Object.create(he.ns)), ue.ns[N] = S.attribValue;
            }
          S.attribList.push([S.attribName, S.attribValue]);
        } else
          S.tag.attributes[S.attribName] = S.attribValue, F(S, "onattribute", {
            name: S.attribName,
            value: S.attribValue
          });
        S.attribName = S.attribValue = "";
      }
      function de(S, v) {
        if (S.opt.xmlns) {
          var j = S.tag, N = V(S.tagName);
          j.prefix = N.prefix, j.local = N.local, j.uri = j.ns[N.prefix] || "", j.prefix && !j.uri && (D(
            S,
            "Unbound namespace prefix: " + JSON.stringify(S.tagName)
          ), j.uri = N.prefix);
          var ue = S.tags[S.tags.length - 1] || S;
          j.ns && ue.ns !== j.ns && Object.keys(j.ns).forEach(function(h) {
            F(S, "onopennamespace", {
              prefix: h,
              uri: j.ns[h]
            });
          });
          for (var he = 0, pe = S.attribList.length; he < pe; he++) {
            var Ae = S.attribList[he], Ee = Ae[0], Ve = Ae[1], Re = V(Ee, !0), Ge = Re.prefix, mt = Re.local, ft = Ge === "" ? "" : j.ns[Ge] || "", ut = {
              name: Ee,
              value: Ve,
              prefix: Ge,
              local: mt,
              uri: ft
            };
            Ge && Ge !== "xmlns" && !ft && (D(
              S,
              "Unbound namespace prefix: " + JSON.stringify(Ge)
            ), ut.uri = Ge), S.tag.attributes[Ee] = ut, F(S, "onattribute", ut);
          }
          S.attribList.length = 0;
        }
        S.tag.isSelfClosing = !!v, S.sawRoot = !0, S.tags.push(S.tag), F(S, "onopentag", S.tag), v || (!S.noscript && S.tagName.toLowerCase() === "script" ? S.state = w.SCRIPT : S.state = w.TEXT, S.tag = null, S.tagName = ""), S.attribName = S.attribValue = "", S.attribList.length = 0;
      }
      function ce(S) {
        if (!S.tagName) {
          D(S, "Weird empty close tag."), S.textNode += "</>", S.state = w.TEXT;
          return;
        }
        if (S.script) {
          if (S.tagName !== "script") {
            S.script += "</" + S.tagName + ">", S.tagName = "", S.state = w.SCRIPT;
            return;
          }
          F(S, "onscript", S.script), S.script = "";
        }
        var v = S.tags.length, j = S.tagName;
        S.strict || (j = j[S.looseCase]());
        for (var N = j; v--; ) {
          var ue = S.tags[v];
          if (ue.name !== N)
            D(S, "Unexpected close tag");
          else
            break;
        }
        if (v < 0) {
          D(S, "Unmatched closing tag: " + S.tagName), S.textNode += "</" + S.tagName + ">", S.state = w.TEXT;
          return;
        }
        S.tagName = j;
        for (var he = S.tags.length; he-- > v; ) {
          var pe = S.tag = S.tags.pop();
          S.tagName = S.tag.name, F(S, "onclosetag", S.tagName);
          var Ae = {};
          for (var Ee in pe.ns)
            Ae[Ee] = pe.ns[Ee];
          var Ve = S.tags[S.tags.length - 1] || S;
          S.opt.xmlns && pe.ns !== Ve.ns && Object.keys(pe.ns).forEach(function(Re) {
            var Ge = pe.ns[Re];
            F(S, "onclosenamespace", { prefix: Re, uri: Ge });
          });
        }
        v === 0 && (S.closedRoot = !0), S.tagName = S.attribValue = S.attribName = "", S.attribList.length = 0, S.state = w.TEXT;
      }
      function ge(S) {
        var v = S.entity, j = v.toLowerCase(), N, ue = "";
        return S.ENTITIES[v] ? S.ENTITIES[v] : S.ENTITIES[j] ? S.ENTITIES[j] : (v = j, v.charAt(0) === "#" && (v.charAt(1) === "x" ? (v = v.slice(2), N = parseInt(v, 16), ue = N.toString(16)) : (v = v.slice(1), N = parseInt(v, 10), ue = N.toString(10))), v = v.replace(/^0+/, ""), isNaN(N) || ue.toLowerCase() !== v || N < 0 || N > 1114111 ? (D(S, "Invalid character entity"), "&" + S.entity + ";") : String.fromCodePoint(N));
      }
      function we(S, v) {
        v === "<" ? (S.state = w.OPEN_WAKA, S.startTagPosition = S.position) : P(v) || (D(S, "Non-whitespace before first tag."), S.textNode = v, S.state = w.TEXT);
      }
      function K(S, v) {
        var j = "";
        return v < S.length && (j = S.charAt(v)), j;
      }
      function ye(S) {
        var v = this;
        if (this.error)
          throw this.error;
        if (v.closed)
          return x(
            v,
            "Cannot write after close. Assign an onready handler."
          );
        if (S === null)
          return H(v);
        typeof S == "object" && (S = S.toString());
        for (var j = 0, N = ""; N = K(S, j++), v.c = N, !!N; )
          switch (v.trackPosition && (v.position++, N === `
` ? (v.line++, v.column = 0) : v.column++), v.state) {
            case w.BEGIN:
              if (v.state = w.BEGIN_WHITESPACE, N === "\uFEFF")
                continue;
              we(v, N);
              continue;
            case w.BEGIN_WHITESPACE:
              we(v, N);
              continue;
            case w.TEXT:
              if (v.sawRoot && !v.closedRoot) {
                for (var he = j - 1; N && N !== "<" && N !== "&"; )
                  N = K(S, j++), N && v.trackPosition && (v.position++, N === `
` ? (v.line++, v.column = 0) : v.column++);
                v.textNode += S.substring(he, j - 1);
              }
              N === "<" && !(v.sawRoot && v.closedRoot && !v.strict) ? (v.state = w.OPEN_WAKA, v.startTagPosition = v.position) : (!P(N) && (!v.sawRoot || v.closedRoot) && D(v, "Text data outside of root node."), N === "&" ? v.state = w.TEXT_ENTITY : v.textNode += N);
              continue;
            case w.SCRIPT:
              N === "<" ? v.state = w.SCRIPT_ENDING : v.script += N;
              continue;
            case w.SCRIPT_ENDING:
              N === "/" ? v.state = w.CLOSE_TAG : (v.script += "<" + N, v.state = w.SCRIPT);
              continue;
            case w.OPEN_WAKA:
              if (N === "!")
                v.state = w.SGML_DECL, v.sgmlDecl = "";
              else if (!P(N)) if (_(m, N))
                v.state = w.OPEN_TAG, v.tagName = N;
              else if (N === "/")
                v.state = w.CLOSE_TAG, v.tagName = "";
              else if (N === "?")
                v.state = w.PROC_INST, v.procInstName = v.procInstBody = "";
              else {
                if (D(v, "Unencoded <"), v.startTagPosition + 1 < v.position) {
                  var ue = v.position - v.startTagPosition;
                  N = new Array(ue).join(" ") + N;
                }
                v.textNode += "<" + N, v.state = w.TEXT;
              }
              continue;
            case w.SGML_DECL:
              if (v.sgmlDecl + N === "--") {
                v.state = w.COMMENT, v.comment = "", v.sgmlDecl = "";
                continue;
              }
              v.doctype && v.doctype !== !0 && v.sgmlDecl ? (v.state = w.DOCTYPE_DTD, v.doctype += "<!" + v.sgmlDecl + N, v.sgmlDecl = "") : (v.sgmlDecl + N).toUpperCase() === d ? (F(v, "onopencdata"), v.state = w.CDATA, v.sgmlDecl = "", v.cdata = "") : (v.sgmlDecl + N).toUpperCase() === c ? (v.state = w.DOCTYPE, (v.doctype || v.sawRoot) && D(
                v,
                "Inappropriately located doctype declaration"
              ), v.doctype = "", v.sgmlDecl = "") : N === ">" ? (F(v, "onsgmldeclaration", v.sgmlDecl), v.sgmlDecl = "", v.state = w.TEXT) : ($(N) && (v.state = w.SGML_DECL_QUOTED), v.sgmlDecl += N);
              continue;
            case w.SGML_DECL_QUOTED:
              N === v.q && (v.state = w.SGML_DECL, v.q = ""), v.sgmlDecl += N;
              continue;
            case w.DOCTYPE:
              N === ">" ? (v.state = w.TEXT, F(v, "ondoctype", v.doctype), v.doctype = !0) : (v.doctype += N, N === "[" ? v.state = w.DOCTYPE_DTD : $(N) && (v.state = w.DOCTYPE_QUOTED, v.q = N));
              continue;
            case w.DOCTYPE_QUOTED:
              v.doctype += N, N === v.q && (v.q = "", v.state = w.DOCTYPE);
              continue;
            case w.DOCTYPE_DTD:
              N === "]" ? (v.doctype += N, v.state = w.DOCTYPE) : N === "<" ? (v.state = w.OPEN_WAKA, v.startTagPosition = v.position) : $(N) ? (v.doctype += N, v.state = w.DOCTYPE_DTD_QUOTED, v.q = N) : v.doctype += N;
              continue;
            case w.DOCTYPE_DTD_QUOTED:
              v.doctype += N, N === v.q && (v.state = w.DOCTYPE_DTD, v.q = "");
              continue;
            case w.COMMENT:
              N === "-" ? v.state = w.COMMENT_ENDING : v.comment += N;
              continue;
            case w.COMMENT_ENDING:
              N === "-" ? (v.state = w.COMMENT_ENDED, v.comment = I(v.opt, v.comment), v.comment && F(v, "oncomment", v.comment), v.comment = "") : (v.comment += "-" + N, v.state = w.COMMENT);
              continue;
            case w.COMMENT_ENDED:
              N !== ">" ? (D(v, "Malformed comment"), v.comment += "--" + N, v.state = w.COMMENT) : v.doctype && v.doctype !== !0 ? v.state = w.DOCTYPE_DTD : v.state = w.TEXT;
              continue;
            case w.CDATA:
              for (var he = j - 1; N && N !== "]"; )
                N = K(S, j++), N && v.trackPosition && (v.position++, N === `
` ? (v.line++, v.column = 0) : v.column++);
              v.cdata += S.substring(he, j - 1), N === "]" && (v.state = w.CDATA_ENDING);
              continue;
            case w.CDATA_ENDING:
              N === "]" ? v.state = w.CDATA_ENDING_2 : (v.cdata += "]" + N, v.state = w.CDATA);
              continue;
            case w.CDATA_ENDING_2:
              N === ">" ? (v.cdata && F(v, "oncdata", v.cdata), F(v, "onclosecdata"), v.cdata = "", v.state = w.TEXT) : N === "]" ? v.cdata += "]" : (v.cdata += "]]" + N, v.state = w.CDATA);
              continue;
            case w.PROC_INST:
              N === "?" ? v.state = w.PROC_INST_ENDING : P(N) ? v.state = w.PROC_INST_BODY : v.procInstName += N;
              continue;
            case w.PROC_INST_BODY:
              if (!v.procInstBody && P(N))
                continue;
              N === "?" ? v.state = w.PROC_INST_ENDING : v.procInstBody += N;
              continue;
            case w.PROC_INST_ENDING:
              N === ">" ? (F(v, "onprocessinginstruction", {
                name: v.procInstName,
                body: v.procInstBody
              }), v.procInstName = v.procInstBody = "", v.state = w.TEXT) : (v.procInstBody += "?" + N, v.state = w.PROC_INST_BODY);
              continue;
            case w.OPEN_TAG:
              _(E, N) ? v.tagName += N : (Q(v), N === ">" ? de(v) : N === "/" ? v.state = w.OPEN_TAG_SLASH : (P(N) || D(v, "Invalid character in tag name"), v.state = w.ATTRIB));
              continue;
            case w.OPEN_TAG_SLASH:
              N === ">" ? (de(v, !0), ce(v)) : (D(
                v,
                "Forward-slash in opening tag not followed by >"
              ), v.state = w.ATTRIB);
              continue;
            case w.ATTRIB:
              if (P(N))
                continue;
              N === ">" ? de(v) : N === "/" ? v.state = w.OPEN_TAG_SLASH : _(m, N) ? (v.attribName = N, v.attribValue = "", v.state = w.ATTRIB_NAME) : D(v, "Invalid attribute name");
              continue;
            case w.ATTRIB_NAME:
              N === "=" ? v.state = w.ATTRIB_VALUE : N === ">" ? (D(v, "Attribute without value"), v.attribValue = v.attribName, ne(v), de(v)) : P(N) ? v.state = w.ATTRIB_NAME_SAW_WHITE : _(E, N) ? v.attribName += N : D(v, "Invalid attribute name");
              continue;
            case w.ATTRIB_NAME_SAW_WHITE:
              if (N === "=")
                v.state = w.ATTRIB_VALUE;
              else {
                if (P(N))
                  continue;
                D(v, "Attribute without value"), v.tag.attributes[v.attribName] = "", v.attribValue = "", F(v, "onattribute", {
                  name: v.attribName,
                  value: ""
                }), v.attribName = "", N === ">" ? de(v) : _(m, N) ? (v.attribName = N, v.state = w.ATTRIB_NAME) : (D(v, "Invalid attribute name"), v.state = w.ATTRIB);
              }
              continue;
            case w.ATTRIB_VALUE:
              if (P(N))
                continue;
              $(N) ? (v.q = N, v.state = w.ATTRIB_VALUE_QUOTED) : (v.opt.unquotedAttributeValues || x(v, "Unquoted attribute value"), v.state = w.ATTRIB_VALUE_UNQUOTED, v.attribValue = N);
              continue;
            case w.ATTRIB_VALUE_QUOTED:
              if (N !== v.q) {
                N === "&" ? v.state = w.ATTRIB_VALUE_ENTITY_Q : v.attribValue += N;
                continue;
              }
              ne(v), v.q = "", v.state = w.ATTRIB_VALUE_CLOSED;
              continue;
            case w.ATTRIB_VALUE_CLOSED:
              P(N) ? v.state = w.ATTRIB : N === ">" ? de(v) : N === "/" ? v.state = w.OPEN_TAG_SLASH : _(m, N) ? (D(v, "No whitespace between attributes"), v.attribName = N, v.attribValue = "", v.state = w.ATTRIB_NAME) : D(v, "Invalid attribute name");
              continue;
            case w.ATTRIB_VALUE_UNQUOTED:
              if (!T(N)) {
                N === "&" ? v.state = w.ATTRIB_VALUE_ENTITY_U : v.attribValue += N;
                continue;
              }
              ne(v), N === ">" ? de(v) : v.state = w.ATTRIB;
              continue;
            case w.CLOSE_TAG:
              if (v.tagName)
                N === ">" ? ce(v) : _(E, N) ? v.tagName += N : v.script ? (v.script += "</" + v.tagName, v.tagName = "", v.state = w.SCRIPT) : (P(N) || D(v, "Invalid tagname in closing tag"), v.state = w.CLOSE_TAG_SAW_WHITE);
              else {
                if (P(N))
                  continue;
                b(m, N) ? v.script ? (v.script += "</" + N, v.state = w.SCRIPT) : D(v, "Invalid tagname in closing tag.") : v.tagName = N;
              }
              continue;
            case w.CLOSE_TAG_SAW_WHITE:
              if (P(N))
                continue;
              N === ">" ? ce(v) : D(v, "Invalid characters in closing tag");
              continue;
            case w.TEXT_ENTITY:
            case w.ATTRIB_VALUE_ENTITY_Q:
            case w.ATTRIB_VALUE_ENTITY_U:
              var pe, Ae;
              switch (v.state) {
                case w.TEXT_ENTITY:
                  pe = w.TEXT, Ae = "textNode";
                  break;
                case w.ATTRIB_VALUE_ENTITY_Q:
                  pe = w.ATTRIB_VALUE_QUOTED, Ae = "attribValue";
                  break;
                case w.ATTRIB_VALUE_ENTITY_U:
                  pe = w.ATTRIB_VALUE_UNQUOTED, Ae = "attribValue";
                  break;
              }
              if (N === ";") {
                var Ee = ge(v);
                v.opt.unparsedEntities && !Object.values(o.XML_ENTITIES).includes(Ee) ? (v.entity = "", v.state = pe, v.write(Ee)) : (v[Ae] += Ee, v.entity = "", v.state = pe);
              } else _(v.entity.length ? O : A, N) ? v.entity += N : (D(v, "Invalid character in entity name"), v[Ae] += "&" + v.entity + N, v.entity = "", v.state = pe);
              continue;
            default:
              throw new Error(v, "Unknown state: " + v.state);
          }
        return v.position >= v.bufferCheckPosition && n(v), v;
      }
      String.fromCodePoint || (function() {
        var S = String.fromCharCode, v = Math.floor, j = function() {
          var N = 16384, ue = [], he, pe, Ae = -1, Ee = arguments.length;
          if (!Ee)
            return "";
          for (var Ve = ""; ++Ae < Ee; ) {
            var Re = Number(arguments[Ae]);
            if (!isFinite(Re) || // `NaN`, `+Infinity`, or `-Infinity`
            Re < 0 || // not a valid Unicode code point
            Re > 1114111 || // not a valid Unicode code point
            v(Re) !== Re)
              throw RangeError("Invalid code point: " + Re);
            Re <= 65535 ? ue.push(Re) : (Re -= 65536, he = (Re >> 10) + 55296, pe = Re % 1024 + 56320, ue.push(he, pe)), (Ae + 1 === Ee || ue.length > N) && (Ve += S.apply(null, ue), ue.length = 0);
          }
          return Ve;
        };
        Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
          value: j,
          configurable: !0,
          writable: !0
        }) : String.fromCodePoint = j;
      })();
    })(t);
  })(zn)), zn;
}
var ds;
function _d() {
  if (ds) return jt;
  ds = 1, Object.defineProperty(jt, "__esModule", { value: !0 }), jt.XElement = void 0, jt.parseXml = e;
  const t = Ed(), o = Zr();
  class l {
    constructor(r) {
      if (this.name = r, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !r)
        throw (0, o.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
      if (!n(r))
        throw (0, o.newError)(`Invalid element name: ${r}`, "ERR_XML_ELEMENT_INVALID_NAME");
    }
    attribute(r) {
      const s = this.attributes === null ? null : this.attributes[r];
      if (s == null)
        throw (0, o.newError)(`No attribute "${r}"`, "ERR_XML_MISSED_ATTRIBUTE");
      return s;
    }
    removeAttribute(r) {
      this.attributes !== null && delete this.attributes[r];
    }
    element(r, s = !1, a = null) {
      const d = this.elementOrNull(r, s);
      if (d === null)
        throw (0, o.newError)(a || `No element "${r}"`, "ERR_XML_MISSED_ELEMENT");
      return d;
    }
    elementOrNull(r, s = !1) {
      if (this.elements === null)
        return null;
      for (const a of this.elements)
        if (i(a, r, s))
          return a;
      return null;
    }
    getElements(r, s = !1) {
      return this.elements === null ? [] : this.elements.filter((a) => i(a, r, s));
    }
    elementValueOrEmpty(r, s = !1) {
      const a = this.elementOrNull(r, s);
      return a === null ? "" : a.value;
    }
  }
  jt.XElement = l;
  const u = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
  function n(f) {
    return u.test(f);
  }
  function i(f, r, s) {
    const a = f.name;
    return a === r || s === !0 && a.length === r.length && a.toLowerCase() === r.toLowerCase();
  }
  function e(f) {
    let r = null;
    const s = t.parser(!0, {}), a = [];
    return s.onopentag = (d) => {
      const c = new l(d.name);
      if (c.attributes = d.attributes, r === null)
        r = c;
      else {
        const p = a[a.length - 1];
        p.elements == null && (p.elements = []), p.elements.push(c);
      }
      a.push(c);
    }, s.onclosetag = () => {
      a.pop();
    }, s.ontext = (d) => {
      a.length > 0 && (a[a.length - 1].value = d);
    }, s.oncdata = (d) => {
      const c = a[a.length - 1];
      c.value = d, c.isCData = !0;
    }, s.onerror = (d) => {
      throw d;
    }, s.write(f), r;
  }
  return jt;
}
var hs;
function Me() {
  return hs || (hs = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.CURRENT_APP_PACKAGE_FILE_NAME = t.CURRENT_APP_INSTALLER_FILE_NAME = t.XElement = t.parseXml = t.UUID = t.parseDn = t.retry = t.githubUrl = t.getS3LikeProviderBaseUrl = t.ProgressCallbackTransform = t.MemoLazy = t.safeStringifyJson = t.safeGetHeader = t.parseJson = t.HttpExecutor = t.HttpError = t.DigestTransform = t.createHttpError = t.configureRequestUrl = t.configureRequestOptionsFromUrl = t.configureRequestOptions = t.newError = t.CancellationToken = t.CancellationError = void 0, t.asArray = d;
    var o = Go();
    Object.defineProperty(t, "CancellationError", { enumerable: !0, get: function() {
      return o.CancellationError;
    } }), Object.defineProperty(t, "CancellationToken", { enumerable: !0, get: function() {
      return o.CancellationToken;
    } });
    var l = Zr();
    Object.defineProperty(t, "newError", { enumerable: !0, get: function() {
      return l.newError;
    } });
    var u = pd();
    Object.defineProperty(t, "configureRequestOptions", { enumerable: !0, get: function() {
      return u.configureRequestOptions;
    } }), Object.defineProperty(t, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
      return u.configureRequestOptionsFromUrl;
    } }), Object.defineProperty(t, "configureRequestUrl", { enumerable: !0, get: function() {
      return u.configureRequestUrl;
    } }), Object.defineProperty(t, "createHttpError", { enumerable: !0, get: function() {
      return u.createHttpError;
    } }), Object.defineProperty(t, "DigestTransform", { enumerable: !0, get: function() {
      return u.DigestTransform;
    } }), Object.defineProperty(t, "HttpError", { enumerable: !0, get: function() {
      return u.HttpError;
    } }), Object.defineProperty(t, "HttpExecutor", { enumerable: !0, get: function() {
      return u.HttpExecutor;
    } }), Object.defineProperty(t, "parseJson", { enumerable: !0, get: function() {
      return u.parseJson;
    } }), Object.defineProperty(t, "safeGetHeader", { enumerable: !0, get: function() {
      return u.safeGetHeader;
    } }), Object.defineProperty(t, "safeStringifyJson", { enumerable: !0, get: function() {
      return u.safeStringifyJson;
    } });
    var n = md();
    Object.defineProperty(t, "MemoLazy", { enumerable: !0, get: function() {
      return n.MemoLazy;
    } });
    var i = ec();
    Object.defineProperty(t, "ProgressCallbackTransform", { enumerable: !0, get: function() {
      return i.ProgressCallbackTransform;
    } });
    var e = gd();
    Object.defineProperty(t, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
      return e.getS3LikeProviderBaseUrl;
    } }), Object.defineProperty(t, "githubUrl", { enumerable: !0, get: function() {
      return e.githubUrl;
    } });
    var f = yd();
    Object.defineProperty(t, "retry", { enumerable: !0, get: function() {
      return f.retry;
    } });
    var r = vd();
    Object.defineProperty(t, "parseDn", { enumerable: !0, get: function() {
      return r.parseDn;
    } });
    var s = wd();
    Object.defineProperty(t, "UUID", { enumerable: !0, get: function() {
      return s.UUID;
    } });
    var a = _d();
    Object.defineProperty(t, "parseXml", { enumerable: !0, get: function() {
      return a.parseXml;
    } }), Object.defineProperty(t, "XElement", { enumerable: !0, get: function() {
      return a.XElement;
    } }), t.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", t.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
    function d(c) {
      return c == null ? [] : Array.isArray(c) ? c : [c];
    }
  })(Bn)), Bn;
}
var He = {}, zr = {}, wt = {}, ps;
function Rr() {
  if (ps) return wt;
  ps = 1;
  function t(e) {
    return typeof e > "u" || e === null;
  }
  function o(e) {
    return typeof e == "object" && e !== null;
  }
  function l(e) {
    return Array.isArray(e) ? e : t(e) ? [] : [e];
  }
  function u(e, f) {
    var r, s, a, d;
    if (f)
      for (d = Object.keys(f), r = 0, s = d.length; r < s; r += 1)
        a = d[r], e[a] = f[a];
    return e;
  }
  function n(e, f) {
    var r = "", s;
    for (s = 0; s < f; s += 1)
      r += e;
    return r;
  }
  function i(e) {
    return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
  }
  return wt.isNothing = t, wt.isObject = o, wt.toArray = l, wt.repeat = n, wt.isNegativeZero = i, wt.extend = u, wt;
}
var Vn, ms;
function Or() {
  if (ms) return Vn;
  ms = 1;
  function t(l, u) {
    var n = "", i = l.reason || "(unknown reason)";
    return l.mark ? (l.mark.name && (n += 'in "' + l.mark.name + '" '), n += "(" + (l.mark.line + 1) + ":" + (l.mark.column + 1) + ")", !u && l.mark.snippet && (n += `

` + l.mark.snippet), i + " " + n) : i;
  }
  function o(l, u) {
    Error.call(this), this.name = "YAMLException", this.reason = l, this.mark = u, this.message = t(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return o.prototype = Object.create(Error.prototype), o.prototype.constructor = o, o.prototype.toString = function(u) {
    return this.name + ": " + t(this, u);
  }, Vn = o, Vn;
}
var Yn, gs;
function Sd() {
  if (gs) return Yn;
  gs = 1;
  var t = Rr();
  function o(n, i, e, f, r) {
    var s = "", a = "", d = Math.floor(r / 2) - 1;
    return f - i > d && (s = " ... ", i = f - d + s.length), e - f > d && (a = " ...", e = f + d - a.length), {
      str: s + n.slice(i, e).replace(/\t/g, "→") + a,
      pos: f - i + s.length
      // relative position
    };
  }
  function l(n, i) {
    return t.repeat(" ", i - n.length) + n;
  }
  function u(n, i) {
    if (i = Object.create(i || null), !n.buffer) return null;
    i.maxLength || (i.maxLength = 79), typeof i.indent != "number" && (i.indent = 1), typeof i.linesBefore != "number" && (i.linesBefore = 3), typeof i.linesAfter != "number" && (i.linesAfter = 2);
    for (var e = /\r?\n|\r|\0/g, f = [0], r = [], s, a = -1; s = e.exec(n.buffer); )
      r.push(s.index), f.push(s.index + s[0].length), n.position <= s.index && a < 0 && (a = f.length - 2);
    a < 0 && (a = f.length - 1);
    var d = "", c, p, y = Math.min(n.line + i.linesAfter, r.length).toString().length, g = i.maxLength - (i.indent + y + 3);
    for (c = 1; c <= i.linesBefore && !(a - c < 0); c++)
      p = o(
        n.buffer,
        f[a - c],
        r[a - c],
        n.position - (f[a] - f[a - c]),
        g
      ), d = t.repeat(" ", i.indent) + l((n.line - c + 1).toString(), y) + " | " + p.str + `
` + d;
    for (p = o(n.buffer, f[a], r[a], n.position, g), d += t.repeat(" ", i.indent) + l((n.line + 1).toString(), y) + " | " + p.str + `
`, d += t.repeat("-", i.indent + y + 3 + p.pos) + `^
`, c = 1; c <= i.linesAfter && !(a + c >= r.length); c++)
      p = o(
        n.buffer,
        f[a + c],
        r[a + c],
        n.position - (f[a] - f[a + c]),
        g
      ), d += t.repeat(" ", i.indent) + l((n.line + c + 1).toString(), y) + " | " + p.str + `
`;
    return d.replace(/\n$/, "");
  }
  return Yn = u, Yn;
}
var Jn, ys;
function We() {
  if (ys) return Jn;
  ys = 1;
  var t = Or(), o = [
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
  ], l = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function u(i) {
    var e = {};
    return i !== null && Object.keys(i).forEach(function(f) {
      i[f].forEach(function(r) {
        e[String(r)] = f;
      });
    }), e;
  }
  function n(i, e) {
    if (e = e || {}, Object.keys(e).forEach(function(f) {
      if (o.indexOf(f) === -1)
        throw new t('Unknown option "' + f + '" is met in definition of "' + i + '" YAML type.');
    }), this.options = e, this.tag = i, this.kind = e.kind || null, this.resolve = e.resolve || function() {
      return !0;
    }, this.construct = e.construct || function(f) {
      return f;
    }, this.instanceOf = e.instanceOf || null, this.predicate = e.predicate || null, this.represent = e.represent || null, this.representName = e.representName || null, this.defaultStyle = e.defaultStyle || null, this.multi = e.multi || !1, this.styleAliases = u(e.styleAliases || null), l.indexOf(this.kind) === -1)
      throw new t('Unknown kind "' + this.kind + '" is specified for "' + i + '" YAML type.');
  }
  return Jn = n, Jn;
}
var Xn, vs;
function tc() {
  if (vs) return Xn;
  vs = 1;
  var t = Or(), o = We();
  function l(i, e) {
    var f = [];
    return i[e].forEach(function(r) {
      var s = f.length;
      f.forEach(function(a, d) {
        a.tag === r.tag && a.kind === r.kind && a.multi === r.multi && (s = d);
      }), f[s] = r;
    }), f;
  }
  function u() {
    var i = {
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
    }, e, f;
    function r(s) {
      s.multi ? (i.multi[s.kind].push(s), i.multi.fallback.push(s)) : i[s.kind][s.tag] = i.fallback[s.tag] = s;
    }
    for (e = 0, f = arguments.length; e < f; e += 1)
      arguments[e].forEach(r);
    return i;
  }
  function n(i) {
    return this.extend(i);
  }
  return n.prototype.extend = function(e) {
    var f = [], r = [];
    if (e instanceof o)
      r.push(e);
    else if (Array.isArray(e))
      r = r.concat(e);
    else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit)))
      e.implicit && (f = f.concat(e.implicit)), e.explicit && (r = r.concat(e.explicit));
    else
      throw new t("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    f.forEach(function(a) {
      if (!(a instanceof o))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (a.loadKind && a.loadKind !== "scalar")
        throw new t("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (a.multi)
        throw new t("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), r.forEach(function(a) {
      if (!(a instanceof o))
        throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    var s = Object.create(n.prototype);
    return s.implicit = (this.implicit || []).concat(f), s.explicit = (this.explicit || []).concat(r), s.compiledImplicit = l(s, "implicit"), s.compiledExplicit = l(s, "explicit"), s.compiledTypeMap = u(s.compiledImplicit, s.compiledExplicit), s;
  }, Xn = n, Xn;
}
var Kn, ws;
function rc() {
  if (ws) return Kn;
  ws = 1;
  var t = We();
  return Kn = new t("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(o) {
      return o !== null ? o : "";
    }
  }), Kn;
}
var Qn, Es;
function nc() {
  if (Es) return Qn;
  Es = 1;
  var t = We();
  return Qn = new t("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(o) {
      return o !== null ? o : [];
    }
  }), Qn;
}
var Zn, _s;
function ic() {
  if (_s) return Zn;
  _s = 1;
  var t = We();
  return Zn = new t("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(o) {
      return o !== null ? o : {};
    }
  }), Zn;
}
var ei, Ss;
function oc() {
  if (Ss) return ei;
  Ss = 1;
  var t = tc();
  return ei = new t({
    explicit: [
      rc(),
      nc(),
      ic()
    ]
  }), ei;
}
var ti, bs;
function ac() {
  if (bs) return ti;
  bs = 1;
  var t = We();
  function o(n) {
    if (n === null) return !0;
    var i = n.length;
    return i === 1 && n === "~" || i === 4 && (n === "null" || n === "Null" || n === "NULL");
  }
  function l() {
    return null;
  }
  function u(n) {
    return n === null;
  }
  return ti = new t("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: o,
    construct: l,
    predicate: u,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  }), ti;
}
var ri, As;
function sc() {
  if (As) return ri;
  As = 1;
  var t = We();
  function o(n) {
    if (n === null) return !1;
    var i = n.length;
    return i === 4 && (n === "true" || n === "True" || n === "TRUE") || i === 5 && (n === "false" || n === "False" || n === "FALSE");
  }
  function l(n) {
    return n === "true" || n === "True" || n === "TRUE";
  }
  function u(n) {
    return Object.prototype.toString.call(n) === "[object Boolean]";
  }
  return ri = new t("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: o,
    construct: l,
    predicate: u,
    represent: {
      lowercase: function(n) {
        return n ? "true" : "false";
      },
      uppercase: function(n) {
        return n ? "TRUE" : "FALSE";
      },
      camelcase: function(n) {
        return n ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  }), ri;
}
var ni, Cs;
function lc() {
  if (Cs) return ni;
  Cs = 1;
  var t = Rr(), o = We();
  function l(r) {
    return 48 <= r && r <= 57 || 65 <= r && r <= 70 || 97 <= r && r <= 102;
  }
  function u(r) {
    return 48 <= r && r <= 55;
  }
  function n(r) {
    return 48 <= r && r <= 57;
  }
  function i(r) {
    if (r === null) return !1;
    var s = r.length, a = 0, d = !1, c;
    if (!s) return !1;
    if (c = r[a], (c === "-" || c === "+") && (c = r[++a]), c === "0") {
      if (a + 1 === s) return !0;
      if (c = r[++a], c === "b") {
        for (a++; a < s; a++)
          if (c = r[a], c !== "_") {
            if (c !== "0" && c !== "1") return !1;
            d = !0;
          }
        return d && c !== "_";
      }
      if (c === "x") {
        for (a++; a < s; a++)
          if (c = r[a], c !== "_") {
            if (!l(r.charCodeAt(a))) return !1;
            d = !0;
          }
        return d && c !== "_";
      }
      if (c === "o") {
        for (a++; a < s; a++)
          if (c = r[a], c !== "_") {
            if (!u(r.charCodeAt(a))) return !1;
            d = !0;
          }
        return d && c !== "_";
      }
    }
    if (c === "_") return !1;
    for (; a < s; a++)
      if (c = r[a], c !== "_") {
        if (!n(r.charCodeAt(a)))
          return !1;
        d = !0;
      }
    return !(!d || c === "_");
  }
  function e(r) {
    var s = r, a = 1, d;
    if (s.indexOf("_") !== -1 && (s = s.replace(/_/g, "")), d = s[0], (d === "-" || d === "+") && (d === "-" && (a = -1), s = s.slice(1), d = s[0]), s === "0") return 0;
    if (d === "0") {
      if (s[1] === "b") return a * parseInt(s.slice(2), 2);
      if (s[1] === "x") return a * parseInt(s.slice(2), 16);
      if (s[1] === "o") return a * parseInt(s.slice(2), 8);
    }
    return a * parseInt(s, 10);
  }
  function f(r) {
    return Object.prototype.toString.call(r) === "[object Number]" && r % 1 === 0 && !t.isNegativeZero(r);
  }
  return ni = new o("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: i,
    construct: e,
    predicate: f,
    represent: {
      binary: function(r) {
        return r >= 0 ? "0b" + r.toString(2) : "-0b" + r.toString(2).slice(1);
      },
      octal: function(r) {
        return r >= 0 ? "0o" + r.toString(8) : "-0o" + r.toString(8).slice(1);
      },
      decimal: function(r) {
        return r.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(r) {
        return r >= 0 ? "0x" + r.toString(16).toUpperCase() : "-0x" + r.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), ni;
}
var ii, Ts;
function uc() {
  if (Ts) return ii;
  Ts = 1;
  var t = Rr(), o = We(), l = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function u(r) {
    return !(r === null || !l.test(r) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    r[r.length - 1] === "_");
  }
  function n(r) {
    var s, a;
    return s = r.replace(/_/g, "").toLowerCase(), a = s[0] === "-" ? -1 : 1, "+-".indexOf(s[0]) >= 0 && (s = s.slice(1)), s === ".inf" ? a === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : s === ".nan" ? NaN : a * parseFloat(s, 10);
  }
  var i = /^[-+]?[0-9]+e/;
  function e(r, s) {
    var a;
    if (isNaN(r))
      switch (s) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === r)
      switch (s) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === r)
      switch (s) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (t.isNegativeZero(r))
      return "-0.0";
    return a = r.toString(10), i.test(a) ? a.replace("e", ".e") : a;
  }
  function f(r) {
    return Object.prototype.toString.call(r) === "[object Number]" && (r % 1 !== 0 || t.isNegativeZero(r));
  }
  return ii = new o("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: u,
    construct: n,
    predicate: f,
    represent: e,
    defaultStyle: "lowercase"
  }), ii;
}
var oi, Rs;
function cc() {
  return Rs || (Rs = 1, oi = oc().extend({
    implicit: [
      ac(),
      sc(),
      lc(),
      uc()
    ]
  })), oi;
}
var ai, Os;
function fc() {
  return Os || (Os = 1, ai = cc()), ai;
}
var si, Ps;
function dc() {
  if (Ps) return si;
  Ps = 1;
  var t = We(), o = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), l = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function u(e) {
    return e === null ? !1 : o.exec(e) !== null || l.exec(e) !== null;
  }
  function n(e) {
    var f, r, s, a, d, c, p, y = 0, g = null, m, E, A;
    if (f = o.exec(e), f === null && (f = l.exec(e)), f === null) throw new Error("Date resolve error");
    if (r = +f[1], s = +f[2] - 1, a = +f[3], !f[4])
      return new Date(Date.UTC(r, s, a));
    if (d = +f[4], c = +f[5], p = +f[6], f[7]) {
      for (y = f[7].slice(0, 3); y.length < 3; )
        y += "0";
      y = +y;
    }
    return f[9] && (m = +f[10], E = +(f[11] || 0), g = (m * 60 + E) * 6e4, f[9] === "-" && (g = -g)), A = new Date(Date.UTC(r, s, a, d, c, p, y)), g && A.setTime(A.getTime() - g), A;
  }
  function i(e) {
    return e.toISOString();
  }
  return si = new t("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: u,
    construct: n,
    instanceOf: Date,
    represent: i
  }), si;
}
var li, Ds;
function hc() {
  if (Ds) return li;
  Ds = 1;
  var t = We();
  function o(l) {
    return l === "<<" || l === null;
  }
  return li = new t("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: o
  }), li;
}
var ui, Is;
function pc() {
  if (Is) return ui;
  Is = 1;
  var t = We(), o = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function l(e) {
    if (e === null) return !1;
    var f, r, s = 0, a = e.length, d = o;
    for (r = 0; r < a; r++)
      if (f = d.indexOf(e.charAt(r)), !(f > 64)) {
        if (f < 0) return !1;
        s += 6;
      }
    return s % 8 === 0;
  }
  function u(e) {
    var f, r, s = e.replace(/[\r\n=]/g, ""), a = s.length, d = o, c = 0, p = [];
    for (f = 0; f < a; f++)
      f % 4 === 0 && f && (p.push(c >> 16 & 255), p.push(c >> 8 & 255), p.push(c & 255)), c = c << 6 | d.indexOf(s.charAt(f));
    return r = a % 4 * 6, r === 0 ? (p.push(c >> 16 & 255), p.push(c >> 8 & 255), p.push(c & 255)) : r === 18 ? (p.push(c >> 10 & 255), p.push(c >> 2 & 255)) : r === 12 && p.push(c >> 4 & 255), new Uint8Array(p);
  }
  function n(e) {
    var f = "", r = 0, s, a, d = e.length, c = o;
    for (s = 0; s < d; s++)
      s % 3 === 0 && s && (f += c[r >> 18 & 63], f += c[r >> 12 & 63], f += c[r >> 6 & 63], f += c[r & 63]), r = (r << 8) + e[s];
    return a = d % 3, a === 0 ? (f += c[r >> 18 & 63], f += c[r >> 12 & 63], f += c[r >> 6 & 63], f += c[r & 63]) : a === 2 ? (f += c[r >> 10 & 63], f += c[r >> 4 & 63], f += c[r << 2 & 63], f += c[64]) : a === 1 && (f += c[r >> 2 & 63], f += c[r << 4 & 63], f += c[64], f += c[64]), f;
  }
  function i(e) {
    return Object.prototype.toString.call(e) === "[object Uint8Array]";
  }
  return ui = new t("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: l,
    construct: u,
    predicate: i,
    represent: n
  }), ui;
}
var ci, Ns;
function mc() {
  if (Ns) return ci;
  Ns = 1;
  var t = We(), o = Object.prototype.hasOwnProperty, l = Object.prototype.toString;
  function u(i) {
    if (i === null) return !0;
    var e = [], f, r, s, a, d, c = i;
    for (f = 0, r = c.length; f < r; f += 1) {
      if (s = c[f], d = !1, l.call(s) !== "[object Object]") return !1;
      for (a in s)
        if (o.call(s, a))
          if (!d) d = !0;
          else return !1;
      if (!d) return !1;
      if (e.indexOf(a) === -1) e.push(a);
      else return !1;
    }
    return !0;
  }
  function n(i) {
    return i !== null ? i : [];
  }
  return ci = new t("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: u,
    construct: n
  }), ci;
}
var fi, xs;
function gc() {
  if (xs) return fi;
  xs = 1;
  var t = We(), o = Object.prototype.toString;
  function l(n) {
    if (n === null) return !0;
    var i, e, f, r, s, a = n;
    for (s = new Array(a.length), i = 0, e = a.length; i < e; i += 1) {
      if (f = a[i], o.call(f) !== "[object Object]" || (r = Object.keys(f), r.length !== 1)) return !1;
      s[i] = [r[0], f[r[0]]];
    }
    return !0;
  }
  function u(n) {
    if (n === null) return [];
    var i, e, f, r, s, a = n;
    for (s = new Array(a.length), i = 0, e = a.length; i < e; i += 1)
      f = a[i], r = Object.keys(f), s[i] = [r[0], f[r[0]]];
    return s;
  }
  return fi = new t("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: l,
    construct: u
  }), fi;
}
var di, Ls;
function yc() {
  if (Ls) return di;
  Ls = 1;
  var t = We(), o = Object.prototype.hasOwnProperty;
  function l(n) {
    if (n === null) return !0;
    var i, e = n;
    for (i in e)
      if (o.call(e, i) && e[i] !== null)
        return !1;
    return !0;
  }
  function u(n) {
    return n !== null ? n : {};
  }
  return di = new t("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: l,
    construct: u
  }), di;
}
var hi, Fs;
function Wo() {
  return Fs || (Fs = 1, hi = fc().extend({
    implicit: [
      dc(),
      hc()
    ],
    explicit: [
      pc(),
      mc(),
      gc(),
      yc()
    ]
  })), hi;
}
var Us;
function bd() {
  if (Us) return zr;
  Us = 1;
  var t = Rr(), o = Or(), l = Sd(), u = Wo(), n = Object.prototype.hasOwnProperty, i = 1, e = 2, f = 3, r = 4, s = 1, a = 2, d = 3, c = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, p = /[\x85\u2028\u2029]/, y = /[,\[\]\{\}]/, g = /^(?:!|!!|![a-z\-]+!)$/i, m = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function E(h) {
    return Object.prototype.toString.call(h);
  }
  function A(h) {
    return h === 10 || h === 13;
  }
  function O(h) {
    return h === 9 || h === 32;
  }
  function P(h) {
    return h === 9 || h === 32 || h === 10 || h === 13;
  }
  function $(h) {
    return h === 44 || h === 91 || h === 93 || h === 123 || h === 125;
  }
  function T(h) {
    var B;
    return 48 <= h && h <= 57 ? h - 48 : (B = h | 32, 97 <= B && B <= 102 ? B - 97 + 10 : -1);
  }
  function _(h) {
    return h === 120 ? 2 : h === 117 ? 4 : h === 85 ? 8 : 0;
  }
  function b(h) {
    return 48 <= h && h <= 57 ? h - 48 : -1;
  }
  function w(h) {
    return h === 48 ? "\0" : h === 97 ? "\x07" : h === 98 ? "\b" : h === 116 || h === 9 ? "	" : h === 110 ? `
` : h === 118 ? "\v" : h === 102 ? "\f" : h === 114 ? "\r" : h === 101 ? "\x1B" : h === 32 ? " " : h === 34 ? '"' : h === 47 ? "/" : h === 92 ? "\\" : h === 78 ? "" : h === 95 ? " " : h === 76 ? "\u2028" : h === 80 ? "\u2029" : "";
  }
  function q(h) {
    return h <= 65535 ? String.fromCharCode(h) : String.fromCharCode(
      (h - 65536 >> 10) + 55296,
      (h - 65536 & 1023) + 56320
    );
  }
  function U(h, B, G) {
    B === "__proto__" ? Object.defineProperty(h, B, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: G
    }) : h[B] = G;
  }
  for (var F = new Array(256), M = new Array(256), I = 0; I < 256; I++)
    F[I] = w(I) ? 1 : 0, M[I] = w(I);
  function x(h, B) {
    this.input = h, this.filename = B.filename || null, this.schema = B.schema || u, this.onWarning = B.onWarning || null, this.legacy = B.legacy || !1, this.json = B.json || !1, this.listener = B.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = h.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
  }
  function H(h, B) {
    var G = {
      name: h.filename,
      buffer: h.input.slice(0, -1),
      // omit trailing \0
      position: h.position,
      line: h.line,
      column: h.position - h.lineStart
    };
    return G.snippet = l(G), new o(B, G);
  }
  function D(h, B) {
    throw H(h, B);
  }
  function Q(h, B) {
    h.onWarning && h.onWarning.call(null, H(h, B));
  }
  var V = {
    YAML: function(B, G, re) {
      var W, te, Z;
      B.version !== null && D(B, "duplication of %YAML directive"), re.length !== 1 && D(B, "YAML directive accepts exactly one argument"), W = /^([0-9]+)\.([0-9]+)$/.exec(re[0]), W === null && D(B, "ill-formed argument of the YAML directive"), te = parseInt(W[1], 10), Z = parseInt(W[2], 10), te !== 1 && D(B, "unacceptable YAML version of the document"), B.version = re[0], B.checkLineBreaks = Z < 2, Z !== 1 && Z !== 2 && Q(B, "unsupported YAML version of the document");
    },
    TAG: function(B, G, re) {
      var W, te;
      re.length !== 2 && D(B, "TAG directive accepts exactly two arguments"), W = re[0], te = re[1], g.test(W) || D(B, "ill-formed tag handle (first argument) of the TAG directive"), n.call(B.tagMap, W) && D(B, 'there is a previously declared suffix for "' + W + '" tag handle'), m.test(te) || D(B, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        te = decodeURIComponent(te);
      } catch {
        D(B, "tag prefix is malformed: " + te);
      }
      B.tagMap[W] = te;
    }
  };
  function ne(h, B, G, re) {
    var W, te, Z, oe;
    if (B < G) {
      if (oe = h.input.slice(B, G), re)
        for (W = 0, te = oe.length; W < te; W += 1)
          Z = oe.charCodeAt(W), Z === 9 || 32 <= Z && Z <= 1114111 || D(h, "expected valid JSON character");
      else c.test(oe) && D(h, "the stream contains non-printable characters");
      h.result += oe;
    }
  }
  function de(h, B, G, re) {
    var W, te, Z, oe;
    for (t.isObject(G) || D(h, "cannot merge mappings; the provided source object is unacceptable"), W = Object.keys(G), Z = 0, oe = W.length; Z < oe; Z += 1)
      te = W[Z], n.call(B, te) || (U(B, te, G[te]), re[te] = !0);
  }
  function ce(h, B, G, re, W, te, Z, oe, le) {
    var Oe, Pe;
    if (Array.isArray(W))
      for (W = Array.prototype.slice.call(W), Oe = 0, Pe = W.length; Oe < Pe; Oe += 1)
        Array.isArray(W[Oe]) && D(h, "nested arrays are not supported inside keys"), typeof W == "object" && E(W[Oe]) === "[object Object]" && (W[Oe] = "[object Object]");
    if (typeof W == "object" && E(W) === "[object Object]" && (W = "[object Object]"), W = String(W), B === null && (B = {}), re === "tag:yaml.org,2002:merge")
      if (Array.isArray(te))
        for (Oe = 0, Pe = te.length; Oe < Pe; Oe += 1)
          de(h, B, te[Oe], G);
      else
        de(h, B, te, G);
    else
      !h.json && !n.call(G, W) && n.call(B, W) && (h.line = Z || h.line, h.lineStart = oe || h.lineStart, h.position = le || h.position, D(h, "duplicated mapping key")), U(B, W, te), delete G[W];
    return B;
  }
  function ge(h) {
    var B;
    B = h.input.charCodeAt(h.position), B === 10 ? h.position++ : B === 13 ? (h.position++, h.input.charCodeAt(h.position) === 10 && h.position++) : D(h, "a line break is expected"), h.line += 1, h.lineStart = h.position, h.firstTabInLine = -1;
  }
  function we(h, B, G) {
    for (var re = 0, W = h.input.charCodeAt(h.position); W !== 0; ) {
      for (; O(W); )
        W === 9 && h.firstTabInLine === -1 && (h.firstTabInLine = h.position), W = h.input.charCodeAt(++h.position);
      if (B && W === 35)
        do
          W = h.input.charCodeAt(++h.position);
        while (W !== 10 && W !== 13 && W !== 0);
      if (A(W))
        for (ge(h), W = h.input.charCodeAt(h.position), re++, h.lineIndent = 0; W === 32; )
          h.lineIndent++, W = h.input.charCodeAt(++h.position);
      else
        break;
    }
    return G !== -1 && re !== 0 && h.lineIndent < G && Q(h, "deficient indentation"), re;
  }
  function K(h) {
    var B = h.position, G;
    return G = h.input.charCodeAt(B), !!((G === 45 || G === 46) && G === h.input.charCodeAt(B + 1) && G === h.input.charCodeAt(B + 2) && (B += 3, G = h.input.charCodeAt(B), G === 0 || P(G)));
  }
  function ye(h, B) {
    B === 1 ? h.result += " " : B > 1 && (h.result += t.repeat(`
`, B - 1));
  }
  function S(h, B, G) {
    var re, W, te, Z, oe, le, Oe, Pe, me = h.kind, C = h.result, k;
    if (k = h.input.charCodeAt(h.position), P(k) || $(k) || k === 35 || k === 38 || k === 42 || k === 33 || k === 124 || k === 62 || k === 39 || k === 34 || k === 37 || k === 64 || k === 96 || (k === 63 || k === 45) && (W = h.input.charCodeAt(h.position + 1), P(W) || G && $(W)))
      return !1;
    for (h.kind = "scalar", h.result = "", te = Z = h.position, oe = !1; k !== 0; ) {
      if (k === 58) {
        if (W = h.input.charCodeAt(h.position + 1), P(W) || G && $(W))
          break;
      } else if (k === 35) {
        if (re = h.input.charCodeAt(h.position - 1), P(re))
          break;
      } else {
        if (h.position === h.lineStart && K(h) || G && $(k))
          break;
        if (A(k))
          if (le = h.line, Oe = h.lineStart, Pe = h.lineIndent, we(h, !1, -1), h.lineIndent >= B) {
            oe = !0, k = h.input.charCodeAt(h.position);
            continue;
          } else {
            h.position = Z, h.line = le, h.lineStart = Oe, h.lineIndent = Pe;
            break;
          }
      }
      oe && (ne(h, te, Z, !1), ye(h, h.line - le), te = Z = h.position, oe = !1), O(k) || (Z = h.position + 1), k = h.input.charCodeAt(++h.position);
    }
    return ne(h, te, Z, !1), h.result ? !0 : (h.kind = me, h.result = C, !1);
  }
  function v(h, B) {
    var G, re, W;
    if (G = h.input.charCodeAt(h.position), G !== 39)
      return !1;
    for (h.kind = "scalar", h.result = "", h.position++, re = W = h.position; (G = h.input.charCodeAt(h.position)) !== 0; )
      if (G === 39)
        if (ne(h, re, h.position, !0), G = h.input.charCodeAt(++h.position), G === 39)
          re = h.position, h.position++, W = h.position;
        else
          return !0;
      else A(G) ? (ne(h, re, W, !0), ye(h, we(h, !1, B)), re = W = h.position) : h.position === h.lineStart && K(h) ? D(h, "unexpected end of the document within a single quoted scalar") : (h.position++, W = h.position);
    D(h, "unexpected end of the stream within a single quoted scalar");
  }
  function j(h, B) {
    var G, re, W, te, Z, oe;
    if (oe = h.input.charCodeAt(h.position), oe !== 34)
      return !1;
    for (h.kind = "scalar", h.result = "", h.position++, G = re = h.position; (oe = h.input.charCodeAt(h.position)) !== 0; ) {
      if (oe === 34)
        return ne(h, G, h.position, !0), h.position++, !0;
      if (oe === 92) {
        if (ne(h, G, h.position, !0), oe = h.input.charCodeAt(++h.position), A(oe))
          we(h, !1, B);
        else if (oe < 256 && F[oe])
          h.result += M[oe], h.position++;
        else if ((Z = _(oe)) > 0) {
          for (W = Z, te = 0; W > 0; W--)
            oe = h.input.charCodeAt(++h.position), (Z = T(oe)) >= 0 ? te = (te << 4) + Z : D(h, "expected hexadecimal character");
          h.result += q(te), h.position++;
        } else
          D(h, "unknown escape sequence");
        G = re = h.position;
      } else A(oe) ? (ne(h, G, re, !0), ye(h, we(h, !1, B)), G = re = h.position) : h.position === h.lineStart && K(h) ? D(h, "unexpected end of the document within a double quoted scalar") : (h.position++, re = h.position);
    }
    D(h, "unexpected end of the stream within a double quoted scalar");
  }
  function N(h, B) {
    var G = !0, re, W, te, Z = h.tag, oe, le = h.anchor, Oe, Pe, me, C, k, z = /* @__PURE__ */ Object.create(null), Y, J, ie, ee;
    if (ee = h.input.charCodeAt(h.position), ee === 91)
      Pe = 93, k = !1, oe = [];
    else if (ee === 123)
      Pe = 125, k = !0, oe = {};
    else
      return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = oe), ee = h.input.charCodeAt(++h.position); ee !== 0; ) {
      if (we(h, !0, B), ee = h.input.charCodeAt(h.position), ee === Pe)
        return h.position++, h.tag = Z, h.anchor = le, h.kind = k ? "mapping" : "sequence", h.result = oe, !0;
      G ? ee === 44 && D(h, "expected the node content, but found ','") : D(h, "missed comma between flow collection entries"), J = Y = ie = null, me = C = !1, ee === 63 && (Oe = h.input.charCodeAt(h.position + 1), P(Oe) && (me = C = !0, h.position++, we(h, !0, B))), re = h.line, W = h.lineStart, te = h.position, Re(h, B, i, !1, !0), J = h.tag, Y = h.result, we(h, !0, B), ee = h.input.charCodeAt(h.position), (C || h.line === re) && ee === 58 && (me = !0, ee = h.input.charCodeAt(++h.position), we(h, !0, B), Re(h, B, i, !1, !0), ie = h.result), k ? ce(h, oe, z, J, Y, ie, re, W, te) : me ? oe.push(ce(h, null, z, J, Y, ie, re, W, te)) : oe.push(Y), we(h, !0, B), ee = h.input.charCodeAt(h.position), ee === 44 ? (G = !0, ee = h.input.charCodeAt(++h.position)) : G = !1;
    }
    D(h, "unexpected end of the stream within a flow collection");
  }
  function ue(h, B) {
    var G, re, W = s, te = !1, Z = !1, oe = B, le = 0, Oe = !1, Pe, me;
    if (me = h.input.charCodeAt(h.position), me === 124)
      re = !1;
    else if (me === 62)
      re = !0;
    else
      return !1;
    for (h.kind = "scalar", h.result = ""; me !== 0; )
      if (me = h.input.charCodeAt(++h.position), me === 43 || me === 45)
        s === W ? W = me === 43 ? d : a : D(h, "repeat of a chomping mode identifier");
      else if ((Pe = b(me)) >= 0)
        Pe === 0 ? D(h, "bad explicit indentation width of a block scalar; it cannot be less than one") : Z ? D(h, "repeat of an indentation width identifier") : (oe = B + Pe - 1, Z = !0);
      else
        break;
    if (O(me)) {
      do
        me = h.input.charCodeAt(++h.position);
      while (O(me));
      if (me === 35)
        do
          me = h.input.charCodeAt(++h.position);
        while (!A(me) && me !== 0);
    }
    for (; me !== 0; ) {
      for (ge(h), h.lineIndent = 0, me = h.input.charCodeAt(h.position); (!Z || h.lineIndent < oe) && me === 32; )
        h.lineIndent++, me = h.input.charCodeAt(++h.position);
      if (!Z && h.lineIndent > oe && (oe = h.lineIndent), A(me)) {
        le++;
        continue;
      }
      if (h.lineIndent < oe) {
        W === d ? h.result += t.repeat(`
`, te ? 1 + le : le) : W === s && te && (h.result += `
`);
        break;
      }
      for (re ? O(me) ? (Oe = !0, h.result += t.repeat(`
`, te ? 1 + le : le)) : Oe ? (Oe = !1, h.result += t.repeat(`
`, le + 1)) : le === 0 ? te && (h.result += " ") : h.result += t.repeat(`
`, le) : h.result += t.repeat(`
`, te ? 1 + le : le), te = !0, Z = !0, le = 0, G = h.position; !A(me) && me !== 0; )
        me = h.input.charCodeAt(++h.position);
      ne(h, G, h.position, !1);
    }
    return !0;
  }
  function he(h, B) {
    var G, re = h.tag, W = h.anchor, te = [], Z, oe = !1, le;
    if (h.firstTabInLine !== -1) return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = te), le = h.input.charCodeAt(h.position); le !== 0 && (h.firstTabInLine !== -1 && (h.position = h.firstTabInLine, D(h, "tab characters must not be used in indentation")), !(le !== 45 || (Z = h.input.charCodeAt(h.position + 1), !P(Z)))); ) {
      if (oe = !0, h.position++, we(h, !0, -1) && h.lineIndent <= B) {
        te.push(null), le = h.input.charCodeAt(h.position);
        continue;
      }
      if (G = h.line, Re(h, B, f, !1, !0), te.push(h.result), we(h, !0, -1), le = h.input.charCodeAt(h.position), (h.line === G || h.lineIndent > B) && le !== 0)
        D(h, "bad indentation of a sequence entry");
      else if (h.lineIndent < B)
        break;
    }
    return oe ? (h.tag = re, h.anchor = W, h.kind = "sequence", h.result = te, !0) : !1;
  }
  function pe(h, B, G) {
    var re, W, te, Z, oe, le, Oe = h.tag, Pe = h.anchor, me = {}, C = /* @__PURE__ */ Object.create(null), k = null, z = null, Y = null, J = !1, ie = !1, ee;
    if (h.firstTabInLine !== -1) return !1;
    for (h.anchor !== null && (h.anchorMap[h.anchor] = me), ee = h.input.charCodeAt(h.position); ee !== 0; ) {
      if (!J && h.firstTabInLine !== -1 && (h.position = h.firstTabInLine, D(h, "tab characters must not be used in indentation")), re = h.input.charCodeAt(h.position + 1), te = h.line, (ee === 63 || ee === 58) && P(re))
        ee === 63 ? (J && (ce(h, me, C, k, z, null, Z, oe, le), k = z = Y = null), ie = !0, J = !0, W = !0) : J ? (J = !1, W = !0) : D(h, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), h.position += 1, ee = re;
      else {
        if (Z = h.line, oe = h.lineStart, le = h.position, !Re(h, G, e, !1, !0))
          break;
        if (h.line === te) {
          for (ee = h.input.charCodeAt(h.position); O(ee); )
            ee = h.input.charCodeAt(++h.position);
          if (ee === 58)
            ee = h.input.charCodeAt(++h.position), P(ee) || D(h, "a whitespace character is expected after the key-value separator within a block mapping"), J && (ce(h, me, C, k, z, null, Z, oe, le), k = z = Y = null), ie = !0, J = !1, W = !1, k = h.tag, z = h.result;
          else if (ie)
            D(h, "can not read an implicit mapping pair; a colon is missed");
          else
            return h.tag = Oe, h.anchor = Pe, !0;
        } else if (ie)
          D(h, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return h.tag = Oe, h.anchor = Pe, !0;
      }
      if ((h.line === te || h.lineIndent > B) && (J && (Z = h.line, oe = h.lineStart, le = h.position), Re(h, B, r, !0, W) && (J ? z = h.result : Y = h.result), J || (ce(h, me, C, k, z, Y, Z, oe, le), k = z = Y = null), we(h, !0, -1), ee = h.input.charCodeAt(h.position)), (h.line === te || h.lineIndent > B) && ee !== 0)
        D(h, "bad indentation of a mapping entry");
      else if (h.lineIndent < B)
        break;
    }
    return J && ce(h, me, C, k, z, null, Z, oe, le), ie && (h.tag = Oe, h.anchor = Pe, h.kind = "mapping", h.result = me), ie;
  }
  function Ae(h) {
    var B, G = !1, re = !1, W, te, Z;
    if (Z = h.input.charCodeAt(h.position), Z !== 33) return !1;
    if (h.tag !== null && D(h, "duplication of a tag property"), Z = h.input.charCodeAt(++h.position), Z === 60 ? (G = !0, Z = h.input.charCodeAt(++h.position)) : Z === 33 ? (re = !0, W = "!!", Z = h.input.charCodeAt(++h.position)) : W = "!", B = h.position, G) {
      do
        Z = h.input.charCodeAt(++h.position);
      while (Z !== 0 && Z !== 62);
      h.position < h.length ? (te = h.input.slice(B, h.position), Z = h.input.charCodeAt(++h.position)) : D(h, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; Z !== 0 && !P(Z); )
        Z === 33 && (re ? D(h, "tag suffix cannot contain exclamation marks") : (W = h.input.slice(B - 1, h.position + 1), g.test(W) || D(h, "named tag handle cannot contain such characters"), re = !0, B = h.position + 1)), Z = h.input.charCodeAt(++h.position);
      te = h.input.slice(B, h.position), y.test(te) && D(h, "tag suffix cannot contain flow indicator characters");
    }
    te && !m.test(te) && D(h, "tag name cannot contain such characters: " + te);
    try {
      te = decodeURIComponent(te);
    } catch {
      D(h, "tag name is malformed: " + te);
    }
    return G ? h.tag = te : n.call(h.tagMap, W) ? h.tag = h.tagMap[W] + te : W === "!" ? h.tag = "!" + te : W === "!!" ? h.tag = "tag:yaml.org,2002:" + te : D(h, 'undeclared tag handle "' + W + '"'), !0;
  }
  function Ee(h) {
    var B, G;
    if (G = h.input.charCodeAt(h.position), G !== 38) return !1;
    for (h.anchor !== null && D(h, "duplication of an anchor property"), G = h.input.charCodeAt(++h.position), B = h.position; G !== 0 && !P(G) && !$(G); )
      G = h.input.charCodeAt(++h.position);
    return h.position === B && D(h, "name of an anchor node must contain at least one character"), h.anchor = h.input.slice(B, h.position), !0;
  }
  function Ve(h) {
    var B, G, re;
    if (re = h.input.charCodeAt(h.position), re !== 42) return !1;
    for (re = h.input.charCodeAt(++h.position), B = h.position; re !== 0 && !P(re) && !$(re); )
      re = h.input.charCodeAt(++h.position);
    return h.position === B && D(h, "name of an alias node must contain at least one character"), G = h.input.slice(B, h.position), n.call(h.anchorMap, G) || D(h, 'unidentified alias "' + G + '"'), h.result = h.anchorMap[G], we(h, !0, -1), !0;
  }
  function Re(h, B, G, re, W) {
    var te, Z, oe, le = 1, Oe = !1, Pe = !1, me, C, k, z, Y, J;
    if (h.listener !== null && h.listener("open", h), h.tag = null, h.anchor = null, h.kind = null, h.result = null, te = Z = oe = r === G || f === G, re && we(h, !0, -1) && (Oe = !0, h.lineIndent > B ? le = 1 : h.lineIndent === B ? le = 0 : h.lineIndent < B && (le = -1)), le === 1)
      for (; Ae(h) || Ee(h); )
        we(h, !0, -1) ? (Oe = !0, oe = te, h.lineIndent > B ? le = 1 : h.lineIndent === B ? le = 0 : h.lineIndent < B && (le = -1)) : oe = !1;
    if (oe && (oe = Oe || W), (le === 1 || r === G) && (i === G || e === G ? Y = B : Y = B + 1, J = h.position - h.lineStart, le === 1 ? oe && (he(h, J) || pe(h, J, Y)) || N(h, Y) ? Pe = !0 : (Z && ue(h, Y) || v(h, Y) || j(h, Y) ? Pe = !0 : Ve(h) ? (Pe = !0, (h.tag !== null || h.anchor !== null) && D(h, "alias node should not have any properties")) : S(h, Y, i === G) && (Pe = !0, h.tag === null && (h.tag = "?")), h.anchor !== null && (h.anchorMap[h.anchor] = h.result)) : le === 0 && (Pe = oe && he(h, J))), h.tag === null)
      h.anchor !== null && (h.anchorMap[h.anchor] = h.result);
    else if (h.tag === "?") {
      for (h.result !== null && h.kind !== "scalar" && D(h, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + h.kind + '"'), me = 0, C = h.implicitTypes.length; me < C; me += 1)
        if (z = h.implicitTypes[me], z.resolve(h.result)) {
          h.result = z.construct(h.result), h.tag = z.tag, h.anchor !== null && (h.anchorMap[h.anchor] = h.result);
          break;
        }
    } else if (h.tag !== "!") {
      if (n.call(h.typeMap[h.kind || "fallback"], h.tag))
        z = h.typeMap[h.kind || "fallback"][h.tag];
      else
        for (z = null, k = h.typeMap.multi[h.kind || "fallback"], me = 0, C = k.length; me < C; me += 1)
          if (h.tag.slice(0, k[me].tag.length) === k[me].tag) {
            z = k[me];
            break;
          }
      z || D(h, "unknown tag !<" + h.tag + ">"), h.result !== null && z.kind !== h.kind && D(h, "unacceptable node kind for !<" + h.tag + '> tag; it should be "' + z.kind + '", not "' + h.kind + '"'), z.resolve(h.result, h.tag) ? (h.result = z.construct(h.result, h.tag), h.anchor !== null && (h.anchorMap[h.anchor] = h.result)) : D(h, "cannot resolve a node with !<" + h.tag + "> explicit tag");
    }
    return h.listener !== null && h.listener("close", h), h.tag !== null || h.anchor !== null || Pe;
  }
  function Ge(h) {
    var B = h.position, G, re, W, te = !1, Z;
    for (h.version = null, h.checkLineBreaks = h.legacy, h.tagMap = /* @__PURE__ */ Object.create(null), h.anchorMap = /* @__PURE__ */ Object.create(null); (Z = h.input.charCodeAt(h.position)) !== 0 && (we(h, !0, -1), Z = h.input.charCodeAt(h.position), !(h.lineIndent > 0 || Z !== 37)); ) {
      for (te = !0, Z = h.input.charCodeAt(++h.position), G = h.position; Z !== 0 && !P(Z); )
        Z = h.input.charCodeAt(++h.position);
      for (re = h.input.slice(G, h.position), W = [], re.length < 1 && D(h, "directive name must not be less than one character in length"); Z !== 0; ) {
        for (; O(Z); )
          Z = h.input.charCodeAt(++h.position);
        if (Z === 35) {
          do
            Z = h.input.charCodeAt(++h.position);
          while (Z !== 0 && !A(Z));
          break;
        }
        if (A(Z)) break;
        for (G = h.position; Z !== 0 && !P(Z); )
          Z = h.input.charCodeAt(++h.position);
        W.push(h.input.slice(G, h.position));
      }
      Z !== 0 && ge(h), n.call(V, re) ? V[re](h, re, W) : Q(h, 'unknown document directive "' + re + '"');
    }
    if (we(h, !0, -1), h.lineIndent === 0 && h.input.charCodeAt(h.position) === 45 && h.input.charCodeAt(h.position + 1) === 45 && h.input.charCodeAt(h.position + 2) === 45 ? (h.position += 3, we(h, !0, -1)) : te && D(h, "directives end mark is expected"), Re(h, h.lineIndent - 1, r, !1, !0), we(h, !0, -1), h.checkLineBreaks && p.test(h.input.slice(B, h.position)) && Q(h, "non-ASCII line breaks are interpreted as content"), h.documents.push(h.result), h.position === h.lineStart && K(h)) {
      h.input.charCodeAt(h.position) === 46 && (h.position += 3, we(h, !0, -1));
      return;
    }
    if (h.position < h.length - 1)
      D(h, "end of the stream or a document separator is expected");
    else
      return;
  }
  function mt(h, B) {
    h = String(h), B = B || {}, h.length !== 0 && (h.charCodeAt(h.length - 1) !== 10 && h.charCodeAt(h.length - 1) !== 13 && (h += `
`), h.charCodeAt(0) === 65279 && (h = h.slice(1)));
    var G = new x(h, B), re = h.indexOf("\0");
    for (re !== -1 && (G.position = re, D(G, "null byte is not allowed in input")), G.input += "\0"; G.input.charCodeAt(G.position) === 32; )
      G.lineIndent += 1, G.position += 1;
    for (; G.position < G.length - 1; )
      Ge(G);
    return G.documents;
  }
  function ft(h, B, G) {
    B !== null && typeof B == "object" && typeof G > "u" && (G = B, B = null);
    var re = mt(h, G);
    if (typeof B != "function")
      return re;
    for (var W = 0, te = re.length; W < te; W += 1)
      B(re[W]);
  }
  function ut(h, B) {
    var G = mt(h, B);
    if (G.length !== 0) {
      if (G.length === 1)
        return G[0];
      throw new o("expected a single document in the stream, but found more");
    }
  }
  return zr.loadAll = ft, zr.load = ut, zr;
}
var pi = {}, $s;
function Ad() {
  if ($s) return pi;
  $s = 1;
  var t = Rr(), o = Or(), l = Wo(), u = Object.prototype.toString, n = Object.prototype.hasOwnProperty, i = 65279, e = 9, f = 10, r = 13, s = 32, a = 33, d = 34, c = 35, p = 37, y = 38, g = 39, m = 42, E = 44, A = 45, O = 58, P = 61, $ = 62, T = 63, _ = 64, b = 91, w = 93, q = 96, U = 123, F = 124, M = 125, I = {};
  I[0] = "\\0", I[7] = "\\a", I[8] = "\\b", I[9] = "\\t", I[10] = "\\n", I[11] = "\\v", I[12] = "\\f", I[13] = "\\r", I[27] = "\\e", I[34] = '\\"', I[92] = "\\\\", I[133] = "\\N", I[160] = "\\_", I[8232] = "\\L", I[8233] = "\\P";
  var x = [
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
  ], H = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function D(C, k) {
    var z, Y, J, ie, ee, ae, fe;
    if (k === null) return {};
    for (z = {}, Y = Object.keys(k), J = 0, ie = Y.length; J < ie; J += 1)
      ee = Y[J], ae = String(k[ee]), ee.slice(0, 2) === "!!" && (ee = "tag:yaml.org,2002:" + ee.slice(2)), fe = C.compiledTypeMap.fallback[ee], fe && n.call(fe.styleAliases, ae) && (ae = fe.styleAliases[ae]), z[ee] = ae;
    return z;
  }
  function Q(C) {
    var k, z, Y;
    if (k = C.toString(16).toUpperCase(), C <= 255)
      z = "x", Y = 2;
    else if (C <= 65535)
      z = "u", Y = 4;
    else if (C <= 4294967295)
      z = "U", Y = 8;
    else
      throw new o("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + z + t.repeat("0", Y - k.length) + k;
  }
  var V = 1, ne = 2;
  function de(C) {
    this.schema = C.schema || l, this.indent = Math.max(1, C.indent || 2), this.noArrayIndent = C.noArrayIndent || !1, this.skipInvalid = C.skipInvalid || !1, this.flowLevel = t.isNothing(C.flowLevel) ? -1 : C.flowLevel, this.styleMap = D(this.schema, C.styles || null), this.sortKeys = C.sortKeys || !1, this.lineWidth = C.lineWidth || 80, this.noRefs = C.noRefs || !1, this.noCompatMode = C.noCompatMode || !1, this.condenseFlow = C.condenseFlow || !1, this.quotingType = C.quotingType === '"' ? ne : V, this.forceQuotes = C.forceQuotes || !1, this.replacer = typeof C.replacer == "function" ? C.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  function ce(C, k) {
    for (var z = t.repeat(" ", k), Y = 0, J = -1, ie = "", ee, ae = C.length; Y < ae; )
      J = C.indexOf(`
`, Y), J === -1 ? (ee = C.slice(Y), Y = ae) : (ee = C.slice(Y, J + 1), Y = J + 1), ee.length && ee !== `
` && (ie += z), ie += ee;
    return ie;
  }
  function ge(C, k) {
    return `
` + t.repeat(" ", C.indent * k);
  }
  function we(C, k) {
    var z, Y, J;
    for (z = 0, Y = C.implicitTypes.length; z < Y; z += 1)
      if (J = C.implicitTypes[z], J.resolve(k))
        return !0;
    return !1;
  }
  function K(C) {
    return C === s || C === e;
  }
  function ye(C) {
    return 32 <= C && C <= 126 || 161 <= C && C <= 55295 && C !== 8232 && C !== 8233 || 57344 <= C && C <= 65533 && C !== i || 65536 <= C && C <= 1114111;
  }
  function S(C) {
    return ye(C) && C !== i && C !== r && C !== f;
  }
  function v(C, k, z) {
    var Y = S(C), J = Y && !K(C);
    return (
      // ns-plain-safe
      (z ? (
        // c = flow-in
        Y
      ) : Y && C !== E && C !== b && C !== w && C !== U && C !== M) && C !== c && !(k === O && !J) || S(k) && !K(k) && C === c || k === O && J
    );
  }
  function j(C) {
    return ye(C) && C !== i && !K(C) && C !== A && C !== T && C !== O && C !== E && C !== b && C !== w && C !== U && C !== M && C !== c && C !== y && C !== m && C !== a && C !== F && C !== P && C !== $ && C !== g && C !== d && C !== p && C !== _ && C !== q;
  }
  function N(C) {
    return !K(C) && C !== O;
  }
  function ue(C, k) {
    var z = C.charCodeAt(k), Y;
    return z >= 55296 && z <= 56319 && k + 1 < C.length && (Y = C.charCodeAt(k + 1), Y >= 56320 && Y <= 57343) ? (z - 55296) * 1024 + Y - 56320 + 65536 : z;
  }
  function he(C) {
    var k = /^\n* /;
    return k.test(C);
  }
  var pe = 1, Ae = 2, Ee = 3, Ve = 4, Re = 5;
  function Ge(C, k, z, Y, J, ie, ee, ae) {
    var fe, Se = 0, Ne = null, Ue = !1, De = !1, Mt = Y !== -1, nt = -1, Ct = j(ue(C, 0)) && N(ue(C, C.length - 1));
    if (k || ee)
      for (fe = 0; fe < C.length; Se >= 65536 ? fe += 2 : fe++) {
        if (Se = ue(C, fe), !ye(Se))
          return Re;
        Ct = Ct && v(Se, Ne, ae), Ne = Se;
      }
    else {
      for (fe = 0; fe < C.length; Se >= 65536 ? fe += 2 : fe++) {
        if (Se = ue(C, fe), Se === f)
          Ue = !0, Mt && (De = De || // Foldable line = too long, and not more-indented.
          fe - nt - 1 > Y && C[nt + 1] !== " ", nt = fe);
        else if (!ye(Se))
          return Re;
        Ct = Ct && v(Se, Ne, ae), Ne = Se;
      }
      De = De || Mt && fe - nt - 1 > Y && C[nt + 1] !== " ";
    }
    return !Ue && !De ? Ct && !ee && !J(C) ? pe : ie === ne ? Re : Ae : z > 9 && he(C) ? Re : ee ? ie === ne ? Re : Ae : De ? Ve : Ee;
  }
  function mt(C, k, z, Y, J) {
    C.dump = (function() {
      if (k.length === 0)
        return C.quotingType === ne ? '""' : "''";
      if (!C.noCompatMode && (x.indexOf(k) !== -1 || H.test(k)))
        return C.quotingType === ne ? '"' + k + '"' : "'" + k + "'";
      var ie = C.indent * Math.max(1, z), ee = C.lineWidth === -1 ? -1 : Math.max(Math.min(C.lineWidth, 40), C.lineWidth - ie), ae = Y || C.flowLevel > -1 && z >= C.flowLevel;
      function fe(Se) {
        return we(C, Se);
      }
      switch (Ge(
        k,
        ae,
        C.indent,
        ee,
        fe,
        C.quotingType,
        C.forceQuotes && !Y,
        J
      )) {
        case pe:
          return k;
        case Ae:
          return "'" + k.replace(/'/g, "''") + "'";
        case Ee:
          return "|" + ft(k, C.indent) + ut(ce(k, ie));
        case Ve:
          return ">" + ft(k, C.indent) + ut(ce(h(k, ee), ie));
        case Re:
          return '"' + G(k) + '"';
        default:
          throw new o("impossible error: invalid scalar style");
      }
    })();
  }
  function ft(C, k) {
    var z = he(C) ? String(k) : "", Y = C[C.length - 1] === `
`, J = Y && (C[C.length - 2] === `
` || C === `
`), ie = J ? "+" : Y ? "" : "-";
    return z + ie + `
`;
  }
  function ut(C) {
    return C[C.length - 1] === `
` ? C.slice(0, -1) : C;
  }
  function h(C, k) {
    for (var z = /(\n+)([^\n]*)/g, Y = (function() {
      var Se = C.indexOf(`
`);
      return Se = Se !== -1 ? Se : C.length, z.lastIndex = Se, B(C.slice(0, Se), k);
    })(), J = C[0] === `
` || C[0] === " ", ie, ee; ee = z.exec(C); ) {
      var ae = ee[1], fe = ee[2];
      ie = fe[0] === " ", Y += ae + (!J && !ie && fe !== "" ? `
` : "") + B(fe, k), J = ie;
    }
    return Y;
  }
  function B(C, k) {
    if (C === "" || C[0] === " ") return C;
    for (var z = / [^ ]/g, Y, J = 0, ie, ee = 0, ae = 0, fe = ""; Y = z.exec(C); )
      ae = Y.index, ae - J > k && (ie = ee > J ? ee : ae, fe += `
` + C.slice(J, ie), J = ie + 1), ee = ae;
    return fe += `
`, C.length - J > k && ee > J ? fe += C.slice(J, ee) + `
` + C.slice(ee + 1) : fe += C.slice(J), fe.slice(1);
  }
  function G(C) {
    for (var k = "", z = 0, Y, J = 0; J < C.length; z >= 65536 ? J += 2 : J++)
      z = ue(C, J), Y = I[z], !Y && ye(z) ? (k += C[J], z >= 65536 && (k += C[J + 1])) : k += Y || Q(z);
    return k;
  }
  function re(C, k, z) {
    var Y = "", J = C.tag, ie, ee, ae;
    for (ie = 0, ee = z.length; ie < ee; ie += 1)
      ae = z[ie], C.replacer && (ae = C.replacer.call(z, String(ie), ae)), (le(C, k, ae, !1, !1) || typeof ae > "u" && le(C, k, null, !1, !1)) && (Y !== "" && (Y += "," + (C.condenseFlow ? "" : " ")), Y += C.dump);
    C.tag = J, C.dump = "[" + Y + "]";
  }
  function W(C, k, z, Y) {
    var J = "", ie = C.tag, ee, ae, fe;
    for (ee = 0, ae = z.length; ee < ae; ee += 1)
      fe = z[ee], C.replacer && (fe = C.replacer.call(z, String(ee), fe)), (le(C, k + 1, fe, !0, !0, !1, !0) || typeof fe > "u" && le(C, k + 1, null, !0, !0, !1, !0)) && ((!Y || J !== "") && (J += ge(C, k)), C.dump && f === C.dump.charCodeAt(0) ? J += "-" : J += "- ", J += C.dump);
    C.tag = ie, C.dump = J || "[]";
  }
  function te(C, k, z) {
    var Y = "", J = C.tag, ie = Object.keys(z), ee, ae, fe, Se, Ne;
    for (ee = 0, ae = ie.length; ee < ae; ee += 1)
      Ne = "", Y !== "" && (Ne += ", "), C.condenseFlow && (Ne += '"'), fe = ie[ee], Se = z[fe], C.replacer && (Se = C.replacer.call(z, fe, Se)), le(C, k, fe, !1, !1) && (C.dump.length > 1024 && (Ne += "? "), Ne += C.dump + (C.condenseFlow ? '"' : "") + ":" + (C.condenseFlow ? "" : " "), le(C, k, Se, !1, !1) && (Ne += C.dump, Y += Ne));
    C.tag = J, C.dump = "{" + Y + "}";
  }
  function Z(C, k, z, Y) {
    var J = "", ie = C.tag, ee = Object.keys(z), ae, fe, Se, Ne, Ue, De;
    if (C.sortKeys === !0)
      ee.sort();
    else if (typeof C.sortKeys == "function")
      ee.sort(C.sortKeys);
    else if (C.sortKeys)
      throw new o("sortKeys must be a boolean or a function");
    for (ae = 0, fe = ee.length; ae < fe; ae += 1)
      De = "", (!Y || J !== "") && (De += ge(C, k)), Se = ee[ae], Ne = z[Se], C.replacer && (Ne = C.replacer.call(z, Se, Ne)), le(C, k + 1, Se, !0, !0, !0) && (Ue = C.tag !== null && C.tag !== "?" || C.dump && C.dump.length > 1024, Ue && (C.dump && f === C.dump.charCodeAt(0) ? De += "?" : De += "? "), De += C.dump, Ue && (De += ge(C, k)), le(C, k + 1, Ne, !0, Ue) && (C.dump && f === C.dump.charCodeAt(0) ? De += ":" : De += ": ", De += C.dump, J += De));
    C.tag = ie, C.dump = J || "{}";
  }
  function oe(C, k, z) {
    var Y, J, ie, ee, ae, fe;
    for (J = z ? C.explicitTypes : C.implicitTypes, ie = 0, ee = J.length; ie < ee; ie += 1)
      if (ae = J[ie], (ae.instanceOf || ae.predicate) && (!ae.instanceOf || typeof k == "object" && k instanceof ae.instanceOf) && (!ae.predicate || ae.predicate(k))) {
        if (z ? ae.multi && ae.representName ? C.tag = ae.representName(k) : C.tag = ae.tag : C.tag = "?", ae.represent) {
          if (fe = C.styleMap[ae.tag] || ae.defaultStyle, u.call(ae.represent) === "[object Function]")
            Y = ae.represent(k, fe);
          else if (n.call(ae.represent, fe))
            Y = ae.represent[fe](k, fe);
          else
            throw new o("!<" + ae.tag + '> tag resolver accepts not "' + fe + '" style');
          C.dump = Y;
        }
        return !0;
      }
    return !1;
  }
  function le(C, k, z, Y, J, ie, ee) {
    C.tag = null, C.dump = z, oe(C, z, !1) || oe(C, z, !0);
    var ae = u.call(C.dump), fe = Y, Se;
    Y && (Y = C.flowLevel < 0 || C.flowLevel > k);
    var Ne = ae === "[object Object]" || ae === "[object Array]", Ue, De;
    if (Ne && (Ue = C.duplicates.indexOf(z), De = Ue !== -1), (C.tag !== null && C.tag !== "?" || De || C.indent !== 2 && k > 0) && (J = !1), De && C.usedDuplicates[Ue])
      C.dump = "*ref_" + Ue;
    else {
      if (Ne && De && !C.usedDuplicates[Ue] && (C.usedDuplicates[Ue] = !0), ae === "[object Object]")
        Y && Object.keys(C.dump).length !== 0 ? (Z(C, k, C.dump, J), De && (C.dump = "&ref_" + Ue + C.dump)) : (te(C, k, C.dump), De && (C.dump = "&ref_" + Ue + " " + C.dump));
      else if (ae === "[object Array]")
        Y && C.dump.length !== 0 ? (C.noArrayIndent && !ee && k > 0 ? W(C, k - 1, C.dump, J) : W(C, k, C.dump, J), De && (C.dump = "&ref_" + Ue + C.dump)) : (re(C, k, C.dump), De && (C.dump = "&ref_" + Ue + " " + C.dump));
      else if (ae === "[object String]")
        C.tag !== "?" && mt(C, C.dump, k, ie, fe);
      else {
        if (ae === "[object Undefined]")
          return !1;
        if (C.skipInvalid) return !1;
        throw new o("unacceptable kind of an object to dump " + ae);
      }
      C.tag !== null && C.tag !== "?" && (Se = encodeURI(
        C.tag[0] === "!" ? C.tag.slice(1) : C.tag
      ).replace(/!/g, "%21"), C.tag[0] === "!" ? Se = "!" + Se : Se.slice(0, 18) === "tag:yaml.org,2002:" ? Se = "!!" + Se.slice(18) : Se = "!<" + Se + ">", C.dump = Se + " " + C.dump);
    }
    return !0;
  }
  function Oe(C, k) {
    var z = [], Y = [], J, ie;
    for (Pe(C, z, Y), J = 0, ie = Y.length; J < ie; J += 1)
      k.duplicates.push(z[Y[J]]);
    k.usedDuplicates = new Array(ie);
  }
  function Pe(C, k, z) {
    var Y, J, ie;
    if (C !== null && typeof C == "object")
      if (J = k.indexOf(C), J !== -1)
        z.indexOf(J) === -1 && z.push(J);
      else if (k.push(C), Array.isArray(C))
        for (J = 0, ie = C.length; J < ie; J += 1)
          Pe(C[J], k, z);
      else
        for (Y = Object.keys(C), J = 0, ie = Y.length; J < ie; J += 1)
          Pe(C[Y[J]], k, z);
  }
  function me(C, k) {
    k = k || {};
    var z = new de(k);
    z.noRefs || Oe(C, z);
    var Y = C;
    return z.replacer && (Y = z.replacer.call({ "": Y }, "", Y)), le(z, 0, Y, !0, !0) ? z.dump + `
` : "";
  }
  return pi.dump = me, pi;
}
var ks;
function zo() {
  if (ks) return He;
  ks = 1;
  var t = bd(), o = Ad();
  function l(u, n) {
    return function() {
      throw new Error("Function yaml." + u + " is removed in js-yaml 4. Use yaml." + n + " instead, which is now safe by default.");
    };
  }
  return He.Type = We(), He.Schema = tc(), He.FAILSAFE_SCHEMA = oc(), He.JSON_SCHEMA = cc(), He.CORE_SCHEMA = fc(), He.DEFAULT_SCHEMA = Wo(), He.load = t.load, He.loadAll = t.loadAll, He.dump = o.dump, He.YAMLException = Or(), He.types = {
    binary: pc(),
    float: uc(),
    map: ic(),
    null: ac(),
    pairs: gc(),
    set: yc(),
    timestamp: dc(),
    bool: sc(),
    int: lc(),
    merge: hc(),
    omap: mc(),
    seq: nc(),
    str: rc()
  }, He.safeLoad = l("safeLoad", "load"), He.safeLoadAll = l("safeLoadAll", "loadAll"), He.safeDump = l("safeDump", "dump"), He;
}
var ir = {}, qs;
function Cd() {
  if (qs) return ir;
  qs = 1, Object.defineProperty(ir, "__esModule", { value: !0 }), ir.Lazy = void 0;
  class t {
    constructor(l) {
      this._value = null, this.creator = l;
    }
    get hasValue() {
      return this.creator == null;
    }
    get value() {
      if (this.creator == null)
        return this._value;
      const l = this.creator();
      return this.value = l, l;
    }
    set value(l) {
      this._value = l, this.creator = null;
    }
  }
  return ir.Lazy = t, ir;
}
var Vr = { exports: {} }, mi, Ms;
function en() {
  if (Ms) return mi;
  Ms = 1;
  const t = "2.0.0", o = 256, l = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991, u = 16, n = o - 6;
  return mi = {
    MAX_LENGTH: o,
    MAX_SAFE_COMPONENT_LENGTH: u,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_SAFE_INTEGER: l,
    RELEASE_TYPES: [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ],
    SEMVER_SPEC_VERSION: t,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  }, mi;
}
var gi, Bs;
function tn() {
  return Bs || (Bs = 1, gi = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...o) => console.error("SEMVER", ...o) : () => {
  }), gi;
}
var js;
function Pr() {
  return js || (js = 1, (function(t, o) {
    const {
      MAX_SAFE_COMPONENT_LENGTH: l,
      MAX_SAFE_BUILD_LENGTH: u,
      MAX_LENGTH: n
    } = en(), i = tn();
    o = t.exports = {};
    const e = o.re = [], f = o.safeRe = [], r = o.src = [], s = o.safeSrc = [], a = o.t = {};
    let d = 0;
    const c = "[a-zA-Z0-9-]", p = [
      ["\\s", 1],
      ["\\d", n],
      [c, u]
    ], y = (m) => {
      for (const [E, A] of p)
        m = m.split(`${E}*`).join(`${E}{0,${A}}`).split(`${E}+`).join(`${E}{1,${A}}`);
      return m;
    }, g = (m, E, A) => {
      const O = y(E), P = d++;
      i(m, P, E), a[m] = P, r[P] = E, s[P] = O, e[P] = new RegExp(E, A ? "g" : void 0), f[P] = new RegExp(O, A ? "g" : void 0);
    };
    g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${c}*`), g("MAINVERSION", `(${r[a.NUMERICIDENTIFIER]})\\.(${r[a.NUMERICIDENTIFIER]})\\.(${r[a.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${r[a.NUMERICIDENTIFIERLOOSE]})\\.(${r[a.NUMERICIDENTIFIERLOOSE]})\\.(${r[a.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${r[a.NONNUMERICIDENTIFIER]}|${r[a.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${r[a.NONNUMERICIDENTIFIER]}|${r[a.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${r[a.PRERELEASEIDENTIFIER]}(?:\\.${r[a.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${r[a.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${r[a.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${c}+`), g("BUILD", `(?:\\+(${r[a.BUILDIDENTIFIER]}(?:\\.${r[a.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${r[a.MAINVERSION]}${r[a.PRERELEASE]}?${r[a.BUILD]}?`), g("FULL", `^${r[a.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${r[a.MAINVERSIONLOOSE]}${r[a.PRERELEASELOOSE]}?${r[a.BUILD]}?`), g("LOOSE", `^${r[a.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${r[a.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${r[a.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${r[a.XRANGEIDENTIFIER]})(?:\\.(${r[a.XRANGEIDENTIFIER]})(?:\\.(${r[a.XRANGEIDENTIFIER]})(?:${r[a.PRERELEASE]})?${r[a.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${r[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${r[a.XRANGEIDENTIFIERLOOSE]})(?:\\.(${r[a.XRANGEIDENTIFIERLOOSE]})(?:${r[a.PRERELEASELOOSE]})?${r[a.BUILD]}?)?)?`), g("XRANGE", `^${r[a.GTLT]}\\s*${r[a.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${r[a.GTLT]}\\s*${r[a.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${l}})(?:\\.(\\d{1,${l}}))?(?:\\.(\\d{1,${l}}))?`), g("COERCE", `${r[a.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", r[a.COERCEPLAIN] + `(?:${r[a.PRERELEASE]})?(?:${r[a.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", r[a.COERCE], !0), g("COERCERTLFULL", r[a.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${r[a.LONETILDE]}\\s+`, !0), o.tildeTrimReplace = "$1~", g("TILDE", `^${r[a.LONETILDE]}${r[a.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${r[a.LONETILDE]}${r[a.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${r[a.LONECARET]}\\s+`, !0), o.caretTrimReplace = "$1^", g("CARET", `^${r[a.LONECARET]}${r[a.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${r[a.LONECARET]}${r[a.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${r[a.GTLT]}\\s*(${r[a.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${r[a.GTLT]}\\s*(${r[a.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${r[a.GTLT]}\\s*(${r[a.LOOSEPLAIN]}|${r[a.XRANGEPLAIN]})`, !0), o.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${r[a.XRANGEPLAIN]})\\s+-\\s+(${r[a.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${r[a.XRANGEPLAINLOOSE]})\\s+-\\s+(${r[a.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(Vr, Vr.exports)), Vr.exports;
}
var yi, Hs;
function Vo() {
  if (Hs) return yi;
  Hs = 1;
  const t = Object.freeze({ loose: !0 }), o = Object.freeze({});
  return yi = (u) => u ? typeof u != "object" ? t : u : o, yi;
}
var vi, Gs;
function vc() {
  if (Gs) return vi;
  Gs = 1;
  const t = /^[0-9]+$/, o = (u, n) => {
    if (typeof u == "number" && typeof n == "number")
      return u === n ? 0 : u < n ? -1 : 1;
    const i = t.test(u), e = t.test(n);
    return i && e && (u = +u, n = +n), u === n ? 0 : i && !e ? -1 : e && !i ? 1 : u < n ? -1 : 1;
  };
  return vi = {
    compareIdentifiers: o,
    rcompareIdentifiers: (u, n) => o(n, u)
  }, vi;
}
var wi, Ws;
function ze() {
  if (Ws) return wi;
  Ws = 1;
  const t = tn(), { MAX_LENGTH: o, MAX_SAFE_INTEGER: l } = en(), { safeRe: u, t: n } = Pr(), i = Vo(), { compareIdentifiers: e } = vc();
  class f {
    constructor(s, a) {
      if (a = i(a), s instanceof f) {
        if (s.loose === !!a.loose && s.includePrerelease === !!a.includePrerelease)
          return s;
        s = s.version;
      } else if (typeof s != "string")
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof s}".`);
      if (s.length > o)
        throw new TypeError(
          `version is longer than ${o} characters`
        );
      t("SemVer", s, a), this.options = a, this.loose = !!a.loose, this.includePrerelease = !!a.includePrerelease;
      const d = s.trim().match(a.loose ? u[n.LOOSE] : u[n.FULL]);
      if (!d)
        throw new TypeError(`Invalid Version: ${s}`);
      if (this.raw = s, this.major = +d[1], this.minor = +d[2], this.patch = +d[3], this.major > l || this.major < 0)
        throw new TypeError("Invalid major version");
      if (this.minor > l || this.minor < 0)
        throw new TypeError("Invalid minor version");
      if (this.patch > l || this.patch < 0)
        throw new TypeError("Invalid patch version");
      d[4] ? this.prerelease = d[4].split(".").map((c) => {
        if (/^[0-9]+$/.test(c)) {
          const p = +c;
          if (p >= 0 && p < l)
            return p;
        }
        return c;
      }) : this.prerelease = [], this.build = d[5] ? d[5].split(".") : [], this.format();
    }
    format() {
      return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
    }
    toString() {
      return this.version;
    }
    compare(s) {
      if (t("SemVer.compare", this.version, this.options, s), !(s instanceof f)) {
        if (typeof s == "string" && s === this.version)
          return 0;
        s = new f(s, this.options);
      }
      return s.version === this.version ? 0 : this.compareMain(s) || this.comparePre(s);
    }
    compareMain(s) {
      return s instanceof f || (s = new f(s, this.options)), this.major < s.major ? -1 : this.major > s.major ? 1 : this.minor < s.minor ? -1 : this.minor > s.minor ? 1 : this.patch < s.patch ? -1 : this.patch > s.patch ? 1 : 0;
    }
    comparePre(s) {
      if (s instanceof f || (s = new f(s, this.options)), this.prerelease.length && !s.prerelease.length)
        return -1;
      if (!this.prerelease.length && s.prerelease.length)
        return 1;
      if (!this.prerelease.length && !s.prerelease.length)
        return 0;
      let a = 0;
      do {
        const d = this.prerelease[a], c = s.prerelease[a];
        if (t("prerelease compare", a, d, c), d === void 0 && c === void 0)
          return 0;
        if (c === void 0)
          return 1;
        if (d === void 0)
          return -1;
        if (d === c)
          continue;
        return e(d, c);
      } while (++a);
    }
    compareBuild(s) {
      s instanceof f || (s = new f(s, this.options));
      let a = 0;
      do {
        const d = this.build[a], c = s.build[a];
        if (t("build compare", a, d, c), d === void 0 && c === void 0)
          return 0;
        if (c === void 0)
          return 1;
        if (d === void 0)
          return -1;
        if (d === c)
          continue;
        return e(d, c);
      } while (++a);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(s, a, d) {
      if (s.startsWith("pre")) {
        if (!a && d === !1)
          throw new Error("invalid increment argument: identifier is empty");
        if (a) {
          const c = `-${a}`.match(this.options.loose ? u[n.PRERELEASELOOSE] : u[n.PRERELEASE]);
          if (!c || c[1] !== a)
            throw new Error(`invalid identifier: ${a}`);
        }
      }
      switch (s) {
        case "premajor":
          this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", a, d);
          break;
        case "preminor":
          this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", a, d);
          break;
        case "prepatch":
          this.prerelease.length = 0, this.inc("patch", a, d), this.inc("pre", a, d);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          this.prerelease.length === 0 && this.inc("patch", a, d), this.inc("pre", a, d);
          break;
        case "release":
          if (this.prerelease.length === 0)
            throw new Error(`version ${this.raw} is not a prerelease`);
          this.prerelease.length = 0;
          break;
        case "major":
          (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
          break;
        case "minor":
          (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
          break;
        case "patch":
          this.prerelease.length === 0 && this.patch++, this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const c = Number(d) ? 1 : 0;
          if (this.prerelease.length === 0)
            this.prerelease = [c];
          else {
            let p = this.prerelease.length;
            for (; --p >= 0; )
              typeof this.prerelease[p] == "number" && (this.prerelease[p]++, p = -2);
            if (p === -1) {
              if (a === this.prerelease.join(".") && d === !1)
                throw new Error("invalid increment argument: identifier already exists");
              this.prerelease.push(c);
            }
          }
          if (a) {
            let p = [a, c];
            d === !1 && (p = [a]), e(this.prerelease[0], a) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = p) : this.prerelease = p;
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${s}`);
      }
      return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
    }
  }
  return wi = f, wi;
}
var Ei, zs;
function Xt() {
  if (zs) return Ei;
  zs = 1;
  const t = ze();
  return Ei = (l, u, n = !1) => {
    if (l instanceof t)
      return l;
    try {
      return new t(l, u);
    } catch (i) {
      if (!n)
        return null;
      throw i;
    }
  }, Ei;
}
var _i, Vs;
function Td() {
  if (Vs) return _i;
  Vs = 1;
  const t = Xt();
  return _i = (l, u) => {
    const n = t(l, u);
    return n ? n.version : null;
  }, _i;
}
var Si, Ys;
function Rd() {
  if (Ys) return Si;
  Ys = 1;
  const t = Xt();
  return Si = (l, u) => {
    const n = t(l.trim().replace(/^[=v]+/, ""), u);
    return n ? n.version : null;
  }, Si;
}
var bi, Js;
function Od() {
  if (Js) return bi;
  Js = 1;
  const t = ze();
  return bi = (l, u, n, i, e) => {
    typeof n == "string" && (e = i, i = n, n = void 0);
    try {
      return new t(
        l instanceof t ? l.version : l,
        n
      ).inc(u, i, e).version;
    } catch {
      return null;
    }
  }, bi;
}
var Ai, Xs;
function Pd() {
  if (Xs) return Ai;
  Xs = 1;
  const t = Xt();
  return Ai = (l, u) => {
    const n = t(l, null, !0), i = t(u, null, !0), e = n.compare(i);
    if (e === 0)
      return null;
    const f = e > 0, r = f ? n : i, s = f ? i : n, a = !!r.prerelease.length;
    if (!!s.prerelease.length && !a) {
      if (!s.patch && !s.minor)
        return "major";
      if (s.compareMain(r) === 0)
        return s.minor && !s.patch ? "minor" : "patch";
    }
    const c = a ? "pre" : "";
    return n.major !== i.major ? c + "major" : n.minor !== i.minor ? c + "minor" : n.patch !== i.patch ? c + "patch" : "prerelease";
  }, Ai;
}
var Ci, Ks;
function Dd() {
  if (Ks) return Ci;
  Ks = 1;
  const t = ze();
  return Ci = (l, u) => new t(l, u).major, Ci;
}
var Ti, Qs;
function Id() {
  if (Qs) return Ti;
  Qs = 1;
  const t = ze();
  return Ti = (l, u) => new t(l, u).minor, Ti;
}
var Ri, Zs;
function Nd() {
  if (Zs) return Ri;
  Zs = 1;
  const t = ze();
  return Ri = (l, u) => new t(l, u).patch, Ri;
}
var Oi, el;
function xd() {
  if (el) return Oi;
  el = 1;
  const t = Xt();
  return Oi = (l, u) => {
    const n = t(l, u);
    return n && n.prerelease.length ? n.prerelease : null;
  }, Oi;
}
var Pi, tl;
function st() {
  if (tl) return Pi;
  tl = 1;
  const t = ze();
  return Pi = (l, u, n) => new t(l, n).compare(new t(u, n)), Pi;
}
var Di, rl;
function Ld() {
  if (rl) return Di;
  rl = 1;
  const t = st();
  return Di = (l, u, n) => t(u, l, n), Di;
}
var Ii, nl;
function Fd() {
  if (nl) return Ii;
  nl = 1;
  const t = st();
  return Ii = (l, u) => t(l, u, !0), Ii;
}
var Ni, il;
function Yo() {
  if (il) return Ni;
  il = 1;
  const t = ze();
  return Ni = (l, u, n) => {
    const i = new t(l, n), e = new t(u, n);
    return i.compare(e) || i.compareBuild(e);
  }, Ni;
}
var xi, ol;
function Ud() {
  if (ol) return xi;
  ol = 1;
  const t = Yo();
  return xi = (l, u) => l.sort((n, i) => t(n, i, u)), xi;
}
var Li, al;
function $d() {
  if (al) return Li;
  al = 1;
  const t = Yo();
  return Li = (l, u) => l.sort((n, i) => t(i, n, u)), Li;
}
var Fi, sl;
function rn() {
  if (sl) return Fi;
  sl = 1;
  const t = st();
  return Fi = (l, u, n) => t(l, u, n) > 0, Fi;
}
var Ui, ll;
function Jo() {
  if (ll) return Ui;
  ll = 1;
  const t = st();
  return Ui = (l, u, n) => t(l, u, n) < 0, Ui;
}
var $i, ul;
function wc() {
  if (ul) return $i;
  ul = 1;
  const t = st();
  return $i = (l, u, n) => t(l, u, n) === 0, $i;
}
var ki, cl;
function Ec() {
  if (cl) return ki;
  cl = 1;
  const t = st();
  return ki = (l, u, n) => t(l, u, n) !== 0, ki;
}
var qi, fl;
function Xo() {
  if (fl) return qi;
  fl = 1;
  const t = st();
  return qi = (l, u, n) => t(l, u, n) >= 0, qi;
}
var Mi, dl;
function Ko() {
  if (dl) return Mi;
  dl = 1;
  const t = st();
  return Mi = (l, u, n) => t(l, u, n) <= 0, Mi;
}
var Bi, hl;
function _c() {
  if (hl) return Bi;
  hl = 1;
  const t = wc(), o = Ec(), l = rn(), u = Xo(), n = Jo(), i = Ko();
  return Bi = (f, r, s, a) => {
    switch (r) {
      case "===":
        return typeof f == "object" && (f = f.version), typeof s == "object" && (s = s.version), f === s;
      case "!==":
        return typeof f == "object" && (f = f.version), typeof s == "object" && (s = s.version), f !== s;
      case "":
      case "=":
      case "==":
        return t(f, s, a);
      case "!=":
        return o(f, s, a);
      case ">":
        return l(f, s, a);
      case ">=":
        return u(f, s, a);
      case "<":
        return n(f, s, a);
      case "<=":
        return i(f, s, a);
      default:
        throw new TypeError(`Invalid operator: ${r}`);
    }
  }, Bi;
}
var ji, pl;
function kd() {
  if (pl) return ji;
  pl = 1;
  const t = ze(), o = Xt(), { safeRe: l, t: u } = Pr();
  return ji = (i, e) => {
    if (i instanceof t)
      return i;
    if (typeof i == "number" && (i = String(i)), typeof i != "string")
      return null;
    e = e || {};
    let f = null;
    if (!e.rtl)
      f = i.match(e.includePrerelease ? l[u.COERCEFULL] : l[u.COERCE]);
    else {
      const p = e.includePrerelease ? l[u.COERCERTLFULL] : l[u.COERCERTL];
      let y;
      for (; (y = p.exec(i)) && (!f || f.index + f[0].length !== i.length); )
        (!f || y.index + y[0].length !== f.index + f[0].length) && (f = y), p.lastIndex = y.index + y[1].length + y[2].length;
      p.lastIndex = -1;
    }
    if (f === null)
      return null;
    const r = f[2], s = f[3] || "0", a = f[4] || "0", d = e.includePrerelease && f[5] ? `-${f[5]}` : "", c = e.includePrerelease && f[6] ? `+${f[6]}` : "";
    return o(`${r}.${s}.${a}${d}${c}`, e);
  }, ji;
}
var Hi, ml;
function qd() {
  if (ml) return Hi;
  ml = 1;
  class t {
    constructor() {
      this.max = 1e3, this.map = /* @__PURE__ */ new Map();
    }
    get(l) {
      const u = this.map.get(l);
      if (u !== void 0)
        return this.map.delete(l), this.map.set(l, u), u;
    }
    delete(l) {
      return this.map.delete(l);
    }
    set(l, u) {
      if (!this.delete(l) && u !== void 0) {
        if (this.map.size >= this.max) {
          const i = this.map.keys().next().value;
          this.delete(i);
        }
        this.map.set(l, u);
      }
      return this;
    }
  }
  return Hi = t, Hi;
}
var Gi, gl;
function lt() {
  if (gl) return Gi;
  gl = 1;
  const t = /\s+/g;
  class o {
    constructor(x, H) {
      if (H = n(H), x instanceof o)
        return x.loose === !!H.loose && x.includePrerelease === !!H.includePrerelease ? x : new o(x.raw, H);
      if (x instanceof i)
        return this.raw = x.value, this.set = [[x]], this.formatted = void 0, this;
      if (this.options = H, this.loose = !!H.loose, this.includePrerelease = !!H.includePrerelease, this.raw = x.trim().replace(t, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((Q) => !g(Q[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const Q of this.set)
            if (Q.length === 1 && m(Q[0])) {
              this.set = [Q];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let x = 0; x < this.set.length; x++) {
          x > 0 && (this.formatted += "||");
          const H = this.set[x];
          for (let D = 0; D < H.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += H[D].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(x) {
      const D = ((this.options.includePrerelease && p) | (this.options.loose && y)) + ":" + x, Q = u.get(D);
      if (Q)
        return Q;
      const V = this.options.loose, ne = V ? r[s.HYPHENRANGELOOSE] : r[s.HYPHENRANGE];
      x = x.replace(ne, F(this.options.includePrerelease)), e("hyphen replace", x), x = x.replace(r[s.COMPARATORTRIM], a), e("comparator trim", x), x = x.replace(r[s.TILDETRIM], d), e("tilde trim", x), x = x.replace(r[s.CARETTRIM], c), e("caret trim", x);
      let de = x.split(" ").map((K) => A(K, this.options)).join(" ").split(/\s+/).map((K) => U(K, this.options));
      V && (de = de.filter((K) => (e("loose invalid filter", K, this.options), !!K.match(r[s.COMPARATORLOOSE])))), e("range list", de);
      const ce = /* @__PURE__ */ new Map(), ge = de.map((K) => new i(K, this.options));
      for (const K of ge) {
        if (g(K))
          return [K];
        ce.set(K.value, K);
      }
      ce.size > 1 && ce.has("") && ce.delete("");
      const we = [...ce.values()];
      return u.set(D, we), we;
    }
    intersects(x, H) {
      if (!(x instanceof o))
        throw new TypeError("a Range is required");
      return this.set.some((D) => E(D, H) && x.set.some((Q) => E(Q, H) && D.every((V) => Q.every((ne) => V.intersects(ne, H)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(x) {
      if (!x)
        return !1;
      if (typeof x == "string")
        try {
          x = new f(x, this.options);
        } catch {
          return !1;
        }
      for (let H = 0; H < this.set.length; H++)
        if (M(this.set[H], x, this.options))
          return !0;
      return !1;
    }
  }
  Gi = o;
  const l = qd(), u = new l(), n = Vo(), i = nn(), e = tn(), f = ze(), {
    safeRe: r,
    t: s,
    comparatorTrimReplace: a,
    tildeTrimReplace: d,
    caretTrimReplace: c
  } = Pr(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: y } = en(), g = (I) => I.value === "<0.0.0-0", m = (I) => I.value === "", E = (I, x) => {
    let H = !0;
    const D = I.slice();
    let Q = D.pop();
    for (; H && D.length; )
      H = D.every((V) => Q.intersects(V, x)), Q = D.pop();
    return H;
  }, A = (I, x) => (I = I.replace(r[s.BUILD], ""), e("comp", I, x), I = T(I, x), e("caret", I), I = P(I, x), e("tildes", I), I = b(I, x), e("xrange", I), I = q(I, x), e("stars", I), I), O = (I) => !I || I.toLowerCase() === "x" || I === "*", P = (I, x) => I.trim().split(/\s+/).map((H) => $(H, x)).join(" "), $ = (I, x) => {
    const H = x.loose ? r[s.TILDELOOSE] : r[s.TILDE];
    return I.replace(H, (D, Q, V, ne, de) => {
      e("tilde", I, D, Q, V, ne, de);
      let ce;
      return O(Q) ? ce = "" : O(V) ? ce = `>=${Q}.0.0 <${+Q + 1}.0.0-0` : O(ne) ? ce = `>=${Q}.${V}.0 <${Q}.${+V + 1}.0-0` : de ? (e("replaceTilde pr", de), ce = `>=${Q}.${V}.${ne}-${de} <${Q}.${+V + 1}.0-0`) : ce = `>=${Q}.${V}.${ne} <${Q}.${+V + 1}.0-0`, e("tilde return", ce), ce;
    });
  }, T = (I, x) => I.trim().split(/\s+/).map((H) => _(H, x)).join(" "), _ = (I, x) => {
    e("caret", I, x);
    const H = x.loose ? r[s.CARETLOOSE] : r[s.CARET], D = x.includePrerelease ? "-0" : "";
    return I.replace(H, (Q, V, ne, de, ce) => {
      e("caret", I, Q, V, ne, de, ce);
      let ge;
      return O(V) ? ge = "" : O(ne) ? ge = `>=${V}.0.0${D} <${+V + 1}.0.0-0` : O(de) ? V === "0" ? ge = `>=${V}.${ne}.0${D} <${V}.${+ne + 1}.0-0` : ge = `>=${V}.${ne}.0${D} <${+V + 1}.0.0-0` : ce ? (e("replaceCaret pr", ce), V === "0" ? ne === "0" ? ge = `>=${V}.${ne}.${de}-${ce} <${V}.${ne}.${+de + 1}-0` : ge = `>=${V}.${ne}.${de}-${ce} <${V}.${+ne + 1}.0-0` : ge = `>=${V}.${ne}.${de}-${ce} <${+V + 1}.0.0-0`) : (e("no pr"), V === "0" ? ne === "0" ? ge = `>=${V}.${ne}.${de}${D} <${V}.${ne}.${+de + 1}-0` : ge = `>=${V}.${ne}.${de}${D} <${V}.${+ne + 1}.0-0` : ge = `>=${V}.${ne}.${de} <${+V + 1}.0.0-0`), e("caret return", ge), ge;
    });
  }, b = (I, x) => (e("replaceXRanges", I, x), I.split(/\s+/).map((H) => w(H, x)).join(" ")), w = (I, x) => {
    I = I.trim();
    const H = x.loose ? r[s.XRANGELOOSE] : r[s.XRANGE];
    return I.replace(H, (D, Q, V, ne, de, ce) => {
      e("xRange", I, D, Q, V, ne, de, ce);
      const ge = O(V), we = ge || O(ne), K = we || O(de), ye = K;
      return Q === "=" && ye && (Q = ""), ce = x.includePrerelease ? "-0" : "", ge ? Q === ">" || Q === "<" ? D = "<0.0.0-0" : D = "*" : Q && ye ? (we && (ne = 0), de = 0, Q === ">" ? (Q = ">=", we ? (V = +V + 1, ne = 0, de = 0) : (ne = +ne + 1, de = 0)) : Q === "<=" && (Q = "<", we ? V = +V + 1 : ne = +ne + 1), Q === "<" && (ce = "-0"), D = `${Q + V}.${ne}.${de}${ce}`) : we ? D = `>=${V}.0.0${ce} <${+V + 1}.0.0-0` : K && (D = `>=${V}.${ne}.0${ce} <${V}.${+ne + 1}.0-0`), e("xRange return", D), D;
    });
  }, q = (I, x) => (e("replaceStars", I, x), I.trim().replace(r[s.STAR], "")), U = (I, x) => (e("replaceGTE0", I, x), I.trim().replace(r[x.includePrerelease ? s.GTE0PRE : s.GTE0], "")), F = (I) => (x, H, D, Q, V, ne, de, ce, ge, we, K, ye) => (O(D) ? H = "" : O(Q) ? H = `>=${D}.0.0${I ? "-0" : ""}` : O(V) ? H = `>=${D}.${Q}.0${I ? "-0" : ""}` : ne ? H = `>=${H}` : H = `>=${H}${I ? "-0" : ""}`, O(ge) ? ce = "" : O(we) ? ce = `<${+ge + 1}.0.0-0` : O(K) ? ce = `<${ge}.${+we + 1}.0-0` : ye ? ce = `<=${ge}.${we}.${K}-${ye}` : I ? ce = `<${ge}.${we}.${+K + 1}-0` : ce = `<=${ce}`, `${H} ${ce}`.trim()), M = (I, x, H) => {
    for (let D = 0; D < I.length; D++)
      if (!I[D].test(x))
        return !1;
    if (x.prerelease.length && !H.includePrerelease) {
      for (let D = 0; D < I.length; D++)
        if (e(I[D].semver), I[D].semver !== i.ANY && I[D].semver.prerelease.length > 0) {
          const Q = I[D].semver;
          if (Q.major === x.major && Q.minor === x.minor && Q.patch === x.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Gi;
}
var Wi, yl;
function nn() {
  if (yl) return Wi;
  yl = 1;
  const t = /* @__PURE__ */ Symbol("SemVer ANY");
  class o {
    static get ANY() {
      return t;
    }
    constructor(a, d) {
      if (d = l(d), a instanceof o) {
        if (a.loose === !!d.loose)
          return a;
        a = a.value;
      }
      a = a.trim().split(/\s+/).join(" "), e("comparator", a, d), this.options = d, this.loose = !!d.loose, this.parse(a), this.semver === t ? this.value = "" : this.value = this.operator + this.semver.version, e("comp", this);
    }
    parse(a) {
      const d = this.options.loose ? u[n.COMPARATORLOOSE] : u[n.COMPARATOR], c = a.match(d);
      if (!c)
        throw new TypeError(`Invalid comparator: ${a}`);
      this.operator = c[1] !== void 0 ? c[1] : "", this.operator === "=" && (this.operator = ""), c[2] ? this.semver = new f(c[2], this.options.loose) : this.semver = t;
    }
    toString() {
      return this.value;
    }
    test(a) {
      if (e("Comparator.test", a, this.options.loose), this.semver === t || a === t)
        return !0;
      if (typeof a == "string")
        try {
          a = new f(a, this.options);
        } catch {
          return !1;
        }
      return i(a, this.operator, this.semver, this.options);
    }
    intersects(a, d) {
      if (!(a instanceof o))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new r(a.value, d).test(this.value) : a.operator === "" ? a.value === "" ? !0 : new r(this.value, d).test(a.semver) : (d = l(d), d.includePrerelease && (this.value === "<0.0.0-0" || a.value === "<0.0.0-0") || !d.includePrerelease && (this.value.startsWith("<0.0.0") || a.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && a.operator.startsWith(">") || this.operator.startsWith("<") && a.operator.startsWith("<") || this.semver.version === a.semver.version && this.operator.includes("=") && a.operator.includes("=") || i(this.semver, "<", a.semver, d) && this.operator.startsWith(">") && a.operator.startsWith("<") || i(this.semver, ">", a.semver, d) && this.operator.startsWith("<") && a.operator.startsWith(">")));
    }
  }
  Wi = o;
  const l = Vo(), { safeRe: u, t: n } = Pr(), i = _c(), e = tn(), f = ze(), r = lt();
  return Wi;
}
var zi, vl;
function on() {
  if (vl) return zi;
  vl = 1;
  const t = lt();
  return zi = (l, u, n) => {
    try {
      u = new t(u, n);
    } catch {
      return !1;
    }
    return u.test(l);
  }, zi;
}
var Vi, wl;
function Md() {
  if (wl) return Vi;
  wl = 1;
  const t = lt();
  return Vi = (l, u) => new t(l, u).set.map((n) => n.map((i) => i.value).join(" ").trim().split(" ")), Vi;
}
var Yi, El;
function Bd() {
  if (El) return Yi;
  El = 1;
  const t = ze(), o = lt();
  return Yi = (u, n, i) => {
    let e = null, f = null, r = null;
    try {
      r = new o(n, i);
    } catch {
      return null;
    }
    return u.forEach((s) => {
      r.test(s) && (!e || f.compare(s) === -1) && (e = s, f = new t(e, i));
    }), e;
  }, Yi;
}
var Ji, _l;
function jd() {
  if (_l) return Ji;
  _l = 1;
  const t = ze(), o = lt();
  return Ji = (u, n, i) => {
    let e = null, f = null, r = null;
    try {
      r = new o(n, i);
    } catch {
      return null;
    }
    return u.forEach((s) => {
      r.test(s) && (!e || f.compare(s) === 1) && (e = s, f = new t(e, i));
    }), e;
  }, Ji;
}
var Xi, Sl;
function Hd() {
  if (Sl) return Xi;
  Sl = 1;
  const t = ze(), o = lt(), l = rn();
  return Xi = (n, i) => {
    n = new o(n, i);
    let e = new t("0.0.0");
    if (n.test(e) || (e = new t("0.0.0-0"), n.test(e)))
      return e;
    e = null;
    for (let f = 0; f < n.set.length; ++f) {
      const r = n.set[f];
      let s = null;
      r.forEach((a) => {
        const d = new t(a.semver.version);
        switch (a.operator) {
          case ">":
            d.prerelease.length === 0 ? d.patch++ : d.prerelease.push(0), d.raw = d.format();
          /* fallthrough */
          case "":
          case ">=":
            (!s || l(d, s)) && (s = d);
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${a.operator}`);
        }
      }), s && (!e || l(e, s)) && (e = s);
    }
    return e && n.test(e) ? e : null;
  }, Xi;
}
var Ki, bl;
function Gd() {
  if (bl) return Ki;
  bl = 1;
  const t = lt();
  return Ki = (l, u) => {
    try {
      return new t(l, u).range || "*";
    } catch {
      return null;
    }
  }, Ki;
}
var Qi, Al;
function Qo() {
  if (Al) return Qi;
  Al = 1;
  const t = ze(), o = nn(), { ANY: l } = o, u = lt(), n = on(), i = rn(), e = Jo(), f = Ko(), r = Xo();
  return Qi = (a, d, c, p) => {
    a = new t(a, p), d = new u(d, p);
    let y, g, m, E, A;
    switch (c) {
      case ">":
        y = i, g = f, m = e, E = ">", A = ">=";
        break;
      case "<":
        y = e, g = r, m = i, E = "<", A = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (n(a, d, p))
      return !1;
    for (let O = 0; O < d.set.length; ++O) {
      const P = d.set[O];
      let $ = null, T = null;
      if (P.forEach((_) => {
        _.semver === l && (_ = new o(">=0.0.0")), $ = $ || _, T = T || _, y(_.semver, $.semver, p) ? $ = _ : m(_.semver, T.semver, p) && (T = _);
      }), $.operator === E || $.operator === A || (!T.operator || T.operator === E) && g(a, T.semver))
        return !1;
      if (T.operator === A && m(a, T.semver))
        return !1;
    }
    return !0;
  }, Qi;
}
var Zi, Cl;
function Wd() {
  if (Cl) return Zi;
  Cl = 1;
  const t = Qo();
  return Zi = (l, u, n) => t(l, u, ">", n), Zi;
}
var eo, Tl;
function zd() {
  if (Tl) return eo;
  Tl = 1;
  const t = Qo();
  return eo = (l, u, n) => t(l, u, "<", n), eo;
}
var to, Rl;
function Vd() {
  if (Rl) return to;
  Rl = 1;
  const t = lt();
  return to = (l, u, n) => (l = new t(l, n), u = new t(u, n), l.intersects(u, n)), to;
}
var ro, Ol;
function Yd() {
  if (Ol) return ro;
  Ol = 1;
  const t = on(), o = st();
  return ro = (l, u, n) => {
    const i = [];
    let e = null, f = null;
    const r = l.sort((c, p) => o(c, p, n));
    for (const c of r)
      t(c, u, n) ? (f = c, e || (e = c)) : (f && i.push([e, f]), f = null, e = null);
    e && i.push([e, null]);
    const s = [];
    for (const [c, p] of i)
      c === p ? s.push(c) : !p && c === r[0] ? s.push("*") : p ? c === r[0] ? s.push(`<=${p}`) : s.push(`${c} - ${p}`) : s.push(`>=${c}`);
    const a = s.join(" || "), d = typeof u.raw == "string" ? u.raw : String(u);
    return a.length < d.length ? a : u;
  }, ro;
}
var no, Pl;
function Jd() {
  if (Pl) return no;
  Pl = 1;
  const t = lt(), o = nn(), { ANY: l } = o, u = on(), n = st(), i = (d, c, p = {}) => {
    if (d === c)
      return !0;
    d = new t(d, p), c = new t(c, p);
    let y = !1;
    e: for (const g of d.set) {
      for (const m of c.set) {
        const E = r(g, m, p);
        if (y = y || E !== null, E)
          continue e;
      }
      if (y)
        return !1;
    }
    return !0;
  }, e = [new o(">=0.0.0-0")], f = [new o(">=0.0.0")], r = (d, c, p) => {
    if (d === c)
      return !0;
    if (d.length === 1 && d[0].semver === l) {
      if (c.length === 1 && c[0].semver === l)
        return !0;
      p.includePrerelease ? d = e : d = f;
    }
    if (c.length === 1 && c[0].semver === l) {
      if (p.includePrerelease)
        return !0;
      c = f;
    }
    const y = /* @__PURE__ */ new Set();
    let g, m;
    for (const b of d)
      b.operator === ">" || b.operator === ">=" ? g = s(g, b, p) : b.operator === "<" || b.operator === "<=" ? m = a(m, b, p) : y.add(b.semver);
    if (y.size > 1)
      return null;
    let E;
    if (g && m) {
      if (E = n(g.semver, m.semver, p), E > 0)
        return null;
      if (E === 0 && (g.operator !== ">=" || m.operator !== "<="))
        return null;
    }
    for (const b of y) {
      if (g && !u(b, String(g), p) || m && !u(b, String(m), p))
        return null;
      for (const w of c)
        if (!u(b, String(w), p))
          return !1;
      return !0;
    }
    let A, O, P, $, T = m && !p.includePrerelease && m.semver.prerelease.length ? m.semver : !1, _ = g && !p.includePrerelease && g.semver.prerelease.length ? g.semver : !1;
    T && T.prerelease.length === 1 && m.operator === "<" && T.prerelease[0] === 0 && (T = !1);
    for (const b of c) {
      if ($ = $ || b.operator === ">" || b.operator === ">=", P = P || b.operator === "<" || b.operator === "<=", g) {
        if (_ && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === _.major && b.semver.minor === _.minor && b.semver.patch === _.patch && (_ = !1), b.operator === ">" || b.operator === ">=") {
          if (A = s(g, b, p), A === b && A !== g)
            return !1;
        } else if (g.operator === ">=" && !u(g.semver, String(b), p))
          return !1;
      }
      if (m) {
        if (T && b.semver.prerelease && b.semver.prerelease.length && b.semver.major === T.major && b.semver.minor === T.minor && b.semver.patch === T.patch && (T = !1), b.operator === "<" || b.operator === "<=") {
          if (O = a(m, b, p), O === b && O !== m)
            return !1;
        } else if (m.operator === "<=" && !u(m.semver, String(b), p))
          return !1;
      }
      if (!b.operator && (m || g) && E !== 0)
        return !1;
    }
    return !(g && P && !m && E !== 0 || m && $ && !g && E !== 0 || _ || T);
  }, s = (d, c, p) => {
    if (!d)
      return c;
    const y = n(d.semver, c.semver, p);
    return y > 0 ? d : y < 0 || c.operator === ">" && d.operator === ">=" ? c : d;
  }, a = (d, c, p) => {
    if (!d)
      return c;
    const y = n(d.semver, c.semver, p);
    return y < 0 ? d : y > 0 || c.operator === "<" && d.operator === "<=" ? c : d;
  };
  return no = i, no;
}
var io, Dl;
function Sc() {
  if (Dl) return io;
  Dl = 1;
  const t = Pr(), o = en(), l = ze(), u = vc(), n = Xt(), i = Td(), e = Rd(), f = Od(), r = Pd(), s = Dd(), a = Id(), d = Nd(), c = xd(), p = st(), y = Ld(), g = Fd(), m = Yo(), E = Ud(), A = $d(), O = rn(), P = Jo(), $ = wc(), T = Ec(), _ = Xo(), b = Ko(), w = _c(), q = kd(), U = nn(), F = lt(), M = on(), I = Md(), x = Bd(), H = jd(), D = Hd(), Q = Gd(), V = Qo(), ne = Wd(), de = zd(), ce = Vd(), ge = Yd(), we = Jd();
  return io = {
    parse: n,
    valid: i,
    clean: e,
    inc: f,
    diff: r,
    major: s,
    minor: a,
    patch: d,
    prerelease: c,
    compare: p,
    rcompare: y,
    compareLoose: g,
    compareBuild: m,
    sort: E,
    rsort: A,
    gt: O,
    lt: P,
    eq: $,
    neq: T,
    gte: _,
    lte: b,
    cmp: w,
    coerce: q,
    Comparator: U,
    Range: F,
    satisfies: M,
    toComparators: I,
    maxSatisfying: x,
    minSatisfying: H,
    minVersion: D,
    validRange: Q,
    outside: V,
    gtr: ne,
    ltr: de,
    intersects: ce,
    simplifyRange: ge,
    subset: we,
    SemVer: l,
    re: t.re,
    src: t.src,
    tokens: t.t,
    SEMVER_SPEC_VERSION: o.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: o.RELEASE_TYPES,
    compareIdentifiers: u.compareIdentifiers,
    rcompareIdentifiers: u.rcompareIdentifiers
  }, io;
}
var Ht = {}, br = { exports: {} };
br.exports;
var Il;
function Xd() {
  return Il || (Il = 1, (function(t, o) {
    var l = 200, u = "__lodash_hash_undefined__", n = 1, i = 2, e = 9007199254740991, f = "[object Arguments]", r = "[object Array]", s = "[object AsyncFunction]", a = "[object Boolean]", d = "[object Date]", c = "[object Error]", p = "[object Function]", y = "[object GeneratorFunction]", g = "[object Map]", m = "[object Number]", E = "[object Null]", A = "[object Object]", O = "[object Promise]", P = "[object Proxy]", $ = "[object RegExp]", T = "[object Set]", _ = "[object String]", b = "[object Symbol]", w = "[object Undefined]", q = "[object WeakMap]", U = "[object ArrayBuffer]", F = "[object DataView]", M = "[object Float32Array]", I = "[object Float64Array]", x = "[object Int8Array]", H = "[object Int16Array]", D = "[object Int32Array]", Q = "[object Uint8Array]", V = "[object Uint8ClampedArray]", ne = "[object Uint16Array]", de = "[object Uint32Array]", ce = /[\\^$.*+?()[\]{}|]/g, ge = /^\[object .+?Constructor\]$/, we = /^(?:0|[1-9]\d*)$/, K = {};
    K[M] = K[I] = K[x] = K[H] = K[D] = K[Q] = K[V] = K[ne] = K[de] = !0, K[f] = K[r] = K[U] = K[a] = K[F] = K[d] = K[c] = K[p] = K[g] = K[m] = K[A] = K[$] = K[T] = K[_] = K[q] = !1;
    var ye = typeof at == "object" && at && at.Object === Object && at, S = typeof self == "object" && self && self.Object === Object && self, v = ye || S || Function("return this")(), j = o && !o.nodeType && o, N = j && !0 && t && !t.nodeType && t, ue = N && N.exports === j, he = ue && ye.process, pe = (function() {
      try {
        return he && he.binding && he.binding("util");
      } catch {
      }
    })(), Ae = pe && pe.isTypedArray;
    function Ee(R, L) {
      for (var X = -1, se = R == null ? 0 : R.length, xe = 0, Ce = []; ++X < se; ) {
        var $e = R[X];
        L($e, X, R) && (Ce[xe++] = $e);
      }
      return Ce;
    }
    function Ve(R, L) {
      for (var X = -1, se = L.length, xe = R.length; ++X < se; )
        R[xe + X] = L[X];
      return R;
    }
    function Re(R, L) {
      for (var X = -1, se = R == null ? 0 : R.length; ++X < se; )
        if (L(R[X], X, R))
          return !0;
      return !1;
    }
    function Ge(R, L) {
      for (var X = -1, se = Array(R); ++X < R; )
        se[X] = L(X);
      return se;
    }
    function mt(R) {
      return function(L) {
        return R(L);
      };
    }
    function ft(R, L) {
      return R.has(L);
    }
    function ut(R, L) {
      return R?.[L];
    }
    function h(R) {
      var L = -1, X = Array(R.size);
      return R.forEach(function(se, xe) {
        X[++L] = [xe, se];
      }), X;
    }
    function B(R, L) {
      return function(X) {
        return R(L(X));
      };
    }
    function G(R) {
      var L = -1, X = Array(R.size);
      return R.forEach(function(se) {
        X[++L] = se;
      }), X;
    }
    var re = Array.prototype, W = Function.prototype, te = Object.prototype, Z = v["__core-js_shared__"], oe = W.toString, le = te.hasOwnProperty, Oe = (function() {
      var R = /[^.]+$/.exec(Z && Z.keys && Z.keys.IE_PROTO || "");
      return R ? "Symbol(src)_1." + R : "";
    })(), Pe = te.toString, me = RegExp(
      "^" + oe.call(le).replace(ce, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ), C = ue ? v.Buffer : void 0, k = v.Symbol, z = v.Uint8Array, Y = te.propertyIsEnumerable, J = re.splice, ie = k ? k.toStringTag : void 0, ee = Object.getOwnPropertySymbols, ae = C ? C.isBuffer : void 0, fe = B(Object.keys, Object), Se = Bt(v, "DataView"), Ne = Bt(v, "Map"), Ue = Bt(v, "Promise"), De = Bt(v, "Set"), Mt = Bt(v, "WeakMap"), nt = Bt(Object, "create"), Ct = Ot(Se), $c = Ot(Ne), kc = Ot(Ue), qc = Ot(De), Mc = Ot(Mt), ra = k ? k.prototype : void 0, sn = ra ? ra.valueOf : void 0;
    function Tt(R) {
      var L = -1, X = R == null ? 0 : R.length;
      for (this.clear(); ++L < X; ) {
        var se = R[L];
        this.set(se[0], se[1]);
      }
    }
    function Bc() {
      this.__data__ = nt ? nt(null) : {}, this.size = 0;
    }
    function jc(R) {
      var L = this.has(R) && delete this.__data__[R];
      return this.size -= L ? 1 : 0, L;
    }
    function Hc(R) {
      var L = this.__data__;
      if (nt) {
        var X = L[R];
        return X === u ? void 0 : X;
      }
      return le.call(L, R) ? L[R] : void 0;
    }
    function Gc(R) {
      var L = this.__data__;
      return nt ? L[R] !== void 0 : le.call(L, R);
    }
    function Wc(R, L) {
      var X = this.__data__;
      return this.size += this.has(R) ? 0 : 1, X[R] = nt && L === void 0 ? u : L, this;
    }
    Tt.prototype.clear = Bc, Tt.prototype.delete = jc, Tt.prototype.get = Hc, Tt.prototype.has = Gc, Tt.prototype.set = Wc;
    function dt(R) {
      var L = -1, X = R == null ? 0 : R.length;
      for (this.clear(); ++L < X; ) {
        var se = R[L];
        this.set(se[0], se[1]);
      }
    }
    function zc() {
      this.__data__ = [], this.size = 0;
    }
    function Vc(R) {
      var L = this.__data__, X = Nr(L, R);
      if (X < 0)
        return !1;
      var se = L.length - 1;
      return X == se ? L.pop() : J.call(L, X, 1), --this.size, !0;
    }
    function Yc(R) {
      var L = this.__data__, X = Nr(L, R);
      return X < 0 ? void 0 : L[X][1];
    }
    function Jc(R) {
      return Nr(this.__data__, R) > -1;
    }
    function Xc(R, L) {
      var X = this.__data__, se = Nr(X, R);
      return se < 0 ? (++this.size, X.push([R, L])) : X[se][1] = L, this;
    }
    dt.prototype.clear = zc, dt.prototype.delete = Vc, dt.prototype.get = Yc, dt.prototype.has = Jc, dt.prototype.set = Xc;
    function Rt(R) {
      var L = -1, X = R == null ? 0 : R.length;
      for (this.clear(); ++L < X; ) {
        var se = R[L];
        this.set(se[0], se[1]);
      }
    }
    function Kc() {
      this.size = 0, this.__data__ = {
        hash: new Tt(),
        map: new (Ne || dt)(),
        string: new Tt()
      };
    }
    function Qc(R) {
      var L = xr(this, R).delete(R);
      return this.size -= L ? 1 : 0, L;
    }
    function Zc(R) {
      return xr(this, R).get(R);
    }
    function ef(R) {
      return xr(this, R).has(R);
    }
    function tf(R, L) {
      var X = xr(this, R), se = X.size;
      return X.set(R, L), this.size += X.size == se ? 0 : 1, this;
    }
    Rt.prototype.clear = Kc, Rt.prototype.delete = Qc, Rt.prototype.get = Zc, Rt.prototype.has = ef, Rt.prototype.set = tf;
    function Ir(R) {
      var L = -1, X = R == null ? 0 : R.length;
      for (this.__data__ = new Rt(); ++L < X; )
        this.add(R[L]);
    }
    function rf(R) {
      return this.__data__.set(R, u), this;
    }
    function nf(R) {
      return this.__data__.has(R);
    }
    Ir.prototype.add = Ir.prototype.push = rf, Ir.prototype.has = nf;
    function gt(R) {
      var L = this.__data__ = new dt(R);
      this.size = L.size;
    }
    function of() {
      this.__data__ = new dt(), this.size = 0;
    }
    function af(R) {
      var L = this.__data__, X = L.delete(R);
      return this.size = L.size, X;
    }
    function sf(R) {
      return this.__data__.get(R);
    }
    function lf(R) {
      return this.__data__.has(R);
    }
    function uf(R, L) {
      var X = this.__data__;
      if (X instanceof dt) {
        var se = X.__data__;
        if (!Ne || se.length < l - 1)
          return se.push([R, L]), this.size = ++X.size, this;
        X = this.__data__ = new Rt(se);
      }
      return X.set(R, L), this.size = X.size, this;
    }
    gt.prototype.clear = of, gt.prototype.delete = af, gt.prototype.get = sf, gt.prototype.has = lf, gt.prototype.set = uf;
    function cf(R, L) {
      var X = Lr(R), se = !X && Cf(R), xe = !X && !se && ln(R), Ce = !X && !se && !xe && fa(R), $e = X || se || xe || Ce, ke = $e ? Ge(R.length, String) : [], qe = ke.length;
      for (var Fe in R)
        le.call(R, Fe) && !($e && // Safari 9 has enumerable `arguments.length` in strict mode.
        (Fe == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        xe && (Fe == "offset" || Fe == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        Ce && (Fe == "buffer" || Fe == "byteLength" || Fe == "byteOffset") || // Skip index properties.
        Ef(Fe, qe))) && ke.push(Fe);
      return ke;
    }
    function Nr(R, L) {
      for (var X = R.length; X--; )
        if (sa(R[X][0], L))
          return X;
      return -1;
    }
    function ff(R, L, X) {
      var se = L(R);
      return Lr(R) ? se : Ve(se, X(R));
    }
    function Qt(R) {
      return R == null ? R === void 0 ? w : E : ie && ie in Object(R) ? vf(R) : Af(R);
    }
    function na(R) {
      return Zt(R) && Qt(R) == f;
    }
    function ia(R, L, X, se, xe) {
      return R === L ? !0 : R == null || L == null || !Zt(R) && !Zt(L) ? R !== R && L !== L : df(R, L, X, se, ia, xe);
    }
    function df(R, L, X, se, xe, Ce) {
      var $e = Lr(R), ke = Lr(L), qe = $e ? r : yt(R), Fe = ke ? r : yt(L);
      qe = qe == f ? A : qe, Fe = Fe == f ? A : Fe;
      var Xe = qe == A, it = Fe == A, Be = qe == Fe;
      if (Be && ln(R)) {
        if (!ln(L))
          return !1;
        $e = !0, Xe = !1;
      }
      if (Be && !Xe)
        return Ce || (Ce = new gt()), $e || fa(R) ? oa(R, L, X, se, xe, Ce) : gf(R, L, qe, X, se, xe, Ce);
      if (!(X & n)) {
        var Ze = Xe && le.call(R, "__wrapped__"), et = it && le.call(L, "__wrapped__");
        if (Ze || et) {
          var vt = Ze ? R.value() : R, ht = et ? L.value() : L;
          return Ce || (Ce = new gt()), xe(vt, ht, X, se, Ce);
        }
      }
      return Be ? (Ce || (Ce = new gt()), yf(R, L, X, se, xe, Ce)) : !1;
    }
    function hf(R) {
      if (!ca(R) || Sf(R))
        return !1;
      var L = la(R) ? me : ge;
      return L.test(Ot(R));
    }
    function pf(R) {
      return Zt(R) && ua(R.length) && !!K[Qt(R)];
    }
    function mf(R) {
      if (!bf(R))
        return fe(R);
      var L = [];
      for (var X in Object(R))
        le.call(R, X) && X != "constructor" && L.push(X);
      return L;
    }
    function oa(R, L, X, se, xe, Ce) {
      var $e = X & n, ke = R.length, qe = L.length;
      if (ke != qe && !($e && qe > ke))
        return !1;
      var Fe = Ce.get(R);
      if (Fe && Ce.get(L))
        return Fe == L;
      var Xe = -1, it = !0, Be = X & i ? new Ir() : void 0;
      for (Ce.set(R, L), Ce.set(L, R); ++Xe < ke; ) {
        var Ze = R[Xe], et = L[Xe];
        if (se)
          var vt = $e ? se(et, Ze, Xe, L, R, Ce) : se(Ze, et, Xe, R, L, Ce);
        if (vt !== void 0) {
          if (vt)
            continue;
          it = !1;
          break;
        }
        if (Be) {
          if (!Re(L, function(ht, Pt) {
            if (!ft(Be, Pt) && (Ze === ht || xe(Ze, ht, X, se, Ce)))
              return Be.push(Pt);
          })) {
            it = !1;
            break;
          }
        } else if (!(Ze === et || xe(Ze, et, X, se, Ce))) {
          it = !1;
          break;
        }
      }
      return Ce.delete(R), Ce.delete(L), it;
    }
    function gf(R, L, X, se, xe, Ce, $e) {
      switch (X) {
        case F:
          if (R.byteLength != L.byteLength || R.byteOffset != L.byteOffset)
            return !1;
          R = R.buffer, L = L.buffer;
        case U:
          return !(R.byteLength != L.byteLength || !Ce(new z(R), new z(L)));
        case a:
        case d:
        case m:
          return sa(+R, +L);
        case c:
          return R.name == L.name && R.message == L.message;
        case $:
        case _:
          return R == L + "";
        case g:
          var ke = h;
        case T:
          var qe = se & n;
          if (ke || (ke = G), R.size != L.size && !qe)
            return !1;
          var Fe = $e.get(R);
          if (Fe)
            return Fe == L;
          se |= i, $e.set(R, L);
          var Xe = oa(ke(R), ke(L), se, xe, Ce, $e);
          return $e.delete(R), Xe;
        case b:
          if (sn)
            return sn.call(R) == sn.call(L);
      }
      return !1;
    }
    function yf(R, L, X, se, xe, Ce) {
      var $e = X & n, ke = aa(R), qe = ke.length, Fe = aa(L), Xe = Fe.length;
      if (qe != Xe && !$e)
        return !1;
      for (var it = qe; it--; ) {
        var Be = ke[it];
        if (!($e ? Be in L : le.call(L, Be)))
          return !1;
      }
      var Ze = Ce.get(R);
      if (Ze && Ce.get(L))
        return Ze == L;
      var et = !0;
      Ce.set(R, L), Ce.set(L, R);
      for (var vt = $e; ++it < qe; ) {
        Be = ke[it];
        var ht = R[Be], Pt = L[Be];
        if (se)
          var da = $e ? se(Pt, ht, Be, L, R, Ce) : se(ht, Pt, Be, R, L, Ce);
        if (!(da === void 0 ? ht === Pt || xe(ht, Pt, X, se, Ce) : da)) {
          et = !1;
          break;
        }
        vt || (vt = Be == "constructor");
      }
      if (et && !vt) {
        var Fr = R.constructor, Ur = L.constructor;
        Fr != Ur && "constructor" in R && "constructor" in L && !(typeof Fr == "function" && Fr instanceof Fr && typeof Ur == "function" && Ur instanceof Ur) && (et = !1);
      }
      return Ce.delete(R), Ce.delete(L), et;
    }
    function aa(R) {
      return ff(R, Of, wf);
    }
    function xr(R, L) {
      var X = R.__data__;
      return _f(L) ? X[typeof L == "string" ? "string" : "hash"] : X.map;
    }
    function Bt(R, L) {
      var X = ut(R, L);
      return hf(X) ? X : void 0;
    }
    function vf(R) {
      var L = le.call(R, ie), X = R[ie];
      try {
        R[ie] = void 0;
        var se = !0;
      } catch {
      }
      var xe = Pe.call(R);
      return se && (L ? R[ie] = X : delete R[ie]), xe;
    }
    var wf = ee ? function(R) {
      return R == null ? [] : (R = Object(R), Ee(ee(R), function(L) {
        return Y.call(R, L);
      }));
    } : Pf, yt = Qt;
    (Se && yt(new Se(new ArrayBuffer(1))) != F || Ne && yt(new Ne()) != g || Ue && yt(Ue.resolve()) != O || De && yt(new De()) != T || Mt && yt(new Mt()) != q) && (yt = function(R) {
      var L = Qt(R), X = L == A ? R.constructor : void 0, se = X ? Ot(X) : "";
      if (se)
        switch (se) {
          case Ct:
            return F;
          case $c:
            return g;
          case kc:
            return O;
          case qc:
            return T;
          case Mc:
            return q;
        }
      return L;
    });
    function Ef(R, L) {
      return L = L ?? e, !!L && (typeof R == "number" || we.test(R)) && R > -1 && R % 1 == 0 && R < L;
    }
    function _f(R) {
      var L = typeof R;
      return L == "string" || L == "number" || L == "symbol" || L == "boolean" ? R !== "__proto__" : R === null;
    }
    function Sf(R) {
      return !!Oe && Oe in R;
    }
    function bf(R) {
      var L = R && R.constructor, X = typeof L == "function" && L.prototype || te;
      return R === X;
    }
    function Af(R) {
      return Pe.call(R);
    }
    function Ot(R) {
      if (R != null) {
        try {
          return oe.call(R);
        } catch {
        }
        try {
          return R + "";
        } catch {
        }
      }
      return "";
    }
    function sa(R, L) {
      return R === L || R !== R && L !== L;
    }
    var Cf = na(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? na : function(R) {
      return Zt(R) && le.call(R, "callee") && !Y.call(R, "callee");
    }, Lr = Array.isArray;
    function Tf(R) {
      return R != null && ua(R.length) && !la(R);
    }
    var ln = ae || Df;
    function Rf(R, L) {
      return ia(R, L);
    }
    function la(R) {
      if (!ca(R))
        return !1;
      var L = Qt(R);
      return L == p || L == y || L == s || L == P;
    }
    function ua(R) {
      return typeof R == "number" && R > -1 && R % 1 == 0 && R <= e;
    }
    function ca(R) {
      var L = typeof R;
      return R != null && (L == "object" || L == "function");
    }
    function Zt(R) {
      return R != null && typeof R == "object";
    }
    var fa = Ae ? mt(Ae) : pf;
    function Of(R) {
      return Tf(R) ? cf(R) : mf(R);
    }
    function Pf() {
      return [];
    }
    function Df() {
      return !1;
    }
    t.exports = Rf;
  })(br, br.exports)), br.exports;
}
var Nl;
function Kd() {
  if (Nl) return Ht;
  Nl = 1, Object.defineProperty(Ht, "__esModule", { value: !0 }), Ht.DownloadedUpdateHelper = void 0, Ht.createTempUpdateFile = f;
  const t = Tr, o = Ke, l = Xd(), u = /* @__PURE__ */ At(), n = Ie;
  let i = class {
    constructor(s) {
      this.cacheDir = s, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
    }
    get downloadedFileInfo() {
      return this._downloadedFileInfo;
    }
    get file() {
      return this._file;
    }
    get packageFile() {
      return this._packageFile;
    }
    get cacheDirForPendingUpdate() {
      return n.join(this.cacheDir, "pending");
    }
    async validateDownloadedPath(s, a, d, c) {
      if (this.versionInfo != null && this.file === s && this.fileInfo != null)
        return l(this.versionInfo, a) && l(this.fileInfo.info, d.info) && await (0, u.pathExists)(s) ? s : null;
      const p = await this.getValidCachedUpdateFile(d, c);
      return p === null ? null : (c.info(`Update has already been downloaded to ${s}).`), this._file = p, p);
    }
    async setDownloadedFile(s, a, d, c, p, y) {
      this._file = s, this._packageFile = a, this.versionInfo = d, this.fileInfo = c, this._downloadedFileInfo = {
        fileName: p,
        sha512: c.info.sha512,
        isAdminRightsRequired: c.info.isAdminRightsRequired === !0
      }, y && await (0, u.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
    }
    async clear() {
      this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
    }
    async cleanCacheDirForPendingUpdate() {
      try {
        await (0, u.emptyDir)(this.cacheDirForPendingUpdate);
      } catch {
      }
    }
    /**
     * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
     * @param fileInfo
     * @param logger
     */
    async getValidCachedUpdateFile(s, a) {
      const d = this.getUpdateInfoFile();
      if (!await (0, u.pathExists)(d))
        return null;
      let p;
      try {
        p = await (0, u.readJson)(d);
      } catch (E) {
        let A = "No cached update info available";
        return E.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), A += ` (error on read: ${E.message})`), a.info(A), null;
      }
      if (!(p?.fileName !== null))
        return a.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
      if (s.info.sha512 !== p.sha512)
        return a.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${p.sha512}, expected: ${s.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
      const g = n.join(this.cacheDirForPendingUpdate, p.fileName);
      if (!await (0, u.pathExists)(g))
        return a.info("Cached update file doesn't exist"), null;
      const m = await e(g);
      return s.info.sha512 !== m ? (a.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${m}, expected: ${s.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = p, g);
    }
    getUpdateInfoFile() {
      return n.join(this.cacheDirForPendingUpdate, "update-info.json");
    }
  };
  Ht.DownloadedUpdateHelper = i;
  function e(r, s = "sha512", a = "base64", d) {
    return new Promise((c, p) => {
      const y = (0, t.createHash)(s);
      y.on("error", p).setEncoding(a), (0, o.createReadStream)(r, {
        ...d,
        highWaterMark: 1024 * 1024
        /* better to use more memory but hash faster */
      }).on("error", p).on("end", () => {
        y.end(), c(y.read());
      }).pipe(y, { end: !1 });
    });
  }
  async function f(r, s, a) {
    let d = 0, c = n.join(s, r);
    for (let p = 0; p < 3; p++)
      try {
        return await (0, u.unlink)(c), c;
      } catch (y) {
        if (y.code === "ENOENT")
          return c;
        a.warn(`Error on remove temp update file: ${y}`), c = n.join(s, `${d++}-${r}`);
      }
    return c;
  }
  return Ht;
}
var or = {}, Yr = {}, xl;
function Qd() {
  if (xl) return Yr;
  xl = 1, Object.defineProperty(Yr, "__esModule", { value: !0 }), Yr.getAppCacheDir = l;
  const t = Ie, o = bt;
  function l() {
    const u = (0, o.homedir)();
    let n;
    return process.platform === "win32" ? n = process.env.LOCALAPPDATA || t.join(u, "AppData", "Local") : process.platform === "darwin" ? n = t.join(u, "Library", "Caches") : n = process.env.XDG_CACHE_HOME || t.join(u, ".cache"), n;
  }
  return Yr;
}
var Ll;
function Zd() {
  if (Ll) return or;
  Ll = 1, Object.defineProperty(or, "__esModule", { value: !0 }), or.ElectronAppAdapter = void 0;
  const t = Ie, o = Qd();
  let l = class {
    constructor(n = _t.app) {
      this.app = n;
    }
    whenReady() {
      return this.app.whenReady();
    }
    get version() {
      return this.app.getVersion();
    }
    get name() {
      return this.app.getName();
    }
    get isPackaged() {
      return this.app.isPackaged === !0;
    }
    get appUpdateConfigPath() {
      return this.isPackaged ? t.join(process.resourcesPath, "app-update.yml") : t.join(this.app.getAppPath(), "dev-app-update.yml");
    }
    get userDataPath() {
      return this.app.getPath("userData");
    }
    get baseCachePath() {
      return (0, o.getAppCacheDir)();
    }
    quit() {
      this.app.quit();
    }
    relaunch() {
      this.app.relaunch();
    }
    onQuit(n) {
      this.app.once("quit", (i, e) => n(e));
    }
  };
  return or.ElectronAppAdapter = l, or;
}
var oo = {}, Fl;
function eh() {
  return Fl || (Fl = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.ElectronHttpExecutor = t.NET_SESSION_NAME = void 0, t.getNetSession = l;
    const o = Me();
    t.NET_SESSION_NAME = "electron-updater";
    function l() {
      return _t.session.fromPartition(t.NET_SESSION_NAME, {
        cache: !1
      });
    }
    class u extends o.HttpExecutor {
      constructor(i) {
        super(), this.proxyLoginCallback = i, this.cachedSession = null;
      }
      async download(i, e, f) {
        return await f.cancellationToken.createPromise((r, s, a) => {
          const d = {
            headers: f.headers || void 0,
            redirect: "manual"
          };
          (0, o.configureRequestUrl)(i, d), (0, o.configureRequestOptions)(d), this.doDownload(d, {
            destination: e,
            options: f,
            onCancel: a,
            callback: (c) => {
              c == null ? r(e) : s(c);
            },
            responseHandler: null
          }, 0);
        });
      }
      createRequest(i, e) {
        i.headers && i.headers.Host && (i.host = i.headers.Host, delete i.headers.Host), this.cachedSession == null && (this.cachedSession = l());
        const f = _t.net.request({
          ...i,
          session: this.cachedSession
        });
        return f.on("response", e), this.proxyLoginCallback != null && f.on("login", this.proxyLoginCallback), f;
      }
      addRedirectHandlers(i, e, f, r, s) {
        i.on("redirect", (a, d, c) => {
          i.abort(), r > this.maxRedirects ? f(this.createMaxRedirectError()) : s(o.HttpExecutor.prepareRedirectUrlOptions(c, e));
        });
      }
    }
    t.ElectronHttpExecutor = u;
  })(oo)), oo;
}
var ar = {}, Lt = {}, ao, Ul;
function th() {
  if (Ul) return ao;
  Ul = 1;
  var t = "[object Symbol]", o = /[\\^$.*+?()[\]{}|]/g, l = RegExp(o.source), u = typeof at == "object" && at && at.Object === Object && at, n = typeof self == "object" && self && self.Object === Object && self, i = u || n || Function("return this")(), e = Object.prototype, f = e.toString, r = i.Symbol, s = r ? r.prototype : void 0, a = s ? s.toString : void 0;
  function d(m) {
    if (typeof m == "string")
      return m;
    if (p(m))
      return a ? a.call(m) : "";
    var E = m + "";
    return E == "0" && 1 / m == -1 / 0 ? "-0" : E;
  }
  function c(m) {
    return !!m && typeof m == "object";
  }
  function p(m) {
    return typeof m == "symbol" || c(m) && f.call(m) == t;
  }
  function y(m) {
    return m == null ? "" : d(m);
  }
  function g(m) {
    return m = y(m), m && l.test(m) ? m.replace(o, "\\$&") : m;
  }
  return ao = g, ao;
}
var $l;
function $t() {
  if ($l) return Lt;
  $l = 1, Object.defineProperty(Lt, "__esModule", { value: !0 }), Lt.newBaseUrl = l, Lt.newUrlFromBase = u, Lt.getChannelFilename = n, Lt.blockmapFiles = i;
  const t = Vt, o = th();
  function l(e) {
    const f = new t.URL(e);
    return f.pathname.endsWith("/") || (f.pathname += "/"), f;
  }
  function u(e, f, r = !1) {
    const s = new t.URL(e, f), a = f.search;
    return a != null && a.length !== 0 ? s.search = a : r && (s.search = `noCache=${Date.now().toString(32)}`), s;
  }
  function n(e) {
    return `${e}.yml`;
  }
  function i(e, f, r) {
    const s = u(`${e.pathname}.blockmap`, e);
    return [u(`${e.pathname.replace(new RegExp(o(r), "g"), f)}.blockmap`, e), s];
  }
  return Lt;
}
var pt = {}, kl;
function rt() {
  if (kl) return pt;
  kl = 1, Object.defineProperty(pt, "__esModule", { value: !0 }), pt.Provider = void 0, pt.findFile = n, pt.parseUpdateInfo = i, pt.getFileList = e, pt.resolveFiles = f;
  const t = Me(), o = zo(), l = $t();
  let u = class {
    constructor(s) {
      this.runtimeOptions = s, this.requestHeaders = null, this.executor = s.executor;
    }
    get isUseMultipleRangeRequest() {
      return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
    }
    getChannelFilePrefix() {
      if (this.runtimeOptions.platform === "linux") {
        const s = process.env.TEST_UPDATER_ARCH || process.arch;
        return "-linux" + (s === "x64" ? "" : `-${s}`);
      } else
        return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
    }
    // due to historical reasons for windows we use channel name without platform specifier
    getDefaultChannelName() {
      return this.getCustomChannelName("latest");
    }
    getCustomChannelName(s) {
      return `${s}${this.getChannelFilePrefix()}`;
    }
    get fileExtraDownloadHeaders() {
      return null;
    }
    setRequestHeaders(s) {
      this.requestHeaders = s;
    }
    /**
     * Method to perform API request only to resolve update info, but not to download update.
     */
    httpRequest(s, a, d) {
      return this.executor.request(this.createRequestOptions(s, a), d);
    }
    createRequestOptions(s, a) {
      const d = {};
      return this.requestHeaders == null ? a != null && (d.headers = a) : d.headers = a == null ? this.requestHeaders : { ...this.requestHeaders, ...a }, (0, t.configureRequestUrl)(s, d), d;
    }
  };
  pt.Provider = u;
  function n(r, s, a) {
    if (r.length === 0)
      throw (0, t.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
    const d = r.find((c) => c.url.pathname.toLowerCase().endsWith(`.${s}`));
    return d ?? (a == null ? r[0] : r.find((c) => !a.some((p) => c.url.pathname.toLowerCase().endsWith(`.${p}`))));
  }
  function i(r, s, a) {
    if (r == null)
      throw (0, t.newError)(`Cannot parse update info from ${s} in the latest release artifacts (${a}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    let d;
    try {
      d = (0, o.load)(r);
    } catch (c) {
      throw (0, t.newError)(`Cannot parse update info from ${s} in the latest release artifacts (${a}): ${c.stack || c.message}, rawData: ${r}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    }
    return d;
  }
  function e(r) {
    const s = r.files;
    if (s != null && s.length > 0)
      return s;
    if (r.path != null)
      return [
        {
          url: r.path,
          sha2: r.sha2,
          sha512: r.sha512
        }
      ];
    throw (0, t.newError)(`No files provided: ${(0, t.safeStringifyJson)(r)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
  }
  function f(r, s, a = (d) => d) {
    const c = e(r).map((g) => {
      if (g.sha2 == null && g.sha512 == null)
        throw (0, t.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, t.safeStringifyJson)(g)}`, "ERR_UPDATER_NO_CHECKSUM");
      return {
        url: (0, l.newUrlFromBase)(a(g.url), s),
        info: g
      };
    }), p = r.packages, y = p == null ? null : p[process.arch] || p.ia32;
    return y != null && (c[0].packageInfo = {
      ...y,
      path: (0, l.newUrlFromBase)(a(y.path), s).href
    }), c;
  }
  return pt;
}
var ql;
function bc() {
  if (ql) return ar;
  ql = 1, Object.defineProperty(ar, "__esModule", { value: !0 }), ar.GenericProvider = void 0;
  const t = Me(), o = $t(), l = rt();
  let u = class extends l.Provider {
    constructor(i, e, f) {
      super(f), this.configuration = i, this.updater = e, this.baseUrl = (0, o.newBaseUrl)(this.configuration.url);
    }
    get channel() {
      const i = this.updater.channel || this.configuration.channel;
      return i == null ? this.getDefaultChannelName() : this.getCustomChannelName(i);
    }
    async getLatestVersion() {
      const i = (0, o.getChannelFilename)(this.channel), e = (0, o.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
      for (let f = 0; ; f++)
        try {
          return (0, l.parseUpdateInfo)(await this.httpRequest(e), i, e);
        } catch (r) {
          if (r instanceof t.HttpError && r.statusCode === 404)
            throw (0, t.newError)(`Cannot find channel "${i}" update info: ${r.stack || r.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
          if (r.code === "ECONNREFUSED" && f < 3) {
            await new Promise((s, a) => {
              try {
                setTimeout(s, 1e3 * f);
              } catch (d) {
                a(d);
              }
            });
            continue;
          }
          throw r;
        }
    }
    resolveFiles(i) {
      return (0, l.resolveFiles)(i, this.baseUrl);
    }
  };
  return ar.GenericProvider = u, ar;
}
var sr = {}, lr = {}, Ml;
function rh() {
  if (Ml) return lr;
  Ml = 1, Object.defineProperty(lr, "__esModule", { value: !0 }), lr.BitbucketProvider = void 0;
  const t = Me(), o = $t(), l = rt();
  let u = class extends l.Provider {
    constructor(i, e, f) {
      super({
        ...f,
        isUseMultipleRangeRequest: !1
      }), this.configuration = i, this.updater = e;
      const { owner: r, slug: s } = i;
      this.baseUrl = (0, o.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${r}/${s}/downloads`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "latest";
    }
    async getLatestVersion() {
      const i = new t.CancellationToken(), e = (0, o.getChannelFilename)(this.getCustomChannelName(this.channel)), f = (0, o.newUrlFromBase)(e, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const r = await this.httpRequest(f, void 0, i);
        return (0, l.parseUpdateInfo)(r, e, f);
      } catch (r) {
        throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${r.stack || r.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(i) {
      return (0, l.resolveFiles)(i, this.baseUrl);
    }
    toString() {
      const { owner: i, slug: e } = this.configuration;
      return `Bitbucket (owner: ${i}, slug: ${e}, channel: ${this.channel})`;
    }
  };
  return lr.BitbucketProvider = u, lr;
}
var Et = {}, Bl;
function Ac() {
  if (Bl) return Et;
  Bl = 1, Object.defineProperty(Et, "__esModule", { value: !0 }), Et.GitHubProvider = Et.BaseGitHubProvider = void 0, Et.computeReleaseNotes = s;
  const t = Me(), o = Sc(), l = Vt, u = $t(), n = rt(), i = /\/tag\/([^/]+)$/;
  class e extends n.Provider {
    constructor(d, c, p) {
      super({
        ...p,
        /* because GitHib uses S3 */
        isUseMultipleRangeRequest: !1
      }), this.options = d, this.baseUrl = (0, u.newBaseUrl)((0, t.githubUrl)(d, c));
      const y = c === "github.com" ? "api.github.com" : c;
      this.baseApiUrl = (0, u.newBaseUrl)((0, t.githubUrl)(d, y));
    }
    computeGithubBasePath(d) {
      const c = this.options.host;
      return c && !["github.com", "api.github.com"].includes(c) ? `/api/v3${d}` : d;
    }
  }
  Et.BaseGitHubProvider = e;
  let f = class extends e {
    constructor(d, c, p) {
      super(d, "github.com", p), this.options = d, this.updater = c;
    }
    get channel() {
      const d = this.updater.channel || this.options.channel;
      return d == null ? this.getDefaultChannelName() : this.getCustomChannelName(d);
    }
    async getLatestVersion() {
      var d, c, p, y, g;
      const m = new t.CancellationToken(), E = await this.httpRequest((0, u.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
        accept: "application/xml, application/atom+xml, text/xml, */*"
      }, m), A = (0, t.parseXml)(E);
      let O = A.element("entry", !1, "No published versions on GitHub"), P = null;
      try {
        if (this.updater.allowPrerelease) {
          const q = ((d = this.updater) === null || d === void 0 ? void 0 : d.channel) || ((c = o.prerelease(this.updater.currentVersion)) === null || c === void 0 ? void 0 : c[0]) || null;
          if (q === null)
            P = i.exec(O.element("link").attribute("href"))[1];
          else
            for (const U of A.getElements("entry")) {
              const F = i.exec(U.element("link").attribute("href"));
              if (F === null)
                continue;
              const M = F[1], I = ((p = o.prerelease(M)) === null || p === void 0 ? void 0 : p[0]) || null, x = !q || ["alpha", "beta"].includes(q), H = I !== null && !["alpha", "beta"].includes(String(I));
              if (x && !H && !(q === "beta" && I === "alpha")) {
                P = M;
                break;
              }
              if (I && I === q) {
                P = M;
                break;
              }
            }
        } else {
          P = await this.getLatestTagName(m);
          for (const q of A.getElements("entry"))
            if (i.exec(q.element("link").attribute("href"))[1] === P) {
              O = q;
              break;
            }
        }
      } catch (q) {
        throw (0, t.newError)(`Cannot parse releases feed: ${q.stack || q.message},
XML:
${E}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
      }
      if (P == null)
        throw (0, t.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      let $, T = "", _ = "";
      const b = async (q) => {
        T = (0, u.getChannelFilename)(q), _ = (0, u.newUrlFromBase)(this.getBaseDownloadPath(String(P), T), this.baseUrl);
        const U = this.createRequestOptions(_);
        try {
          return await this.executor.request(U, m);
        } catch (F) {
          throw F instanceof t.HttpError && F.statusCode === 404 ? (0, t.newError)(`Cannot find ${T} in the latest release artifacts (${_}): ${F.stack || F.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : F;
        }
      };
      try {
        let q = this.channel;
        this.updater.allowPrerelease && (!((y = o.prerelease(P)) === null || y === void 0) && y[0]) && (q = this.getCustomChannelName(String((g = o.prerelease(P)) === null || g === void 0 ? void 0 : g[0]))), $ = await b(q);
      } catch (q) {
        if (this.updater.allowPrerelease)
          $ = await b(this.getDefaultChannelName());
        else
          throw q;
      }
      const w = (0, n.parseUpdateInfo)($, T, _);
      return w.releaseName == null && (w.releaseName = O.elementValueOrEmpty("title")), w.releaseNotes == null && (w.releaseNotes = s(this.updater.currentVersion, this.updater.fullChangelog, A, O)), {
        tag: P,
        ...w
      };
    }
    async getLatestTagName(d) {
      const c = this.options, p = c.host == null || c.host === "github.com" ? (0, u.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new l.URL(`${this.computeGithubBasePath(`/repos/${c.owner}/${c.repo}/releases`)}/latest`, this.baseApiUrl);
      try {
        const y = await this.httpRequest(p, { Accept: "application/json" }, d);
        return y == null ? null : JSON.parse(y).tag_name;
      } catch (y) {
        throw (0, t.newError)(`Unable to find latest version on GitHub (${p}), please ensure a production release exists: ${y.stack || y.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return `/${this.options.owner}/${this.options.repo}/releases`;
    }
    resolveFiles(d) {
      return (0, n.resolveFiles)(d, this.baseUrl, (c) => this.getBaseDownloadPath(d.tag, c.replace(/ /g, "-")));
    }
    getBaseDownloadPath(d, c) {
      return `${this.basePath}/download/${d}/${c}`;
    }
  };
  Et.GitHubProvider = f;
  function r(a) {
    const d = a.elementValueOrEmpty("content");
    return d === "No content." ? "" : d;
  }
  function s(a, d, c, p) {
    if (!d)
      return r(p);
    const y = [];
    for (const g of c.getElements("entry")) {
      const m = /\/tag\/v?([^/]+)$/.exec(g.element("link").attribute("href"))[1];
      o.lt(a, m) && y.push({
        version: m,
        note: r(g)
      });
    }
    return y.sort((g, m) => o.rcompare(g.version, m.version));
  }
  return Et;
}
var ur = {}, jl;
function nh() {
  if (jl) return ur;
  jl = 1, Object.defineProperty(ur, "__esModule", { value: !0 }), ur.KeygenProvider = void 0;
  const t = Me(), o = $t(), l = rt();
  let u = class extends l.Provider {
    constructor(i, e, f) {
      super({
        ...f,
        isUseMultipleRangeRequest: !1
      }), this.configuration = i, this.updater = e, this.defaultHostname = "api.keygen.sh";
      const r = this.configuration.host || this.defaultHostname;
      this.baseUrl = (0, o.newBaseUrl)(`https://${r}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
    }
    get channel() {
      return this.updater.channel || this.configuration.channel || "stable";
    }
    async getLatestVersion() {
      const i = new t.CancellationToken(), e = (0, o.getChannelFilename)(this.getCustomChannelName(this.channel)), f = (0, o.newUrlFromBase)(e, this.baseUrl, this.updater.isAddNoCacheQuery);
      try {
        const r = await this.httpRequest(f, {
          Accept: "application/vnd.api+json",
          "Keygen-Version": "1.1"
        }, i);
        return (0, l.parseUpdateInfo)(r, e, f);
      } catch (r) {
        throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${r.stack || r.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    resolveFiles(i) {
      return (0, l.resolveFiles)(i, this.baseUrl);
    }
    toString() {
      const { account: i, product: e, platform: f } = this.configuration;
      return `Keygen (account: ${i}, product: ${e}, platform: ${f}, channel: ${this.channel})`;
    }
  };
  return ur.KeygenProvider = u, ur;
}
var cr = {}, Hl;
function ih() {
  if (Hl) return cr;
  Hl = 1, Object.defineProperty(cr, "__esModule", { value: !0 }), cr.PrivateGitHubProvider = void 0;
  const t = Me(), o = zo(), l = Ie, u = Vt, n = $t(), i = Ac(), e = rt();
  let f = class extends i.BaseGitHubProvider {
    constructor(s, a, d, c) {
      super(s, "api.github.com", c), this.updater = a, this.token = d;
    }
    createRequestOptions(s, a) {
      const d = super.createRequestOptions(s, a);
      return d.redirect = "manual", d;
    }
    async getLatestVersion() {
      const s = new t.CancellationToken(), a = (0, n.getChannelFilename)(this.getDefaultChannelName()), d = await this.getLatestVersionInfo(s), c = d.assets.find((g) => g.name === a);
      if (c == null)
        throw (0, t.newError)(`Cannot find ${a} in the release ${d.html_url || d.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      const p = new u.URL(c.url);
      let y;
      try {
        y = (0, o.load)(await this.httpRequest(p, this.configureHeaders("application/octet-stream"), s));
      } catch (g) {
        throw g instanceof t.HttpError && g.statusCode === 404 ? (0, t.newError)(`Cannot find ${a} in the latest release artifacts (${p}): ${g.stack || g.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : g;
      }
      return y.assets = d.assets, y;
    }
    get fileExtraDownloadHeaders() {
      return this.configureHeaders("application/octet-stream");
    }
    configureHeaders(s) {
      return {
        accept: s,
        authorization: `token ${this.token}`
      };
    }
    async getLatestVersionInfo(s) {
      const a = this.updater.allowPrerelease;
      let d = this.basePath;
      a || (d = `${d}/latest`);
      const c = (0, n.newUrlFromBase)(d, this.baseUrl);
      try {
        const p = JSON.parse(await this.httpRequest(c, this.configureHeaders("application/vnd.github.v3+json"), s));
        return a ? p.find((y) => y.prerelease) || p[0] : p;
      } catch (p) {
        throw (0, t.newError)(`Unable to find latest version on GitHub (${c}), please ensure a production release exists: ${p.stack || p.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
      }
    }
    get basePath() {
      return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
    }
    resolveFiles(s) {
      return (0, e.getFileList)(s).map((a) => {
        const d = l.posix.basename(a.url).replace(/ /g, "-"), c = s.assets.find((p) => p != null && p.name === d);
        if (c == null)
          throw (0, t.newError)(`Cannot find asset "${d}" in: ${JSON.stringify(s.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
        return {
          url: new u.URL(c.url),
          info: a
        };
      });
    }
  };
  return cr.PrivateGitHubProvider = f, cr;
}
var Gl;
function oh() {
  if (Gl) return sr;
  Gl = 1, Object.defineProperty(sr, "__esModule", { value: !0 }), sr.isUrlProbablySupportMultiRangeRequests = e, sr.createClient = f;
  const t = Me(), o = rh(), l = bc(), u = Ac(), n = nh(), i = ih();
  function e(r) {
    return !r.includes("s3.amazonaws.com");
  }
  function f(r, s, a) {
    if (typeof r == "string")
      throw (0, t.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
    const d = r.provider;
    switch (d) {
      case "github": {
        const c = r, p = (c.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || c.token;
        return p == null ? new u.GitHubProvider(c, s, a) : new i.PrivateGitHubProvider(c, s, p, a);
      }
      case "bitbucket":
        return new o.BitbucketProvider(r, s, a);
      case "keygen":
        return new n.KeygenProvider(r, s, a);
      case "s3":
      case "spaces":
        return new l.GenericProvider({
          provider: "generic",
          url: (0, t.getS3LikeProviderBaseUrl)(r),
          channel: r.channel || null
        }, s, {
          ...a,
          // https://github.com/minio/minio/issues/5285#issuecomment-350428955
          isUseMultipleRangeRequest: !1
        });
      case "generic": {
        const c = r;
        return new l.GenericProvider(c, s, {
          ...a,
          isUseMultipleRangeRequest: c.useMultipleRangeRequest !== !1 && e(c.url)
        });
      }
      case "custom": {
        const c = r, p = c.updateProvider;
        if (!p)
          throw (0, t.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
        return new p(c, s, a);
      }
      default:
        throw (0, t.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
    }
  }
  return sr;
}
var fr = {}, dr = {}, Gt = {}, Wt = {}, Wl;
function Zo() {
  if (Wl) return Wt;
  Wl = 1, Object.defineProperty(Wt, "__esModule", { value: !0 }), Wt.OperationKind = void 0, Wt.computeOperations = o;
  var t;
  (function(e) {
    e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
  })(t || (Wt.OperationKind = t = {}));
  function o(e, f, r) {
    const s = i(e.files), a = i(f.files);
    let d = null;
    const c = f.files[0], p = [], y = c.name, g = s.get(y);
    if (g == null)
      throw new Error(`no file ${y} in old blockmap`);
    const m = a.get(y);
    let E = 0;
    const { checksumToOffset: A, checksumToOldSize: O } = n(s.get(y), g.offset, r);
    let P = c.offset;
    for (let $ = 0; $ < m.checksums.length; P += m.sizes[$], $++) {
      const T = m.sizes[$], _ = m.checksums[$];
      let b = A.get(_);
      b != null && O.get(_) !== T && (r.warn(`Checksum ("${_}") matches, but size differs (old: ${O.get(_)}, new: ${T})`), b = void 0), b === void 0 ? (E++, d != null && d.kind === t.DOWNLOAD && d.end === P ? d.end += T : (d = {
        kind: t.DOWNLOAD,
        start: P,
        end: P + T
        // oldBlocks: null,
      }, u(d, p, _, $))) : d != null && d.kind === t.COPY && d.end === b ? d.end += T : (d = {
        kind: t.COPY,
        start: b,
        end: b + T
        // oldBlocks: [checksum]
      }, u(d, p, _, $));
    }
    return E > 0 && r.info(`File${c.name === "file" ? "" : " " + c.name} has ${E} changed blocks`), p;
  }
  const l = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
  function u(e, f, r, s) {
    if (l && f.length !== 0) {
      const a = f[f.length - 1];
      if (a.kind === e.kind && e.start < a.end && e.start > a.start) {
        const d = [a.start, a.end, e.start, e.end].reduce((c, p) => c < p ? c : p);
        throw new Error(`operation (block index: ${s}, checksum: ${r}, kind: ${t[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${a.start} until ${a.end} and ${e.start} until ${e.end}
rel: ${a.start - d} until ${a.end - d} and ${e.start - d} until ${e.end - d}`);
      }
    }
    f.push(e);
  }
  function n(e, f, r) {
    const s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
    let d = f;
    for (let c = 0; c < e.checksums.length; c++) {
      const p = e.checksums[c], y = e.sizes[c], g = a.get(p);
      if (g === void 0)
        s.set(p, d), a.set(p, y);
      else if (r.debug != null) {
        const m = g === y ? "(same size)" : `(size: ${g}, this size: ${y})`;
        r.debug(`${p} duplicated in blockmap ${m}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
      }
      d += y;
    }
    return { checksumToOffset: s, checksumToOldSize: a };
  }
  function i(e) {
    const f = /* @__PURE__ */ new Map();
    for (const r of e)
      f.set(r.name, r);
    return f;
  }
  return Wt;
}
var zl;
function Cc() {
  if (zl) return Gt;
  zl = 1, Object.defineProperty(Gt, "__esModule", { value: !0 }), Gt.DataSplitter = void 0, Gt.copyData = e;
  const t = Me(), o = Ke, l = Ar, u = Zo(), n = Buffer.from(`\r
\r
`);
  var i;
  (function(r) {
    r[r.INIT = 0] = "INIT", r[r.HEADER = 1] = "HEADER", r[r.BODY = 2] = "BODY";
  })(i || (i = {}));
  function e(r, s, a, d, c) {
    const p = (0, o.createReadStream)("", {
      fd: a,
      autoClose: !1,
      start: r.start,
      // end is inclusive
      end: r.end - 1
    });
    p.on("error", d), p.once("end", c), p.pipe(s, {
      end: !1
    });
  }
  let f = class extends l.Writable {
    constructor(s, a, d, c, p, y) {
      super(), this.out = s, this.options = a, this.partIndexToTaskIndex = d, this.partIndexToLength = p, this.finishHandler = y, this.partIndex = -1, this.headerListBuffer = null, this.readState = i.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = c.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
    }
    get isFinished() {
      return this.partIndex === this.partIndexToLength.length;
    }
    // noinspection JSUnusedGlobalSymbols
    _write(s, a, d) {
      if (this.isFinished) {
        console.error(`Trailing ignored data: ${s.length} bytes`);
        return;
      }
      this.handleData(s).then(d).catch(d);
    }
    async handleData(s) {
      let a = 0;
      if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
        throw (0, t.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
      if (this.ignoreByteCount > 0) {
        const d = Math.min(this.ignoreByteCount, s.length);
        this.ignoreByteCount -= d, a = d;
      } else if (this.remainingPartDataCount > 0) {
        const d = Math.min(this.remainingPartDataCount, s.length);
        this.remainingPartDataCount -= d, await this.processPartData(s, 0, d), a = d;
      }
      if (a !== s.length) {
        if (this.readState === i.HEADER) {
          const d = this.searchHeaderListEnd(s, a);
          if (d === -1)
            return;
          a = d, this.readState = i.BODY, this.headerListBuffer = null;
        }
        for (; ; ) {
          if (this.readState === i.BODY)
            this.readState = i.INIT;
          else {
            this.partIndex++;
            let y = this.partIndexToTaskIndex.get(this.partIndex);
            if (y == null)
              if (this.isFinished)
                y = this.options.end;
              else
                throw (0, t.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
            const g = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
            if (g < y)
              await this.copyExistingData(g, y);
            else if (g > y)
              throw (0, t.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
            if (this.isFinished) {
              this.onPartEnd(), this.finishHandler();
              return;
            }
            if (a = this.searchHeaderListEnd(s, a), a === -1) {
              this.readState = i.HEADER;
              return;
            }
          }
          const d = this.partIndexToLength[this.partIndex], c = a + d, p = Math.min(c, s.length);
          if (await this.processPartStarted(s, a, p), this.remainingPartDataCount = d - (p - a), this.remainingPartDataCount > 0)
            return;
          if (a = c + this.boundaryLength, a >= s.length) {
            this.ignoreByteCount = this.boundaryLength - (s.length - c);
            return;
          }
        }
      }
    }
    copyExistingData(s, a) {
      return new Promise((d, c) => {
        const p = () => {
          if (s === a) {
            d();
            return;
          }
          const y = this.options.tasks[s];
          if (y.kind !== u.OperationKind.COPY) {
            c(new Error("Task kind must be COPY"));
            return;
          }
          e(y, this.out, this.options.oldFileFd, c, () => {
            s++, p();
          });
        };
        p();
      });
    }
    searchHeaderListEnd(s, a) {
      const d = s.indexOf(n, a);
      if (d !== -1)
        return d + n.length;
      const c = a === 0 ? s : s.slice(a);
      return this.headerListBuffer == null ? this.headerListBuffer = c : this.headerListBuffer = Buffer.concat([this.headerListBuffer, c]), -1;
    }
    onPartEnd() {
      const s = this.partIndexToLength[this.partIndex - 1];
      if (this.actualPartLength !== s)
        throw (0, t.newError)(`Expected length: ${s} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
      this.actualPartLength = 0;
    }
    processPartStarted(s, a, d) {
      return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(s, a, d);
    }
    processPartData(s, a, d) {
      this.actualPartLength += d - a;
      const c = this.out;
      return c.write(a === 0 && s.length === d ? s : s.slice(a, d)) ? Promise.resolve() : new Promise((p, y) => {
        c.on("error", y), c.once("drain", () => {
          c.removeListener("error", y), p();
        });
      });
    }
  };
  return Gt.DataSplitter = f, Gt;
}
var hr = {}, Vl;
function ah() {
  if (Vl) return hr;
  Vl = 1, Object.defineProperty(hr, "__esModule", { value: !0 }), hr.executeTasksUsingMultipleRangeRequests = u, hr.checkIsRangesSupported = i;
  const t = Me(), o = Cc(), l = Zo();
  function u(e, f, r, s, a) {
    const d = (c) => {
      if (c >= f.length) {
        e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
        return;
      }
      const p = c + 1e3;
      n(e, {
        tasks: f,
        start: c,
        end: Math.min(f.length, p),
        oldFileFd: s
      }, r, () => d(p), a);
    };
    return d;
  }
  function n(e, f, r, s, a) {
    let d = "bytes=", c = 0;
    const p = /* @__PURE__ */ new Map(), y = [];
    for (let E = f.start; E < f.end; E++) {
      const A = f.tasks[E];
      A.kind === l.OperationKind.DOWNLOAD && (d += `${A.start}-${A.end - 1}, `, p.set(c, E), c++, y.push(A.end - A.start));
    }
    if (c <= 1) {
      const E = (A) => {
        if (A >= f.end) {
          s();
          return;
        }
        const O = f.tasks[A++];
        if (O.kind === l.OperationKind.COPY)
          (0, o.copyData)(O, r, f.oldFileFd, a, () => E(A));
        else {
          const P = e.createRequestOptions();
          P.headers.Range = `bytes=${O.start}-${O.end - 1}`;
          const $ = e.httpExecutor.createRequest(P, (T) => {
            i(T, a) && (T.pipe(r, {
              end: !1
            }), T.once("end", () => E(A)));
          });
          e.httpExecutor.addErrorAndTimeoutHandlers($, a), $.end();
        }
      };
      E(f.start);
      return;
    }
    const g = e.createRequestOptions();
    g.headers.Range = d.substring(0, d.length - 2);
    const m = e.httpExecutor.createRequest(g, (E) => {
      if (!i(E, a))
        return;
      const A = (0, t.safeGetHeader)(E, "content-type"), O = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(A);
      if (O == null) {
        a(new Error(`Content-Type "multipart/byteranges" is expected, but got "${A}"`));
        return;
      }
      const P = new o.DataSplitter(r, f, p, O[1] || O[2], y, s);
      P.on("error", a), E.pipe(P), E.on("end", () => {
        setTimeout(() => {
          m.abort(), a(new Error("Response ends without calling any handlers"));
        }, 1e4);
      });
    });
    e.httpExecutor.addErrorAndTimeoutHandlers(m, a), m.end();
  }
  function i(e, f) {
    if (e.statusCode >= 400)
      return f((0, t.createHttpError)(e)), !1;
    if (e.statusCode !== 206) {
      const r = (0, t.safeGetHeader)(e, "accept-ranges");
      if (r == null || r === "none")
        return f(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
    }
    return !0;
  }
  return hr;
}
var pr = {}, Yl;
function sh() {
  if (Yl) return pr;
  Yl = 1, Object.defineProperty(pr, "__esModule", { value: !0 }), pr.ProgressDifferentialDownloadCallbackTransform = void 0;
  const t = Ar;
  var o;
  (function(u) {
    u[u.COPY = 0] = "COPY", u[u.DOWNLOAD = 1] = "DOWNLOAD";
  })(o || (o = {}));
  let l = class extends t.Transform {
    constructor(n, i, e) {
      super(), this.progressDifferentialDownloadInfo = n, this.cancellationToken = i, this.onProgress = e, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = o.COPY, this.nextUpdate = this.start + 1e3;
    }
    _transform(n, i, e) {
      if (this.cancellationToken.cancelled) {
        e(new Error("cancelled"), null);
        return;
      }
      if (this.operationType == o.COPY) {
        e(null, n);
        return;
      }
      this.transferred += n.length, this.delta += n.length;
      const f = Date.now();
      f >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = f + 1e3, this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((f - this.start) / 1e3))
      }), this.delta = 0), e(null, n);
    }
    beginFileCopy() {
      this.operationType = o.COPY;
    }
    beginRangeDownload() {
      this.operationType = o.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
    }
    endRangeDownload() {
      this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      });
    }
    // Called when we are 100% done with the connection/download
    _flush(n) {
      if (this.cancellationToken.cancelled) {
        n(new Error("cancelled"));
        return;
      }
      this.onProgress({
        total: this.progressDifferentialDownloadInfo.grandTotal,
        delta: this.delta,
        transferred: this.transferred,
        percent: 100,
        bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
      }), this.delta = 0, this.transferred = 0, n(null);
    }
  };
  return pr.ProgressDifferentialDownloadCallbackTransform = l, pr;
}
var Jl;
function Tc() {
  if (Jl) return dr;
  Jl = 1, Object.defineProperty(dr, "__esModule", { value: !0 }), dr.DifferentialDownloader = void 0;
  const t = Me(), o = /* @__PURE__ */ At(), l = Ke, u = Cc(), n = Vt, i = Zo(), e = ah(), f = sh();
  let r = class {
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(c, p, y) {
      this.blockAwareFileInfo = c, this.httpExecutor = p, this.options = y, this.fileMetadataBuffer = null, this.logger = y.logger;
    }
    createRequestOptions() {
      const c = {
        headers: {
          ...this.options.requestHeaders,
          accept: "*/*"
        }
      };
      return (0, t.configureRequestUrl)(this.options.newUrl, c), (0, t.configureRequestOptions)(c), c;
    }
    doDownload(c, p) {
      if (c.version !== p.version)
        throw new Error(`version is different (${c.version} - ${p.version}), full download is required`);
      const y = this.logger, g = (0, i.computeOperations)(c, p, y);
      y.debug != null && y.debug(JSON.stringify(g, null, 2));
      let m = 0, E = 0;
      for (const O of g) {
        const P = O.end - O.start;
        O.kind === i.OperationKind.DOWNLOAD ? m += P : E += P;
      }
      const A = this.blockAwareFileInfo.size;
      if (m + E + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== A)
        throw new Error(`Internal error, size mismatch: downloadSize: ${m}, copySize: ${E}, newSize: ${A}`);
      return y.info(`Full: ${s(A)}, To download: ${s(m)} (${Math.round(m / (A / 100))}%)`), this.downloadFile(g);
    }
    downloadFile(c) {
      const p = [], y = () => Promise.all(p.map((g) => (0, o.close)(g.descriptor).catch((m) => {
        this.logger.error(`cannot close file "${g.path}": ${m}`);
      })));
      return this.doDownloadFile(c, p).then(y).catch((g) => y().catch((m) => {
        try {
          this.logger.error(`cannot close files: ${m}`);
        } catch (E) {
          try {
            console.error(E);
          } catch {
          }
        }
        throw g;
      }).then(() => {
        throw g;
      }));
    }
    async doDownloadFile(c, p) {
      const y = await (0, o.open)(this.options.oldFile, "r");
      p.push({ descriptor: y, path: this.options.oldFile });
      const g = await (0, o.open)(this.options.newFile, "w");
      p.push({ descriptor: g, path: this.options.newFile });
      const m = (0, l.createWriteStream)(this.options.newFile, { fd: g });
      await new Promise((E, A) => {
        const O = [];
        let P;
        if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
          const F = [];
          let M = 0;
          for (const x of c)
            x.kind === i.OperationKind.DOWNLOAD && (F.push(x.end - x.start), M += x.end - x.start);
          const I = {
            expectedByteCounts: F,
            grandTotal: M
          };
          P = new f.ProgressDifferentialDownloadCallbackTransform(I, this.options.cancellationToken, this.options.onProgress), O.push(P);
        }
        const $ = new t.DigestTransform(this.blockAwareFileInfo.sha512);
        $.isValidateOnEnd = !1, O.push($), m.on("finish", () => {
          m.close(() => {
            p.splice(1, 1);
            try {
              $.validate();
            } catch (F) {
              A(F);
              return;
            }
            E(void 0);
          });
        }), O.push(m);
        let T = null;
        for (const F of O)
          F.on("error", A), T == null ? T = F : T = T.pipe(F);
        const _ = O[0];
        let b;
        if (this.options.isUseMultipleRangeRequest) {
          b = (0, e.executeTasksUsingMultipleRangeRequests)(this, c, _, y, A), b(0);
          return;
        }
        let w = 0, q = null;
        this.logger.info(`Differential download: ${this.options.newUrl}`);
        const U = this.createRequestOptions();
        U.redirect = "manual", b = (F) => {
          var M, I;
          if (F >= c.length) {
            this.fileMetadataBuffer != null && _.write(this.fileMetadataBuffer), _.end();
            return;
          }
          const x = c[F++];
          if (x.kind === i.OperationKind.COPY) {
            P && P.beginFileCopy(), (0, u.copyData)(x, _, y, A, () => b(F));
            return;
          }
          const H = `bytes=${x.start}-${x.end - 1}`;
          U.headers.range = H, (I = (M = this.logger) === null || M === void 0 ? void 0 : M.debug) === null || I === void 0 || I.call(M, `download range: ${H}`), P && P.beginRangeDownload();
          const D = this.httpExecutor.createRequest(U, (Q) => {
            Q.on("error", A), Q.on("aborted", () => {
              A(new Error("response has been aborted by the server"));
            }), Q.statusCode >= 400 && A((0, t.createHttpError)(Q)), Q.pipe(_, {
              end: !1
            }), Q.once("end", () => {
              P && P.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => b(F), 1e3)) : b(F);
            });
          });
          D.on("redirect", (Q, V, ne) => {
            this.logger.info(`Redirect to ${a(ne)}`), q = ne, (0, t.configureRequestUrl)(new n.URL(q), U), D.followRedirect();
          }), this.httpExecutor.addErrorAndTimeoutHandlers(D, A), D.end();
        }, b(0);
      });
    }
    async readRemoteBytes(c, p) {
      const y = Buffer.allocUnsafe(p + 1 - c), g = this.createRequestOptions();
      g.headers.range = `bytes=${c}-${p}`;
      let m = 0;
      if (await this.request(g, (E) => {
        E.copy(y, m), m += E.length;
      }), m !== y.length)
        throw new Error(`Received data length ${m} is not equal to expected ${y.length}`);
      return y;
    }
    request(c, p) {
      return new Promise((y, g) => {
        const m = this.httpExecutor.createRequest(c, (E) => {
          (0, e.checkIsRangesSupported)(E, g) && (E.on("error", g), E.on("aborted", () => {
            g(new Error("response has been aborted by the server"));
          }), E.on("data", p), E.on("end", () => y()));
        });
        this.httpExecutor.addErrorAndTimeoutHandlers(m, g), m.end();
      });
    }
  };
  dr.DifferentialDownloader = r;
  function s(d, c = " KB") {
    return new Intl.NumberFormat("en").format((d / 1024).toFixed(2)) + c;
  }
  function a(d) {
    const c = d.indexOf("?");
    return c < 0 ? d : d.substring(0, c);
  }
  return dr;
}
var Xl;
function lh() {
  if (Xl) return fr;
  Xl = 1, Object.defineProperty(fr, "__esModule", { value: !0 }), fr.GenericDifferentialDownloader = void 0;
  const t = Tc();
  let o = class extends t.DifferentialDownloader {
    download(u, n) {
      return this.doDownload(u, n);
    }
  };
  return fr.GenericDifferentialDownloader = o, fr;
}
var so = {}, Kl;
function kt() {
  return Kl || (Kl = 1, (function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.UpdaterSignal = t.UPDATE_DOWNLOADED = t.DOWNLOAD_PROGRESS = t.CancellationToken = void 0, t.addHandler = u;
    const o = Me();
    Object.defineProperty(t, "CancellationToken", { enumerable: !0, get: function() {
      return o.CancellationToken;
    } }), t.DOWNLOAD_PROGRESS = "download-progress", t.UPDATE_DOWNLOADED = "update-downloaded";
    class l {
      constructor(i) {
        this.emitter = i;
      }
      /**
       * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
       */
      login(i) {
        u(this.emitter, "login", i);
      }
      progress(i) {
        u(this.emitter, t.DOWNLOAD_PROGRESS, i);
      }
      updateDownloaded(i) {
        u(this.emitter, t.UPDATE_DOWNLOADED, i);
      }
      updateCancelled(i) {
        u(this.emitter, "update-cancelled", i);
      }
    }
    t.UpdaterSignal = l;
    function u(n, i, e) {
      n.on(i, e);
    }
  })(so)), so;
}
var Ql;
function ea() {
  if (Ql) return It;
  Ql = 1, Object.defineProperty(It, "__esModule", { value: !0 }), It.NoOpLogger = It.AppUpdater = void 0;
  const t = Me(), o = Tr, l = bt, u = Kr, n = /* @__PURE__ */ At(), i = zo(), e = Cd(), f = Ie, r = Sc(), s = Kd(), a = Zd(), d = eh(), c = bc(), p = oh(), y = Ju, g = $t(), m = lh(), E = kt();
  let A = class Rc extends u.EventEmitter {
    /**
     * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
     */
    get channel() {
      return this._channel;
    }
    /**
     * Set the update channel. Overrides `channel` in the update configuration.
     *
     * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
     */
    set channel(T) {
      if (this._channel != null) {
        if (typeof T != "string")
          throw (0, t.newError)(`Channel must be a string, but got: ${T}`, "ERR_UPDATER_INVALID_CHANNEL");
        if (T.length === 0)
          throw (0, t.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
      }
      this._channel = T, this.allowDowngrade = !0;
    }
    /**
     *  Shortcut for explicitly adding auth tokens to request headers
     */
    addAuthHeader(T) {
      this.requestHeaders = Object.assign({}, this.requestHeaders, {
        authorization: T
      });
    }
    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    get netSession() {
      return (0, d.getNetSession)();
    }
    /**
     * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
     * Set it to `null` if you would like to disable a logging feature.
     */
    get logger() {
      return this._logger;
    }
    set logger(T) {
      this._logger = T ?? new P();
    }
    // noinspection JSUnusedGlobalSymbols
    /**
     * test only
     * @private
     */
    set updateConfigPath(T) {
      this.clientPromise = null, this._appUpdateConfigPath = T, this.configOnDisk = new e.Lazy(() => this.loadUpdateConfig());
    }
    /**
     * Allows developer to override default logic for determining if an update is supported.
     * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
     */
    get isUpdateSupported() {
      return this._isUpdateSupported;
    }
    set isUpdateSupported(T) {
      T && (this._isUpdateSupported = T);
    }
    constructor(T, _) {
      super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new E.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (q) => this.checkIfUpdateSupported(q), this.clientPromise = null, this.stagingUserIdPromise = new e.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new e.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (q) => {
        this._logger.error(`Error: ${q.stack || q.message}`);
      }), _ == null ? (this.app = new a.ElectronAppAdapter(), this.httpExecutor = new d.ElectronHttpExecutor((q, U) => this.emit("login", q, U))) : (this.app = _, this.httpExecutor = null);
      const b = this.app.version, w = (0, r.parse)(b);
      if (w == null)
        throw (0, t.newError)(`App version is not a valid semver version: "${b}"`, "ERR_UPDATER_INVALID_VERSION");
      this.currentVersion = w, this.allowPrerelease = O(w), T != null && (this.setFeedURL(T), typeof T != "string" && T.requestHeaders && (this.requestHeaders = T.requestHeaders));
    }
    //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    getFeedURL() {
      return "Deprecated. Do not use it.";
    }
    /**
     * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
     * @param options If you want to override configuration in the `app-update.yml`.
     */
    setFeedURL(T) {
      const _ = this.createProviderRuntimeOptions();
      let b;
      typeof T == "string" ? b = new c.GenericProvider({ provider: "generic", url: T }, this, {
        ..._,
        isUseMultipleRangeRequest: (0, p.isUrlProbablySupportMultiRangeRequests)(T)
      }) : b = (0, p.createClient)(T, this, _), this.clientPromise = Promise.resolve(b);
    }
    /**
     * Asks the server whether there is an update.
     * @returns null if the updater is disabled, otherwise info about the latest version
     */
    checkForUpdates() {
      if (!this.isUpdaterActive())
        return Promise.resolve(null);
      let T = this.checkForUpdatesPromise;
      if (T != null)
        return this._logger.info("Checking for update (already in progress)"), T;
      const _ = () => this.checkForUpdatesPromise = null;
      return this._logger.info("Checking for update"), T = this.doCheckForUpdates().then((b) => (_(), b)).catch((b) => {
        throw _(), this.emit("error", b, `Cannot check for updates: ${(b.stack || b).toString()}`), b;
      }), this.checkForUpdatesPromise = T, T;
    }
    isUpdaterActive() {
      return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
    }
    // noinspection JSUnusedGlobalSymbols
    checkForUpdatesAndNotify(T) {
      return this.checkForUpdates().then((_) => _?.downloadPromise ? (_.downloadPromise.then(() => {
        const b = Rc.formatDownloadNotification(_.updateInfo.version, this.app.name, T);
        new _t.Notification(b).show();
      }), _) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), _));
    }
    static formatDownloadNotification(T, _, b) {
      return b == null && (b = {
        title: "A new update is ready to install",
        body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
      }), b = {
        title: b.title.replace("{appName}", _).replace("{version}", T),
        body: b.body.replace("{appName}", _).replace("{version}", T)
      }, b;
    }
    async isStagingMatch(T) {
      const _ = T.stagingPercentage;
      let b = _;
      if (b == null)
        return !0;
      if (b = parseInt(b, 10), isNaN(b))
        return this._logger.warn(`Staging percentage is NaN: ${_}`), !0;
      b = b / 100;
      const w = await this.stagingUserIdPromise.value, U = t.UUID.parse(w).readUInt32BE(12) / 4294967295;
      return this._logger.info(`Staging percentage: ${b}, percentage: ${U}, user id: ${w}`), U < b;
    }
    computeFinalHeaders(T) {
      return this.requestHeaders != null && Object.assign(T, this.requestHeaders), T;
    }
    async isUpdateAvailable(T) {
      const _ = (0, r.parse)(T.version);
      if (_ == null)
        throw (0, t.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${T.version}"`, "ERR_UPDATER_INVALID_VERSION");
      const b = this.currentVersion;
      if ((0, r.eq)(_, b) || !await Promise.resolve(this.isUpdateSupported(T)) || !await this.isStagingMatch(T))
        return !1;
      const q = (0, r.gt)(_, b), U = (0, r.lt)(_, b);
      return q ? !0 : this.allowDowngrade && U;
    }
    checkIfUpdateSupported(T) {
      const _ = T?.minimumSystemVersion, b = (0, l.release)();
      if (_)
        try {
          if ((0, r.lt)(b, _))
            return this._logger.info(`Current OS version ${b} is less than the minimum OS version required ${_} for version ${b}`), !1;
        } catch (w) {
          this._logger.warn(`Failed to compare current OS version(${b}) with minimum OS version(${_}): ${(w.message || w).toString()}`);
        }
      return !0;
    }
    async getUpdateInfoAndProvider() {
      await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((b) => (0, p.createClient)(b, this, this.createProviderRuntimeOptions())));
      const T = await this.clientPromise, _ = await this.stagingUserIdPromise.value;
      return T.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": _ })), {
        info: await T.getLatestVersion(),
        provider: T
      };
    }
    createProviderRuntimeOptions() {
      return {
        isUseMultipleRangeRequest: !0,
        platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
        executor: this.httpExecutor
      };
    }
    async doCheckForUpdates() {
      this.emit("checking-for-update");
      const T = await this.getUpdateInfoAndProvider(), _ = T.info;
      if (!await this.isUpdateAvailable(_))
        return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${_.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", _), {
          isUpdateAvailable: !1,
          versionInfo: _,
          updateInfo: _
        };
      this.updateInfoAndProvider = T, this.onUpdateAvailable(_);
      const b = new t.CancellationToken();
      return {
        isUpdateAvailable: !0,
        versionInfo: _,
        updateInfo: _,
        cancellationToken: b,
        downloadPromise: this.autoDownload ? this.downloadUpdate(b) : null
      };
    }
    onUpdateAvailable(T) {
      this._logger.info(`Found version ${T.version} (url: ${(0, t.asArray)(T.files).map((_) => _.url).join(", ")})`), this.emit("update-available", T);
    }
    /**
     * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
     * @returns {Promise<Array<string>>} Paths to downloaded files.
     */
    downloadUpdate(T = new t.CancellationToken()) {
      const _ = this.updateInfoAndProvider;
      if (_ == null) {
        const w = new Error("Please check update first");
        return this.dispatchError(w), Promise.reject(w);
      }
      if (this.downloadPromise != null)
        return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
      this._logger.info(`Downloading update from ${(0, t.asArray)(_.info.files).map((w) => w.url).join(", ")}`);
      const b = (w) => {
        if (!(w instanceof t.CancellationError))
          try {
            this.dispatchError(w);
          } catch (q) {
            this._logger.warn(`Cannot dispatch error event: ${q.stack || q}`);
          }
        return w;
      };
      return this.downloadPromise = this.doDownloadUpdate({
        updateInfoAndProvider: _,
        requestHeaders: this.computeRequestHeaders(_.provider),
        cancellationToken: T,
        disableWebInstaller: this.disableWebInstaller,
        disableDifferentialDownload: this.disableDifferentialDownload
      }).catch((w) => {
        throw b(w);
      }).finally(() => {
        this.downloadPromise = null;
      }), this.downloadPromise;
    }
    dispatchError(T) {
      this.emit("error", T, (T.stack || T).toString());
    }
    dispatchUpdateDownloaded(T) {
      this.emit(E.UPDATE_DOWNLOADED, T);
    }
    async loadUpdateConfig() {
      return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, i.load)(await (0, n.readFile)(this._appUpdateConfigPath, "utf-8"));
    }
    computeRequestHeaders(T) {
      const _ = T.fileExtraDownloadHeaders;
      if (_ != null) {
        const b = this.requestHeaders;
        return b == null ? _ : {
          ..._,
          ...b
        };
      }
      return this.computeFinalHeaders({ accept: "*/*" });
    }
    async getOrCreateStagingUserId() {
      const T = f.join(this.app.userDataPath, ".updaterId");
      try {
        const b = await (0, n.readFile)(T, "utf-8");
        if (t.UUID.check(b))
          return b;
        this._logger.warn(`Staging user id file exists, but content was invalid: ${b}`);
      } catch (b) {
        b.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${b}`);
      }
      const _ = t.UUID.v5((0, o.randomBytes)(4096), t.UUID.OID);
      this._logger.info(`Generated new staging user ID: ${_}`);
      try {
        await (0, n.outputFile)(T, _);
      } catch (b) {
        this._logger.warn(`Couldn't write out staging user ID: ${b}`);
      }
      return _;
    }
    /** @internal */
    get isAddNoCacheQuery() {
      const T = this.requestHeaders;
      if (T == null)
        return !0;
      for (const _ of Object.keys(T)) {
        const b = _.toLowerCase();
        if (b === "authorization" || b === "private-token")
          return !1;
      }
      return !0;
    }
    async getOrCreateDownloadHelper() {
      let T = this.downloadedUpdateHelper;
      if (T == null) {
        const _ = (await this.configOnDisk.value).updaterCacheDirName, b = this._logger;
        _ == null && b.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
        const w = f.join(this.app.baseCachePath, _ || this.app.name);
        b.debug != null && b.debug(`updater cache dir: ${w}`), T = new s.DownloadedUpdateHelper(w), this.downloadedUpdateHelper = T;
      }
      return T;
    }
    async executeDownload(T) {
      const _ = T.fileInfo, b = {
        headers: T.downloadUpdateOptions.requestHeaders,
        cancellationToken: T.downloadUpdateOptions.cancellationToken,
        sha2: _.info.sha2,
        sha512: _.info.sha512
      };
      this.listenerCount(E.DOWNLOAD_PROGRESS) > 0 && (b.onProgress = (ge) => this.emit(E.DOWNLOAD_PROGRESS, ge));
      const w = T.downloadUpdateOptions.updateInfoAndProvider.info, q = w.version, U = _.packageInfo;
      function F() {
        const ge = decodeURIComponent(T.fileInfo.url.pathname);
        return ge.endsWith(`.${T.fileExtension}`) ? f.basename(ge) : T.fileInfo.info.url;
      }
      const M = await this.getOrCreateDownloadHelper(), I = M.cacheDirForPendingUpdate;
      await (0, n.mkdir)(I, { recursive: !0 });
      const x = F();
      let H = f.join(I, x);
      const D = U == null ? null : f.join(I, `package-${q}${f.extname(U.path) || ".7z"}`), Q = async (ge) => (await M.setDownloadedFile(H, D, w, _, x, ge), await T.done({
        ...w,
        downloadedFile: H
      }), D == null ? [H] : [H, D]), V = this._logger, ne = await M.validateDownloadedPath(H, w, _, V);
      if (ne != null)
        return H = ne, await Q(!1);
      const de = async () => (await M.clear().catch(() => {
      }), await (0, n.unlink)(H).catch(() => {
      })), ce = await (0, s.createTempUpdateFile)(`temp-${x}`, I, V);
      try {
        await T.task(ce, b, D, de), await (0, t.retry)(() => (0, n.rename)(ce, H), 60, 500, 0, 0, (ge) => ge instanceof Error && /^EBUSY:/.test(ge.message));
      } catch (ge) {
        throw await de(), ge instanceof t.CancellationError && (V.info("cancelled"), this.emit("update-cancelled", w)), ge;
      }
      return V.info(`New version ${q} has been downloaded to ${H}`), await Q(!0);
    }
    async differentialDownloadInstaller(T, _, b, w, q) {
      try {
        if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
          return !0;
        const U = (0, g.blockmapFiles)(T.url, this.app.version, _.updateInfoAndProvider.info.version);
        this._logger.info(`Download block maps (old: "${U[0]}", new: ${U[1]})`);
        const F = async (x) => {
          const H = await this.httpExecutor.downloadToBuffer(x, {
            headers: _.requestHeaders,
            cancellationToken: _.cancellationToken
          });
          if (H == null || H.length === 0)
            throw new Error(`Blockmap "${x.href}" is empty`);
          try {
            return JSON.parse((0, y.gunzipSync)(H).toString());
          } catch (D) {
            throw new Error(`Cannot parse blockmap "${x.href}", error: ${D}`);
          }
        }, M = {
          newUrl: T.url,
          oldFile: f.join(this.downloadedUpdateHelper.cacheDir, q),
          logger: this._logger,
          newFile: b,
          isUseMultipleRangeRequest: w.isUseMultipleRangeRequest,
          requestHeaders: _.requestHeaders,
          cancellationToken: _.cancellationToken
        };
        this.listenerCount(E.DOWNLOAD_PROGRESS) > 0 && (M.onProgress = (x) => this.emit(E.DOWNLOAD_PROGRESS, x));
        const I = await Promise.all(U.map((x) => F(x)));
        return await new m.GenericDifferentialDownloader(T.info, this.httpExecutor, M).download(I[0], I[1]), !1;
      } catch (U) {
        if (this._logger.error(`Cannot download differentially, fallback to full download: ${U.stack || U}`), this._testOnlyOptions != null)
          throw U;
        return !0;
      }
    }
  };
  It.AppUpdater = A;
  function O($) {
    const T = (0, r.prerelease)($);
    return T != null && T.length > 0;
  }
  class P {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(T) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(T) {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(T) {
    }
  }
  return It.NoOpLogger = P, It;
}
var Zl;
function Kt() {
  if (Zl) return er;
  Zl = 1, Object.defineProperty(er, "__esModule", { value: !0 }), er.BaseUpdater = void 0;
  const t = Cr, o = ea();
  let l = class extends o.AppUpdater {
    constructor(n, i) {
      super(n, i), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
    }
    quitAndInstall(n = !1, i = !1) {
      this._logger.info("Install on explicit quitAndInstall"), this.install(n, n ? i : this.autoRunAppAfterInstall) ? setImmediate(() => {
        _t.autoUpdater.emit("before-quit-for-update"), this.app.quit();
      }) : this.quitAndInstallCalled = !1;
    }
    executeDownload(n) {
      return super.executeDownload({
        ...n,
        done: (i) => (this.dispatchUpdateDownloaded(i), this.addQuitHandler(), Promise.resolve())
      });
    }
    get installerPath() {
      return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
    }
    // must be sync (because quit even handler is not async)
    install(n = !1, i = !1) {
      if (this.quitAndInstallCalled)
        return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
      const e = this.downloadedUpdateHelper, f = this.installerPath, r = e == null ? null : e.downloadedFileInfo;
      if (f == null || r == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      this.quitAndInstallCalled = !0;
      try {
        return this._logger.info(`Install: isSilent: ${n}, isForceRunAfter: ${i}`), this.doInstall({
          isSilent: n,
          isForceRunAfter: i,
          isAdminRightsRequired: r.isAdminRightsRequired
        });
      } catch (s) {
        return this.dispatchError(s), !1;
      }
    }
    addQuitHandler() {
      this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((n) => {
        if (this.quitAndInstallCalled) {
          this._logger.info("Update installer has already been triggered. Quitting application.");
          return;
        }
        if (!this.autoInstallOnAppQuit) {
          this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
          return;
        }
        if (n !== 0) {
          this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${n}`);
          return;
        }
        this._logger.info("Auto install update on quit"), this.install(!0, !1);
      }));
    }
    wrapSudo() {
      const { name: n } = this.app, i = `"${n} would like to update"`, e = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), f = [e];
      return /kdesudo/i.test(e) ? (f.push("--comment", i), f.push("-c")) : /gksudo/i.test(e) ? f.push("--message", i) : /pkexec/i.test(e) && f.push("--disable-internal-agent"), f.join(" ");
    }
    spawnSyncLog(n, i = [], e = {}) {
      this._logger.info(`Executing: ${n} with args: ${i}`);
      const f = (0, t.spawnSync)(n, i, {
        env: { ...process.env, ...e },
        encoding: "utf-8",
        shell: !0
      }), { error: r, status: s, stdout: a, stderr: d } = f;
      if (r != null)
        throw this._logger.error(d), r;
      if (s != null && s !== 0)
        throw this._logger.error(d), new Error(`Command ${n} exited with code ${s}`);
      return a.trim();
    }
    /**
     * This handles both node 8 and node 10 way of emitting error when spawning a process
     *   - node 8: Throws the error
     *   - node 10: Emit the error(Need to listen with on)
     */
    // https://github.com/electron-userland/electron-builder/issues/1129
    // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
    async spawnLog(n, i = [], e = void 0, f = "ignore") {
      return this._logger.info(`Executing: ${n} with args: ${i}`), new Promise((r, s) => {
        try {
          const a = { stdio: f, env: e, detached: !0 }, d = (0, t.spawn)(n, i, a);
          d.on("error", (c) => {
            s(c);
          }), d.unref(), d.pid !== void 0 && r(!0);
        } catch (a) {
          s(a);
        }
      });
    }
  };
  return er.BaseUpdater = l, er;
}
var mr = {}, gr = {}, eu;
function Oc() {
  if (eu) return gr;
  eu = 1, Object.defineProperty(gr, "__esModule", { value: !0 }), gr.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
  const t = /* @__PURE__ */ At(), o = Tc(), l = Ju;
  let u = class extends o.DifferentialDownloader {
    async download() {
      const f = this.blockAwareFileInfo, r = f.size, s = r - (f.blockMapSize + 4);
      this.fileMetadataBuffer = await this.readRemoteBytes(s, r - 1);
      const a = n(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
      await this.doDownload(await i(this.options.oldFile), a);
    }
  };
  gr.FileWithEmbeddedBlockMapDifferentialDownloader = u;
  function n(e) {
    return JSON.parse((0, l.inflateRawSync)(e).toString());
  }
  async function i(e) {
    const f = await (0, t.open)(e, "r");
    try {
      const r = (await (0, t.fstat)(f)).size, s = Buffer.allocUnsafe(4);
      await (0, t.read)(f, s, 0, s.length, r - s.length);
      const a = Buffer.allocUnsafe(s.readUInt32BE(0));
      return await (0, t.read)(f, a, 0, a.length, r - s.length - a.length), await (0, t.close)(f), n(a);
    } catch (r) {
      throw await (0, t.close)(f), r;
    }
  }
  return gr;
}
var tu;
function ru() {
  if (tu) return mr;
  tu = 1, Object.defineProperty(mr, "__esModule", { value: !0 }), mr.AppImageUpdater = void 0;
  const t = Me(), o = Cr, l = /* @__PURE__ */ At(), u = Ke, n = Ie, i = Kt(), e = Oc(), f = rt(), r = kt();
  let s = class extends i.BaseUpdater {
    constructor(d, c) {
      super(d, c);
    }
    isUpdaterActive() {
      return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
    }
    /*** @private */
    doDownloadUpdate(d) {
      const c = d.updateInfoAndProvider.provider, p = (0, f.findFile)(c.resolveFiles(d.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "AppImage",
        fileInfo: p,
        downloadUpdateOptions: d,
        task: async (y, g) => {
          const m = process.env.APPIMAGE;
          if (m == null)
            throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
          (d.disableDifferentialDownload || await this.downloadDifferential(p, m, y, c, d)) && await this.httpExecutor.download(p.url, y, g), await (0, l.chmod)(y, 493);
        }
      });
    }
    async downloadDifferential(d, c, p, y, g) {
      try {
        const m = {
          newUrl: d.url,
          oldFile: c,
          logger: this._logger,
          newFile: p,
          isUseMultipleRangeRequest: y.isUseMultipleRangeRequest,
          requestHeaders: g.requestHeaders,
          cancellationToken: g.cancellationToken
        };
        return this.listenerCount(r.DOWNLOAD_PROGRESS) > 0 && (m.onProgress = (E) => this.emit(r.DOWNLOAD_PROGRESS, E)), await new e.FileWithEmbeddedBlockMapDifferentialDownloader(d.info, this.httpExecutor, m).download(), !1;
      } catch (m) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${m.stack || m}`), process.platform === "linux";
      }
    }
    doInstall(d) {
      const c = process.env.APPIMAGE;
      if (c == null)
        throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
      (0, u.unlinkSync)(c);
      let p;
      const y = n.basename(c), g = this.installerPath;
      if (g == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      n.basename(g) === y || !/\d+\.\d+\.\d+/.test(y) ? p = c : p = n.join(n.dirname(c), n.basename(g)), (0, o.execFileSync)("mv", ["-f", g, p]), p !== c && this.emit("appimage-filename-updated", p);
      const m = {
        ...process.env,
        APPIMAGE_SILENT_INSTALL: "true"
      };
      return d.isForceRunAfter ? this.spawnLog(p, [], m) : (m.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, o.execFileSync)(p, [], { env: m })), !0;
    }
  };
  return mr.AppImageUpdater = s, mr;
}
var yr = {}, nu;
function iu() {
  if (nu) return yr;
  nu = 1, Object.defineProperty(yr, "__esModule", { value: !0 }), yr.DebUpdater = void 0;
  const t = Kt(), o = rt(), l = kt();
  let u = class extends t.BaseUpdater {
    constructor(i, e) {
      super(i, e);
    }
    /*** @private */
    doDownloadUpdate(i) {
      const e = i.updateInfoAndProvider.provider, f = (0, o.findFile)(e.resolveFiles(i.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
      return this.executeDownload({
        fileExtension: "deb",
        fileInfo: f,
        downloadUpdateOptions: i,
        task: async (r, s) => {
          this.listenerCount(l.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(l.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(f.url, r, s);
        }
      });
    }
    get installerPath() {
      var i, e;
      return (e = (i = super.installerPath) === null || i === void 0 ? void 0 : i.replace(/ /g, "\\ ")) !== null && e !== void 0 ? e : null;
    }
    doInstall(i) {
      const e = this.wrapSudo(), f = /pkexec/i.test(e) ? "" : '"', r = this.installerPath;
      if (r == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const s = ["dpkg", "-i", r, "||", "apt-get", "install", "-f", "-y"];
      return this.spawnSyncLog(e, [`${f}/bin/bash`, "-c", `'${s.join(" ")}'${f}`]), i.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return yr.DebUpdater = u, yr;
}
var vr = {}, ou;
function au() {
  if (ou) return vr;
  ou = 1, Object.defineProperty(vr, "__esModule", { value: !0 }), vr.PacmanUpdater = void 0;
  const t = Kt(), o = kt(), l = rt();
  let u = class extends t.BaseUpdater {
    constructor(i, e) {
      super(i, e);
    }
    /*** @private */
    doDownloadUpdate(i) {
      const e = i.updateInfoAndProvider.provider, f = (0, l.findFile)(e.resolveFiles(i.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
      return this.executeDownload({
        fileExtension: "pacman",
        fileInfo: f,
        downloadUpdateOptions: i,
        task: async (r, s) => {
          this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(o.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(f.url, r, s);
        }
      });
    }
    get installerPath() {
      var i, e;
      return (e = (i = super.installerPath) === null || i === void 0 ? void 0 : i.replace(/ /g, "\\ ")) !== null && e !== void 0 ? e : null;
    }
    doInstall(i) {
      const e = this.wrapSudo(), f = /pkexec/i.test(e) ? "" : '"', r = this.installerPath;
      if (r == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const s = ["pacman", "-U", "--noconfirm", r];
      return this.spawnSyncLog(e, [`${f}/bin/bash`, "-c", `'${s.join(" ")}'${f}`]), i.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return vr.PacmanUpdater = u, vr;
}
var wr = {}, su;
function lu() {
  if (su) return wr;
  su = 1, Object.defineProperty(wr, "__esModule", { value: !0 }), wr.RpmUpdater = void 0;
  const t = Kt(), o = kt(), l = rt();
  let u = class extends t.BaseUpdater {
    constructor(i, e) {
      super(i, e);
    }
    /*** @private */
    doDownloadUpdate(i) {
      const e = i.updateInfoAndProvider.provider, f = (0, l.findFile)(e.resolveFiles(i.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
      return this.executeDownload({
        fileExtension: "rpm",
        fileInfo: f,
        downloadUpdateOptions: i,
        task: async (r, s) => {
          this.listenerCount(o.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(o.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(f.url, r, s);
        }
      });
    }
    get installerPath() {
      var i, e;
      return (e = (i = super.installerPath) === null || i === void 0 ? void 0 : i.replace(/ /g, "\\ ")) !== null && e !== void 0 ? e : null;
    }
    doInstall(i) {
      const e = this.wrapSudo(), f = /pkexec/i.test(e) ? "" : '"', r = this.spawnSyncLog("which zypper"), s = this.installerPath;
      if (s == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      let a;
      return r ? a = [r, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", s] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", s], this.spawnSyncLog(e, [`${f}/bin/bash`, "-c", `'${a.join(" ")}'${f}`]), i.isForceRunAfter && this.app.relaunch(), !0;
    }
  };
  return wr.RpmUpdater = u, wr;
}
var Er = {}, uu;
function cu() {
  if (uu) return Er;
  uu = 1, Object.defineProperty(Er, "__esModule", { value: !0 }), Er.MacUpdater = void 0;
  const t = Me(), o = /* @__PURE__ */ At(), l = Ke, u = Ie, n = Xu, i = ea(), e = rt(), f = Cr, r = Tr;
  let s = class extends i.AppUpdater {
    constructor(d, c) {
      super(d, c), this.nativeUpdater = _t.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (p) => {
        this._logger.warn(p), this.emit("error", p);
      }), this.nativeUpdater.on("update-downloaded", () => {
        this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
      });
    }
    debug(d) {
      this._logger.debug != null && this._logger.debug(d);
    }
    closeServerIfExists() {
      this.server && (this.debug("Closing proxy server"), this.server.close((d) => {
        d && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
      }));
    }
    async doDownloadUpdate(d) {
      let c = d.updateInfoAndProvider.provider.resolveFiles(d.updateInfoAndProvider.info);
      const p = this._logger, y = "sysctl.proc_translated";
      let g = !1;
      try {
        this.debug("Checking for macOS Rosetta environment"), g = (0, f.execFileSync)("sysctl", [y], { encoding: "utf8" }).includes(`${y}: 1`), p.info(`Checked for macOS Rosetta environment (isRosetta=${g})`);
      } catch ($) {
        p.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${$}`);
      }
      let m = !1;
      try {
        this.debug("Checking for arm64 in uname");
        const T = (0, f.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
        p.info(`Checked 'uname -a': arm64=${T}`), m = m || T;
      } catch ($) {
        p.warn(`uname shell command to check for arm64 failed: ${$}`);
      }
      m = m || process.arch === "arm64" || g;
      const E = ($) => {
        var T;
        return $.url.pathname.includes("arm64") || ((T = $.info.url) === null || T === void 0 ? void 0 : T.includes("arm64"));
      };
      m && c.some(E) ? c = c.filter(($) => m === E($)) : c = c.filter(($) => !E($));
      const A = (0, e.findFile)(c, "zip", ["pkg", "dmg"]);
      if (A == null)
        throw (0, t.newError)(`ZIP file not provided: ${(0, t.safeStringifyJson)(c)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
      const O = d.updateInfoAndProvider.provider, P = "update.zip";
      return this.executeDownload({
        fileExtension: "zip",
        fileInfo: A,
        downloadUpdateOptions: d,
        task: async ($, T) => {
          const _ = u.join(this.downloadedUpdateHelper.cacheDir, P), b = () => (0, o.pathExistsSync)(_) ? !d.disableDifferentialDownload : (p.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
          let w = !0;
          b() && (w = await this.differentialDownloadInstaller(A, d, $, O, P)), w && await this.httpExecutor.download(A.url, $, T);
        },
        done: async ($) => {
          if (!d.disableDifferentialDownload)
            try {
              const T = u.join(this.downloadedUpdateHelper.cacheDir, P);
              await (0, o.copyFile)($.downloadedFile, T);
            } catch (T) {
              this._logger.warn(`Unable to copy file for caching for future differential downloads: ${T.message}`);
            }
          return this.updateDownloaded(A, $);
        }
      });
    }
    async updateDownloaded(d, c) {
      var p;
      const y = c.downloadedFile, g = (p = d.info.size) !== null && p !== void 0 ? p : (await (0, o.stat)(y)).size, m = this._logger, E = `fileToProxy=${d.url.href}`;
      this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${E})`), this.server = (0, n.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${E})`), this.server.on("close", () => {
        m.info(`Proxy server for native Squirrel.Mac is closed (${E})`);
      });
      const A = (O) => {
        const P = O.address();
        return typeof P == "string" ? P : `http://127.0.0.1:${P?.port}`;
      };
      return await new Promise((O, P) => {
        const $ = (0, r.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), T = Buffer.from(`autoupdater:${$}`, "ascii"), _ = `/${(0, r.randomBytes)(64).toString("hex")}.zip`;
        this.server.on("request", (b, w) => {
          const q = b.url;
          if (m.info(`${q} requested`), q === "/") {
            if (!b.headers.authorization || b.headers.authorization.indexOf("Basic ") === -1) {
              w.statusCode = 401, w.statusMessage = "Invalid Authentication Credentials", w.end(), m.warn("No authenthication info");
              return;
            }
            const M = b.headers.authorization.split(" ")[1], I = Buffer.from(M, "base64").toString("ascii"), [x, H] = I.split(":");
            if (x !== "autoupdater" || H !== $) {
              w.statusCode = 401, w.statusMessage = "Invalid Authentication Credentials", w.end(), m.warn("Invalid authenthication credentials");
              return;
            }
            const D = Buffer.from(`{ "url": "${A(this.server)}${_}" }`);
            w.writeHead(200, { "Content-Type": "application/json", "Content-Length": D.length }), w.end(D);
            return;
          }
          if (!q.startsWith(_)) {
            m.warn(`${q} requested, but not supported`), w.writeHead(404), w.end();
            return;
          }
          m.info(`${_} requested by Squirrel.Mac, pipe ${y}`);
          let U = !1;
          w.on("finish", () => {
            U || (this.nativeUpdater.removeListener("error", P), O([]));
          });
          const F = (0, l.createReadStream)(y);
          F.on("error", (M) => {
            try {
              w.end();
            } catch (I) {
              m.warn(`cannot end response: ${I}`);
            }
            U = !0, this.nativeUpdater.removeListener("error", P), P(new Error(`Cannot pipe "${y}": ${M}`));
          }), w.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-Length": g
          }), F.pipe(w);
        }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${E})`), this.server.listen(0, "127.0.0.1", () => {
          this.debug(`Proxy server for native Squirrel.Mac is listening (address=${A(this.server)}, ${E})`), this.nativeUpdater.setFeedURL({
            url: A(this.server),
            headers: {
              "Cache-Control": "no-cache",
              Authorization: `Basic ${T.toString("base64")}`
            }
          }), this.dispatchUpdateDownloaded(c), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", P), this.nativeUpdater.checkForUpdates()) : O([]);
        });
      });
    }
    handleUpdateDownloaded() {
      this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
    }
    quitAndInstall() {
      this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
    }
  };
  return Er.MacUpdater = s, Er;
}
var _r = {}, Jr = {}, fu;
function uh() {
  if (fu) return Jr;
  fu = 1, Object.defineProperty(Jr, "__esModule", { value: !0 }), Jr.verifySignature = n;
  const t = Me(), o = Cr, l = bt, u = Ie;
  function n(r, s, a) {
    return new Promise((d, c) => {
      const p = s.replace(/'/g, "''");
      a.info(`Verifying signature ${p}`), (0, o.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${p}' | ConvertTo-Json -Compress"`], {
        shell: !0,
        timeout: 20 * 1e3
      }, (y, g, m) => {
        var E;
        try {
          if (y != null || m) {
            e(a, y, m, c), d(null);
            return;
          }
          const A = i(g);
          if (A.Status === 0) {
            try {
              const T = u.normalize(A.Path), _ = u.normalize(s);
              if (a.info(`LiteralPath: ${T}. Update Path: ${_}`), T !== _) {
                e(a, new Error(`LiteralPath of ${T} is different than ${_}`), m, c), d(null);
                return;
              }
            } catch (T) {
              a.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(E = T.message) !== null && E !== void 0 ? E : T.stack}`);
            }
            const P = (0, t.parseDn)(A.SignerCertificate.Subject);
            let $ = !1;
            for (const T of r) {
              const _ = (0, t.parseDn)(T);
              if (_.size ? $ = Array.from(_.keys()).every((w) => _.get(w) === P.get(w)) : T === P.get("CN") && (a.warn(`Signature validated using only CN ${T}. Please add your full Distinguished Name (DN) to publisherNames configuration`), $ = !0), $) {
                d(null);
                return;
              }
            }
          }
          const O = `publisherNames: ${r.join(" | ")}, raw info: ` + JSON.stringify(A, (P, $) => P === "RawData" ? void 0 : $, 2);
          a.warn(`Sign verification failed, installer signed with incorrect certificate: ${O}`), d(O);
        } catch (A) {
          e(a, A, null, c), d(null);
          return;
        }
      });
    });
  }
  function i(r) {
    const s = JSON.parse(r);
    delete s.PrivateKey, delete s.IsOSBinary, delete s.SignatureType;
    const a = s.SignerCertificate;
    return a != null && (delete a.Archived, delete a.Extensions, delete a.Handle, delete a.HasPrivateKey, delete a.SubjectName), s;
  }
  function e(r, s, a, d) {
    if (f()) {
      r.warn(`Cannot execute Get-AuthenticodeSignature: ${s || a}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    try {
      (0, o.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
    } catch (c) {
      r.warn(`Cannot execute ConvertTo-Json: ${c.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
      return;
    }
    s != null && d(s), a && d(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${a}. Failing signature validation due to unknown stderr.`));
  }
  function f() {
    const r = l.release();
    return r.startsWith("6.") && !r.startsWith("6.3");
  }
  return Jr;
}
var du;
function hu() {
  if (du) return _r;
  du = 1, Object.defineProperty(_r, "__esModule", { value: !0 }), _r.NsisUpdater = void 0;
  const t = Me(), o = Ie, l = Kt(), u = Oc(), n = kt(), i = rt(), e = /* @__PURE__ */ At(), f = uh(), r = Vt;
  let s = class extends l.BaseUpdater {
    constructor(d, c) {
      super(d, c), this._verifyUpdateCodeSignature = (p, y) => (0, f.verifySignature)(p, y, this._logger);
    }
    /**
     * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
     * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
     */
    get verifyUpdateCodeSignature() {
      return this._verifyUpdateCodeSignature;
    }
    set verifyUpdateCodeSignature(d) {
      d && (this._verifyUpdateCodeSignature = d);
    }
    /*** @private */
    doDownloadUpdate(d) {
      const c = d.updateInfoAndProvider.provider, p = (0, i.findFile)(c.resolveFiles(d.updateInfoAndProvider.info), "exe");
      return this.executeDownload({
        fileExtension: "exe",
        downloadUpdateOptions: d,
        fileInfo: p,
        task: async (y, g, m, E) => {
          const A = p.packageInfo, O = A != null && m != null;
          if (O && d.disableWebInstaller)
            throw (0, t.newError)(`Unable to download new version ${d.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
          !O && !d.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (O || d.disableDifferentialDownload || await this.differentialDownloadInstaller(p, d, y, c, t.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(p.url, y, g);
          const P = await this.verifySignature(y);
          if (P != null)
            throw await E(), (0, t.newError)(`New version ${d.updateInfoAndProvider.info.version} is not signed by the application owner: ${P}`, "ERR_UPDATER_INVALID_SIGNATURE");
          if (O && await this.differentialDownloadWebPackage(d, A, m, c))
            try {
              await this.httpExecutor.download(new r.URL(A.path), m, {
                headers: d.requestHeaders,
                cancellationToken: d.cancellationToken,
                sha512: A.sha512
              });
            } catch ($) {
              try {
                await (0, e.unlink)(m);
              } catch {
              }
              throw $;
            }
        }
      });
    }
    // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
    // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
    // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
    async verifySignature(d) {
      let c;
      try {
        if (c = (await this.configOnDisk.value).publisherName, c == null)
          return null;
      } catch (p) {
        if (p.code === "ENOENT")
          return null;
        throw p;
      }
      return await this._verifyUpdateCodeSignature(Array.isArray(c) ? c : [c], d);
    }
    doInstall(d) {
      const c = this.installerPath;
      if (c == null)
        return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
      const p = ["--updated"];
      d.isSilent && p.push("/S"), d.isForceRunAfter && p.push("--force-run"), this.installDirectory && p.push(`/D=${this.installDirectory}`);
      const y = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
      y != null && p.push(`--package-file=${y}`);
      const g = () => {
        this.spawnLog(o.join(process.resourcesPath, "elevate.exe"), [c].concat(p)).catch((m) => this.dispatchError(m));
      };
      return d.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), g(), !0) : (this.spawnLog(c, p).catch((m) => {
        const E = m.code;
        this._logger.info(`Cannot run installer: error code: ${E}, error message: "${m.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), E === "UNKNOWN" || E === "EACCES" ? g() : E === "ENOENT" ? _t.shell.openPath(c).catch((A) => this.dispatchError(A)) : this.dispatchError(m);
      }), !0);
    }
    async differentialDownloadWebPackage(d, c, p, y) {
      if (c.blockMapSize == null)
        return !0;
      try {
        const g = {
          newUrl: new r.URL(c.path),
          oldFile: o.join(this.downloadedUpdateHelper.cacheDir, t.CURRENT_APP_PACKAGE_FILE_NAME),
          logger: this._logger,
          newFile: p,
          requestHeaders: this.requestHeaders,
          isUseMultipleRangeRequest: y.isUseMultipleRangeRequest,
          cancellationToken: d.cancellationToken
        };
        this.listenerCount(n.DOWNLOAD_PROGRESS) > 0 && (g.onProgress = (m) => this.emit(n.DOWNLOAD_PROGRESS, m)), await new u.FileWithEmbeddedBlockMapDifferentialDownloader(c, this.httpExecutor, g).download();
      } catch (g) {
        return this._logger.error(`Cannot download differentially, fallback to full download: ${g.stack || g}`), process.platform === "win32";
      }
      return !1;
    }
  };
  return _r.NsisUpdater = s, _r;
}
var pu;
function ch() {
  return pu || (pu = 1, (function(t) {
    var o = Dt && Dt.__createBinding || (Object.create ? (function(m, E, A, O) {
      O === void 0 && (O = A);
      var P = Object.getOwnPropertyDescriptor(E, A);
      (!P || ("get" in P ? !E.__esModule : P.writable || P.configurable)) && (P = { enumerable: !0, get: function() {
        return E[A];
      } }), Object.defineProperty(m, O, P);
    }) : (function(m, E, A, O) {
      O === void 0 && (O = A), m[O] = E[A];
    })), l = Dt && Dt.__exportStar || function(m, E) {
      for (var A in m) A !== "default" && !Object.prototype.hasOwnProperty.call(E, A) && o(E, m, A);
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.NsisUpdater = t.MacUpdater = t.RpmUpdater = t.PacmanUpdater = t.DebUpdater = t.AppImageUpdater = t.Provider = t.NoOpLogger = t.AppUpdater = t.BaseUpdater = void 0;
    const u = /* @__PURE__ */ At(), n = Ie;
    var i = Kt();
    Object.defineProperty(t, "BaseUpdater", { enumerable: !0, get: function() {
      return i.BaseUpdater;
    } });
    var e = ea();
    Object.defineProperty(t, "AppUpdater", { enumerable: !0, get: function() {
      return e.AppUpdater;
    } }), Object.defineProperty(t, "NoOpLogger", { enumerable: !0, get: function() {
      return e.NoOpLogger;
    } });
    var f = rt();
    Object.defineProperty(t, "Provider", { enumerable: !0, get: function() {
      return f.Provider;
    } });
    var r = ru();
    Object.defineProperty(t, "AppImageUpdater", { enumerable: !0, get: function() {
      return r.AppImageUpdater;
    } });
    var s = iu();
    Object.defineProperty(t, "DebUpdater", { enumerable: !0, get: function() {
      return s.DebUpdater;
    } });
    var a = au();
    Object.defineProperty(t, "PacmanUpdater", { enumerable: !0, get: function() {
      return a.PacmanUpdater;
    } });
    var d = lu();
    Object.defineProperty(t, "RpmUpdater", { enumerable: !0, get: function() {
      return d.RpmUpdater;
    } });
    var c = cu();
    Object.defineProperty(t, "MacUpdater", { enumerable: !0, get: function() {
      return c.MacUpdater;
    } });
    var p = hu();
    Object.defineProperty(t, "NsisUpdater", { enumerable: !0, get: function() {
      return p.NsisUpdater;
    } }), l(kt(), t);
    let y;
    function g() {
      if (process.platform === "win32")
        y = new (hu()).NsisUpdater();
      else if (process.platform === "darwin")
        y = new (cu()).MacUpdater();
      else {
        y = new (ru()).AppImageUpdater();
        try {
          const m = n.join(process.resourcesPath, "package-type");
          if (!(0, u.existsSync)(m))
            return y;
          console.info("Checking for beta autoupdate feature for deb/rpm distributions");
          const E = (0, u.readFileSync)(m).toString().trim();
          switch (console.info("Found package-type:", E), E) {
            case "deb":
              y = new (iu()).DebUpdater();
              break;
            case "rpm":
              y = new (lu()).RpmUpdater();
              break;
            case "pacman":
              y = new (au()).PacmanUpdater();
              break;
            default:
              break;
          }
        } catch (m) {
          console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", m.message);
        }
      }
      return y;
    }
    Object.defineProperty(t, "autoUpdater", {
      enumerable: !0,
      get: () => y || g()
    });
  })(Dt)), Dt;
}
var tt = ch(), Sr = { exports: {} }, lo = { exports: {} }, mu;
function Pc() {
  return mu || (mu = 1, (function(t) {
    let o = {};
    try {
      o = require("electron");
    } catch {
    }
    o.ipcRenderer && l(o), t.exports = l;
    function l({ contextBridge: u, ipcRenderer: n }) {
      if (!n)
        return;
      n.on("__ELECTRON_LOG_IPC__", (e, f) => {
        window.postMessage({ cmd: "message", ...f });
      }), n.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((e) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${e.message}`
      )));
      const i = {
        sendToMain(e) {
          try {
            n.send("__ELECTRON_LOG__", e);
          } catch (f) {
            console.error("electronLog.sendToMain ", f, "data:", e), n.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: f?.message, stack: f?.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...e) {
          i.sendToMain({ data: e, level: "info" });
        }
      };
      for (const e of ["error", "warn", "info", "verbose", "debug", "silly"])
        i[e] = (...f) => i.sendToMain({
          data: f,
          level: e
        });
      if (u && process.contextIsolated)
        try {
          u.exposeInMainWorld("__electronLog", i);
        } catch {
        }
      typeof window == "object" ? window.__electronLog = i : __electronLog = i;
    }
  })(lo)), lo.exports;
}
var uo = { exports: {} }, co, gu;
function fh() {
  if (gu) return co;
  gu = 1, co = t;
  function t(o) {
    return Object.defineProperties(l, {
      defaultLabel: { value: "", writable: !0 },
      labelPadding: { value: !0, writable: !0 },
      maxLabelLength: { value: 0, writable: !0 },
      labelLength: {
        get() {
          switch (typeof l.labelPadding) {
            case "boolean":
              return l.labelPadding ? l.maxLabelLength : 0;
            case "number":
              return l.labelPadding;
            default:
              return 0;
          }
        }
      }
    });
    function l(u) {
      l.maxLabelLength = Math.max(l.maxLabelLength, u.length);
      const n = {};
      for (const i of o.levels)
        n[i] = (...e) => o.logData(e, { level: i, scope: u });
      return n.log = n.info, n;
    }
  }
  return co;
}
var fo, yu;
function dh() {
  if (yu) return fo;
  yu = 1;
  class t {
    constructor({ processMessage: l }) {
      this.processMessage = l, this.buffer = [], this.enabled = !1, this.begin = this.begin.bind(this), this.commit = this.commit.bind(this), this.reject = this.reject.bind(this);
    }
    addMessage(l) {
      this.buffer.push(l);
    }
    begin() {
      this.enabled = [];
    }
    commit() {
      this.enabled = !1, this.buffer.forEach((l) => this.processMessage(l)), this.buffer = [];
    }
    reject() {
      this.enabled = !1, this.buffer = [];
    }
  }
  return fo = t, fo;
}
var ho, vu;
function Dc() {
  if (vu) return ho;
  vu = 1;
  const t = fh(), o = dh();
  class l {
    static instances = {};
    dependencies = {};
    errorHandler = null;
    eventLogger = null;
    functions = {};
    hooks = [];
    isDev = !1;
    levels = null;
    logId = null;
    scope = null;
    transports = {};
    variables = {};
    constructor({
      allowUnknownLevel: n = !1,
      dependencies: i = {},
      errorHandler: e,
      eventLogger: f,
      initializeFn: r,
      isDev: s = !1,
      levels: a = ["error", "warn", "info", "verbose", "debug", "silly"],
      logId: d,
      transportFactories: c = {},
      variables: p
    } = {}) {
      this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = n, this.buffering = new o(this), this.dependencies = i, this.initializeFn = r, this.isDev = s, this.levels = a, this.logId = d, this.scope = t(this), this.transportFactories = c, this.variables = p || {};
      for (const y of this.levels)
        this.addLevel(y, !1);
      this.log = this.info, this.functions.log = this.log, this.errorHandler = e, e?.setOptions({ ...i, logFn: this.error }), this.eventLogger = f, f?.setOptions({ ...i, logger: this });
      for (const [y, g] of Object.entries(c))
        this.transports[y] = g(this, i);
      l.instances[d] = this;
    }
    static getInstance({ logId: n }) {
      return this.instances[n] || this.instances.default;
    }
    addLevel(n, i = this.levels.length) {
      i !== !1 && this.levels.splice(i, 0, n), this[n] = (...e) => this.logData(e, { level: n }), this.functions[n] = this[n];
    }
    catchErrors(n) {
      return this.processMessage(
        {
          data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
          level: "warn"
        },
        { transports: ["console"] }
      ), this.errorHandler.startCatching(n);
    }
    create(n) {
      return typeof n == "string" && (n = { logId: n }), new l({
        dependencies: this.dependencies,
        errorHandler: this.errorHandler,
        initializeFn: this.initializeFn,
        isDev: this.isDev,
        transportFactories: this.transportFactories,
        variables: { ...this.variables },
        ...n
      });
    }
    compareLevels(n, i, e = this.levels) {
      const f = e.indexOf(n), r = e.indexOf(i);
      return r === -1 || f === -1 ? !0 : r <= f;
    }
    initialize(n = {}) {
      this.initializeFn({ logger: this, ...this.dependencies, ...n });
    }
    logData(n, i = {}) {
      this.buffering.enabled ? this.buffering.addMessage({ data: n, date: /* @__PURE__ */ new Date(), ...i }) : this.processMessage({ data: n, ...i });
    }
    processMessage(n, { transports: i = this.transports } = {}) {
      if (n.cmd === "errorHandler") {
        this.errorHandler.handle(n.error, {
          errorName: n.errorName,
          processType: "renderer",
          showDialog: !!n.showDialog
        });
        return;
      }
      let e = n.level;
      this.allowUnknownLevel || (e = this.levels.includes(n.level) ? n.level : "info");
      const f = {
        date: /* @__PURE__ */ new Date(),
        logId: this.logId,
        ...n,
        level: e,
        variables: {
          ...this.variables,
          ...n.variables
        }
      };
      for (const [r, s] of this.transportEntries(i))
        if (!(typeof s != "function" || s.level === !1) && this.compareLevels(s.level, n.level))
          try {
            const a = this.hooks.reduce((d, c) => d && c(d, s, r), f);
            a && s({ ...a, data: [...a.data] });
          } catch (a) {
            this.processInternalErrorFn(a);
          }
    }
    processInternalErrorFn(n) {
    }
    transportEntries(n = this.transports) {
      return (Array.isArray(n) ? n : Object.entries(n)).map((e) => {
        switch (typeof e) {
          case "string":
            return this.transports[e] ? [e, this.transports[e]] : null;
          case "function":
            return [e.name, e];
          default:
            return Array.isArray(e) ? e : null;
        }
      }).filter(Boolean);
    }
  }
  return ho = l, ho;
}
var po, wu;
function hh() {
  if (wu) return po;
  wu = 1;
  const t = console.error;
  class o {
    logFn = null;
    onError = null;
    showDialog = !1;
    preventDefault = !0;
    constructor({ logFn: u = null } = {}) {
      this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.startCatching = this.startCatching.bind(this), this.logFn = u;
    }
    handle(u, {
      logFn: n = this.logFn,
      errorName: i = "",
      onError: e = this.onError,
      showDialog: f = this.showDialog
    } = {}) {
      try {
        e?.({ error: u, errorName: i, processType: "renderer" }) !== !1 && n({ error: u, errorName: i, showDialog: f });
      } catch {
        t(u);
      }
    }
    setOptions({ logFn: u, onError: n, preventDefault: i, showDialog: e }) {
      typeof u == "function" && (this.logFn = u), typeof n == "function" && (this.onError = n), typeof i == "boolean" && (this.preventDefault = i), typeof e == "boolean" && (this.showDialog = e);
    }
    startCatching({ onError: u, showDialog: n } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: u, showDialog: n }), window.addEventListener("error", (i) => {
        this.preventDefault && i.preventDefault?.(), this.handleError(i.error || i);
      }), window.addEventListener("unhandledrejection", (i) => {
        this.preventDefault && i.preventDefault?.(), this.handleRejection(i.reason || i);
      }));
    }
    handleError(u) {
      this.handle(u, { errorName: "Unhandled" });
    }
    handleRejection(u) {
      const n = u instanceof Error ? u : new Error(JSON.stringify(u));
      this.handle(n, { errorName: "Unhandled rejection" });
    }
  }
  return po = o, po;
}
var mo, Eu;
function qt() {
  if (Eu) return mo;
  Eu = 1, mo = { transform: t };
  function t({
    logger: o,
    message: l,
    transport: u,
    initialData: n = l?.data || [],
    transforms: i = u?.transforms
  }) {
    return i.reduce((e, f) => typeof f == "function" ? f({ data: e, logger: o, message: l, transport: u }) : e, n);
  }
  return mo;
}
var go, _u;
function ph() {
  if (_u) return go;
  _u = 1;
  const { transform: t } = qt();
  go = l;
  const o = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  function l(n) {
    return Object.assign(i, {
      format: "{h}:{i}:{s}.{ms}{scope} › {text}",
      transforms: [u],
      writeFn({ message: { level: e, data: f } }) {
        const r = o[e] || o.info;
        setTimeout(() => r(...f));
      }
    });
    function i(e) {
      i.writeFn({
        message: { ...e, data: t({ logger: n, message: e, transport: i }) }
      });
    }
  }
  function u({
    data: n = [],
    logger: i = {},
    message: e = {},
    transport: f = {}
  }) {
    if (typeof f.format == "function")
      return f.format({
        data: n,
        level: e?.level || "info",
        logger: i,
        message: e,
        transport: f
      });
    if (typeof f.format != "string")
      return n;
    n.unshift(f.format), typeof n[1] == "string" && n[1].match(/%[1cdfiOos]/) && (n = [`${n[0]}${n[1]}`, ...n.slice(2)]);
    const r = e.date || /* @__PURE__ */ new Date();
    return n[0] = n[0].replace(/\{(\w+)}/g, (s, a) => {
      switch (a) {
        case "level":
          return e.level;
        case "logId":
          return e.logId;
        case "scope": {
          const d = e.scope || i.scope?.defaultLabel;
          return d ? ` (${d})` : "";
        }
        case "text":
          return "";
        case "y":
          return r.getFullYear().toString(10);
        case "m":
          return (r.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return r.getDate().toString(10).padStart(2, "0");
        case "h":
          return r.getHours().toString(10).padStart(2, "0");
        case "i":
          return r.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return r.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return r.getMilliseconds().toString(10).padStart(3, "0");
        case "iso":
          return r.toISOString();
        default:
          return e.variables?.[a] || s;
      }
    }).trim(), n;
  }
  return go;
}
var yo, Su;
function mh() {
  if (Su) return yo;
  Su = 1;
  const { transform: t } = qt();
  yo = l;
  const o = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
  function l(i) {
    return Object.assign(e, {
      depth: 5,
      transforms: [n]
    });
    function e(f) {
      if (!window.__electronLog) {
        i.processMessage(
          {
            data: ["electron-log: logger isn't initialized in the main process"],
            level: "error"
          },
          { transports: ["console"] }
        );
        return;
      }
      try {
        const r = t({
          initialData: f,
          logger: i,
          message: f,
          transport: e
        });
        __electronLog.sendToMain(r);
      } catch (r) {
        i.transports.console({
          data: ["electronLog.transports.ipc", r, "data:", f.data],
          level: "error"
        });
      }
    }
  }
  function u(i) {
    return Object(i) !== i;
  }
  function n({
    data: i,
    depth: e,
    seen: f = /* @__PURE__ */ new WeakSet(),
    transport: r = {}
  } = {}) {
    const s = e || r.depth || 5;
    return f.has(i) ? "[Circular]" : s < 1 ? u(i) ? i : Array.isArray(i) ? "[Array]" : `[${typeof i}]` : ["function", "symbol"].includes(typeof i) ? i.toString() : u(i) ? i : o.has(i.constructor) ? `[${i.constructor.name}]` : Array.isArray(i) ? i.map((a) => n({
      data: a,
      depth: s - 1,
      seen: f
    })) : i instanceof Date ? i.toISOString() : i instanceof Error ? i.stack : i instanceof Map ? new Map(
      Array.from(i).map(([a, d]) => [
        n({ data: a, depth: s - 1, seen: f }),
        n({ data: d, depth: s - 1, seen: f })
      ])
    ) : i instanceof Set ? new Set(
      Array.from(i).map(
        (a) => n({ data: a, depth: s - 1, seen: f })
      )
    ) : (f.add(i), Object.fromEntries(
      Object.entries(i).map(
        ([a, d]) => [
          a,
          n({ data: d, depth: s - 1, seen: f })
        ]
      )
    ));
  }
  return yo;
}
var bu;
function gh() {
  return bu || (bu = 1, (function(t) {
    const o = Dc(), l = hh(), u = ph(), n = mh();
    typeof process == "object" && process.type === "browser" && console.warn(
      "electron-log/renderer is loaded in the main process. It could cause unexpected behaviour."
    ), t.exports = i(), t.exports.Logger = o, t.exports.default = t.exports;
    function i() {
      const e = new o({
        allowUnknownLevel: !0,
        errorHandler: new l(),
        initializeFn: () => {
        },
        logId: "default",
        transportFactories: {
          console: u,
          ipc: n
        },
        variables: {
          processType: "renderer"
        }
      });
      return e.errorHandler.setOptions({
        logFn({ error: f, errorName: r, showDialog: s }) {
          e.transports.console({
            data: [r, f].filter(Boolean),
            level: "error"
          }), e.transports.ipc({
            cmd: "errorHandler",
            error: {
              cause: f?.cause,
              code: f?.code,
              name: f?.name,
              message: f?.message,
              stack: f?.stack
            },
            errorName: r,
            logId: e.logId,
            showDialog: s
          });
        }
      }), typeof window == "object" && window.addEventListener("message", (f) => {
        const { cmd: r, logId: s, ...a } = f.data || {}, d = o.getInstance({ logId: s });
        r === "message" && d.processMessage(a, { transports: ["console"] });
      }), new Proxy(e, {
        get(f, r) {
          return typeof f[r] < "u" ? f[r] : (...s) => e.logData(s, { level: r });
        }
      });
    }
  })(uo)), uo.exports;
}
var vo, Au;
function yh() {
  if (Au) return vo;
  Au = 1;
  const t = Ke, o = Ie;
  vo = {
    findAndReadPackageJson: l,
    tryReadJsonAt: u
  };
  function l() {
    return u(e()) || u(i()) || u(process.resourcesPath, "app.asar") || u(process.resourcesPath, "app") || u(process.cwd()) || { name: void 0, version: void 0 };
  }
  function u(...f) {
    if (f[0])
      try {
        const r = o.join(...f), s = n("package.json", r);
        if (!s)
          return;
        const a = JSON.parse(t.readFileSync(s, "utf8")), d = a?.productName || a?.name;
        return !d || d.toLowerCase() === "electron" ? void 0 : d ? { name: d, version: a?.version } : void 0;
      } catch {
        return;
      }
  }
  function n(f, r) {
    let s = r;
    for (; ; ) {
      const a = o.parse(s), d = a.root, c = a.dir;
      if (t.existsSync(o.join(s, f)))
        return o.resolve(o.join(s, f));
      if (s === d)
        return null;
      s = c;
    }
  }
  function i() {
    const f = process.argv.filter((s) => s.indexOf("--user-data-dir=") === 0);
    return f.length === 0 || typeof f[0] != "string" ? null : f[0].replace("--user-data-dir=", "");
  }
  function e() {
    try {
      return require.main?.filename;
    } catch {
      return;
    }
  }
  return vo;
}
var wo, Cu;
function Ic() {
  if (Cu) return wo;
  Cu = 1;
  const t = Cr, o = bt, l = Ie, u = yh();
  class n {
    appName = void 0;
    appPackageJson = void 0;
    platform = process.platform;
    getAppLogPath(e = this.getAppName()) {
      return this.platform === "darwin" ? l.join(this.getSystemPathHome(), "Library/Logs", e) : l.join(this.getAppUserDataPath(e), "logs");
    }
    getAppName() {
      const e = this.appName || this.getAppPackageJson()?.name;
      if (!e)
        throw new Error(
          "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
        );
      return e;
    }
    /**
     * @private
     * @returns {undefined}
     */
    getAppPackageJson() {
      return typeof this.appPackageJson != "object" && (this.appPackageJson = u.findAndReadPackageJson()), this.appPackageJson;
    }
    getAppUserDataPath(e = this.getAppName()) {
      return e ? l.join(this.getSystemPathAppData(), e) : void 0;
    }
    getAppVersion() {
      return this.getAppPackageJson()?.version;
    }
    getElectronLogPath() {
      return this.getAppLogPath();
    }
    getMacOsVersion() {
      const e = Number(o.release().split(".")[0]);
      return e <= 19 ? `10.${e - 4}` : e - 9;
    }
    /**
     * @protected
     * @returns {string}
     */
    getOsVersion() {
      let e = o.type().replace("_", " "), f = o.release();
      return e === "Darwin" && (e = "macOS", f = this.getMacOsVersion()), `${e} ${f}`;
    }
    /**
     * @return {PathVariables}
     */
    getPathVariables() {
      const e = this.getAppName(), f = this.getAppVersion(), r = this;
      return {
        appData: this.getSystemPathAppData(),
        appName: e,
        appVersion: f,
        get electronDefaultDir() {
          return r.getElectronLogPath();
        },
        home: this.getSystemPathHome(),
        libraryDefaultDir: this.getAppLogPath(e),
        libraryTemplate: this.getAppLogPath("{appName}"),
        temp: this.getSystemPathTemp(),
        userData: this.getAppUserDataPath(e)
      };
    }
    getSystemPathAppData() {
      const e = this.getSystemPathHome();
      switch (this.platform) {
        case "darwin":
          return l.join(e, "Library/Application Support");
        case "win32":
          return process.env.APPDATA || l.join(e, "AppData/Roaming");
        default:
          return process.env.XDG_CONFIG_HOME || l.join(e, ".config");
      }
    }
    getSystemPathHome() {
      return o.homedir?.() || process.env.HOME;
    }
    getSystemPathTemp() {
      return o.tmpdir();
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: void 0,
        os: this.getOsVersion()
      };
    }
    isDev() {
      return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
    }
    isElectron() {
      return !!process.versions.electron;
    }
    onAppEvent(e, f) {
    }
    onAppReady(e) {
      e();
    }
    onEveryWebContentsEvent(e, f) {
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(e, f) {
    }
    onIpcInvoke(e, f) {
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(e, f = console.error) {
      const s = { darwin: "open", win32: "start", linux: "xdg-open" }[process.platform] || "xdg-open";
      t.exec(`${s} ${e}`, {}, (a) => {
        a && f(a);
      });
    }
    setAppName(e) {
      this.appName = e;
    }
    setPlatform(e) {
      this.platform = e;
    }
    setPreloadFileForSessions({
      filePath: e,
      // eslint-disable-line no-unused-vars
      includeFutureSession: f = !0,
      // eslint-disable-line no-unused-vars
      getSessions: r = () => []
      // eslint-disable-line no-unused-vars
    }) {
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(e, f) {
    }
    showErrorBox(e, f) {
    }
  }
  return wo = n, wo;
}
var Eo, Tu;
function vh() {
  if (Tu) return Eo;
  Tu = 1;
  const t = Ie, o = Ic();
  class l extends o {
    /**
     * @type {typeof Electron}
     */
    electron = void 0;
    /**
     * @param {object} options
     * @param {typeof Electron} [options.electron]
     */
    constructor({ electron: n } = {}) {
      super(), this.electron = n;
    }
    getAppName() {
      let n;
      try {
        n = this.appName || this.electron.app?.name || this.electron.app?.getName();
      } catch {
      }
      return n || super.getAppName();
    }
    getAppUserDataPath(n) {
      return this.getPath("userData") || super.getAppUserDataPath(n);
    }
    getAppVersion() {
      let n;
      try {
        n = this.electron.app?.getVersion();
      } catch {
      }
      return n || super.getAppVersion();
    }
    getElectronLogPath() {
      return this.getPath("logs") || super.getElectronLogPath();
    }
    /**
     * @private
     * @param {any} name
     * @returns {string|undefined}
     */
    getPath(n) {
      try {
        return this.electron.app?.getPath(n);
      } catch {
        return;
      }
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: `Electron ${process.versions.electron}`,
        os: this.getOsVersion()
      };
    }
    getSystemPathAppData() {
      return this.getPath("appData") || super.getSystemPathAppData();
    }
    isDev() {
      return this.electron.app?.isPackaged !== void 0 ? !this.electron.app.isPackaged : typeof process.execPath == "string" ? t.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev();
    }
    onAppEvent(n, i) {
      return this.electron.app?.on(n, i), () => {
        this.electron.app?.off(n, i);
      };
    }
    onAppReady(n) {
      this.electron.app?.isReady() ? n() : this.electron.app?.once ? this.electron.app?.once("ready", n) : n();
    }
    onEveryWebContentsEvent(n, i) {
      return this.electron.webContents?.getAllWebContents()?.forEach((f) => {
        f.on(n, i);
      }), this.electron.app?.on("web-contents-created", e), () => {
        this.electron.webContents?.getAllWebContents().forEach((f) => {
          f.off(n, i);
        }), this.electron.app?.off("web-contents-created", e);
      };
      function e(f, r) {
        r.on(n, i);
      }
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(n, i) {
      this.electron.ipcMain?.on(n, i);
    }
    onIpcInvoke(n, i) {
      this.electron.ipcMain?.handle?.(n, i);
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(n, i = console.error) {
      this.electron.shell?.openExternal(n).catch(i);
    }
    setPreloadFileForSessions({
      filePath: n,
      includeFutureSession: i = !0,
      getSessions: e = () => [this.electron.session?.defaultSession]
    }) {
      for (const r of e().filter(Boolean))
        f(r);
      i && this.onAppEvent("session-created", (r) => {
        f(r);
      });
      function f(r) {
        typeof r.registerPreloadScript == "function" ? r.registerPreloadScript({
          filePath: n,
          id: "electron-log-preload",
          type: "frame"
        }) : r.setPreloads([...r.getPreloads(), n]);
      }
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(n, i) {
      this.electron.BrowserWindow?.getAllWindows()?.forEach((e) => {
        e.webContents?.isDestroyed() === !1 && e.webContents?.isCrashed() === !1 && e.webContents.send(n, i);
      });
    }
    showErrorBox(n, i) {
      this.electron.dialog?.showErrorBox(n, i);
    }
  }
  return Eo = l, Eo;
}
var _o, Ru;
function wh() {
  if (Ru) return _o;
  Ru = 1;
  const t = Ke, o = bt, l = Ie, u = Pc();
  let n = !1, i = !1;
  _o = {
    initialize({
      externalApi: r,
      getSessions: s,
      includeFutureSession: a,
      logger: d,
      preload: c = !0,
      spyRendererConsole: p = !1
    }) {
      r.onAppReady(() => {
        try {
          c && e({
            externalApi: r,
            getSessions: s,
            includeFutureSession: a,
            logger: d,
            preloadOption: c
          }), p && f({ externalApi: r, logger: d });
        } catch (y) {
          d.warn(y);
        }
      });
    }
  };
  function e({
    externalApi: r,
    getSessions: s,
    includeFutureSession: a,
    logger: d,
    preloadOption: c
  }) {
    let p = typeof c == "string" ? c : void 0;
    if (n) {
      d.warn(new Error("log.initialize({ preload }) already called").stack);
      return;
    }
    n = !0;
    try {
      p = l.resolve(
        __dirname,
        "../renderer/electron-log-preload.js"
      );
    } catch {
    }
    if (!p || !t.existsSync(p)) {
      p = l.join(
        r.getAppUserDataPath() || o.tmpdir(),
        "electron-log-preload.js"
      );
      const y = `
      try {
        (${u.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
      t.writeFileSync(p, y, "utf8");
    }
    r.setPreloadFileForSessions({
      filePath: p,
      includeFutureSession: a,
      getSessions: s
    });
  }
  function f({ externalApi: r, logger: s }) {
    if (i) {
      s.warn(
        new Error("log.initialize({ spyRendererConsole }) already called").stack
      );
      return;
    }
    i = !0;
    const a = ["debug", "info", "warn", "error"];
    r.onEveryWebContentsEvent(
      "console-message",
      (d, c, p) => {
        s.processMessage({
          data: [p],
          level: a[c],
          variables: { processType: "renderer" }
        });
      }
    );
  }
  return _o;
}
var So, Ou;
function Eh() {
  if (Ou) return So;
  Ou = 1;
  class t {
    externalApi = void 0;
    isActive = !1;
    logFn = void 0;
    onError = void 0;
    showDialog = !0;
    constructor({
      externalApi: u,
      logFn: n = void 0,
      onError: i = void 0,
      showDialog: e = void 0
    } = {}) {
      this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({ externalApi: u, logFn: n, onError: i, showDialog: e }), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
    }
    handle(u, {
      logFn: n = this.logFn,
      onError: i = this.onError,
      processType: e = "browser",
      showDialog: f = this.showDialog,
      errorName: r = ""
    } = {}) {
      u = o(u);
      try {
        if (typeof i == "function") {
          const s = this.externalApi?.getVersions() || {}, a = this.createIssue;
          if (i({
            createIssue: a,
            error: u,
            errorName: r,
            processType: e,
            versions: s
          }) === !1)
            return;
        }
        r ? n(r, u) : n(u), f && !r.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(
          `A JavaScript error occurred in the ${e} process`,
          u.stack
        );
      } catch {
        console.error(u);
      }
    }
    setOptions({ externalApi: u, logFn: n, onError: i, showDialog: e }) {
      typeof u == "object" && (this.externalApi = u), typeof n == "function" && (this.logFn = n), typeof i == "function" && (this.onError = i), typeof e == "boolean" && (this.showDialog = e);
    }
    startCatching({ onError: u, showDialog: n } = {}) {
      this.isActive || (this.isActive = !0, this.setOptions({ onError: u, showDialog: n }), process.on("uncaughtException", this.handleError), process.on("unhandledRejection", this.handleRejection));
    }
    stopCatching() {
      this.isActive = !1, process.removeListener("uncaughtException", this.handleError), process.removeListener("unhandledRejection", this.handleRejection);
    }
    createIssue(u, n) {
      this.externalApi?.openUrl(
        `${u}?${new URLSearchParams(n).toString()}`
      );
    }
    handleError(u) {
      this.handle(u, { errorName: "Unhandled" });
    }
    handleRejection(u) {
      const n = u instanceof Error ? u : new Error(JSON.stringify(u));
      this.handle(n, { errorName: "Unhandled rejection" });
    }
  }
  function o(l) {
    if (l instanceof Error)
      return l;
    if (l && typeof l == "object") {
      if (l.message)
        return Object.assign(new Error(l.message), l);
      try {
        return new Error(JSON.stringify(l));
      } catch (u) {
        return new Error(`Couldn't normalize error ${String(l)}: ${u}`);
      }
    }
    return new Error(`Can't normalize error ${String(l)}`);
  }
  return So = t, So;
}
var bo, Pu;
function _h() {
  if (Pu) return bo;
  Pu = 1;
  class t {
    disposers = [];
    format = "{eventSource}#{eventName}:";
    formatters = {
      app: {
        "certificate-error": ({ args: l }) => this.arrayToObject(l.slice(1, 4), [
          "url",
          "error",
          "certificate"
        ]),
        "child-process-gone": ({ args: l }) => l.length === 1 ? l[0] : l,
        "render-process-gone": ({ args: [l, u] }) => u && typeof u == "object" ? { ...u, ...this.getWebContentsDetails(l) } : []
      },
      webContents: {
        "console-message": ({ args: [l, u, n, i] }) => {
          if (!(l < 3))
            return { message: u, source: `${i}:${n}` };
        },
        "did-fail-load": ({ args: l }) => this.arrayToObject(l, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "did-fail-provisional-load": ({ args: l }) => this.arrayToObject(l, [
          "errorCode",
          "errorDescription",
          "validatedURL",
          "isMainFrame",
          "frameProcessId",
          "frameRoutingId"
        ]),
        "plugin-crashed": ({ args: l }) => this.arrayToObject(l, ["name", "version"]),
        "preload-error": ({ args: l }) => this.arrayToObject(l, ["preloadPath", "error"])
      }
    };
    events = {
      app: {
        "certificate-error": !0,
        "child-process-gone": !0,
        "render-process-gone": !0
      },
      webContents: {
        // 'console-message': true,
        "did-fail-load": !0,
        "did-fail-provisional-load": !0,
        "plugin-crashed": !0,
        "preload-error": !0,
        unresponsive: !0
      }
    };
    externalApi = void 0;
    level = "error";
    scope = "";
    constructor(l = {}) {
      this.setOptions(l);
    }
    setOptions({
      events: l,
      externalApi: u,
      level: n,
      logger: i,
      format: e,
      formatters: f,
      scope: r
    }) {
      typeof l == "object" && (this.events = l), typeof u == "object" && (this.externalApi = u), typeof n == "string" && (this.level = n), typeof i == "object" && (this.logger = i), (typeof e == "string" || typeof e == "function") && (this.format = e), typeof f == "object" && (this.formatters = f), typeof r == "string" && (this.scope = r);
    }
    startLogging(l = {}) {
      this.setOptions(l), this.disposeListeners();
      for (const u of this.getEventNames(this.events.app))
        this.disposers.push(
          this.externalApi.onAppEvent(u, (...n) => {
            this.handleEvent({ eventSource: "app", eventName: u, handlerArgs: n });
          })
        );
      for (const u of this.getEventNames(this.events.webContents))
        this.disposers.push(
          this.externalApi.onEveryWebContentsEvent(
            u,
            (...n) => {
              this.handleEvent(
                { eventSource: "webContents", eventName: u, handlerArgs: n }
              );
            }
          )
        );
    }
    stopLogging() {
      this.disposeListeners();
    }
    arrayToObject(l, u) {
      const n = {};
      return u.forEach((i, e) => {
        n[i] = l[e];
      }), l.length > u.length && (n.unknownArgs = l.slice(u.length)), n;
    }
    disposeListeners() {
      this.disposers.forEach((l) => l()), this.disposers = [];
    }
    formatEventLog({ eventName: l, eventSource: u, handlerArgs: n }) {
      const [i, ...e] = n;
      if (typeof this.format == "function")
        return this.format({ args: e, event: i, eventName: l, eventSource: u });
      const f = this.formatters[u]?.[l];
      let r = e;
      if (typeof f == "function" && (r = f({ args: e, event: i, eventName: l, eventSource: u })), !r)
        return;
      const s = {};
      return Array.isArray(r) ? s.args = r : typeof r == "object" && Object.assign(s, r), u === "webContents" && Object.assign(s, this.getWebContentsDetails(i?.sender)), [this.format.replace("{eventSource}", u === "app" ? "App" : "WebContents").replace("{eventName}", l), s];
    }
    getEventNames(l) {
      return !l || typeof l != "object" ? [] : Object.entries(l).filter(([u, n]) => n).map(([u]) => u);
    }
    getWebContentsDetails(l) {
      if (!l?.loadURL)
        return {};
      try {
        return {
          webContents: {
            id: l.id,
            url: l.getURL()
          }
        };
      } catch {
        return {};
      }
    }
    handleEvent({ eventName: l, eventSource: u, handlerArgs: n }) {
      const i = this.formatEventLog({ eventName: l, eventSource: u, handlerArgs: n });
      i && (this.scope ? this.logger.scope(this.scope) : this.logger)?.[this.level]?.(...i);
    }
  }
  return bo = t, bo;
}
var Ao, Du;
function Nc() {
  if (Du) return Ao;
  Du = 1;
  const { transform: t } = qt();
  Ao = {
    concatFirstStringElements: o,
    formatScope: u,
    formatText: i,
    formatVariables: n,
    timeZoneFromOffset: l,
    format({ message: e, logger: f, transport: r, data: s = e?.data }) {
      switch (typeof r.format) {
        case "string":
          return t({
            message: e,
            logger: f,
            transforms: [n, u, i],
            transport: r,
            initialData: [r.format, ...s]
          });
        case "function":
          return r.format({
            data: s,
            level: e?.level || "info",
            logger: f,
            message: e,
            transport: r
          });
        default:
          return s;
      }
    }
  };
  function o({ data: e }) {
    return typeof e[0] != "string" || typeof e[1] != "string" || e[0].match(/%[1cdfiOos]/) ? e : [`${e[0]} ${e[1]}`, ...e.slice(2)];
  }
  function l(e) {
    const f = Math.abs(e), r = e > 0 ? "-" : "+", s = Math.floor(f / 60).toString().padStart(2, "0"), a = (f % 60).toString().padStart(2, "0");
    return `${r}${s}:${a}`;
  }
  function u({ data: e, logger: f, message: r }) {
    const { defaultLabel: s, labelLength: a } = f?.scope || {}, d = e[0];
    let c = r.scope;
    c || (c = s);
    let p;
    return c === "" ? p = a > 0 ? "".padEnd(a + 3) : "" : typeof c == "string" ? p = ` (${c})`.padEnd(a + 3) : p = "", e[0] = d.replace("{scope}", p), e;
  }
  function n({ data: e, message: f }) {
    let r = e[0];
    if (typeof r != "string")
      return e;
    r = r.replace("{level}]", `${f.level}]`.padEnd(6, " "));
    const s = f.date || /* @__PURE__ */ new Date();
    return e[0] = r.replace(/\{(\w+)}/g, (a, d) => {
      switch (d) {
        case "level":
          return f.level || "info";
        case "logId":
          return f.logId;
        case "y":
          return s.getFullYear().toString(10);
        case "m":
          return (s.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return s.getDate().toString(10).padStart(2, "0");
        case "h":
          return s.getHours().toString(10).padStart(2, "0");
        case "i":
          return s.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return s.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return s.getMilliseconds().toString(10).padStart(3, "0");
        case "z":
          return l(s.getTimezoneOffset());
        case "iso":
          return s.toISOString();
        default:
          return f.variables?.[d] || a;
      }
    }).trim(), e;
  }
  function i({ data: e }) {
    const f = e[0];
    if (typeof f != "string")
      return e;
    if (f.lastIndexOf("{text}") === f.length - 6)
      return e[0] = f.replace(/\s?{text}/, ""), e[0] === "" && e.shift(), e;
    const s = f.split("{text}");
    let a = [];
    return s[0] !== "" && a.push(s[0]), a = a.concat(e.slice(1)), s[1] !== "" && a.push(s[1]), a;
  }
  return Ao;
}
var Co = { exports: {} }, Iu;
function an() {
  return Iu || (Iu = 1, (function(t) {
    const o = Xr;
    t.exports = {
      serialize: u,
      maxDepth({ data: n, transport: i, depth: e = i?.depth ?? 6 }) {
        if (!n)
          return n;
        if (e < 1)
          return Array.isArray(n) ? "[array]" : typeof n == "object" && n ? "[object]" : n;
        if (Array.isArray(n))
          return n.map((r) => t.exports.maxDepth({
            data: r,
            depth: e - 1
          }));
        if (typeof n != "object" || n && typeof n.toISOString == "function")
          return n;
        if (n === null)
          return null;
        if (n instanceof Error)
          return n;
        const f = {};
        for (const r in n)
          Object.prototype.hasOwnProperty.call(n, r) && (f[r] = t.exports.maxDepth({
            data: n[r],
            depth: e - 1
          }));
        return f;
      },
      toJSON({ data: n }) {
        return JSON.parse(JSON.stringify(n, l()));
      },
      toString({ data: n, transport: i }) {
        const e = i?.inspectOptions || {}, f = n.map((r) => {
          if (r !== void 0)
            try {
              const s = JSON.stringify(r, l(), "  ");
              return s === void 0 ? void 0 : JSON.parse(s);
            } catch {
              return r;
            }
        });
        return o.formatWithOptions(e, ...f);
      }
    };
    function l(n = {}) {
      const i = /* @__PURE__ */ new WeakSet();
      return function(e, f) {
        if (typeof f == "object" && f !== null) {
          if (i.has(f))
            return;
          i.add(f);
        }
        return u(e, f, n);
      };
    }
    function u(n, i, e = {}) {
      const f = e?.serializeMapAndSet !== !1;
      return i instanceof Error ? i.stack : i && (typeof i == "function" ? `[function] ${i.toString()}` : i instanceof Date ? i.toISOString() : f && i instanceof Map && Object.fromEntries ? Object.fromEntries(i) : f && i instanceof Set && Array.from ? Array.from(i) : i);
    }
  })(Co)), Co.exports;
}
var To, Nu;
function ta() {
  if (Nu) return To;
  Nu = 1, To = {
    transformStyles: u,
    applyAnsiStyles({ data: n }) {
      return u(n, o, l);
    },
    removeStyles({ data: n }) {
      return u(n, () => "");
    }
  };
  const t = {
    unset: "\x1B[0m",
    black: "\x1B[30m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m",
    gray: "\x1B[90m"
  };
  function o(n) {
    const i = n.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
    return t[i] || "";
  }
  function l(n) {
    return n + t.unset;
  }
  function u(n, i, e) {
    const f = {};
    return n.reduce((r, s, a, d) => {
      if (f[a])
        return r;
      if (typeof s == "string") {
        let c = a, p = !1;
        s = s.replace(/%[1cdfiOos]/g, (y) => {
          if (c += 1, y !== "%c")
            return y;
          const g = d[c];
          return typeof g == "string" ? (f[c] = !0, p = !0, i(g, s)) : y;
        }), p && e && (s = e(s));
      }
      return r.push(s), r;
    }, []);
  }
  return To;
}
var Ro, xu;
function Sh() {
  if (xu) return Ro;
  xu = 1;
  const {
    concatFirstStringElements: t,
    format: o
  } = Nc(), { maxDepth: l, toJSON: u } = an(), {
    applyAnsiStyles: n,
    removeStyles: i
  } = ta(), { transform: e } = qt(), f = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  Ro = a;
  const s = `%c{h}:{i}:{s}.{ms}{scope}%c ${process.platform === "win32" ? ">" : "›"} {text}`;
  Object.assign(a, {
    DEFAULT_FORMAT: s
  });
  function a(g) {
    return Object.assign(m, {
      colorMap: {
        error: "red",
        warn: "yellow",
        info: "cyan",
        verbose: "unset",
        debug: "gray",
        silly: "gray",
        default: "unset"
      },
      format: s,
      level: "silly",
      transforms: [
        d,
        o,
        p,
        t,
        l,
        u
      ],
      useStyles: process.env.FORCE_STYLES,
      writeFn({ message: E }) {
        (f[E.level] || f.info)(...E.data);
      }
    });
    function m(E) {
      const A = e({ logger: g, message: E, transport: m });
      m.writeFn({
        message: { ...E, data: A }
      });
    }
  }
  function d({ data: g, message: m, transport: E }) {
    return typeof E.format != "string" || !E.format.includes("%c") ? g : [
      `color:${y(m.level, E)}`,
      "color:unset",
      ...g
    ];
  }
  function c(g, m) {
    if (typeof g == "boolean")
      return g;
    const A = m === "error" || m === "warn" ? process.stderr : process.stdout;
    return A && A.isTTY;
  }
  function p(g) {
    const { message: m, transport: E } = g;
    return (c(E.useStyles, m.level) ? n : i)(g);
  }
  function y(g, m) {
    return m.colorMap[g] || m.colorMap.default;
  }
  return Ro;
}
var Oo, Lu;
function xc() {
  if (Lu) return Oo;
  Lu = 1;
  const t = Kr, o = Ke, l = bt;
  class u extends t {
    asyncWriteQueue = [];
    bytesWritten = 0;
    hasActiveAsyncWriting = !1;
    path = null;
    initialSize = void 0;
    writeOptions = null;
    writeAsync = !1;
    constructor({
      path: e,
      writeOptions: f = { encoding: "utf8", flag: "a", mode: 438 },
      writeAsync: r = !1
    }) {
      super(), this.path = e, this.writeOptions = f, this.writeAsync = r;
    }
    get size() {
      return this.getSize();
    }
    clear() {
      try {
        return o.writeFileSync(this.path, "", {
          mode: this.writeOptions.mode,
          flag: "w"
        }), this.reset(), !0;
      } catch (e) {
        return e.code === "ENOENT" ? !0 : (this.emit("error", e, this), !1);
      }
    }
    crop(e) {
      try {
        const f = n(this.path, e || 4096);
        this.clear(), this.writeLine(`[log cropped]${l.EOL}${f}`);
      } catch (f) {
        this.emit(
          "error",
          new Error(`Couldn't crop file ${this.path}. ${f.message}`),
          this
        );
      }
    }
    getSize() {
      if (this.initialSize === void 0)
        try {
          const e = o.statSync(this.path);
          this.initialSize = e.size;
        } catch {
          this.initialSize = 0;
        }
      return this.initialSize + this.bytesWritten;
    }
    increaseBytesWrittenCounter(e) {
      this.bytesWritten += Buffer.byteLength(e, this.writeOptions.encoding);
    }
    isNull() {
      return !1;
    }
    nextAsyncWrite() {
      const e = this;
      if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0)
        return;
      const f = this.asyncWriteQueue.join("");
      this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, o.writeFile(this.path, f, this.writeOptions, (r) => {
        e.hasActiveAsyncWriting = !1, r ? e.emit(
          "error",
          new Error(`Couldn't write to ${e.path}. ${r.message}`),
          this
        ) : e.increaseBytesWrittenCounter(f), e.nextAsyncWrite();
      });
    }
    reset() {
      this.initialSize = void 0, this.bytesWritten = 0;
    }
    toString() {
      return this.path;
    }
    writeLine(e) {
      if (e += l.EOL, this.writeAsync) {
        this.asyncWriteQueue.push(e), this.nextAsyncWrite();
        return;
      }
      try {
        o.writeFileSync(this.path, e, this.writeOptions), this.increaseBytesWrittenCounter(e);
      } catch (f) {
        this.emit(
          "error",
          new Error(`Couldn't write to ${this.path}. ${f.message}`),
          this
        );
      }
    }
  }
  Oo = u;
  function n(i, e) {
    const f = Buffer.alloc(e), r = o.statSync(i), s = Math.min(r.size, e), a = Math.max(0, r.size - e), d = o.openSync(i, "r"), c = o.readSync(d, f, 0, s, a);
    return o.closeSync(d), f.toString("utf8", 0, c);
  }
  return Oo;
}
var Po, Fu;
function bh() {
  if (Fu) return Po;
  Fu = 1;
  const t = xc();
  class o extends t {
    clear() {
    }
    crop() {
    }
    getSize() {
      return 0;
    }
    isNull() {
      return !0;
    }
    writeLine() {
    }
  }
  return Po = o, Po;
}
var Do, Uu;
function Ah() {
  if (Uu) return Do;
  Uu = 1;
  const t = Kr, o = Ke, l = Ie, u = xc(), n = bh();
  class i extends t {
    store = {};
    constructor() {
      super(), this.emitError = this.emitError.bind(this);
    }
    /**
     * Provide a File object corresponding to the filePath
     * @param {string} filePath
     * @param {WriteOptions} [writeOptions]
     * @param {boolean} [writeAsync]
     * @return {File}
     */
    provide({ filePath: f, writeOptions: r = {}, writeAsync: s = !1 }) {
      let a;
      try {
        if (f = l.resolve(f), this.store[f])
          return this.store[f];
        a = this.createFile({ filePath: f, writeOptions: r, writeAsync: s });
      } catch (d) {
        a = new n({ path: f }), this.emitError(d, a);
      }
      return a.on("error", this.emitError), this.store[f] = a, a;
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @param {boolean} async
     * @return {File}
     * @private
     */
    createFile({ filePath: f, writeOptions: r, writeAsync: s }) {
      return this.testFileWriting({ filePath: f, writeOptions: r }), new u({ path: f, writeOptions: r, writeAsync: s });
    }
    /**
     * @param {Error} error
     * @param {File} file
     * @private
     */
    emitError(f, r) {
      this.emit("error", f, r);
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @private
     */
    testFileWriting({ filePath: f, writeOptions: r }) {
      o.mkdirSync(l.dirname(f), { recursive: !0 }), o.writeFileSync(f, "", { flag: "a", mode: r.mode });
    }
  }
  return Do = i, Do;
}
var Io, $u;
function Ch() {
  if ($u) return Io;
  $u = 1;
  const t = Ke, o = bt, l = Ie, u = Ah(), { transform: n } = qt(), { removeStyles: i } = ta(), {
    format: e,
    concatFirstStringElements: f
  } = Nc(), { toString: r } = an();
  Io = a;
  const s = new u();
  function a(c, { registry: p = s, externalApi: y } = {}) {
    let g;
    return p.listenerCount("error") < 1 && p.on("error", ($, T) => {
      A(`Can't write to ${T}`, $);
    }), Object.assign(m, {
      fileName: d(c.variables.processType),
      format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
      getFile: O,
      inspectOptions: { depth: 5 },
      level: "silly",
      maxSize: 1024 ** 2,
      readAllLogs: P,
      sync: !0,
      transforms: [i, e, f, r],
      writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
      archiveLogFn($) {
        const T = $.toString(), _ = l.parse(T);
        try {
          t.renameSync(T, l.join(_.dir, `${_.name}.old${_.ext}`));
        } catch (b) {
          A("Could not rotate log", b);
          const w = Math.round(m.maxSize / 4);
          $.crop(Math.min(w, 256 * 1024));
        }
      },
      resolvePathFn($) {
        return l.join($.libraryDefaultDir, $.fileName);
      },
      setAppName($) {
        c.dependencies.externalApi.setAppName($);
      }
    });
    function m($) {
      const T = O($);
      m.maxSize > 0 && T.size > m.maxSize && (m.archiveLogFn(T), T.reset());
      const b = n({ logger: c, message: $, transport: m });
      T.writeLine(b);
    }
    function E() {
      g || (g = Object.create(
        Object.prototype,
        {
          ...Object.getOwnPropertyDescriptors(
            y.getPathVariables()
          ),
          fileName: {
            get() {
              return m.fileName;
            },
            enumerable: !0
          }
        }
      ), typeof m.archiveLog == "function" && (m.archiveLogFn = m.archiveLog, A("archiveLog is deprecated. Use archiveLogFn instead")), typeof m.resolvePath == "function" && (m.resolvePathFn = m.resolvePath, A("resolvePath is deprecated. Use resolvePathFn instead")));
    }
    function A($, T = null, _ = "error") {
      const b = [`electron-log.transports.file: ${$}`];
      T && b.push(T), c.transports.console({ data: b, date: /* @__PURE__ */ new Date(), level: _ });
    }
    function O($) {
      E();
      const T = m.resolvePathFn(g, $);
      return p.provide({
        filePath: T,
        writeAsync: !m.sync,
        writeOptions: m.writeOptions
      });
    }
    function P({ fileFilter: $ = (T) => T.endsWith(".log") } = {}) {
      E();
      const T = l.dirname(m.resolvePathFn(g));
      return t.existsSync(T) ? t.readdirSync(T).map((_) => l.join(T, _)).filter($).map((_) => {
        try {
          return {
            path: _,
            lines: t.readFileSync(_, "utf8").split(o.EOL)
          };
        } catch {
          return null;
        }
      }).filter(Boolean) : [];
    }
  }
  function d(c = process.type) {
    switch (c) {
      case "renderer":
        return "renderer.log";
      case "worker":
        return "worker.log";
      default:
        return "main.log";
    }
  }
  return Io;
}
var No, ku;
function Th() {
  if (ku) return No;
  ku = 1;
  const { maxDepth: t, toJSON: o } = an(), { transform: l } = qt();
  No = u;
  function u(n, { externalApi: i }) {
    return Object.assign(e, {
      depth: 3,
      eventId: "__ELECTRON_LOG_IPC__",
      level: n.isDev ? "silly" : !1,
      transforms: [o, t]
    }), i?.isElectron() ? e : void 0;
    function e(f) {
      f?.variables?.processType !== "renderer" && i?.sendIpc(e.eventId, {
        ...f,
        data: l({ logger: n, message: f, transport: e })
      });
    }
  }
  return No;
}
var xo, qu;
function Rh() {
  if (qu) return xo;
  qu = 1;
  const t = Xu, o = Uf, { transform: l } = qt(), { removeStyles: u } = ta(), { toJSON: n, maxDepth: i } = an();
  xo = e;
  function e(f) {
    return Object.assign(r, {
      client: { name: "electron-application" },
      depth: 6,
      level: !1,
      requestOptions: {},
      transforms: [u, n, i],
      makeBodyFn({ message: s }) {
        return JSON.stringify({
          client: r.client,
          data: s.data,
          date: s.date.getTime(),
          level: s.level,
          scope: s.scope,
          variables: s.variables
        });
      },
      processErrorFn({ error: s }) {
        f.processMessage(
          {
            data: [`electron-log: can't POST ${r.url}`, s],
            level: "warn"
          },
          { transports: ["console", "file"] }
        );
      },
      sendRequestFn({ serverUrl: s, requestOptions: a, body: d }) {
        const p = (s.startsWith("https:") ? o : t).request(s, {
          method: "POST",
          ...a,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": d.length,
            ...a.headers
          }
        });
        return p.write(d), p.end(), p;
      }
    });
    function r(s) {
      if (!r.url)
        return;
      const a = r.makeBodyFn({
        logger: f,
        message: { ...s, data: l({ logger: f, message: s, transport: r }) },
        transport: r
      }), d = r.sendRequestFn({
        serverUrl: r.url,
        requestOptions: r.requestOptions,
        body: Buffer.from(a, "utf8")
      });
      d.on("error", (c) => r.processErrorFn({
        error: c,
        logger: f,
        message: s,
        request: d,
        transport: r
      }));
    }
  }
  return xo;
}
var Lo, Mu;
function Lc() {
  if (Mu) return Lo;
  Mu = 1;
  const t = Dc(), o = Eh(), l = _h(), u = Sh(), n = Ch(), i = Th(), e = Rh();
  Lo = f;
  function f({ dependencies: r, initializeFn: s }) {
    const a = new t({
      dependencies: r,
      errorHandler: new o(),
      eventLogger: new l(),
      initializeFn: s,
      isDev: r.externalApi?.isDev(),
      logId: "default",
      transportFactories: {
        console: u,
        file: n,
        ipc: i,
        remote: e
      },
      variables: {
        processType: "main"
      }
    });
    return a.default = a, a.Logger = t, a.processInternalErrorFn = (d) => {
      a.transports.console.writeFn({
        message: {
          data: ["Unhandled electron-log error", d],
          level: "error"
        }
      });
    }, a;
  }
  return Lo;
}
var Fo, Bu;
function Oh() {
  if (Bu) return Fo;
  Bu = 1;
  const t = _t, o = vh(), { initialize: l } = wh(), u = Lc(), n = new o({ electron: t }), i = u({
    dependencies: { externalApi: n },
    initializeFn: l
  });
  Fo = i, n.onIpc("__ELECTRON_LOG__", (f, r) => {
    r.scope && i.Logger.getInstance(r).scope(r.scope);
    const s = new Date(r.date);
    e({
      ...r,
      date: s.getTime() ? s : /* @__PURE__ */ new Date()
    });
  }), n.onIpcInvoke("__ELECTRON_LOG__", (f, { cmd: r = "", logId: s }) => r === "getOptions" ? {
    levels: i.Logger.getInstance({ logId: s }).levels,
    logId: s
  } : (e({ data: [`Unknown cmd '${r}'`], level: "error" }), {}));
  function e(f) {
    i.Logger.getInstance(f)?.processMessage(f);
  }
  return Fo;
}
var Uo, ju;
function Ph() {
  if (ju) return Uo;
  ju = 1;
  const t = Ic(), o = Lc(), l = new t();
  return Uo = o({
    dependencies: { externalApi: l }
  }), Uo;
}
var Hu;
function Dh() {
  if (Hu) return Sr.exports;
  Hu = 1;
  const t = typeof process > "u" || process.type === "renderer" || process.type === "worker", o = typeof process == "object" && process.type === "browser";
  return t ? (Pc(), Sr.exports = gh()) : o ? Sr.exports = Oh() : Sr.exports = Ph(), Sr.exports;
}
var Ih = Dh();
const zt = /* @__PURE__ */ Ku(Ih), Ye = {
  CHANNEL: "msedge",
  HEADLESS: !1,
  ARGS: [
    "--disable-blink-features=AutomationControlled",
    "--window-position=0,0",
    "--no-sandbox",
    "--disable-setuid-sandbox"
  ],
  VIEWPORT: null,
  DEFAULT_TIMEOUT: 0,
  NAVIGATION_TIMEOUT: 6e4,
  GAME_PATH: "/game.php?screen=overview",
  CLICK: { force: !0 },
  CHROME_NOT_FOUND: "Erro ao abrir o Chrome. Verifique a instalação e tente novamente.",
  SELECTORS: {
    USERNAME: "input#user",
    PASSWORD: "input#password",
    SUBMIT: "a.btn-login",
    WORLDS: ".worlds-container",
    SCREEN: /screen=/,
    WORLD_LINK: (t) => `a.world-select[href*="${t}"], a:has(.world_button_active)[href*="${t}"]`,
    RES: {
      WOOD: "#wood",
      STONE: "#stone",
      IRON: "#iron",
      STORAGE: "#storage",
      FARM: "#header_farm_text"
    },
    UNITS: {
      SPEAR: ".unit-item-spear span.unit_a_count",
      SWORD: ".unit-item-sword span.unit_a_count",
      SPY: ".unit-item-spy span.unit_a_count",
      LIGHT: ".unit-item-light span.unit_a_count",
      TABLE_SPEAR: 'strong[data-count="spear"]',
      TABLE_SWORD: 'strong[data-count="sword"]',
      TABLE_SPY: 'strong[data-count="spy"]',
      TABLE_LIGHT: 'strong[data-count="light"]'
    }
  }
};
class Dr {
  constructor(o) {
    this.preferredBrowser = Ye.CHANNEL, this.hasCaptcha = !1, this.lastCaptchaNotification = 0, this.browser = null, this.context = null, this.page = null;
    const { config: { proxy: l, cookies: u = [], server: n, world: i, name: e, password: f, config: r, globalSettings: s, discordWebhook: a, lastCaptchaNotification: d }, browser: { windowSize: c, closeSession: p, closeCaptcha: y, browser: g }, onStatusUpdate: m, onCaptchaUpdate: E } = o;
    this.proxy = l, this.cookies = u, this.server = n, this.world = i, this.name = e, this.password = f, this.windowSize = c || "1280,720", this.closeSession = p, this.closeCaptcha = y, this.preferredBrowser = g || Ye.CHANNEL, this.onStatusUpdate = m, this.onCaptchaUpdate = E, this.discordWebhook = a || r && r.discordWebhook || s && s.discordWebhook, this.lastCaptchaNotification = d || r && r.lastCaptchaNotification || 0;
  }
  async sendDiscordNotification(o) {
    if (this.discordWebhook)
      try {
        await fetch(this.discordWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: o })
        });
      } catch (l) {
        console.error("Discord Notification Error:", l);
      }
  }
  static async init(o) {
    return await new Dr(o).start();
  }
  async shutdown(o) {
    o && this.browser && await this.browser.close();
  }
  async setStatus(o) {
    if (this.onStatusUpdate && this.onStatusUpdate(o), !!this.page)
      try {
        await this.page.evaluate((l) => {
          let u = document.getElementById("pw-status-overlay");
          u || (u = document.createElement("div"), u.id = "pw-status-overlay", u.style.position = "fixed", u.style.bottom = "10px", u.style.right = "10px", u.style.backgroundColor = "rgba(0, 0, 0, 0.8)", u.style.color = "#fff", u.style.padding = "10px 20px", u.style.borderRadius = "5px", u.style.zIndex = "999999", u.style.fontFamily = "monospace", u.style.fontSize = "14px", u.style.pointerEvents = "none", document.body.appendChild(u)), u.innerText = `Status: ${l}`;
        }, o);
      } catch {
      }
  }
  async waitCaptchaResolve() {
    if (!this.page) return null;
    try {
      const o = this.world?.domain || this.server?.domain, u = await (await this.page.request.get(`${o}/game.php?screen=api&ajax=ping&ts=${Date.now()}`, { headers: { "Tribalwars-ajax": "1" } })).json(), n = await this.page.evaluate(() => !!(document.querySelector(".bot-protection-row") || document.querySelector(".captcha") || document.getElementById("bot_check"))), i = u.bot_protect || n;
      if (!i) return null;
      if (i) {
        this.hasCaptcha = !0, this.onCaptchaUpdate && await this.onCaptchaUpdate(!0), await this.setStatus("Captcha detectado! Aguardando resolução...");
        const e = Date.now();
        if (this.discordWebhook && e - this.lastCaptchaNotification > 3600 * 1e3) {
          const f = this.world?.domain?.replace("https://", "") || "Unknown";
          await this.sendDiscordNotification(`⚠️ **Captcha Detectado!**
👤 Conta: **${this.name}**
🌍 Mundo: ${f}
🔗 [Resolver](<${this.world?.domain}/game.php>)`), this.lastCaptchaNotification = e;
        }
      }
      return Ye.HEADLESS ? "CAPTCHA_DETECTED" : (await this.page.waitForResponse(/botcheck&ajaxaction=verify/, { timeout: 0 }).catch(() => {
      }), this.hasCaptcha = !1, this.onCaptchaUpdate && await this.onCaptchaUpdate(!1), this.closeCaptcha ? (await this.shutdown(!0), "CAPTCHA_RESOLVED_CLOSED") : "CAPTCHA_RESOLVED");
    } catch {
      return null;
    }
  }
  async scrapeData() {
    if (!this.page) return null;
    try {
      return await this.page.evaluate((o) => {
        const l = (i) => {
          const e = document.querySelector(i);
          return e ? parseInt(e.textContent?.replace(/\./g, "") || "0", 10) : 0;
        }, u = window.game_data, n = !!(document.getElementById("bot_check") || document.querySelector(".captcha") || document.querySelector(".bot-protection-row"));
        return u && u.village ? {
          resources: {
            wood: Math.floor(u.village.wood),
            stone: Math.floor(u.village.stone),
            iron: Math.floor(u.village.iron),
            storage: parseInt(u.village.storage_max, 10)
          },
          farm: `${u.village.pop}/${u.village.pop_max}`,
          units: {
            spear: l(o.UNITS.SPEAR) || l(o.UNITS.TABLE_SPEAR),
            sword: l(o.UNITS.SWORD) || l(o.UNITS.TABLE_SWORD),
            spy: l(o.UNITS.SPY) || l(o.UNITS.TABLE_SPY),
            light: l(o.UNITS.LIGHT) || l(o.UNITS.TABLE_LIGHT)
          },
          incoming: u.player?.incomings || 0,
          points: parseInt(u.player?.points || "0", 10),
          premiumPoints: parseInt(u.player?.pp || "0", 10),
          hasCaptcha: n
        } : { hasCaptcha: n };
      }, { UNITS: Ye.SELECTORS.UNITS });
    } catch {
      return null;
    }
  }
  async withCookies() {
    if (!this.page) return null;
    const o = this.world?.domain || this.server?.domain;
    await this.page.goto(o + Ye.GAME_PATH);
    try {
      return await this.page.waitForURL((l) => {
        const u = l.toString();
        return u.includes("screen=") || u.includes("session_expired=1");
      }, { timeout: Ye.NAVIGATION_TIMEOUT }), await this.page.waitForTimeout(1e3), await this.waitCaptchaResolve();
    } catch {
      return null;
    }
  }
  setupPageEvents() {
    this.page && this.browser && this.page.on("close", () => this.browser?.close());
  }
  // Substitua o método start() pelo código abaixo:
  async start() {
    let o = this.cookies || [];
    const l = async () => {
      if (this.context)
        try {
          const u = [
            this.server?.domain,
            this.world?.domain,
            this.page ? this.page.url() : null
          ].filter((r) => !!r), n = await this.context.cookies().catch(() => []), i = u.length > 0 ? await this.context.cookies(u).catch(() => []) : [], e = /* @__PURE__ */ new Map();
          [...n, ...i].forEach((r) => {
            e.set(r.name + r.domain, r);
          });
          const f = Array.from(e.values());
          f.length > 0 && (o = f);
        } catch {
        }
    };
    try {
      let u = {
        headless: Ye.HEADLESS,
        args: [...Ye.ARGS, `--window-size=${this.windowSize}`]
      };
      if (this.proxy) {
        const g = `${this.proxy.proxy_address}:${this.proxy.port}`;
        u.args.push(`--proxy-server=http://${g}`), console.log(`[Playwright] Configurando proxy: ${g}`);
      }
      const n = (g) => {
        if (process.platform === "win32") {
          if (g === "brave")
            return [
              "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
              "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
              `${process.env.LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`
            ].find((A) => ha.existsSync(A));
          if (g === "opera")
            return [
              `${process.env.LOCALAPPDATA}\\Programs\\Opera\\launcher.exe`,
              `${process.env.LOCALAPPDATA}\\Programs\\Opera GX\\launcher.exe`,
              "C:\\Program Files\\Opera\\launcher.exe",
              "C:\\Program Files\\Opera GX\\launcher.exe"
            ].find((A) => ha.existsSync(A));
        }
      }, i = [];
      if (this.preferredBrowser === "brave") {
        const g = n("brave");
        g ? i.push({ executablePath: g, name: "Brave" }) : console.warn("[Playwright] Brave executable not found.");
      } else if (this.preferredBrowser === "opera") {
        const g = n("opera");
        g ? i.push({ executablePath: g, name: "Opera" }) : console.warn("[Playwright] Opera executable not found.");
      } else this.preferredBrowser === "msedge" ? i.push({ channel: "msedge", name: "Edge" }) : i.push({ channel: "chrome", name: "Chrome" });
      this.preferredBrowser !== "chrome" && i.push({ channel: "chrome", name: "Chrome (Fallback)" }), this.preferredBrowser !== "msedge" && i.push({ channel: "msedge", name: "Edge (Fallback)" }), i.push({ channel: void 0, name: "Bundled Chromium (Fallback)" });
      let e, f = !1;
      for (const g of i)
        try {
          console.log(`[Playwright] Attempting to launch: ${g.name}`);
          const m = { ...u };
          g.channel && (m.channel = g.channel), g.executablePath && (m.executablePath = g.executablePath), this.browser = await $f.launch(m), console.log(`[Playwright] Browser launched successfully: ${g.name}`), f = !0;
          break;
        } catch (m) {
          console.error(`[Playwright] Failed to launch ${g.name}:`, m.message), e = m;
        }
      if (!f || !this.browser)
        throw new Error(`Falha ao abrir o navegador. Erro: ${e?.message}`);
      const r = {
        viewport: Ye.VIEWPORT
      };
      this.proxy && this.proxy.username && this.proxy.password && (r.httpCredentials = {
        username: this.proxy.username,
        password: this.proxy.password
      }), this.context = await this.browser.newContext(r), this.page = await this.context.newPage(), this.setupPageEvents(), await this.context.addCookies(this.cookies), await l();
      let s = o.some((g) => g.name.toLowerCase() === "sid"), a = o.some((g) => g.name.toLowerCase().includes("auth"));
      if (a && s) {
        await this.setStatus("Sessão ativa detectada! Indo para o jogo...");
        const g = await this.withCookies();
        if (this.page.url().includes("session_expired=1"))
          await this.setStatus("Sessão expirada detectada! Tentando reconectar..."), s = !1;
        else {
          if (g === "CAPTCHA_RESOLVED_CLOSED")
            return {
              cookies: o,
              data: {
                hasCaptcha: !1,
                lastCaptchaNotification: this.lastCaptchaNotification
              }
            };
          g === "CAPTCHA_DETECTED" && await this.setStatus("Captcha detectado! Pausando...");
        }
      }
      if (!a || !s) {
        await this.page.goto(this.server.domain), await l(), o.some((m) => m.name.toLowerCase().includes("auth")) || (await this.setStatus("Realizando login..."), await this.page.locator(Ye.SELECTORS.USERNAME).isVisible().catch(() => !1) && (await this.page.locator(Ye.SELECTORS.USERNAME).fill(this.name), await this.page.locator(Ye.SELECTORS.PASSWORD).fill(this.password), await this.page.locator(Ye.SELECTORS.SUBMIT).click(), await this.page.waitForLoadState("networkidle")));
        const g = this.world?.domain.split("//")[1]?.split(".")[0];
        await this.setStatus(`Aguardando seleção do mundo (${g})...`);
        for (let m = 0; m < 60; m++) {
          await l();
          const E = this.page.url();
          if (E.includes("/page/join/") && (await this.setStatus("Confirmando entrada no mundo..."), await this.page.click('button.btn[type="submit"]').catch(() => {
          })), E.includes("game.php") && E.includes("screen=") && !E.includes("session_expired=1")) {
            await this.setStatus("Entrando no mundo...");
            const A = await this.scrapeData();
            A && ((A.resources?.wood ?? 0) > 0 || (A.units?.spear ?? 0) > 0) && await this.setStatus("Dados do jogo detectados!");
            break;
          }
          if (g) {
            const A = `a.world-select[href*="${g}"], a:has(.world_button_active)[href*="${g}"], a[href*="/page/play/${g}"]`;
            await this.page.locator(A).count() > 0 && (await this.setStatus(`Mundo ${g} encontrado! Clicando...`), await this.page.click(A, { force: !0 }).catch(() => {
            }));
          }
          await this.page.waitForTimeout(1e3);
        }
      }
      await this.page.waitForURL(/game\.php/, { timeout: 15e3 }).catch(() => {
      });
      const d = this.world?.domain || this.server?.domain;
      this.page.url().includes(d.replace("https://", "").replace("http://", "")) || (await this.page.goto(d + Ye.GAME_PATH), await this.page.waitForLoadState("networkidle"), await this.page.waitForTimeout(2e3));
      let p = await this.scrapeData();
      if (!p || (p.resources?.wood ?? 0) === 0) {
        await this.setStatus("Aguardando cookies do mundo (SID/Sessão)...");
        for (let g = 0; g < 20; g++) {
          await l();
          const m = await this.scrapeData();
          if (m && (m.resources?.wood ?? 0) > 0)
            break;
          await this.page.waitForTimeout(1e3).catch(() => {
          });
        }
      }
      const y = await this.scrapeData();
      return this.hasCaptcha && y && (y.hasCaptcha = !0), await l(), this.closeSession && await this.shutdown(!0), {
        cookies: o,
        data: {
          ...y,
          lastCaptchaNotification: this.lastCaptchaNotification
        }
      };
    } catch (u) {
      return console.error("[Playwright] Error:", u), this.closeSession && await this.shutdown(!0), { cookies: o, error: u.message };
    }
  }
}
class ot {
  static info(o, l) {
    console.log(`[${o}] ${l}`);
  }
  static error(o, l) {
    console.error(`[${o}] ${l}`);
  }
  static success(o, l) {
    console.log(`[${o}] ✅ ${l}`);
  }
  static warn(o, l) {
    console.warn(`[${o}] ⚠️ ${l}`);
  }
  static log(o, l) {
    console.log(`[${o}] ${l}`);
  }
  static header(o) {
    console.log(`
=== ${o} ===
`);
  }
}
var $o, Gu;
function Nh() {
  if (Gu) return $o;
  Gu = 1;
  class t {
    /// value;
    /// next;
    constructor(u) {
      this.value = u, this.next = void 0;
    }
  }
  class o {
    // TODO: Use private class fields when targeting Node.js 12.
    // #_head;
    // #_tail;
    // #_size;
    constructor() {
      this.clear();
    }
    enqueue(u) {
      const n = new t(u);
      this._head ? (this._tail.next = n, this._tail = n) : (this._head = n, this._tail = n), this._size++;
    }
    dequeue() {
      const u = this._head;
      if (u)
        return this._head = this._head.next, this._size--, u.value;
    }
    clear() {
      this._head = void 0, this._tail = void 0, this._size = 0;
    }
    get size() {
      return this._size;
    }
    *[Symbol.iterator]() {
      let u = this._head;
      for (; u; )
        yield u.value, u = u.next;
    }
  }
  return $o = o, $o;
}
var ko, Wu;
function xh() {
  if (Wu) return ko;
  Wu = 1;
  const t = Nh();
  return ko = (l) => {
    if (!((Number.isInteger(l) || l === 1 / 0) && l > 0))
      throw new TypeError("Expected `concurrency` to be a number from 1 and up");
    const u = new t();
    let n = 0;
    const i = () => {
      n--, u.size > 0 && u.dequeue()();
    }, e = async (s, a, ...d) => {
      n++;
      const c = (async () => s(...d))();
      a(c);
      try {
        await c;
      } catch {
      }
      i();
    }, f = (s, a, ...d) => {
      u.enqueue(e.bind(null, s, a, ...d)), (async () => (await Promise.resolve(), n < l && u.size > 0 && u.dequeue()()))();
    }, r = (s, ...a) => new Promise((d) => {
      f(s, d, ...a);
    });
    return Object.defineProperties(r, {
      activeCount: {
        get: () => n
      },
      pendingCount: {
        get: () => u.size
      },
      clearQueue: {
        value: () => {
          u.clear();
        }
      }
    }), r;
  }, ko;
}
var Lh = xh();
const Fh = /* @__PURE__ */ Ku(Lh), Uh = parseInt(process.env.CONCURRENCY_LIMIT || "20", 10), $h = Fh(Uh), qo = process.env.API_URL || (St.isPackaged, "http://91.98.128.189:3001"), zu = /* @__PURE__ */ new Map(), Le = {
  intervalId: null,
  win: null,
  userUuid: null,
  isRunning: !1,
  activeTasks: 0,
  setWindow: (t) => {
    Le.win = t;
  },
  init: (t, o) => {
    t && (Le.userUuid = t, !Le.intervalId && (ot.info("Scheduler", `Starting Scheduler for user ${t} (Mode: ${o})`), Le.intervalId = setInterval(() => {
      Le.runSchedule();
    }, 5e3), Le.runSchedule()));
  },
  stop: (t) => {
    Le.userUuid === t && Le.stopAll();
  },
  stopAll: () => {
    Le.intervalId && (clearInterval(Le.intervalId), Le.intervalId = null, ot.info("Scheduler", "Scheduler stopped."));
  },
  runSchedule: async () => {
    if (!Le.isRunning && Le.userUuid) {
      Le.isRunning = !0;
      try {
        const t = await fetch(`${qo}/api/accounts?userUuid=${Le.userUuid}`);
        if (!t.ok) throw new Error("Failed to fetch accounts");
        const o = await t.json(), l = Date.now(), u = o.filter((n) => {
          if (n.status !== "Ativo" || !n.enabled) return !1;
          const i = zu.get(n._id) || 0, e = n.nextExecution || 0;
          return l >= i && l >= e;
        });
        u.length > 0 && (ot.info("Scheduler", `Found ${u.length} accounts due for execution.`), Promise.all(u.map((n) => $h(async () => {
          Le.activeTasks++;
          try {
            await Le.processAccount(n);
          } finally {
            Le.activeTasks--;
          }
        }))));
      } catch (t) {
        ot.error("Scheduler", `Cycle error: ${t.message}`);
      } finally {
        Le.isRunning = !1;
      }
    }
  },
  processAccount: async (t) => {
    try {
      const u = Math.floor(Math.random() * 180001 + 18e4), n = Date.now() + u;
      zu.set(t._id, n), ot.header(`Processing: ${t.name} (World: ${t.world})`);
      const e = await (await fetch(`${qo}/api/users/${Le.userUuid}`)).json(), f = e.globalSettings || {};
      let r = null;
      if (t.proxy && t.proxy !== "Sem Proxy") {
        const p = t.proxy.split(":");
        p.length >= 2 && (r = {
          proxy_address: p[0],
          port: p[1],
          username: p[2] || "",
          password: p[3] || ""
        });
      }
      const s = {
        config: {
          name: t.name,
          password: t.password,
          server: { domain: t.server },
          world: { domain: t.world },
          proxy: r,
          cookies: t.cookies || [],
          config: t.config,
          // Raw config from account
          globalSettings: f,
          accountId: t._id,
          discordWebhook: t.discordWebhook || e.preferences?.discordWebhook || f.discordWebhook,
          lastCaptchaNotification: t.lastCaptchaNotification || 0
        },
        browser: {
          windowSize: "1280,720",
          closeSession: !0,
          closeCaptcha: !1,
          browser: e.preferences?.browser || "chrome"
        }
      }, d = await new Dr(s).start(), c = {};
      if (c.lastExecution = Date.now(), c.nextExecution = n, !d)
        ot.error("Scheduler", `Account ${t.name} returned null.`);
      else if (d.error)
        ot.error("Scheduler", `Account ${t.name} error: ${d.error}`);
      else if (d.status === "CAPTCHA")
        c.status = "Captcha", c.hasCaptcha = !0, ot.warn("Scheduler", `Account ${t.name} hit CAPTCHA.`);
      else if (d.status === "SESSION_EXPIRED")
        c.status = "Desconectado", ot.warn("Scheduler", `Account ${t.name} session expired.`);
      else if (d.cookies && (ot.success("Scheduler", `Account ${t.name} execution success.`), c.status = "Ativo", c.cookies = d.cookies, d.data)) {
        const p = d.data;
        p.units && (c.units = p.units), p.resources && (c.resources = p.resources), p.farm && (c.farm = p.farm), p.incoming !== void 0 && (c.incoming = p.incoming), p.points !== void 0 && (c.points = p.points), p.premiumPoints !== void 0 && (c.premiumPoints = p.premiumPoints), p.hasCaptcha !== void 0 && (c.hasCaptcha = p.hasCaptcha), p.lastCaptchaNotification && (c.lastCaptchaNotification = p.lastCaptchaNotification);
      }
      await fetch(`${qo}/api/accounts/${t._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c)
      });
    } catch (o) {
      ot.error("Scheduler", `Process error for ${t.name}: ${o.message}`);
    }
  }
};
function kh(t) {
  const o = t.split(/\r?\n/), l = [], u = [];
  return o.forEach((n, i) => {
    const e = i + 1, f = n;
    if (n.trim() === "") return;
    const s = n.trim().replace(/[;,\t]+/, ":").split(/:/);
    if (s.length < 2) {
      u.push({ lineNumber: e, value: f, error: "Formato inválido ou separador ausente." });
      return;
    }
    const a = s[0].trim(), d = s.slice(1).join(":").trim();
    a ? d ? l.push({ username: a, password: d }) : u.push({ lineNumber: e, value: f, error: "Senha ausente." }) : u.push({ lineNumber: e, value: f, error: "Nome de usuário ausente." });
  }), {
    validAccounts: l,
    invalidLines: u,
    summary: {
      totalLinesProcessed: o.length,
      validCount: l.length,
      invalidCount: u.length
    }
  };
}
async function qh(t) {
  const o = Array.isArray(t) ? t : [t];
  if (!o.length) return {};
  try {
    const l = o.map((e) => kf.get(`${e}/backend/get_servers.php`)), u = await Promise.all(l), n = {}, i = /s:\d+:"([^"]+)";s:\d+:"([^"]+)";/g;
    for (const e of u)
      if (!(!e || typeof e.data != "string"))
        for (const f of e.data.matchAll(i)) {
          const r = f[1], s = f[2];
          n[r] = s;
        }
    return n;
  } catch (l) {
    return console.error("Error fetching servers:", l), {};
  }
}
xf.config();
const Mh = Nf(import.meta.url), Fc = Ft.dirname(Mh);
process.env.DIST_ELECTRON = Ft.join(Fc, "..");
process.env.DIST = Ft.join(process.env.DIST_ELECTRON, "dist");
process.env.VITE_PUBLIC = St.isPackaged ? process.env.DIST : Ft.join(process.env.DIST_ELECTRON, "public");
const _e = process.env.API_URL || (St.isPackaged, "http://91.98.128.189:3001");
console.log("API URL initialized as:", _e);
let Te;
function Uc() {
  if (Te = new Mo({
    icon: Ft.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 1200,
    height: 800,
    minWidth: 1e3,
    minHeight: 700,
    frame: !1,
    titleBarStyle: "hidden",
    backgroundColor: "#0a0a0c",
    webPreferences: {
      preload: Ft.join(Fc, "preload.cjs"),
      devTools: !1
    }
  }), Te.webContents.on("devtools-opened", () => {
    Te?.webContents.closeDevTools();
  }), Le.setWindow(Te), process.env.VITE_DEV_SERVER_URL)
    console.log("Loading from Vite Dev Server:", process.env.VITE_DEV_SERVER_URL), Te.loadURL(process.env.VITE_DEV_SERVER_URL);
  else {
    const t = Ft.join(process.env.DIST, "index.html");
    console.log("Loading from file:", t), Te.loadFile(t);
  }
}
St.on("window-all-closed", () => {
  process.platform !== "darwin" && (St.quit(), Te = null);
});
St.on("activate", () => {
  Mo.getAllWindows().length === 0 && Uc();
});
ve.on("window-controls", (t, o) => {
  const l = Mo.fromWebContents(t.sender);
  l && (o === "minimize" && l.minimize(), o === "maximize" && (l.isMaximized() ? l.unmaximize() : l.maximize()), o === "close" && l.close());
});
async function be(t, o = {}, l = 1, u = 15e3) {
  for (let n = 0; n < l; n++)
    try {
      const i = new AbortController(), e = setTimeout(() => i.abort(), u), f = await fetch(t, {
        ...o,
        signal: i.signal
      });
      if (clearTimeout(e), !f.ok && f.status !== 400 && f.status !== 404)
        throw new Error(`HTTP error! status: ${f.status} `);
      return await f.json();
    } catch (i) {
      const e = n === l - 1;
      if (console.error(`Request failed for ${t}(Attempt ${n + 1}/${l}): `, i.message), e)
        return { success: !1, error: i.message };
      await new Promise((f) => setTimeout(f, 1e3 * Math.pow(2, n)));
    }
}
ve.handle("auth:register", async (t, o) => await be(`${_e}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("auth:login", async (t, o) => await be(`${_e}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("user:get", async (t, o) => await be(`${_e}/api/users/${o}`));
ve.handle("user:update-profile", async (t, o) => await be(`${_e}/api/users/${o.uuid}/profile`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("user:update-settings", async (t, o) => await be(`${_e}/api/users/${o.userUuid}/settings`, {
  method: "POST",
  // or PUT depending on your API
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ settings: o.settings })
}));
ve.handle("user:update-preferences", async (t, o, l) => {
  let u, n;
  return typeof o == "string" ? (u = o, n = l) : (u = o.uuid, n = o), await be(`${_e}/api/users/${u}/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(n)
  });
});
ve.handle("accounts:get", async (t, o) => {
  const l = await be(`${_e}/api/accounts?userUuid=${o}`);
  return Array.isArray(l) ? l : [];
});
ve.handle("accounts:add", async (t, o) => await be(`${_e}/api/accounts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("accounts:get-all", async (t, o) => {
  const l = await be(`${_e}/api/accounts?userUuid=${o}`);
  return { success: !0, accounts: Array.isArray(l) ? l : [] };
});
ve.handle("accounts:bulk-add", async (t, o) => await be(`${_e}/api/accounts/bulk`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("accounts:bulk-update", async (t, o, { accountIds: l, updateData: u }) => await be(`${_e}/api/accounts/bulk-update`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ accountIds: l, updateData: u })
}));
ve.handle("accounts:bulk-update-group", async (t, o, { targetGroup: l, newGroup: u }) => await be(`${_e}/api/accounts/bulk-update-group`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userUuid: o, targetGroup: l, newGroup: u })
}));
ve.handle("accounts:delete", async (t, o) => await be(`${_e}/api/accounts/${o}`, { method: "DELETE" }));
ve.handle("accounts:update", async (t, o) => await be(`${_e}/api/accounts/${o.id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("accounts:update-strategy", async (t, o) => await be(`${_e}/api/accounts/strategy`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("accounts:login", async (t, o) => {
  try {
    const l = typeof o == "string" ? o : o.id, u = typeof o == "object" ? !!o.autoClose : !1, n = await be(`${_e}/api/accounts/${l}`);
    if (!n || !n._id) return { success: !1, error: "Conta não encontrada" };
    let i = null;
    if (n.proxy && n.proxy.toLowerCase() !== "sem proxy") {
      const c = n.proxy.trim().split(":").map((p) => p.trim());
      c.length >= 2 && (i = {
        proxy_address: c[0].replace(/^https?:\/\//i, ""),
        port: c[1],
        username: c[2] || void 0,
        password: c[3] || void 0
      });
    }
    let e = {}, f = {};
    try {
      const d = await be(`${_e}/api/users/${n.user || n.userUuid}`);
      d && d.globalSettings && (e = d.globalSettings, f = d.preferences || {});
    } catch (d) {
      console.error("Failed to fetch user settings for automation:", d);
    }
    const r = {
      config: {
        name: n.name,
        password: n.password,
        server: { domain: n.server },
        world: { domain: n.world },
        proxy: i,
        cookies: n.cookies || [],
        userUuid: n.user || n.userUuid,
        accountId: n._id,
        apiUrl: _e,
        globalSettings: e,
        discordWebhook: n.discordWebhook || f.discordWebhook || e.discordWebhook,
        lastCaptchaNotification: n.lastCaptchaNotification || 0
      },
      browser: {
        closeSession: u,
        closeCaptcha: !1
      },
      onStatusUpdate: (d) => {
        Te && !Te.isDestroyed() && Te.webContents.send("automation-status", { accountId: l, message: d });
      },
      onDebugData: (d, c) => {
        Te && !Te.isDestroyed() && Te.webContents.send("automation-debug", { accountId: l, type: d, data: c });
      },
      onCaptchaUpdate: async (d) => {
        console.log(`[Main] Captcha status update for ${l}: ${d}`);
        try {
          await be(`${_e}/api/accounts/${l}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hasCaptcha: d })
          });
        } catch (c) {
          console.error(`[Main] Failed to update captcha status for ${l}:`, c.message);
        }
      }
    }, a = await new Dr(r).start();
    if (a && a.cookies) {
      const d = a.cookies.some((g) => g.name?.toLowerCase() === "sid"), c = a.cookies.some((g) => g.name?.toLowerCase().includes("auth")), p = {
        id: n._id,
        cookies: a.cookies,
        status: d || c ? "Ativo" : "Offline"
      };
      if (a.data) {
        const g = a.data;
        g.units && (p.units = g.units), p.resources = g.resources, p.farm = g.farm, p.incoming = g.incoming || 0, p.points = g.points || 0, p.premiumPoints = g.premiumPoints || 0, p.hasCaptcha = g.hasCaptcha || !1;
      }
      const y = await be(`${_e}/api/accounts/${n._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      return y.success === !1 ? { success: !1, error: `Falha ao salvar dados: ${y.error}` } : !d && !c ? (console.log("Session missing. Available cookies:", a.cookies.map((g) => g.name)), { success: !1, error: "Sessão não encontrada" }) : { success: !0, cookies: a.cookies, account: { ...n, ...p } };
    } else
      return { success: !1, error: "Falha ao realizar login ou capturar cookies" };
  } catch (l) {
    return { success: !1, error: l.message };
  }
});
ve.handle("proxies:get", async (t, o) => {
  const l = await be(`${_e}/api/proxies?userUuid=${o}`);
  return Array.isArray(l) ? l : [];
});
ve.handle("proxies:add", async (t, o) => await be(`${_e}/api/proxies`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("proxies:delete", async (t, o) => await be(`${_e}/api/proxies/${o}`, { method: "DELETE" }));
ve.handle("proxies:delete-all", async (t, o) => {
  const l = `${_e}/api/proxy/bulk-delete?userUuid=${o}`;
  return console.log("Fetching bulk delete URL:", l), await be(l, { method: "DELETE" });
});
ve.handle("proxies:auto-assign", async (t, { userUuid: o, allowReuse: l }) => {
  try {
    const [u, n] = await Promise.all([
      be(`${_e}/api/accounts?userUuid=${o}`),
      be(`${_e}/api/proxies?userUuid=${o}`)
    ]);
    if (!Array.isArray(u) || !Array.isArray(n))
      return { success: !1, error: "Falha ao buscar dados." };
    const i = /* @__PURE__ */ new Map();
    u.forEach((a) => {
      if (a.proxy && typeof a.proxy == "string" && !a.proxy.toLowerCase().includes("sem proxy")) {
        const d = a.proxy.split(":")[0].trim();
        i.has(d) || i.set(d, /* @__PURE__ */ new Set());
        const c = a.worldPrefix ? a.worldPrefix.toLowerCase() : "unknown";
        i.get(d).add(c);
      }
    });
    const e = u.filter(
      (a) => !a.proxy || a.proxy.trim() === "" || /sem\s*proxy/i.test(a.proxy)
    );
    if (e.length === 0)
      return { success: !0, count: 0, message: "Todas as contas já possuem proxy configurado." };
    let f = 0;
    const r = [], s = (a) => {
      const d = n.find((c) => {
        const p = c.address.split(":")[0].trim();
        return !i.has(p);
      });
      if (d) return d;
      if (l) {
        const c = a ? a.toLowerCase() : "unknown";
        return n.find((y) => {
          const g = y.address.split(":")[0].trim(), m = i.get(g);
          return m && !m.has(c);
        });
      }
      return null;
    };
    for (const a of e) {
      const d = a.worldPrefix || "", c = s(d);
      if (!c)
        continue;
      const p = c.address.split(":")[0].trim();
      i.has(p) || i.set(p, /* @__PURE__ */ new Set()), i.get(p).add(d ? d.toLowerCase() : "unknown");
      let y = c.address.trim();
      (y.match(/:/g) || []).length < 2 && (y = `${c.address}:${c.port || ""}:${c.username || ""}:${c.password || ""}`), r.push(be(`${_e}/api/accounts/${a._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proxy: y })
      })), f++;
    }
    return await Promise.all(r), f === 0 && e.length > 0 ? {
      success: !0,
      count: 0,
      message: l ? "Não há proxies compatíveis disponíveis (todos em uso no mesmo mundo)." : "Não há proxies livres disponíveis. Tente habilitar a reutilização."
    } : { success: !0, count: f };
  } catch (u) {
    return { success: !1, error: u.message };
  }
});
ve.handle("construction:get-models", async (t, o) => await be(`${_e}/api/users/${o}/construction/models`));
ve.handle("construction:save-model", async (t, { userUuid: o, model: l }) => await be(`${_e}/api/users/${o}/construction/models`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ model: l })
}));
ve.handle("construction:delete-model", async (t, { userUuid: o, modelUuid: l }) => await be(`${_e}/api/users/${o}/construction/models/${l}`, {
  method: "DELETE"
}));
ve.handle("construction:get-settings", async (t, o) => await be(`${_e}/api/users/${o}/settings`));
ve.handle("construction:save-settings", async (t, { userUuid: o, settings: l }) => await be(`${_e}/api/users/${o}/settings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ settings: l })
}));
ve.handle("recruitment:get-models", async (t, o) => await be(`${_e}/api/users/${o}/recruitment/models`));
ve.handle("recruitment:save-model", async (t, { userUuid: o, model: l }) => await be(`${_e}/api/users/${o}/recruitment/models`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ model: l })
}));
ve.handle("recruitment:delete-model", async (t, { userUuid: o, modelUuid: l }) => await be(`${_e}/api/users/${o}/recruitment/models/${l}`, {
  method: "DELETE"
}));
ve.handle("recruitment:get-settings", async (t, o) => await be(`${_e}/api/users/${o}/settings`));
ve.handle("recruitment:save-settings", async (t, { userUuid: o, settings: l }) => await be(`${_e}/api/users/${o}/settings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ settings: l })
}));
ve.handle("scavenge:save-settings", async (t, { userUuid: o, settings: l }) => await be(`${_e}/api/users/${o}/settings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ settings: l })
}));
ve.handle("premiumExchange:save-settings", async (t, { userUuid: o, settings: l }) => await be(`${_e}/api/users/${o}/settings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ settings: l })
}));
ve.handle("billing:validate-coupon", async (t, o) => await be(`${_e}/billing/validate-coupon`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("billing:purchase", async (t, o) => await be(`${_e}/billing/purchase`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("proxies:get-stock", async () => await be(`${_e}/api/proxies/stock`));
ve.handle("proxies:import-stock", async (t, o) => await be(`${_e}/api/proxies/stock`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(o)
}));
ve.handle("payments:create", async (t, o) => {
  try {
    const l = await be(`${_e}/billing/preference`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(o)
    });
    return l.init_point ? (If.openExternal(l.init_point), { success: !0, url: l.init_point }) : { success: !1, error: "Falha ao obter URL de pagamento." };
  } catch (l) {
    return { success: !1, error: l.message };
  }
});
ve.handle("automation:get-servers", async (t, o) => await qh(o));
ve.handle("automation:process-file", async (t, o) => kh(o));
ve.handle("automation:start-playwright", async (t, o) => {
  try {
    return await Dr.init(o);
  } catch (l) {
    return { success: !1, error: l.message };
  }
});
ve.on("scheduler:init", (t, { uuid: o, mode: l }) => {
  Le.init(o, l);
});
ve.on("scheduler:stop", (t, o) => {
  Le.stop(o);
});
ve.on("scheduler:stop-all", () => {
  Le.stopAll();
});
function Bh() {
  zt.transports.file.level = "info", tt.autoUpdater.logger = zt, tt.autoUpdater.autoDownload = !1, tt.autoUpdater.autoInstallOnAppQuit = !1, zt.info("App starting...");
  const t = (o, l = null) => {
    zt.info(o), Te && !Te.isDestroyed() && Te.webContents.send("updater:status", { text: o, data: l });
  };
  tt.autoUpdater.on("checking-for-update", () => {
    t("Checking for update..."), Te && !Te.isDestroyed() && Te.webContents.send("updater:event", { type: "checking" });
  }), tt.autoUpdater.on("update-available", (o) => {
    t("Update available.", o), Te && !Te.isDestroyed() && Te.webContents.send("updater:event", { type: "available", info: o });
  }), tt.autoUpdater.on("update-not-available", (o) => {
    t("Update not available.", o), Te && !Te.isDestroyed() && Te.webContents.send("updater:event", { type: "not-available", info: o });
  }), tt.autoUpdater.on("error", (o) => {
    t("Error in auto-updater. " + o), Te && !Te.isDestroyed() && Te.webContents.send("updater:event", { type: "error", error: o.message });
  }), tt.autoUpdater.on("download-progress", (o) => {
    let l = "Download speed: " + o.bytesPerSecond;
    l = l + " - Downloaded " + o.percent + "%", l = l + " (" + o.transferred + "/" + o.total + ")", t(l), Te && !Te.isDestroyed() && Te.webContents.send("updater:event", { type: "progress", info: o });
  }), tt.autoUpdater.on("update-downloaded", (o) => {
    t("Update downloaded", o), Te && !Te.isDestroyed() && Te.webContents.send("updater:event", { type: "downloaded", info: o });
  }), ve.handle("updater:check", () => {
    tt.autoUpdater.checkForUpdates().catch((o) => zt.error("Error checking for updates:", o));
  }), ve.handle("updater:download", () => {
    tt.autoUpdater.downloadUpdate().catch((o) => zt.error("Error downloading update:", o));
  }), ve.handle("updater:install", () => {
    tt.autoUpdater.quitAndInstall();
  }), ve.handle("app:get-version", () => St.getVersion());
}
St.whenReady().then(() => {
  Uc(), Bh();
});
