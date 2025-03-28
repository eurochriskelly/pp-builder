
/**
 * Generates a simple hash from a string for consistent color mapping
 * @param {string} str - Input string
 * @returns {number} - Hash value
 */
function hashString(str) {
  if (!str) return 0;
  let hash = 17;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 23 + str.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return hash;
}

/**
 * Generates a consistent random color class for a name
 * @param {string} name - The name to generate color for 
 * @param {boolean} [isTeam=false] - Whether this is for a team
 * @returns {string} CSS class string
 */
function getRandomColor(name, isTeam = false) {
  if (!name) return '';
  const hash = hashString(name);
  const hueClass = `hue-${hash % 360}`;
  return isTeam ? `${hueClass} team-color` : `${hueClass} category-color`;
}

/**
 * Gets the CSS class name for a given card color.
 * @param {string|null} cardColor - The color name (e.g., 'yellow', 'red', 'black').
 * @returns {string} CSS class name (e.g., 'card-yellow', 'card-red', 'card-black').
 */
function getCardColorStyle(cardColor) {
    switch (cardColor?.toLowerCase()) {
        case 'yellow': return 'card-yellow';
        case 'red': return 'card-red';
        case 'black': return 'card-black';
        default: return '';
    }
}

module.exports = {
  hashString,
  getRandomColor,
  getCardColorStyle
};
