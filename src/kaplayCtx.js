import kaplay from "kaplay";

const k = kaplay({
  width: 1920,
  height: 1080,
  letterbox: true,
  background: [0, 0, 0],
  global: false,
  buttons: {
    left: {
      keyboard: ["left", "a"],
    },
    right: {
      keyboard: ["right", "d"],
    },
  },
  touchToMouse: true, // Important for mobile responsiveness
  debug: false,
});

export default k;
