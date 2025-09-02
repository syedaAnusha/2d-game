import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import "./styles.css";
import { assets } from "./assets";

// Function to preload all images
function preloadImages() {
  const images = [
    assets.basket,
    assets.tomato,
    assets.carrot,
    assets.eggplant,
    assets.background,
  ];

  const promises = images.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(`Failed to load image: ${src}`);
      img.src = src;
    });
  });

  return Promise.all(promises);
}

// Initialize the game when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  // First preload all images
  preloadImages()
    .then(() => {
      // Remove loading message
      const loadingElement = document.getElementById("loading");
      if (loadingElement) {
        loadingElement.style.display = "none";
      }

      // Create the canvas element
      const canvas = document.createElement("canvas");
      document.body.appendChild(canvas);

      // Set canvas dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Get the 2D context
      const ctx = canvas.getContext("2d");

      // Game state
      const gameState = {
        score: 0,
        timeLeft: 30,
        currentTarget: "",
        gameOver: false,
        targetVegetable: null,
        win: false,
      };

      // Create game scenes
      const gameScene = new Game(canvas, ctx, gameState);
      const gameOverScene = new GameOver(canvas, ctx, gameState);

      // Current active scene
      let currentScene = gameScene;

      // Handle window resize
      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gameScene.resize();
        gameOverScene.resize();
      });

      // Game loop
      function gameLoop() {
        if (gameState.gameOver) {
          currentScene = gameOverScene;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentScene.update();
        currentScene.render();

        requestAnimationFrame(gameLoop);
      }

      // Start the game loop
      gameLoop();

      // Handle keyboard input
      document.addEventListener("keydown", (e) => {
        currentScene.handleKeyDown(e);
      });

      document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          gameScene.basket.stopMoving();
        }
      });

      // Handle touch input
      canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        currentScene.handleTouchStart(e);
      });

      canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        currentScene.handleTouchMove(e);
      });

      canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        currentScene.handleTouchEnd(e);
      });
    })
    .catch((error) => {
      console.error("Error loading game assets:", error);
      document.getElementById("loading").textContent =
        "Error loading game assets. Please refresh.";
    });
});
