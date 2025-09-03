import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import "./styles.css";
import { assets } from "./assets";

// Function to preload all images
function preloadImages() {
  const imageAssets = {
    basket: assets.basket,
    tomato: assets.tomato,
    carrot: assets.carrot,
    eggplant: assets.eggplant,
    background: assets.background,
    vegetable: assets.vegetable,
  };

  console.log("Image assets to load:", imageAssets);

  const promises = Object.entries(imageAssets).map(([key, src]) => {
    return new Promise((resolve, reject) => {
      if (!src) {
        console.error(`Missing image source for: ${key}`);
        reject(`Missing image source for: ${key}`);
        return;
      }

      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded: ${key}`);
        resolve(img);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${key} (${src})`);
        reject(`Failed to load image: ${key} (${src})`);
      };
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
      const loadingElement = document.getElementById("loading");
      if (loadingElement) {
        loadingElement.innerHTML = `Error loading game assets: ${error}<br>Please check the console for details and refresh.`;
        loadingElement.style.display = "block";
        loadingElement.style.color = "red";
        loadingElement.style.padding = "20px";
        loadingElement.style.backgroundColor = "rgba(0,0,0,0.7)";
      }
    });
});
