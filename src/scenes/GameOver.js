import { assets } from "../assets";

export class GameOver {
  constructor(canvas, ctx, gameState) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gameState = gameState;

    // Load background image
    this.backgroundImage = new Image();
    if (!assets.background) {
      console.error("Background asset not found in GameOver!");
      console.log("Available assets:", assets);
    } else {
      this.backgroundImage.src = assets.background;
    }
  }

  resize() {
    // No specific resize actions needed
  }

  update() {
    // No update logic needed for game over screen
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background image with a darkening overlay
    if (this.backgroundImage.complete) {
      // Draw the background image
      this.ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // Add a semi-transparent dark overlay to make text more readable
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      // Fallback if image isn't loaded
      this.ctx.fillStyle = "#2C3E50"; // Dark blue background
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Check for mobile screen
    const isMobileScreen = window.innerWidth < 768;
    const isVerySmallScreen = window.innerWidth < 360;

    // Set responsive text sizes - improved for better mobile display
    const gameOverFontSize = isVerySmallScreen ? 28 : isMobileScreen ? 36 : 48;
    const resultFontSize = isVerySmallScreen ? 20 : isMobileScreen ? 26 : 36;
    const scoreFontSize = isVerySmallScreen ? 16 : isMobileScreen ? 20 : 30;
    const instructionFontSize = isVerySmallScreen
      ? 12
      : isMobileScreen
      ? 16
      : 24;
    const lineWidth = isMobileScreen ? 1.5 : 3;
    const verticalSpacing = isVerySmallScreen ? 30 : isMobileScreen ? 35 : 60;

    // Set text styles
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = lineWidth;
    this.ctx.textAlign = "center";

    // Game over text
    this.ctx.font = `${gameOverFontSize}px Arial`;
    this.ctx.strokeText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - verticalSpacing
    );
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - verticalSpacing
    );

    // Win or lose message
    this.ctx.font = `${resultFontSize}px Arial`;
    const resultMessage = this.gameState.score > 0 ? "You Win!" : "You Lose!";
    this.ctx.strokeText(
      resultMessage,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.fillText(
      resultMessage,
      this.canvas.width / 2,
      this.canvas.height / 2
    );

    // Final score
    this.ctx.font = `${scoreFontSize}px Arial`;
    const scoreVerticalSpacing = isMobileScreen ? 40 : 60;
    this.ctx.strokeText(
      `Final Score: ${this.gameState.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + scoreVerticalSpacing
    );
    this.ctx.fillText(
      `Final Score: ${this.gameState.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + scoreVerticalSpacing
    );

    // Restart instructions
    this.ctx.font = `${instructionFontSize}px Arial`;
    const instructionVerticalSpacing = isMobileScreen ? 80 : 120;
    this.ctx.strokeText(
      "Refresh the page to play again",
      this.canvas.width / 2,
      this.canvas.height / 2 + instructionVerticalSpacing
    );
    this.ctx.fillText(
      "Refresh the page to play again",
      this.canvas.width / 2,
      this.canvas.height / 2 + instructionVerticalSpacing
    );
  }

  handleKeyDown() {
    // No keyboard handling needed for game over screen
  }

  handleTouchStart() {
    // No touch handling needed for game over screen
  }

  handleTouchMove() {
    // No touch handling needed for game over screen
  }

  handleTouchEnd() {
    // No touch handling needed for game over screen
  }
}
