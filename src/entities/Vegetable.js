import { Entity } from "./Entity";
import { assets } from "../assets";

export class Vegetable extends Entity {
  constructor(canvas, type) {
    // Check if on mobile screen
    const isMobileScreen = window.innerWidth < 768;
    const isVerySmallScreen = window.innerWidth < 360;

    // Set initial vegetable dimensions responsive to screen size
    // Ensure vegetables are visible enough on very small screens
    let width, height;

    if (isVerySmallScreen) {
      width = Math.max(30, canvas.width * 0.12);
      height = Math.max(30, canvas.width * 0.12);
    } else if (isMobileScreen) {
      width = Math.max(30, canvas.width * 0.1);
      height = Math.max(30, canvas.width * 0.1);
    } else {
      width = 40;
      height = 40;
    }

    // Random x position
    const x = Math.random() * (canvas.width - width);

    // Start from top of the screen
    const y = -height;

    super(x, y, width, height);

    this.type = type; // 'tomato', 'carrot', or 'eggplant'
    // Adjust falling speed based on screen height to ensure consistent gameplay
    const speedFactor = isMobileScreen ? 0.8 : 1.0;
    this.speedY = (2 + Math.random() * 2) * speedFactor; // Random falling speed
    this.canvas = canvas;

    // Load the appropriate image
    this.image = new Image();
    this.image.src = assets[type];

    // Mark as active
    this.active = true;
  }

  update() {
    super.update();

    // Deactivate if it falls below the screen
    if (this.y > this.canvas.height) {
      this.active = false;
    }
  }

  render(ctx) {
    if (this.active) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
