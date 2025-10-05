// Map configuration
const KYIV_COORDS = [50.4501, 30.5234];
const MAPTILER_KEY = 'tJoJlJ4VvyIVk26MvPbb';
const TILE_URL = `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}@2x.png?key=${MAPTILER_KEY}`;
const map = L.map('map').setView(KYIV_COORDS, 12);

// Export the map instance and constants for use in other files
window.map = map;
window.mapConfig = {
    KYIV_COORDS,
    MAPTILER_KEY,
    TILE_URL
};
