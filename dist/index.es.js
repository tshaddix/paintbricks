function g(e, t) {
  return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2));
}
function y(e, t) {
  const i = g(e, t), o = {
    x: t.x - e.x,
    y: t.y - e.y
  };
  return {
    x: o.x / i,
    y: o.y / i
  };
}
class k {
  constructor(t) {
    this.canvas = t, this.lastTouch = null, this.sensitivity = 20, this.lastStrokeParts = [], this.onStrokePartHandlers = [], this.onTouchStart = this.onTouchStart.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this), this.onTouchCancel = this.onTouchCancel.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.destroy = this.destroy.bind(this), this.getRelativePosition = this.getRelativePosition.bind(this), this.canvas.addEventListener("touchstart", this.onTouchStart, {
      passive: !1
    }), this.canvas.addEventListener("touchend", this.onTouchEnd, {
      passive: !1
    }), this.canvas.addEventListener("touchcancel", this.onTouchCancel, {
      passive: !1
    }), this.canvas.addEventListener("touchmove", this.onTouchMove, {
      passive: !1
    });
  }
  /**
   * Registers a handler to be fired on a new stroke part
   * @param handler
   */
  onStrokePart(t) {
    this.onStrokePartHandlers.push(t);
  }
  /**
   * Removes all active listeners
   */
  destroy() {
    this.onStrokePartHandlers = [], this.lastStrokeParts = [], this.canvas.removeEventListener("touchstart", this.onTouchStart), this.canvas.removeEventListener("touchend", this.onTouchEnd), this.canvas.removeEventListener("touchcancel", this.onTouchCancel), this.canvas.removeEventListener("touchmove", this.onTouchMove);
  }
  /**
   * Get relative position to canvas
   * @param clientX
   * @param clientY
   * @returns IPoint
   */
  getRelativePosition(t, i) {
    const o = this.canvas.getBoundingClientRect();
    return {
      x: t - o.left,
      y: i - o.top
    };
  }
  /**
   * Creates a new touch if one does not
   * already exist
   * @param e
   */
  onTouchStart(t) {
    if (t.preventDefault(), this.lastTouch)
      return;
    const o = t.changedTouches.item(0);
    this.lastTouch = {
      id: o.identifier,
      position: this.getRelativePosition(o.clientX, o.clientY)
    };
  }
  /**
   * Creates a line from last touch to current touch
   * point and emits event. Does no-op if no existing touch
   * @param e
   */
  onTouchMove(t) {
    if (t.preventDefault(), !this.lastTouch)
      return;
    const i = t.changedTouches, o = Array.from(i).find((a) => a.identifier === this.lastTouch.id);
    if (!o)
      return;
    const n = {
      id: o.identifier,
      position: this.getRelativePosition(o.clientX, o.clientY)
    };
    if (this.sensitivity && g(n.position, this.lastTouch.position) < 10 / this.sensitivity)
      return;
    const s = {
      endPoint: n.position,
      startPoint: this.lastTouch.position,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: !1
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(s);
    }), this.lastTouch = n, this.lastStrokeParts.push(s);
  }
  /**
   * Draws a line from last point to final point. Removes
   * the reference to last touch point.
   * @param e
   */
  onTouchEnd(t) {
    if (t.preventDefault(), !this.lastTouch)
      return;
    const i = t.changedTouches, o = Array.from(i).find((a) => a.identifier === this.lastTouch.id);
    if (!o)
      return;
    const n = this.getRelativePosition(o.clientX, o.clientY), s = {
      startPoint: this.lastTouch.position,
      endPoint: n,
      isStart: !1,
      isEnd: !0
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(s);
    }), this.lastTouch = null, this.lastStrokeParts = [];
  }
  /**
   * Removes the current last touch point
   * @param e
   */
  onTouchCancel(t) {
    t.preventDefault(), this.lastTouch = null, this.lastStrokeParts = [];
  }
}
class P {
  constructor(t, i, o) {
    this.canvas = t, this.canvasWidth = i, this.canvasHeight = o, this.currentTool = null, this.currentStroke = [], this.strokeManager = new k(t), this.canvasState = null, this.shouldDraw = !1, this.shouldCommit = !1;
    const n = t.getContext("2d").backingStorePixelRatio || 1, s = window.devicePixelRatio || 1;
    this.pixelRatio = s / n, this.setCanvasSize = this.setCanvasSize.bind(this), this.setTool = this.setTool.bind(this), this.destroy = this.destroy.bind(this), this.clear = this.clear.bind(this), this.draw = this.draw.bind(this), this.onStrokePart = this.onStrokePart.bind(this), this.nextAnimationFrame = window.requestAnimationFrame(this.draw), this.strokeManager.onStrokePart(this.onStrokePart), this.setCanvasSize(i, o);
  }
  /**
   * Sets the canvas desired width and height and sets transform
   * for hifi displays
   * @param width
   * @param height
   */
  setCanvasSize(t, i) {
    this.canvasWidth = t, this.canvasHeight = i;
    const { canvas: o, canvasWidth: n, canvasHeight: s, pixelRatio: a } = this, h = o.getContext("2d");
    o.width = n * a, o.height = s * a, o.style.width = n + "px", o.style.height = s + "px", h.setTransform(a, 0, 0, a, 0, 0);
  }
  /**
   * Sets the current tool for the manager
   * @param tool
   */
  setTool(t) {
    this.currentTool = t;
  }
  /**
   * Remove all event listeners
   */
  destroy() {
    window.cancelAnimationFrame(this.nextAnimationFrame), this.strokeManager.destroy();
  }
  /**
   * Clears the canvas
   */
  clear() {
    this.canvasState = null, this.currentStroke = [], this.shouldDraw = !0, this.shouldCommit = !0;
  }
  /**
   * Adds a new stroke part to the nextStrokes
   * array
   * @param strokePart
   */
  onStrokePart(t) {
    this.currentStroke.push(t), this.shouldDraw = !0, t.isEnd && (this.shouldCommit = !0);
  }
  /**
   * Draws a frame
   */
  draw() {
    this.nextAnimationFrame = window.requestAnimationFrame(this.draw);
    const t = this.canvas.getContext("2d");
    this.shouldDraw && (t.clearRect(0, 0, this.canvasWidth, this.canvasHeight), this.canvasState && t.putImageData(this.canvasState, 0, 0), this.currentTool && this.currentStroke.length && (t.save(), this.currentTool.draw(t, this.currentStroke), t.restore()), this.shouldCommit && (this.canvasState = t.getImageData(
      0,
      0,
      this.canvasWidth * this.pixelRatio,
      this.canvasHeight * this.pixelRatio
    ), this.currentStroke = [], this.shouldCommit = !1), this.shouldDraw = !1);
  }
}
class C {
  constructor(t = "red", i = 3) {
    this.color = t, this.width = i;
  }
  /**
   * Draws a "pen stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, i) {
    const o = i[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "round", t.lineJoin = "round", t.moveTo(o.startPoint.x, o.startPoint.y), i.forEach((n) => {
      const { endPoint: s } = n;
      t.lineTo(s.x, s.y);
    }), t.stroke();
  }
}
class E {
  constructor(t = 10, i) {
    this.width = t, i = i || {}, this.handleOpts = {
      hide: i.hide || !1,
      strokeWidth: i.strokeWidth || 2,
      fillColor: i.fillColor || "white",
      strokeColor: i.strokeColor || "black"
    };
  }
  /**
   * Draws an "eraser stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, i) {
    const { handleOpts: o } = this, n = this.width / 2;
    i.forEach((a) => {
      const { startPoint: h, endPoint: l, isEnd: f } = a, d = g(h, l), v = y(h, l);
      let r = h, u = 0;
      for (; u < d; ) {
        const c = {
          x: r.x + v.x,
          y: r.y + v.y
        };
        t.clearRect(
          c.x - n,
          c.y - n,
          this.width,
          this.width
        ), u++, r = c;
      }
    });
    const s = i[i.length - 1];
    !s.isEnd && !o.hide && (t.strokeStyle = o.strokeColor, t.fillStyle = o.fillColor, t.fillRect(
      s.endPoint.x - n,
      s.endPoint.y - n,
      this.width,
      this.width
    ), t.strokeRect(
      s.endPoint.x - n + 0.5,
      s.endPoint.y - n + 0.5,
      this.width - 1,
      this.width - 1
    ));
  }
}
function w(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var b = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
const p = /* @__PURE__ */ w(b);
var m = {
  red: 0,
  orange: 60,
  yellow: 120,
  green: 180,
  blue: 240,
  purple: 300
};
function T(e) {
  var t, i = [], o = 1, n;
  if (typeof e == "string")
    if (e = e.toLowerCase(), p[e])
      i = p[e].slice(), n = "rgb";
    else if (e === "transparent")
      o = 0, n = "rgb", i = [0, 0, 0];
    else if (/^#[A-Fa-f0-9]+$/.test(e)) {
      var s = e.slice(1), a = s.length, h = a <= 4;
      o = 1, h ? (i = [
        parseInt(s[0] + s[0], 16),
        parseInt(s[1] + s[1], 16),
        parseInt(s[2] + s[2], 16)
      ], a === 4 && (o = parseInt(s[3] + s[3], 16) / 255)) : (i = [
        parseInt(s[0] + s[1], 16),
        parseInt(s[2] + s[3], 16),
        parseInt(s[4] + s[5], 16)
      ], a === 8 && (o = parseInt(s[6] + s[7], 16) / 255)), i[0] || (i[0] = 0), i[1] || (i[1] = 0), i[2] || (i[2] = 0), n = "rgb";
    } else if (t = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(e)) {
      var l = t[1], f = l === "rgb", s = l.replace(/a$/, "");
      n = s;
      var a = s === "cmyk" ? 4 : s === "gray" ? 1 : 3;
      i = t[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(r, u) {
        if (/%$/.test(r))
          return u === a ? parseFloat(r) / 100 : s === "rgb" ? parseFloat(r) * 255 / 100 : parseFloat(r);
        if (s[u] === "h") {
          if (/deg$/.test(r))
            return parseFloat(r);
          if (m[r] !== void 0)
            return m[r];
        }
        return parseFloat(r);
      }), l === s && i.push(1), o = f || i[a] === void 0 ? 1 : i[a], i = i.slice(0, a);
    } else
      e.length > 10 && /[0-9](?:\s|\/)/.test(e) && (i = e.match(/([0-9]+)/g).map(function(d) {
        return parseFloat(d);
      }), n = e.match(/([a-z])/ig).join("").toLowerCase());
  else
    isNaN(e) ? Array.isArray(e) || e.length ? (i = [e[0], e[1], e[2]], n = "rgb", o = e.length === 4 ? e[3] : 1) : e instanceof Object && (e.r != null || e.red != null || e.R != null ? (n = "rgb", i = [
      e.r || e.red || e.R || 0,
      e.g || e.green || e.G || 0,
      e.b || e.blue || e.B || 0
    ]) : (n = "hsl", i = [
      e.h || e.hue || e.H || 0,
      e.s || e.saturation || e.S || 0,
      e.l || e.lightness || e.L || e.b || e.brightness
    ]), o = e.a || e.alpha || e.opacity || 1, e.opacity != null && (o /= 100)) : (n = "rgb", i = [e >>> 16, (e & 65280) >>> 8, e & 255]);
  return {
    space: n,
    values: i,
    alpha: o
  };
}
function S(e, t) {
  var i = T(e);
  return t == null && (t = i.alpha), i.space[0] === "h" ? i.space + ["a(", i.values[0], ",", i.values[1], "%,", i.values[2], "%,", t, ")"].join("") : i.space + ["a(", i.values, ",", t, ")"].join("");
}
class R {
  constructor(t = "yellow", i = 8, o = 0.3) {
    this.width = i, this.color = S(t, 0.4);
  }
  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, i) {
    const o = i[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "butt", t.miterLimit = 1, t.moveTo(o.startPoint.x, o.startPoint.y), i.forEach((n) => {
      const { endPoint: s } = n;
      t.lineTo(s.x, s.y);
    }), t.stroke();
  }
}
export {
  E as EraserTool,
  R as HighlighterTool,
  P as Manager,
  C as PenTool
};
//# sourceMappingURL=index.es.js.map
