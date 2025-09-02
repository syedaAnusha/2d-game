import k from "./kaplayCtx";
import game from "./scenes/game";
import gameOver from "./scenes/gameOver";
import mainMenu from "./scenes/mainMenu";

// Load assets
k.loadSprite("background", "graphics/background.png");
k.loadSprite("basket", "graphics/basket.png", {
  sliceX: 2,
  sliceY: 1,
  anims: {
    yellow: { from: 0, to: 0 },
    orange: { from: 1, to: 1 },
  },
});
k.loadSprite("orange", "graphics/orange.png");
k.loadSprite("mango", "graphics/mango.png");

// Load sounds
k.loadSound("bgMusic", "sounds/background.mp3");
k.loadSound("catch", "sounds/catch.wav");
k.loadSound("wrong", "sounds/wrong.wav");
k.loadSound("gameOver", "sounds/gameOver.wav");

// Load font
k.loadFont("gameFont", "fonts/gameFont.ttf");

// Define scenes
k.scene("main-menu", mainMenu);
k.scene("game", game);
k.scene("game-over", gameOver);

// Start with the main menu
k.go("main-menu");
