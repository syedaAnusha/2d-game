import { Basket } from "../entities/Basket";
import { Vegetable } from "../entities/Vegetable";
import { assets } from "../assets";

export class Game {
  constructor(canvas, ctx, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = gameState;

    // Load background image
    this.backgroundImage = new Image();
    this.backgroundImage.src = assets.background;

    // Create player's basket
    this.basket = new Basket(canvas);

    // Vegetables container
    this.vegetables = [];

    // Vegetable types
    this.vegetableTypes = ["tomato", "carrot", "eggplant"];

    // Timers
    this.lastVegetableTime = 0;
    this.vegetableSpawnInterval = 800; // in milliseconds
    this.lastTimerUpdate = Date.now();

    // Set the initial target vegetable
    this.setRandomTargetVegetable();

    // Timer to update the target vegetable every few seconds
    this.targetUpdateInterval = setInterval(() => {
      this.setRandomTargetVegetable();
    }, 5000); // Change target every 5 seconds

    // Start the game timer
    this.startTimer();
  }

  resize() {
    // Adjust basket position on resize
    this.basket.y = this.canvas.height - this.basket.height - 10;
  }

  update() {
    // Update the basket
    this.basket.update();

    // Spawn new vegetables
    const currentTime = Date.now();
    if (currentTime - this.lastVegetableTime > this.vegetableSpawnInterval) {
      this.lastVegetableTime = currentTime;

      // Random vegetable type
      const randomType =
        this.vegetableTypes[
          Math.floor(Math.random() * this.vegetableTypes.length)
        ];
      this.vegetables.push(new Vegetable(this.canvas, randomType));
    }

    // Update vegetables
    for (let i = this.vegetables.length - 1; i >= 0; i--) {
      const vegetable = this.vegetables[i];
      vegetable.update();

      // Check collision with basket
      if (vegetable.active && vegetable.collidesWith(this.basket)) {
        vegetable.active = false;

        // Update score based on target vegetable
        if (vegetable.type === this.gameState.targetVegetable) {
          this.gameState.score += 10;
        } else {
          this.gameState.score -= 5;
        }

        // Remove the vegetable
        this.vegetables.splice(i, 1);
      }

      // Remove inactive vegetables
      if (!vegetable.active) {
        this.vegetables.splice(i, 1);
      }
    }

    // Update timer
    this.updateTimer();
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background image
    if (this.backgroundImage.complete) {
      // Draw the background image covering the entire canvas
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    } else {
      // Fallback if image isn't loaded yet
      this.ctx.fillStyle = "#87CEEB"; // Sky blue background
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Render all vegetables
    for (const vegetable of this.vegetables) {
      vegetable.render(this.ctx);
    }

    // Render the basket
    this.basket.render(this.ctx);

    // Render the UI (score, timer, target)
    this.renderUI();
  }

  renderUI() {
    // Check for mobile screen
    const isMobileScreen = window.innerWidth < 768;
    const isVerySmallScreen = window.innerWidth < 360;

    // Set responsive text sizes
    const scoreFontSize = isVerySmallScreen ? 16 : isMobileScreen ? 20 : 24;
    const targetFontSize = isVerySmallScreen ? 18 : isMobileScreen ? 24 : 28;
    const lineWidth = isMobileScreen ? 2 : 3;

    // Set text styles
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = lineWidth;
    this.ctx.font = `${scoreFontSize}px Arial`;

    // Score
    this.ctx.textAlign = "left";
    const scoreX = isVerySmallScreen ? 10 : 20;
    const textY = isVerySmallScreen ? 25 : 40;
    this.ctx.strokeText(`Score: ${this.gameState.score}`, scoreX, textY);
    this.ctx.fillText(`Score: ${this.gameState.score}`, scoreX, textY);

    // Timer
    this.ctx.textAlign = "right";
    const timerX = this.canvas.width - (isVerySmallScreen ? 10 : 20);
    this.ctx.strokeText(`Time: ${this.gameState.timeLeft}s`, timerX, textY);
    this.ctx.fillText(`Time: ${this.gameState.timeLeft}s`, timerX, textY);

    // Target vegetable
    this.ctx.textAlign = "center";
    this.ctx.font = `${targetFontSize}px Arial`;
    this.ctx.strokeText(
      `Catch: ${this.gameState.targetVegetable.toUpperCase()}`,
      this.canvas.width / 2,
      textY
    );
    this.ctx.fillText(
      `Catch: ${this.gameState.targetVegetable.toUpperCase()}`,
      this.canvas.width / 2,
      textY
    );
  }

  setRandomTargetVegetable() {
    const randomIndex = Math.floor(Math.random() * this.vegetableTypes.length);
    this.gameState.targetVegetable = this.vegetableTypes[randomIndex];
  }

  startTimer() {
    this.lastTimerUpdate = Date.now();
  }

  updateTimer() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTimerUpdate;

    // Update timer every second
    if (deltaTime >= 1000) {
      this.gameState.timeLeft--;
      this.lastTimerUpdate = currentTime;

      // Check if time is up
      if (this.gameState.timeLeft <= 0) {
        this.gameState.timeLeft = 0;
        this.endGame();
      }
    }
  }

  endGame() {
    // Clear the target update interval
    clearInterval(this.targetUpdateInterval);

    // Determine if player won (positive score)
    this.gameState.win = this.gameState.score > 0;

    // Set game over state
    this.gameState.gameOver = true;
  }

  handleKeyDown(e) {
    switch (e.key) {
      case "ArrowLeft":
        this.basket.moveLeft();
        break;
      case "ArrowRight":
        this.basket.moveRight();
        break;
    }
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.basket.setTouchPosition(touch.clientX);
  }

  handleTouchMove(e) {
    const touch = e.touches[0];
    this.basket.setTouchPosition(touch.clientX);
  }

  handleTouchEnd() {
    this.basket.releaseTouchPosition();
  }
}
