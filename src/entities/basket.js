import { Entity } from "./Entity";

export class Basket extends Entity {
  constructor(canvas) {
    // Set initial basket dimensions and position based on screen size
    const isMobileScreen = window.innerWidth < 768;

    // Responsive sizing for basket
    const width = isMobileScreen ? Math.min(70, canvas.width * 0.2) : 80;
    const height = isMobileScreen ? Math.min(50, canvas.width * 0.15) : 60;

    const x = canvas.width / 2 - width / 2;
    const y = canvas.height - height - 10;

    super(x, y, width, height);

    // Responsive speed based on screen width
    this.speed = isMobileScreen ? 7 : 10;
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = "/graphics/basket.png";
    this.touchX = null;
  }

  update() {
    super.update();

    // Keep basket within canvas boundaries
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvas.width)
      this.x = this.canvas.width - this.width;
  }

  render(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.speedX = -this.speed;
  }

  moveRight() {
    this.speedX = this.speed;
  }

  stopMoving() {
    this.speedX = 0;
  }

  // Handle touch movement
  setTouchPosition(x) {
    this.touchX = x;
    // Calculate the center point of the basket
    const basketCenter = this.x + this.width / 2;
    const distance = x - basketCenter;

    // Apply movement based on touch position
    if (Math.abs(distance) > 5) {
      // Small threshold to prevent jittering
      if (distance > 0) {
        this.moveRight();
      } else {
        this.moveLeft();
      }
    } else {
      this.stopMoving();
    }
  }

  releaseTouchPosition() {
    this.touchX = null;
    this.stopMoving();
  }
}
