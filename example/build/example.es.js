function v(e, t) {
  return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2));
}
function w(e, t) {
  const i = v(e, t), n = {
    x: t.x - e.x,
    y: t.y - e.y
  };
  return {
    x: n.x / i,
    y: n.y / i
  };
}
class b {
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
    const n = this.canvas.getBoundingClientRect();
    return {
      x: t - n.left,
      y: i - n.top
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
    const i = t.changedTouches.item(0);
    this.lastTouch = {
      id: i.identifier,
      position: this.getRelativePosition(i.clientX, i.clientY)
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
    const i = t.changedTouches, n = Array.from(i).find((a) => a.identifier === this.lastTouch.id);
    if (!n)
      return;
    const o = {
      id: n.identifier,
      position: this.getRelativePosition(n.clientX, n.clientY)
    };
    if (this.sensitivity && v(o.position, this.lastTouch.position) < 10 / this.sensitivity)
      return;
    const s = {
      endPoint: o.position,
      startPoint: this.lastTouch.position,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: !1
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(s);
    }), this.lastTouch = o, this.lastStrokeParts.push(s);
  }
  /**
   * Draws a line from last point to final point. Removes
   * the reference to last touch point.
   * @param e
   */
  onTouchEnd(t) {
    if (t.preventDefault(), !this.lastTouch)
      return;
    const i = t.changedTouches, n = Array.from(i).find((a) => a.identifier === this.lastTouch.id);
    if (!n)
      return;
    const o = this.getRelativePosition(n.clientX, n.clientY), s = {
      startPoint: this.lastTouch.position,
      endPoint: o,
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
class f {
  constructor(t, i, n) {
    this.canvas = t, this.canvasWidth = i, this.canvasHeight = n, this.currentTool = null, this.currentStroke = [], this.strokeManager = new b(t), this.canvasState = null, this.shouldDraw = !1, this.shouldCommit = !1;
    const o = t.getContext("2d").backingStorePixelRatio || 1, s = window.devicePixelRatio || 1;
    this.pixelRatio = s / o, this.setCanvasSize = this.setCanvasSize.bind(this), this.setTool = this.setTool.bind(this), this.destroy = this.destroy.bind(this), this.clear = this.clear.bind(this), this.draw = this.draw.bind(this), this.onStrokePart = this.onStrokePart.bind(this), this.nextAnimationFrame = window.requestAnimationFrame(this.draw), this.strokeManager.onStrokePart(this.onStrokePart), this.setCanvasSize(i, n);
  }
  /**
   * Sets the canvas desired width and height and sets transform
   * for hifi displays
   * @param width
   * @param height
   */
  setCanvasSize(t, i) {
    this.canvasWidth = t, this.canvasHeight = i;
    const { canvas: n, canvasWidth: o, canvasHeight: s, pixelRatio: a } = this, l = n.getContext("2d");
    n.width = o * a, n.height = s * a, n.style.width = o + "px", n.style.height = s + "px", l.setTransform(a, 0, 0, a, 0, 0);
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
class p {
  constructor(t = "red", i = 3) {
    this.color = t, this.width = i;
  }
  /**
   * Draws a "pen stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, i) {
    const n = i[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "round", t.lineJoin = "round", t.moveTo(n.startPoint.x, n.startPoint.y), i.forEach((o) => {
      const { endPoint: s } = o;
      t.lineTo(s.x, s.y);
    }), t.stroke();
  }
}
class T {
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
    const { handleOpts: n } = this, o = this.width / 2;
    i.forEach((a) => {
      const { startPoint: l, endPoint: h, isEnd: c } = a, d = v(l, h), g = w(l, h);
      let r = l, u = 0;
      for (; u < d; ) {
        const m = {
          x: r.x + g.x,
          y: r.y + g.y
        };
        t.clearRect(
          m.x - o,
          m.y - o,
          this.width,
          this.width
        ), u++, r = m;
      }
    });
    const s = i[i.length - 1];
    !s.isEnd && !n.hide && (t.strokeStyle = n.strokeColor, t.fillStyle = n.fillColor, t.fillRect(
      s.endPoint.x - o,
      s.endPoint.y - o,
      this.width,
      this.width
    ), t.strokeRect(
      s.endPoint.x - o + 0.5,
      s.endPoint.y - o + 0.5,
      this.width - 1,
      this.width - 1
    ));
  }
}
function P(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var S = {
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
const y = /* @__PURE__ */ P(S);
var k = {
  red: 0,
  orange: 60,
  yellow: 120,
  green: 180,
  blue: 240,
  purple: 300
};
function E(e) {
  var t, i = [], n = 1, o;
  if (typeof e == "string")
    if (e = e.toLowerCase(), y[e])
      i = y[e].slice(), o = "rgb";
    else if (e === "transparent")
      n = 0, o = "rgb", i = [0, 0, 0];
    else if (/^#[A-Fa-f0-9]+$/.test(e)) {
      var s = e.slice(1), a = s.length, l = a <= 4;
      n = 1, l ? (i = [
        parseInt(s[0] + s[0], 16),
        parseInt(s[1] + s[1], 16),
        parseInt(s[2] + s[2], 16)
      ], a === 4 && (n = parseInt(s[3] + s[3], 16) / 255)) : (i = [
        parseInt(s[0] + s[1], 16),
        parseInt(s[2] + s[3], 16),
        parseInt(s[4] + s[5], 16)
      ], a === 8 && (n = parseInt(s[6] + s[7], 16) / 255)), i[0] || (i[0] = 0), i[1] || (i[1] = 0), i[2] || (i[2] = 0), o = "rgb";
    } else if (t = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(e)) {
      var h = t[1], c = h === "rgb", s = h.replace(/a$/, "");
      o = s;
      var a = s === "cmyk" ? 4 : s === "gray" ? 1 : 3;
      i = t[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(r, u) {
        if (/%$/.test(r))
          return u === a ? parseFloat(r) / 100 : s === "rgb" ? parseFloat(r) * 255 / 100 : parseFloat(r);
        if (s[u] === "h") {
          if (/deg$/.test(r))
            return parseFloat(r);
          if (k[r] !== void 0)
            return k[r];
        }
        return parseFloat(r);
      }), h === s && i.push(1), n = c || i[a] === void 0 ? 1 : i[a], i = i.slice(0, a);
    } else
      e.length > 10 && /[0-9](?:\s|\/)/.test(e) && (i = e.match(/([0-9]+)/g).map(function(d) {
        return parseFloat(d);
      }), o = e.match(/([a-z])/ig).join("").toLowerCase());
  else
    isNaN(e) ? Array.isArray(e) || e.length ? (i = [e[0], e[1], e[2]], o = "rgb", n = e.length === 4 ? e[3] : 1) : e instanceof Object && (e.r != null || e.red != null || e.R != null ? (o = "rgb", i = [
      e.r || e.red || e.R || 0,
      e.g || e.green || e.G || 0,
      e.b || e.blue || e.B || 0
    ]) : (o = "hsl", i = [
      e.h || e.hue || e.H || 0,
      e.s || e.saturation || e.S || 0,
      e.l || e.lightness || e.L || e.b || e.brightness
    ]), n = e.a || e.alpha || e.opacity || 1, e.opacity != null && (n /= 100)) : (o = "rgb", i = [e >>> 16, (e & 65280) >>> 8, e & 255]);
  return {
    space: o,
    values: i,
    alpha: n
  };
}
function x(e, t) {
  var i = E(e);
  return t == null && (t = i.alpha), i.space[0] === "h" ? i.space + ["a(", i.values[0], ",", i.values[1], "%,", i.values[2], "%,", t, ")"].join("") : i.space + ["a(", i.values, ",", t, ")"].join("");
}
class C {
  constructor(t = "yellow", i = 8, n = 0.3) {
    this.width = i, this.color = x(t, 0.4);
  }
  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, i) {
    const n = i[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "butt", t.miterLimit = 1, t.moveTo(n.startPoint.x, n.startPoint.y), i.forEach((o) => {
      const { endPoint: s } = o;
      t.lineTo(s.x, s.y);
    }), t.stroke();
  }
}
window.onload = function() {
  const e = document.getElementById("canvas"), t = document.getElementById("red-pen"), i = document.getElementById("blue-pen"), n = document.getElementById("eraser"), o = document.getElementById("highlighter"), s = document.getElementById("clear");
  if (!t || !i || !n || !o || !s)
    throw new Error("Invalid elements");
  const a = 400, l = 400, h = new f(e, a, l), c = new p("red", 3), d = new p("blue", 8), g = new T(20), r = new C("yellow", 30);
  h.setTool(c), t.onclick = function() {
    h.setTool(c);
  }, i.onclick = function() {
    h.setTool(d);
  }, n.onclick = function() {
    h.setTool(g);
  }, o.onclick = function() {
    h.setTool(r);
  }, s.onclick = function() {
    h.clear();
  };
};
//# sourceMappingURL=example.es.js.map
