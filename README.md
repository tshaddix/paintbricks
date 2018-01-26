# fingerpaint
Canvas experiment that encourages painting with your fingers.

## Install
```
npm install --save fingerpaint
```

## Usage

```js
// import manager and tool
import {Manager, PenTool} from "fingerpaint";

// Create a new manager
const manager = new Manager(canvasElem, canvasWidth, canvasHeight);

// create a new pen tool with color and stroke width
const penTool = new PenTool("blue", 5);

// set the current tool as the pen tool
manager.setTool(penTool);

// ... draw :)
```

