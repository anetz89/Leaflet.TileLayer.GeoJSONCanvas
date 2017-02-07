var map = new L.Map('map');

map.setView(new L.LatLng(48.135, 11.55), 18);

map.addLayer(L.canvasLayer('http://localhost:8765/{z}/{x}/{y}.json', {
    tileSize : 256
}));