# Leaflet.TileLayer.GeoJSONCanvas

Leaflet TileLayer extension to request and draw GeoJSON data in Leaflet.

## Usage

```js
map.addLayer(L.canvasLayer('http://url.to.tile.server/{z}/{x}/{y}.json'));
```

## Backend
This plugin needs a backend that provides tiled GeoJSON data, it is implemented using [osm-geojson-server](https://github.com/anetz89/osm-geojson-server).

## Configuration
Right now only the backend URL can be configured.

## Future Work
Next step is to make styles configurable (client side and by loading remote configuration)

## Contribute
Feel free to add issues or pull requests. I'm glad for every kind of feedback!