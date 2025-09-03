import kaplay from "kaplay";

// Create kaplay context with responsive settings
const k = kaplay({
  width: 1540, // 1540px gives full width
  height: 720,
  letterbox: true,
  global: false,
  buttons: {
    jump: { key: ["space"], mouse: "left" },
  },
  debug: false, // TODO set to false on production
  touchToMouse: true, // Enable touch controls
  pixelDensity: window.devicePixelRatio,
  background: [0, 0, 0],
});

export default k;
