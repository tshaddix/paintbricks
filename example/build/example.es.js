function g(s, t) {
  return Math.sqrt(Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2));
}
function b(s, t) {
  const e = g(s, t), n = {
    x: t.x - s.x,
    y: t.y - s.y
  };
  return {
    x: n.x / e,
    y: n.y / e
  };
}
class f {
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
    const n = this.canvas.getBoundingClientRect();
    return {
      x: (t - n.left) / n.width,
      y: (e - n.top) / n.height
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
    const e = t.changedTouches.item(0);
    this.lastTouch = {
      id: e.identifier,
      position: this.getRelativePosition(e.clientX, e.clientY)
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
    const e = t.changedTouches, n = Array.from(e).find((a) => a.identifier === this.lastTouch.id);
    if (!n)
      return;
    const o = {
      id: n.identifier,
      position: this.getRelativePosition(n.clientX, n.clientY)
    };
    if (this.sensitivity && g(o.position, this.lastTouch.position) < 10 / this.sensitivity)
      return;
    const i = {
      endPoint: o.position,
      startPoint: this.lastTouch.position,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: !1
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(i);
    }), this.lastTouch = o, this.lastStrokeParts.push(i);
  }
  /**
   * Draws a line from last point to final point. Removes
   * the reference to last touch point.
   * @param e
   */
  onTouchEnd(t) {
    if (t.preventDefault(), !this.lastTouch)
      return;
    const e = t.changedTouches, n = Array.from(e).find((a) => a.identifier === this.lastTouch.id);
    if (!n)
      return;
    const o = this.getRelativePosition(n.clientX, n.clientY), i = {
      startPoint: this.lastTouch.position,
      endPoint: o,
      isStart: !1,
      isEnd: !0
    };
    this.onStrokePartHandlers.forEach((a) => {
      a(i);
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
    g(this.lastMouse, e) < 1 && (e = {
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
    if (this.sensitivity && g(e, this.lastMouse) < 0.05 / this.sensitivity)
      return;
    const n = {
      endPoint: e,
      startPoint: this.lastMouse,
      isStart: this.lastStrokeParts.length === 0,
      isEnd: !1
    };
    this.onStrokePartHandlers.forEach((o) => {
      o(n);
    }), this.lastMouse = e, this.lastStrokeParts.push(n);
  }
}
class S {
  constructor(t, e, n) {
    this.canvas = t, this.ctx = t.getContext("2d", { willReadFrequently: !0 }), this.canvasWidth = e, this.canvasHeight = n, this.currentTool = null, this.currentStroke = [], this.strokeManager = new f(t), this.canvasState = null, this.shouldDraw = !1, this.shouldCommit = !1, this.onStateChangeHandlers = [];
    const o = this.ctx.backingStorePixelRatio || 1, i = window.devicePixelRatio || 1;
    this.pixelRatio = i / o, this.setCanvasSize = this.setCanvasSize.bind(this), this.setTool = this.setTool.bind(this), this.destroy = this.destroy.bind(this), this.clear = this.clear.bind(this), this.draw = this.draw.bind(this), this.onStrokePart = this.onStrokePart.bind(this), this.nextAnimationFrame = window.requestAnimationFrame(this.draw), this.strokeManager.onStrokePart(this.onStrokePart), this.setCanvasSize(e, n);
  }
  /**
   * Sets the canvas desired width and height and sets transform
   * for hifi displays
   * @param width
   * @param height
   */
  setCanvasSize(t, e) {
    this.canvasWidth = t, this.canvasHeight = e;
    const { ctx: n, canvas: o, canvasWidth: i, canvasHeight: a, pixelRatio: r } = this;
    n && (o.width = i * r, o.height = a * r, o.style.width = i + "px", o.style.height = a + "px", n.scale(r, r));
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
   * Set the current canvas state
   * @param data
   */
  setCanvasState(t) {
    this.canvasState = t, this.shouldDraw = !0;
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
    const { ctx: t, canvasWidth: e, canvasHeight: n } = this;
    !this.shouldDraw || !t || (t.clearRect(0, 0, this.canvasWidth, this.canvasHeight), this.canvasState && t.putImageData(this.canvasState, 0, 0), this.currentTool && this.currentStroke.length && (t.save(), this.currentTool.draw(t, this.currentStroke, e, n), t.restore()), this.shouldCommit && (this.canvasState = t.getImageData(
      0,
      0,
      e * this.pixelRatio,
      n * this.pixelRatio
    ), this.currentStroke = [], this.shouldCommit = !1, this.onStateChangeHandlers.forEach((o) => o())), this.shouldDraw = !1);
  }
}
class y {
  constructor(t = "red", e = 3) {
    this.color = t, this.width = e;
  }
  /**
   * Draws a "pen stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, e, n, o) {
    const i = e[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "round", t.lineJoin = "round", t.moveTo(
      i.startPoint.x * n,
      i.startPoint.y * o
    ), e.forEach((a) => {
      const { endPoint: r } = a;
      t.lineTo(r.x * n, r.y * o);
    }), t.stroke();
  }
}
class P {
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
  draw(t, e, n, o) {
    const { handleOpts: i } = this, a = this.width / 2;
    e.forEach((h) => {
      const { startPoint: c, endPoint: u } = h, v = g(c, u), l = b(c, u);
      let d = c, p = 0;
      for (; p < v; ) {
        const m = {
          x: d.x * n + l.x,
          y: d.y * o + l.y
        };
        t.clearRect(
          m.x - a,
          m.y - a,
          this.width,
          this.width
        ), p++, d = m;
      }
    });
    const r = e[e.length - 1];
    if (!r.isEnd && !i.hide) {
      t.strokeStyle = i.strokeColor, t.fillStyle = i.fillColor;
      const h = {
        x: r.endPoint.x * n,
        y: r.endPoint.y * o
      };
      t.fillRect(
        h.x - a,
        h.y - a,
        this.width,
        this.width
      ), t.strokeRect(
        h.x - a + 0.5,
        h.y - a + 0.5,
        this.width - 1,
        this.width - 1
      );
    }
  }
}
function T(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var E = {
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
const w = /* @__PURE__ */ T(E);
var k = {
  red: 0,
  orange: 60,
  yellow: 120,
  green: 180,
  blue: 240,
  purple: 300
};
function M(s) {
  var t, e = [], n = 1, o;
  if (typeof s == "string")
    if (s = s.toLowerCase(), w[s])
      e = w[s].slice(), o = "rgb";
    else if (s === "transparent")
      n = 0, o = "rgb", e = [0, 0, 0];
    else if (/^#[A-Fa-f0-9]+$/.test(s)) {
      var i = s.slice(1), a = i.length, r = a <= 4;
      n = 1, r ? (e = [
        parseInt(i[0] + i[0], 16),
        parseInt(i[1] + i[1], 16),
        parseInt(i[2] + i[2], 16)
      ], a === 4 && (n = parseInt(i[3] + i[3], 16) / 255)) : (e = [
        parseInt(i[0] + i[1], 16),
        parseInt(i[2] + i[3], 16),
        parseInt(i[4] + i[5], 16)
      ], a === 8 && (n = parseInt(i[6] + i[7], 16) / 255)), e[0] || (e[0] = 0), e[1] || (e[1] = 0), e[2] || (e[2] = 0), o = "rgb";
    } else if (t = /^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(s)) {
      var h = t[1], c = h === "rgb", i = h.replace(/a$/, "");
      o = i;
      var a = i === "cmyk" ? 4 : i === "gray" ? 1 : 3;
      e = t[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(l, d) {
        if (/%$/.test(l))
          return d === a ? parseFloat(l) / 100 : i === "rgb" ? parseFloat(l) * 255 / 100 : parseFloat(l);
        if (i[d] === "h") {
          if (/deg$/.test(l))
            return parseFloat(l);
          if (k[l] !== void 0)
            return k[l];
        }
        return parseFloat(l);
      }), h === i && e.push(1), n = c || e[a] === void 0 ? 1 : e[a], e = e.slice(0, a);
    } else
      s.length > 10 && /[0-9](?:\s|\/)/.test(s) && (e = s.match(/([0-9]+)/g).map(function(u) {
        return parseFloat(u);
      }), o = s.match(/([a-z])/ig).join("").toLowerCase());
  else
    isNaN(s) ? Array.isArray(s) || s.length ? (e = [s[0], s[1], s[2]], o = "rgb", n = s.length === 4 ? s[3] : 1) : s instanceof Object && (s.r != null || s.red != null || s.R != null ? (o = "rgb", e = [
      s.r || s.red || s.R || 0,
      s.g || s.green || s.G || 0,
      s.b || s.blue || s.B || 0
    ]) : (o = "hsl", e = [
      s.h || s.hue || s.H || 0,
      s.s || s.saturation || s.S || 0,
      s.l || s.lightness || s.L || s.b || s.brightness
    ]), n = s.a || s.alpha || s.opacity || 1, s.opacity != null && (n /= 100)) : (o = "rgb", e = [s >>> 16, (s & 65280) >>> 8, s & 255]);
  return {
    space: o,
    values: e,
    alpha: n
  };
}
function x(s, t) {
  var e = M(s);
  return t == null && (t = e.alpha), e.space[0] === "h" ? e.space + ["a(", e.values[0], ",", e.values[1], "%,", e.values[2], "%,", t, ")"].join("") : e.space + ["a(", e.values, ",", t, ")"].join("");
}
class C {
  constructor(t = "yellow", e = 8, n = 0.3) {
    this.width = e, this.color = x(t, n);
  }
  /**
   * Draws a "highlighter stroke" for all line segments
   * @param ctx
   * @param strokeParts
   */
  draw(t, e, n, o) {
    const i = e[0];
    t.beginPath(), t.lineWidth = this.width, t.strokeStyle = this.color, t.lineCap = "butt", t.miterLimit = 1, t.moveTo(
      i.startPoint.x * n,
      i.startPoint.y * o
    ), e.forEach((a) => {
      const { endPoint: r } = a;
      t.lineTo(r.x * n, r.y * o);
    }), t.stroke();
  }
}
window.onload = function() {
  const s = document.getElementById("canvas"), t = document.getElementById("red-pen"), e = document.getElementById("blue-pen"), n = document.getElementById("eraser"), o = document.getElementById("highlighter"), i = document.getElementById("clear");
  if (!t || !e || !n || !o || !i)
    throw new Error("Invalid elements");
  const a = 400, r = 400, h = new S(s, a, r), c = new y("red", 3), u = new y("blue", 8), v = new P(20), l = new C("yellow", 30);
  h.setTool(c), t.onclick = function() {
    h.setTool(c);
  }, e.onclick = function() {
    h.setTool(u);
  }, n.onclick = function() {
    h.setTool(v);
  }, o.onclick = function() {
    h.setTool(l);
  }, i.onclick = function() {
    h.clear();
  };
};
//# sourceMappingURL=example.es.js.map
