import { Entity } from "./Entity";
import { assets } from "../assets";

export class Basket extends Entity {
  constructor(canvas) {
    // Set initial basket dimensions and position based on screen size
    const isMobileScreen = window.innerWidth < 768;
    const isVerySmallScreen = window.innerWidth < 360;

    // Improved responsive sizing for basket
    // Ensure the basket is visible and usable on very small screens
    let width, height;
    
    if (isVerySmallScreen) {
      // Significantly larger for very small screens to ensure visibility
      width = Math.max(70, canvas.width * 0.3);
      height = Math.max(55, canvas.width * 0.22);
    } else if (isMobileScreen) {
      width = Math.max(80, canvas.width * 0.25);
      height = Math.max(60, canvas.width * 0.2);
    } else {
      width = 80;
      height = 60;
    }

    const x = canvas.width / 2 - width / 2;
    const y = canvas.height - height - 30; // Moved up more for better visibility on mobile    super(x, y, width, height);

    // Responsive speed based on screen width
    this.speed = isMobileScreen ? 7 : 10;
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = assets.basket;
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
    // For mobile screens, add a subtle highlight around the basket for better visibility
    const isMobileScreen = window.innerWidth < 768;
    
    if (isMobileScreen) {
      // Add a subtle glow/highlight effect around the basket
      ctx.save();
      
      // Draw a subtle shadow or highlight around the basket
      const glowSize = 5;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw the basket with the glow effect
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      
      ctx.restore();
    } else {
      // Standard rendering for desktop
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
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

    // Adjust basket position directly for smoother mobile control
    const isMobileScreen = window.innerWidth < 768;

    if (isMobileScreen) {
      // Direct positioning for better mobile responsiveness
      this.x = Math.max(
        0,
        Math.min(this.canvas.width - this.width, x - this.width / 2)
      );
      this.speedX = 0; // Stop any momentum-based movement
    } else {
      // Apply momentum-based movement for desktop
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
  }

  releaseTouchPosition() {
    this.touchX = null;
    this.stopMoving();
  }
}
