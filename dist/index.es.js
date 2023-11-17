function c(i, t) {
  return Math.sqrt(Math.pow(i.x - t.x, 2) + Math.pow(i.y - t.y, 2));
}
function k(i, t) {
  const e = c(i, t), s = {
    x: t.x - i.x,
    y: t.y - i.y
  };
  return {
    x: s.x / e,
    y: s.y / e
  };
}
class w {
  constructor(t) {
    this.canvas = t, this.lastTouch = null, this.lastMouse = null, this.sensitivity = 20, this.lastStrokeParts = [], this.onStrokePartHandlers = [], this.onTouchStart = this.onTouchStart.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this), this.onTouchCancel = this.onTouchCancel.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.destroy = this.destroy.bind(this), this.getRelativePosition = this.getRelativePosition.bind(this), this.onMouseDown = this.onMouseDown.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.canvas.addEventListener("touchstart", this.onTouchStart, {
      passive: !1
    }), this.canvas.addEventListener("touchend", this.onTouchEnd, {
      passive: !1
    }), this.canvas.addEventListener("touchcancel", this.onTouchCancel, {
      passive: !1
    }), this.canvas.addEventListener("touchmove", this.onTouchMove, {
      passive: !1
    }), this.canvas.addEventListener("mousedown", this.onMouseDown, {
      passive: !1
    }), document.addEventListener("mouseup", this.onMouseUp, {
      passive: !1
    }), this.canvas.addEventListener("mousemove", this.onMouseMove, {
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
    this.onStrokePartHandlers = [], this.lastStrokeParts = [], this.canvas.removeEventListener("touchstart", this.onTouchStart), this.canvas.removeEventListener("touchend", this.onTouchEnd), this.canvas.removeEventListener("touchcancel", this.onTouchCancel), this.canvas.removeEventListener("touchmove", this.onTouchMove), this.canvas.removeEventListener("mousedown", this.onMouseDown), document.removeEventListener("mouseup", this.onMouseUp), this.canvas.removeEventListener("mousemove", this.onMouseMove);
  }
  /**
   * Get relative position to canvas
   * @param clientX
   * @param clientY
   * @returns IPoint
   */
  getRelativePosition(t, e) {
    const s = this.canvas.getBoundingClientRect();
    return {
      x: (t - s.left) / s.width,
      y: (e - s.top) / s.height
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
    const s = t.changedTouches.item(0);
    this.lastTouch = {
      id: s.identifier,
      position: this.getRelativePosition(s.clientX, s.clientY)
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
    const e = t.changedTouches, s = Array.from(e).find((a) => a.identifier === this.lastTouch.id);
    if (!s)
      return;
    const n = {
      id: s.identifier,
      position: this.getRelativePosition(s.clientX, s.clientY)
    };
    if (this.sensitivity && c(n.position, this.lastTouch.position) < 10 / this.sensitivity)
      return;
    const o = {
      endPoint: n.position,
      startPoint: this.lastTouch.position,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: !1
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(o);
    }), this.lastTouch = n, this.lastStrokeParts.push(o);
  }
  /**
   * Draws a line from last point to final point. Removes
   * the reference to last touch point.
   * @param e
   */
  onTouchEnd(t) {
    if (t.preventDefault(), !this.lastTouch)
      return;
    const e = t.changedTouches, s = Array.from(e).find((a) => a.identifier === this.lastTouch.id);
    if (!s)
      return;
    const n = this.getRelativePosition(s.clientX, s.clientY), o = {
      startPoint: this.lastTouch.position,
      endPoint: n,
      isStart: !1,
      isEnd: !0
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(o);
    }), this.lastTouch = null, this.lastStrokeParts = [];
  }
  /**
   * Removes the current last touch point
   * @param e
   */
  onTouchCancel(t) {
    t.preventDefault(), this.lastTouch = null, this.lastStrokeParts = [];
  }
  onMouseDown(t) {
    this.lastMouse || (this.lastMouse = this.getRelativePosition(t.clientX, t.clientY));
  }
  onMouseUp(t) {
    if (!this.lastMouse)
      return;
    let e = this.getRelativePosition(t.clientX, t.clientY);
    c(this.lastMouse, e) < 1 && (e = {
      x: this.lastMouse.x + 8e-4,
      y: this.lastMouse.y + 8e-4
    });
    const n = {
      startPoint: this.lastMouse,
      endPoint: e,
      isStart: !1,
      isEnd: !0
    };
    this.onStrokePartHandlers.forEach((o) => {
      o(n);
    }), this.lastMouse = null, this.lastStrokeParts = [];
  }
  onMouseMove(t) {
    if (!this.lastMouse)
      return;
    const e = this.getRelativePosition(t.clientX, t.clientY);
    if (this.sensitivity && c(e, this.lastMouse) < 0.05 / this.sensitivity)
      return;
    const s = {
      endPoint: e,
      startPoint: this.lastMouse,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: !1
    };
    this.onStrokePartHandlers.forEach((n) => {
      n(s);
    }), this.lastMouse = e, this.lastStrokeParts.push(s);
  }
}
class M {
  constructor(t, e, s) {
    this.canvas = t, this.ctx = t.getContext("2d", { willReadFrequently: !0 }), this.canvasWidth = e, this.canvasHeight = s, this.currentTool = null, this.currentStroke = [], this.strokeManager = new w(t), this.canvasState = null, this.shouldDraw = !1, this.shouldCommit = !1, this.onStateChangeHandlers = [];
    const n = this.ctx.backingStorePixelRatio || 1, o = window.devicePixelRatio || 1;
    this.pixelRatio = o / n, this.setCanvasSize = this.setCanvasSize.bind(this), this.setTool = this.setTool.bind(this), this.destroy = this.destroy.bind(this), this.clear = this.clear.bind(this), this.draw = this.draw.bind(this), this.onStrokePart = this.onStrokePart.bind(this), this.nextAnimationFrame = window.requestAnimationFrame(this.draw), this.strokeManager.onStrokePart(this.onStrokePart), this.setCanvasSize(e, s);
  }
  /**
   * Sets the canvas desired width and height and sets transform
   * for hifi displays
   * @param width
   * @param height
   */
  setCanvasSize(t, e) {
    this.canvasWidth = t, this.canvasHeight = e;
    const { ctx: s, canvas: n, canvasWidth: o, canvasHeight: a, pixelRatio: r } = this;
    s && (n.width = o * r, n.height = a * r, n.style.width = o + "px", n.style.height = a + "px", s.scale(r, r));
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
    window.cancelAnimationFrame(this.nextAnimationFrame), this.strokeManager.destroy(), this.onStateChangeHandlers = [];
  }
  /**
   * Clears the canvas
   */
  clear() {
    this.canvasState = null, this.currentStroke = [], this.shouldDraw = !0, this.shouldCommit = !0;
  }
  /**
   * Get the current canvas state
   * @returns ImageData | null
   */
  getCanvasState() {
    return this.canvasState;
  }
  /**
   * Add listener for state changes
   * @param handler
   */
  onStateChange(t) {
    this.onStateChangeHandlers.push(t);
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
    const { ctx: t, canvasWidth: e, canvasHeight: s } = this;
    !this.shouldDraw || !t || (t.clearRect(0, 0, this.canvasWidth, this.canvasHeight), this.canvasState && t.putImageData(this.canvasState, 0, 0), this.currentTool && this.currentStroke.length && (t.save(), this.currentTool.draw(t, this.currentStroke, e, s), t.restore()), this.shouldCommit && (this.canvasState = t.getImageData(
      0,
      0,
      e * this.pixelRatio,
      s * this.pixelRatio
    ), this.currentStroke = [], this.shouldCommit = !1, this.onStateChangeHandlers.forEach((n) => n())), this.shouldDraw = !1);
  }
}
class E {
  constructor(t = "red", e = 3) {
    this.color = t, this.width = e;
  }
  /**
   * Draws a "pen stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, e, s, n) {
    const o = e[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "round", t.lineJoin = "round", t.moveTo(
      o.startPoint.x * s,
      o.startPoint.y * n
    ), e.forEach((a) => {
      const { endPoint: r } = a;
      t.lineTo(r.x * s, r.y * n);
    }), t.stroke();
  }
}
class C {
  constructor(t = 10, e) {
    this.width = t, e = e || {}, this.handleOpts = {
      hide: e.hide || !1,
      strokeWidth: e.strokeWidth || 2,
      fillColor: e.fillColor || "white",
      strokeColor: e.strokeColor || "black"
    };
  }
  /**
   * Draws an "eraser stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, e, s, n) {
    const { handleOpts: o } = this, a = this.width / 2;
    e.forEach((l) => {
      const { startPoint: d, endPoint: g } = l, y = c(d, g), h = k(d, g);
      let u = d, f = 0;
      for (; f < y; ) {
        const v = {
          x: u.x * s + h.x,
          y: u.y * n + h.y
        };
        t.clearRect(
          v.x - a,
          v.y - a,
          this.width,
          this.width
        ), f++, u = v;
      }
    });
    const r = e[e.length - 1];
    if (!r.isEnd && !o.hide) {
      t.strokeStyle = o.strokeColor, t.fillStyle = o.fillColor;
      const l = {
        x: r.endPoint.x * s,
        y: r.endPoint.y * n
      };
      t.fillRect(
        l.x - a,
        l.y - a,
        this.width,
        this.width
      ), t.strokeRect(
        l.x - a + 0.5,
        l.y - a + 0.5,
        this.width - 1,
        this.width - 1
      );
    }
  }
}
function b(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
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
const p = /* @__PURE__ */ b(S);
var m = {
  red: 0,
  orange: 60,
  yellow: 120,
  green: 180,
  blue: 240,
  purple: 300
};
function P(i) {
  var t, e = [], s = 1, n;
  if (typeof i == "string")
    if (i = i.toLowerCase(), p[i])
      e = p[i].slice(), n = "rgb";
    else if (i === "transparent")
      s = 0, n = "rgb", e = [0, 0, 0];
    else if (/^#[A-Fa-f0-9]+$/.test(i)) {
      var o = i.slice(1), a = o.length, r = a <= 4;
      s = 1, r ? (e = [
        parseInt(o[0] + o[0], 16),
        parseInt(o[1] + o[1], 16),
        parseInt(o[2] + o[2], 16)
      ], a === 4 && (s = parseInt(o[3] + o[3], 16) / 255)) : (e = [
        parseInt(o[0] + o[1], 16),
        parseInt(o[2] + o[3], 16),
        parseInt(o[4] + o[5], 16)
      ], a === 8 && (s = parseInt(o[6] + o[7], 16) / 255)), e[0] || (e[0] = 0), e[1] || (e[1] = 0), e[2] || (e[2] = 0), n = "rgb";
    } else if (t = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(i)) {
      var l = t[1], d = l === "rgb", o = l.replace(/a$/, "");
      n = o;
      var a = o === "cmyk" ? 4 : o === "gray" ? 1 : 3;
      e = t[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(h, u) {
        if (/%$/.test(h))
          return u === a ? parseFloat(h) / 100 : o === "rgb" ? parseFloat(h) * 255 / 100 : parseFloat(h);
        if (o[u] === "h") {
          if (/deg$/.test(h))
            return parseFloat(h);
          if (m[h] !== void 0)
            return m[h];
        }
        return parseFloat(h);
      }), l === o && e.push(1), s = d || e[a] === void 0 ? 1 : e[a], e = e.slice(0, a);
    } else
      i.length > 10 && /[0-9](?:\s|\/)/.test(i) && (e = i.match(/([0-9]+)/g).map(function(g) {
        return parseFloat(g);
      }), n = i.match(/([a-z])/ig).join("").toLowerCase());
  else
    isNaN(i) ? Array.isArray(i) || i.length ? (e = [i[0], i[1], i[2]], n = "rgb", s = i.length === 4 ? i[3] : 1) : i instanceof Object && (i.r != null || i.red != null || i.R != null ? (n = "rgb", e = [
      i.r || i.red || i.R || 0,
      i.g || i.green || i.G || 0,
      i.b || i.blue || i.B || 0
    ]) : (n = "hsl", e = [
      i.h || i.hue || i.H || 0,
      i.s || i.saturation || i.S || 0,
      i.l || i.lightness || i.L || i.b || i.brightness
    ]), s = i.a || i.alpha || i.opacity || 1, i.opacity != null && (s /= 100)) : (n = "rgb", e = [i >>> 16, (i & 65280) >>> 8, i & 255]);
  return {
    space: n,
    values: e,
    alpha: s
  };
}
function T(i, t) {
  var e = P(i);
  return t == null && (t = e.alpha), e.space[0] === "h" ? e.space + ["a(", e.values[0], ",", e.values[1], "%,", e.values[2], "%,", t, ")"].join("") : e.space + ["a(", e.values, ",", t, ")"].join("");
}
class R {
  constructor(t = "yellow", e = 8, s = 0.3) {
    this.width = e, this.color = T(t, s);
  }
  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, e, s, n) {
    const o = e[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "butt", t.miterLimit = 1, t.moveTo(
      o.startPoint.x * s,
      o.startPoint.y * n
    ), e.forEach((a) => {
      const { endPoint: r } = a;
      t.lineTo(r.x * s, r.y * n);
    }), t.stroke();
  }
}
export {
  C as EraserTool,
  R as HighlighterTool,
  M as Manager,
  E as PenTool
};
//# sourceMappingURL=index.es.js.map
