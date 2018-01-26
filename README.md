# paintbricks
An extendable drawing system built for the web.

## Install
```
npm install --save paintbricks
```

## Usage

```js
// import manager and tool
import {Manager, PenTool} from "paintbricks";

// Create a new manager
const manager = new Manager(canvasElem, canvasWidth, canvasHeight);

// create a new pen tool with color and stroke width
const penTool = new PenTool("blue", 5);

// set the current tool as the pen tool
manager.setTool(penTool);

// ... draw :)
```

