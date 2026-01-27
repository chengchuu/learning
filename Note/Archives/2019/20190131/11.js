(function(e) {
  function t(t) {
    for (var n, s, c = t[0], i = t[1], u = t[2], d = 0, m = []; d < c.length; d++) s = c[d], o[s] && m.push(o[s][0]), o[s] = 0;
    for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
    l && l(t);
    while (m.length) m.shift()();
    return r.push.apply(r, u || []), a()
  }
  function a() {
    for (var e, t = 0; t < r.length; t++) {
      for (var a = r[t], n = !0, c = 1; c < a.length; c++) {
        var i = a[c];
        0 !== o[i] && (n = !1)
      }
      n && (r.splice(t--, 1), e = s(s.s = a[0]))
    }
    return e
  }
  var n = {},
    o = {
      "pages-hot-index": 0
    },
    r = [];

  function s(t) {
    if (n[t]) return n[t].exports;
    var a = n[t] = {
      i: t,
      l: !1,
      exports: {}
    };
    return e[t].call(a.exports, a, a.exports, s), a.l = !0, a.exports
  }
  s.m = e, s.c = n, s.d = function(e, t, a) {
    s.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: a
    })
  }, s.r = function(e) {
    "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    })
  }, s.t = function(e, t) {
    if (1 & t && (e = s(e)), 8 & t) return e;
    if (4 & t && "object" === typeof e && e && e.__esModule) return e;
    var a = Object.create(null);
    if (s.r(a), Object.defineProperty(a, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var n in e) s.d(a, n, function(t) {
      return e[t]
    }.bind(null, n));
    return a
  }, s.n = function(e) {
    var t = e && e.__esModule ?
      function() {
        return e["default"]
      } : function() {
        return e
      };
    return s.d(t, "a", t), t
  }, s.o = function(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }, s.p = "../../";
  var c = window["webpackJsonp"] = window["webpackJsonp"] || [],
    i = c.push.bind(c);
  c.push = t, c = c.slice();
  for (var u = 0; u < c.length; u++) t(c[u]);
  var l = i;
  r.push([1, "chunk-vendors", "chunk-common"]), a()
})({
  "01d4": function(e, t, a) {
    (function(t) {
      "use strict";
      var a, n = t.Base64,
        o = "2.1.9",
        r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        s = function(e) {
          for (var t = {}, a = 0, n = e.length; a < n; a++) t[e.charAt(a)] = a;
          return t
        }(r),
        c = String.fromCharCode,
        i = function(e) {
          if (e.length < 2) {
            var t = e.charCodeAt(0);
            return t < 128 ? e : t < 2048 ? c(192 | t >>> 6) + c(128 | 63 & t) : c(224 | t >>> 12 & 15) + c(128 | t >>> 6 & 63) + c(128 | 63 & t)
          }
          t = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
          return c(240 | t >>> 18 & 7) + c(128 | t >>> 12 & 63) + c(128 | t >>> 6 & 63) + c(128 | 63 & t)
        },
        u = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
        l = function(e) {
          return e.replace(u, i)
        },
        d = function(e) {
          var t = [0, 2, 1][e.length % 3],
            a = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0),
            n = [r.charAt(a >>> 18), r.charAt(a >>> 12 & 63), t >= 2 ? "=" : r.charAt(a >>> 6 & 63), t >= 1 ? "=" : r.charAt(63 & a)];
          return n.join("")
        },
        m = t.btoa ?
          function(e) {
            return t.btoa(e)
          } : function(e) {
            return e.replace(/[\s\S]{1,3}/g, d)
          }, h = a ?
        function(e) {
          return (e.constructor === a.constructor ? e : new a(e)).toString("base64")
        } : function(e) {
          return m(l(e))
        }, g = function(e, t) {
          return t ? h(String(e)).replace(/[+\/]/g, function(e) {
            return "+" == e ? "-" : "_"
          }).replace(/=/g, "") : h(String(e))
        }, f = function(e) {
          return g(e, !0)
        }, p = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g"), v = function(e) {
          switch (e.length) {
            case 4:
              var t = (7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3),
                a = t - 65536;
              return c(55296 + (a >>> 10)) + c(56320 + (1023 & a));
            case 3:
              return c((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));
            default:
              return c((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1))
          }
        }, b = function(e) {
          return e.replace(p, v)
        }, C = function(e) {
          var t = e.length,
            a = t % 4,
            n = (t > 0 ? s[e.charAt(0)] << 18 : 0) | (t > 1 ? s[e.charAt(1)] << 12 : 0) | (t > 2 ? s[e.charAt(2)] << 6 : 0) | (t > 3 ? s[e.charAt(3)] : 0),
            o = [c(n >>> 16), c(n >>> 8 & 255), c(255 & n)];
          return o.length -= [0, 0, 2, 1][a], o.join("")
        }, w = t.atob ?
        function(e) {
          return t.atob(e)
        } : function(e) {
          return e.replace(/[\s\S]{1,4}/g, C)
        }, x = a ?
        function(e) {
          return (e.constructor === a.constructor ? e : new a(e, "base64")).toString()
        } : function(e) {
          return b(w(e))
        }, A = function(e) {
          return x(String(e).replace(/[-_]/g, function(e) {
            return "-" == e ? "+" : "/"
          }).replace(/[^A-Za-z0-9\+\/]/g, ""))
        }, y = function() {
          var e = t.Base64;
          return t.Base64 = n, e
        };
      if (t.Base64 = {
        VERSION: o,
        atob: w,
        btoa: m,
        fromBase64: A,
        toBase64: g,
        utob: l,
        encode: g,
        encodeURI: f,
        btou: b,
        decode: A,
        noConflict: y
      }, "function" === typeof Object.defineProperty) {
        var N = function(e) {
          return {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        };
        t.Base64.extendString = function() {
          Object.defineProperty(String.prototype, "fromBase64", N(function() {
            return A(this)
          })), Object.defineProperty(String.prototype, "toBase64", N(function(e) {
            return g(this, e)
          })), Object.defineProperty(String.prototype, "toBase64URI", N(function() {
            return g(this, !0)
          }))
        }
      }
      t["Meteor"] && (Base64 = t.Base64), e.exports && (e.exports.Base64 = t.Base64)
    })(window)
  },
  1: function(e, t, a) {
    e.exports = a("375d")
  },
  "375d": function(e, t, a) {
    "use strict";
    a.r(t);
    a("cadf"), a("551c"), a("097d");
    var n = a("2b0e"),
      o = function() {
        var e = this,
          t = e.$createElement,
          n = e._self._c || t;
        return n("div", {
          staticClass: "center-hot-game"
        }, [n("div", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: !0,
            expression: "true"
          }],
          staticClass: "hot-game-search"
        }, [n("input", {
          directives: [{
            name: "model",
            rawName: "v-model",
            value: e.gameSearchText,
            expression: "gameSearchText"
          }],
          staticClass: "search-input",
          attrs: {
            type: "text",
            placeholder: "搜索你感兴趣的内容"
          },
          domProps: {
            value: e.gameSearchText
          },
          on: {
            input: function(t) {
              t.target.composing || (e.gameSearchText = t.target.value)
            }
          }
        }), n("button", {
          staticClass: "search-btn",
          attrs: {
            type: "button"
          },
          on: {
            touchstart: e.gameSearch
          }
        }, [n("img", {
          attrs: {
            src: a("ef21")
          }
        })])]), n("div", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: e.modules.searchResultsNone,
            expression: "modules.searchResultsNone"
          }],
          staticClass: "hot-game-search-none"
        }, [n("img", {
          staticClass: "no-result-img",
          attrs: {
            src: "https://static-oss.qutoutiao.net/game/im_no_result_default.svg"
          }
        }), n("span", {
          staticClass: "no-result-des"
        }, [e._v("没有搜索到相关游戏哦～")])]), n("div", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: e.modules.searchResults,
            expression: "modules.searchResults"
          }],
          staticClass: "hot-game-search-list"
        }, [e._m(0), n("div", {
          staticClass: "search-results"
        }, e._l(e.gameSearchResults, function(t) {
          return n("div", {
            staticClass: "result-item"
          }, [n("div", {
            staticClass: "result-item-des"
          }, [n("img", {
            staticClass: "result-game-logo",
            attrs: {
              src: t.iconUrl
            }
          }), n("div", {
            staticClass: "result-game-des"
          }, [n("span", {
            staticClass: "result-game-des-title"
          }, [e._v(e._s(t.appName))]), n("span", {
            staticClass: "result-game-des-text"
          }, [e._v(e._s(t.shortDesc))])])]), n("button", {
            staticClass: "result-game-btn",
            attrs: {
              type: "button"
            },
            on: {
              touchstart: function(a) {
                e.jumpToSdk(t.apkUrl, {
                  module: "search",
                  gameName: t.appName,
                  catName: "搜索列表"
                })
              }
            }
          }, [e._v("立即下载")])])
        }), 0), e.gameSearchs.hasNext ? n("div", {
          staticClass: "search-more",
          on: {
            touchstart: function(t) {
              e.gameSearch({
                contextData: e.gameSearchs.contextData
              })
            }
          }
        }, [n("span", {
          staticClass: "search-more-text"
        }, [e._v("查看更多")]), n("img", {
          staticClass: "search-more-icon",
          attrs: {
            src: a("d4ff")
          }
        })]) : e._e()]), n("div", {
          directives: [{
            name: "show",
            rawName: "v-show",
            value: e.modules.homeRank || e.modules.gamesMore,
            expression: "modules.homeRank || modules.gamesMore"
          }],
          staticClass: "hot-game-list",
          class: {
            "is-more": e.modules.gamesMore
          }
        }, e._l(e.gameCats, function(t) {
          return n("div", {
            staticClass: "game-module"
          }, [n("header", {
            staticClass: "game-module-header"
          }, [n("span", {
            staticClass: "game-module-title"
          }, [e._v(e._s(t.catName))]), t.hasNext && e.modules.homeRank ? n("span", {
            staticClass: "game-module-more",
            on: {
              touchstart: function(a) {
                e.searchRank({
                  catName: t.catName,
                  sceneId: t.sceneId,
                  categoryId: t.categoryId,
                  parentId: t.parentId
                })
              }
            }
          }, [e._v("更多>")]) : e._e(), e.modules.gamesMore ? n("span", {
            staticClass: "game-module-more",
            on: {
              touchstart: function(t) {
                e.searchRank()
              }
            }
          }, [e._v("<返回")]) : e._e()]), n("div", {
            staticClass: "game-module-list"
          }, e._l(t.list, function(a) {
            return n("div", {
              staticClass: "game-item"
            }, [n("div", {
              staticClass: "game-logo",
              style: {
                backgroundImage: "url(" + a.iconUrl + ")"
              }
            }), n("span", {
              staticClass: "game-name"
            }, [e._v(e._s(a.appName))]), n("span", {
              staticClass: "game-download-count"
            }, [e._v(e._s(e.clipAppDownCount(a.appDownCount || a.totalDownloadTimes)) + "万次下载")]), n("button", {
              staticClass: "game-download-btn",
              attrs: {
                type: "button"
              },
              on: {
                touchstart: function(n) {
                  e.jumpToSdk(a.apkUrl, {
                    module: e.modules.homeRank ? "home" : "more",
                    gameName: a.appName,
                    catName: t.catName
                  })
                }
              }
            }, [e._v("立即下载")])])
          }), 0), e.modules.gamesMore && t.hasNext ? n("div", {
            staticClass: "search-more",
            on: {
              touchstart: function(a) {
                e.searchRank({
                  catName: t.catName,
                  sceneId: t.sceneId,
                  categoryId: t.categoryId,
                  parentId: t.parentId,
                  pageContext: t.pageContext,
                  contextData: t.contextData
                })
              }
            }
          }, [n("span", {
            staticClass: "search-more-text"
          }, [e._v("查看更多")]), n("img", {
            staticClass: "search-more-icon",
            attrs: {
              src: a("d4ff")
            }
          })]) : e._e()])
        }), 0)])
      },
      r = [function() {
        var e = this,
          t = e.$createElement,
          a = e._self._c || t;
        return a("header", {
          staticClass: "search-list-header"
        }, [a("span", {
          staticClass: "search-list-header-title"
        }, [e._v("搜索结果")])])
      }],
      s = a("b6d0"),
      c = a.n(s),
      i = a("a4bb"),
      u = a.n(i),
      l = a("5176"),
      d = a.n(l),
      m = a("795b"),
      h = a.n(m),
      g = (a("ac6a"), a("5df3"), a("96cf"), a("3b8d")),
      f = a("f499"),
      p = a.n(f);
    "function" != typeof d.a && Object.defineProperty(Object, "assign", {
      value: function(e, t) {
        if (null == e) throw new TypeError("Cannot convert undefined or null to object");
        for (var a = Object(e), n = 1; n < arguments.length; n++) {
          var o = arguments[n];
          if (null != o) for (var r in o) Object.prototype.hasOwnProperty.call(o, r) && (a[r] = o[r])
        }
        return a
      },
      writable: !0,
      configurable: !0
    });
    a("db4d");
    var v = a("4aa6"),
      b = a.n(v),
      C = a("2d7d"),
      w = a.n(C),
      x = a("4328");
    class A {
      constructor() {}
      static get UA() {
        return navigator.userAgent
      }
      static os() {
        return A.isios() ? "ios" : "android"
      }
      static qs(e) {
        return x.parse(location.search.substring(1))[e] || ""
      }
      static inApp() {
        return -1 != A.UA.toLowerCase().indexOf("qukan")
      }
      static isios() {
        return -1 != A.UA.toLowerCase().indexOf("iphone")
      }
      static isIOS() {
        return A.isios()
      }
      static isAndroid() {
        return -1 != A.UA.toLowerCase().indexOf("android")
      }
      static getVersion() {
        return parseInt(A.qs("v")) || 0
      }
      static isWeixinBrowser() {
        return /micromessenger/i.test(navigator.userAgent)
      }
      static toqs(e) {
        var t = [];
        for (var a in e) t.push(a + "=" + encodeURIComponent(e[a]));
        return t.join("&")
      }
      static allqs() {
        for (var e = {}, t = location.search.substring(1).split("&"), a = 0, n = t.length; a < n; a++) {
          var o = t[a].split("=");
          o[0] && (e[o[0]] = o[1])
        }
        return e
      }
      static isOpenView() {
        return !!A.qs("openview")
      }
    }
    var y = a("a1db"),
      N = a.n(y),
      k = a("6d93"),
      _ = a("9c97"),
      I = N.a.getCommonMsg && N.a.getCommonMsg() || {
        version: "123",
        brand: "unknow",
        model: "123"
      },
      S = "http://newidea4-gamecenter-backend.1sapp.com/x/game-center/market",
      j = Object(_["a"])() || "2eB5L6pJrGKU9v9k-7ObA1_Va6yfnjx5msAF97T4rvgi9fOe9PqJm81oaJAFAGAMrvpU-vWg98uM-7nl-89Nu3TMuf1G-jAM-jufuGgqAo4=",
      O = function() {
        return {
          body: {},
          head: {
            businessId: "",
            callbackPara: "callback01",
            client_ip: "",
            nonce: 1,
            terminal: {
              androidId: I.version,
              imei: A.isios() ? "" : A.qs("dc"),
              macAddress: "",
              manufacture: I.brand,
              mode: I.model
            },
            timestamp: 0
          }
        }
      },
      R = {
        hasNext: !1,
        contextData: [],
        list: []
      },
      M = new w.a,
      D = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.catName,
          a = e.sceneId,
          n = e.pageContext,
          o = void 0 === n ? [] : n,
          r = e.pageSize,
          s = void 0 === r ? 4 : r,
          c = O();
        d()(c.body, {
          sceneId: a,
          pageContext: o,
          pageSize: s
        });
        var i = "".concat(S, "/get-rank-list?game_token=").concat(j);
        return new h.a(function(e) {
          J({
            method: "post",
            url: i,
            data: c
          }).then(function(n) {
            var o = n.data;
            e({
              catName: t,
              sceneId: a,
              pageContext: o.body.pageContext,
              hasNext: o.body.hasNext,
              list: o.body.appList.slice(0, s)
            })
          })
        })
      },
      B = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.catName,
          a = e.categoryId,
          n = e.parentId,
          o = e.contextData,
          r = void 0 === o ? [] : o,
          s = e.pageSize,
          c = void 0 === s ? 4 : s,
          i = e.remain,
          u = O();
        d()(u.body, {
          categoryId: a,
          parentId: n,
          contextData: r,
          pageSize: i || c
        });
        var l = "".concat(S, "/get-category-app-list?game_token=").concat(j);
        return new h.a(function(e) {
          J({
            method: "post",
            url: l,
            data: u
          }).then(function(o) {
            var r = o.data;
            e({
              categoryId: a,
              parentId: n,
              catName: t,
              contextData: r.body.contextData,
              hasNext: r.body.hasNext,
              list: r.body.appList.slice(0, c)
            })
          })
        })
      },
      T = function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = e.keyword,
          a = e.contextData,
          n = void 0 === a ? [] : a,
          o = e.pageSize,
          r = void 0 === o ? 20 : o,
          s = O();
        d()(s.body, {
          keyword: t,
          contextData: n,
          pageSize: r
        });
        var c = "".concat(S, "/search?game_token=").concat(j);
        return new h.a(function(e) {
          J({
            method: "post",
            url: c,
            data: s
          }).then(function(t) {
            var a = t.data;
            e({
              hasNext: a.body.hasNext,
              contextData: a.body.contextData,
              list: a.body.appList.slice(0, r)
            })
          })
        })
      };

    function J() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        t = e.method,
        a = void 0 === t ? "post" : t,
        n = e.url,
        o = void 0 === n ? null : n,
        r = e.data,
        s = void 0 === r ? b()(null) : r;
      return !!o && new h.a(function(e, t) {
        Object(k["a"])(o, {
          method: a,
          body: p()(s)
        }).then(function(e) {
          return e.json()
        }).then(function(a) {
          if (0 === a.code) {
            var n = a.data.body.appList;
            n.forEach(function(e) {
              var t = e.packageName || e.pkgName;
              M.has(t) || M.set(t, null)
            }), e({
              data: a.data
            })
          } else t()
        }).
        catch (function(e) {
          return t(e)
        })
      })
    }
    a("28a5"), a("4917");
    var E = {
      default:
        void 0, call: function(e, t, a) {
        var n = "";
        "function" == typeof t && (a = t, t = {});
        var o = {
          data: void 0 === t ? null : t
        };
        if ("function" == typeof a) {
          var r = "dscb" + window.dscb++;
          window[r] = a, o["_dscbstub"] = r
        }
        return o = p()(o), window._dsbridge && window._dsbridge.call ? n = _dsbridge.call(e, o) : (window._dswk || -1 != navigator.userAgent.indexOf("_dsbridge")) && (n = prompt("_dsbridge=" + e, o)), JSON.parse(n || "{}").data
      },
      hasNativeMethod: function(e, t) {
        return this.call("_dsb.hasNativeMethod", {
          name: e,
          type: t || "all"
        })
      },
      disableJavascriptDialogBlock: function(e) {
        this.call("_dsb.disableJavascriptDialogBlock", {
          disable: !1 !== e
        })
      }
    };
    !
      function() {
        if (!window._dsf) {
          var e = {
            _dsf: {
              _obs: {}
            },
            _dsaf: {
              _obs: {}
            },
            dscb: 0,
            dsBridge: E,
            close: function() {
              E.call("_dsb.closePage")
            },
            _handleMessageFromNative: function(e) {
              var t = JSON.parse(e.data),
                a = {
                  id: e.callbackId,
                  complete: !0
                },
                n = this._dsf[e.method],
                o = this._dsaf[e.method],
                r = function(e, n) {
                  a.data = e.apply(n, t), E.call("_dsb.returnValue", a)
                },
                s = function(e, n) {
                  t.push(function(e, t) {
                    a.data = e, a.complete = !1 !== t, E.call("_dsb.returnValue", a)
                  }), e.apply(n, t)
                };
              if (n) r(n, this._dsf);
              else if (o) s(o, this._dsaf);
              else {
                var c = e.method.split(".");
                if (c.length < 2) return;
                var i = c.pop(),
                  u = c.join("."),
                  l = this._dsf._obs,
                  d = l[u] || {},
                  m = d[i];
                if (m && "function" == typeof m) return void r(m, d);
                if (l = this._dsaf._obs, d = l[u] || {}, m = d[i], m && "function" == typeof m) return void s(m, d)
              }
            }
          };
          for (var t in e) window[t] = e[t]
        }
      }();
    var q = a("01d4"),
      P = a.n(q),
      F = 0,
      U = function() {
        if (E.hasNativeMethod("getCommonMsg")) {
          var e = E.call("getCommonMsg");
          return e && 1 === e.code && e.data || ""
        }
        return window.qukanClient && window.qukanClient.getCommonMsg && window.qukanClient.getCommonMsg() || ""
      },
      L = U(),
      z = (L.token, function() {
        return new h.a(function(e, t) {
          E.hasNativeMethod("newsDetailAdToSdk") && E.call("newsDetailAdToSdk", function(t) {
            e(t.data)
          })
        })
      });

    function W(e) {
      var t, a = {
        feature_id: "208,901",
        native_material: {
          c_url: e.match("http") ? e : location.protocol + e
        }
      };
      if (F) {
        if (e.match("apk")) {
          var n = e.split("?fsname=");
          n[1] && (a.native_material.app_package = n[1]), t = P.a.Base64.encode(p()({
            dmstring: P.a.Base64.encode(p()(a)),
            alter_rcv_tag: "apkdown"
          }))
        } else t = P.a.Base64.encode(p()({
          dmstring: P.a.Base64.encode(p()(a))
        }));
        var o = "aiclkdp://nsdk_innerlink/com.iclicash.advlib.ui.front.ADBrowser/" + encodeURIComponent(e.match("http") ? e : location.protocol + e) + "/" + encodeURIComponent("text/html") + "/" + t + "/";
        location.href = "goto?target=adGotoSdk&value=" + o
      } else location.href = e
    }
    z().then(function(e) {
      e.value && (F = !F)
    });
    a("ba17");
    var G = a("c2ec"),
      Q = (a("4bcb"), function(e) {
        return JSON.parse(p()(e))
      }),
      H = {
        name: "center-hot-game",
        data: function() {
          return {
            gameCats: [],
            gameSearchs: Q(R),
            gameSearchText: "",
            modules: {
              searchResults: !1,
              searchResultsNone: !1,
              homeRank: !0,
              gamesMore: !1
            },
            test: null,
            isInstall: null,
            gamesLocal: M,
            memberid: ""
          }
        },
        watch: {
          isInstall: function(e, t) {
            "boolean" === typeof e && (this.isInstall = null)
          }
        },
        computed: {
          gameSearchResults: function() {
            return this.uniqGames(this.gameSearchs.list)
          }
        },
        beforeCreate: function() {
          document.body.style.backgroundColor = "#ffffff"
        },
        created: function() {
          var e = this;
          Object(G["a"])("hot"), this.searchRank(), window.androidCheckAppCallback = function(t) {
            e.isInstall = t
          }
        },
        beforeDestroy: function() {},
        methods: {
          searchRank: function() {
            var e = Object(g["a"])(regeneratorRuntime.mark(function e() {
              var t, a, n, o, r, s, c, i, u, l, m, g, f, p, v, b = arguments;
              return regeneratorRuntime.wrap(function(e) {
                while (1) switch (e.prev = e.next) {
                  case 0:
                    if (t = b.length > 0 && void 0 !== b[0] ? b[0] : {}, a = t.catName, n = void 0 === a ? null : a, o = t.sceneId, r = t.categoryId, s = t.parentId, c = t.pageSize, i = void 0 === c ? 20 : c, u = t.pageContext, l = void 0 === u ? [] : u, m = t.contextData, g = void 0 === m ? [] : m, l.length || g.length || window.scrollTo(0, 0), f = [], !n) {
                      e.next = 20;
                      break
                    }
                    if (p = this.gameCats.reduce(function(e, t, a) {
                      return t.catName === n && (e = a), e
                    }, 0), this.chooseModules("gamesMore"), !o) {
                      e.next = 12;
                      break
                    }
                    return e.next = 9, h.a.all([D({
                      catName: n,
                      sceneId: o,
                      pageSize: i,
                      pageContext: l
                    })]);
                  case 9:
                    f = e.sent, e.next = 15;
                    break;
                  case 12:
                    return e.next = 14, h.a.all([B({
                      catName: n,
                      categoryId: r,
                      parentId: s,
                      pageSize: i,
                      contextData: g
                    })]);
                  case 14:
                    f = e.sent;
                  case 15:
                    v = this.uniqGames(this.gameCats[p].list.concat(f[0].list)), d.a ? d()(f[0], {
                      list: v
                    }) : f[0].list = v, this.gameCats = f, e.next = 25;
                    break;
                  case 20:
                    return this.chooseModules("homeRank"), e.next = 23, h.a.all([D({
                      catName: "游戏流行榜",
                      sceneId: 20
                    }), B({
                      catName: "棋牌游戏",
                      categoryId: 142,
                      parentId: -2
                    }), D({
                      catName: "游戏热销榜",
                      sceneId: 2
                    }), B({
                      catName: "休闲益智",
                      categoryId: 137,
                      parentId: -2,
                      remain: 5
                    }), D({
                      catName: "游戏新品榜",
                      sceneId: 21
                    }), B({
                      catName: "动作冒险",
                      categoryId: 140,
                      parentId: -2
                    }), B({
                      catName: "体育竞速",
                      categoryId: 141,
                      parentId: -2
                    })]);
                  case 23:
                    f = e.sent, this.gameCats = f.filter(function(e) {
                      var t = e.list;
                      return Boolean(t.length)
                    });
                  case 25:
                  case "end":
                    return e.stop()
                }
              }, e, this)
            }));

            function t() {
              return e.apply(this, arguments)
            }
            return t
          }(),
          clipAppDownCount: function(e) {
            return Math.ceil(e / 1e4)
          },
          jumpToSdk: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              a = t.module,
              n = void 0 === a ? "" : a,
              o = t.gameName,
              r = void 0 === o ? "" : o,
              s = t.catName,
              c = void 0 === s ? "" : s;
            Object(G["b"])(80002, {
              module: n,
              gameName: r,
              catName: c
            }), W(e)
          },
          gameSearch: function() {
            var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
              a = t.contextData,
              n = void 0 === a ? [] : a;
            this.$nextTick(function() {}), this.gameSearchText && (this.chooseModules("searchResults"), n.length || (this.gameSearchs = Q(R), window.scrollTo(0, 0)), T({
              keyword: this.gameSearchText,
              contextData: n
            }).then(function(t) {
              e.gameSearchs.list.length ? Object(G["b"])(80001, {
                module: "searchMore"
              }) : Object(G["b"])(80001, {
                module: "search"
              });
              var a = e.gameSearchs.list.concat(t.list);
              d.a ? e.gameSearchs = d()(t, {
                list: a
              }) : e.gameSearchs = t.list = a, a.length || e.chooseModules("searchResultsNone")
            }))
          },
          chooseModules: function(e) {
            var t = this;
            u()(this.modules).forEach(function(a) {
              t.modules[a] = a === e
            })
          },
          uniqGames: function(e) {
            var t = new c.a;
            return e.reduce(function(e, a) {
              return t.has(a.appName) || e.push(a), t.add(a.appName), e
            }, [])
          }
        }
      },
      V = H,
      Z = a("2877"),
      Y = Object(Z["a"])(V, o, r, !1, null, null, null);
    Y.options.__file = "index.vue";
    var K = Y.exports;
    a("8c1b");
    n["a"].config.productionTip = !1, new n["a"]({
      el: "#app",
      render: function(e) {
        return e(K)
      }
    })
  },
  d4ff: function(e, t) {
    e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC70lEQVRoQ+1WQU8TURCeebYlLYSoMRK4cDIm1sQDB6QHpEtt2qqJkZsmehEuyB/wgImJ/gGIBzx5MJ4QY4TWTbtLUcPFgx7qxZMXkZMxMRhpeWN2saaU7vbtvt0SzPbane/NN/N9M4NwyH94yPOHgMBBdzDoQNAByQoEEpIsoHR40AHpEkoC/D8dICJWKJeGkaC7tyv2LpFI/JIsjqfhRISFcuk8B+g5Fom9redndkDX9RNbVH0FBMPmq4jfjgDczigXlz3NwiWYWlZPVXfgGRAM7ULgJjC6fCmZfm8SyGvqPCeYbsLnyHA2O5Z6iIjk8m3psLym5jjgUyA62giGCJWckj5rEljW1A9AcK7la4jPYxi6lUwmf0pn4wDAkEx+tXiXON0HANYqtDcSPW4SWCmpLwngihU+An4Khehq+kL6s4McXH+q63rPFtWeANE1SxCE7zEMnzQJvNa0oRrsvAGiqA2JH4h0PaukV1xnJhBo6L1WwxcEdMbuc4ZsOqukHv0bo/nV4ghxvkgE/TaBvvrCSu9N+WwzZDNZJbVg2rnxz8LaWj+v/l4koBE79giwFGXhm175QkTvu8MRNpCxiexYar2e375FVqlUIl82v84T0aQ9CW98IaR3s9K4zsJdE5nR0Y0908gqybxWnOLE5wAg4pcvRPWOiI8H+wbuxOPx7eZcbE8JP33hRu+tCtn2FvLaFzJ6d0XACPrrizkimpLxhazeXROoB4r6giHcaL6jHOh9YbBvYKaV3qUJGACivmCA9zJK6oFxR3mld08IGCBOfIEMP3JOs1b3jNV8F1ja5idtTWwFJOqLdolYzfd2cZaLTDTQiS8s9wiiI717JqFmIEFfNIbtuWecFk1oEzsFFfZFi3vG6Vu+EBDZF7J6901C+yTV4o5CD/TeMQLmvtC000R8EoC6AdhSbnxclZGK5SDwA7STmK73QCeTtHsrIHDQnQg6EHRAsgKBhCQLKB0edEC6hJIAQQckCygd/gcUaYnbWer7SgAAAABJRU5ErkJggg=="
  },
  ef21: function(e, t, a) {
    e.exports = a.p + "img/search.ac07131f.svg"
  }
});
//# sourceMappingURL=pages-hot-index.907ad00b.js.map
