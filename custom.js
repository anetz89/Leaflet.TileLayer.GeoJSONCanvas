var map = new L.Map('map'),
    osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
    canvas = L.canvasLayer('http://localhost:8765/{z}/{x}/{y}.json', {
        tileSize : 256
    });

map.setView(new L.LatLng(48.135, 11.55), 18);

$.ajax({
    url : 'http://localhost:8765/config',
    dataType: "jsonp",
    success: function(result) {
        L.CanvasRenderer.style = JSON.parse(result);

        map.addLayer(canvas);
    }
})

function toggleOSM() {
    if (map.hasLayer(osm)) {
        map.removeLayer(osm);
        map.addLayer(canvas);
    } else {
        map.removeLayer(canvas);
        map.addLayer(osm);
    }
}