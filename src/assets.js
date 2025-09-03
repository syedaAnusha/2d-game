// Import all game assets
import basketImg from "../graphics/basket.png";
import tomatoImg from "../graphics/tomato.png";
import carrotImg from "../graphics/carrot.png";
import eggplantImg from "../graphics/eggplant.png";
import backgroundImg from "../graphics/background.png";
import vegetableImg from "../graphics/vegetable.png";

// Log asset imports to verify they're loaded correctly
console.log("Asset imports:", {
  basketImg,
  tomatoImg,
  carrotImg,
  eggplantImg,
  backgroundImg,
  vegetableImg,
});

// Export all assets as a single object
export const assets = {
  basket: basketImg,
  tomato: tomatoImg,
  carrot: carrotImg,
  eggplant: eggplantImg,
  background: backgroundImg,
  vegetable: vegetableImg,
};
