
L.CanvasLayer = L.TileLayer.extend({
    onAdd: function(map) {
        var that = this;

        this._map.tileMap = {};

        this._map.on('click', function(e) {
            var pixelPoint = map.project(e.latlng, that._map.getZoom()).floor(),
                coords = pixelPoint.unscaleBy(that.getTileSize()).floor(),
                tile;

            coords.z = that._map.getZoom();
            coords.valid = true;

            tile = that.getTileMapElem(coords);

            if (tile) {
                if (!tile.geoObjects) {
                    tile.geoObjects = L.geoJson(tile.raw, {
                        // style
                    });
                    var bound = L.tile2bound(coords);

                    tile.boundObject = L.rectangle([[bound.getWest(), bound.getNorth()], [bound.getEast(), bound.getSouth()]], {
                        // color: 'red'
                    });
                }
                if (tile.geoObjectsShown) {
                    that._map.removeLayer(tile.geoObjects);
                    that._map.removeLayer(tile.boundObject);
                    tile.geoObjectsShown = false;
                } else {
                    that._map.addLayer(tile.geoObjects);
                    that._map.addLayer(tile.boundObject);
                    tile.geoObjectsShown = true;
                }
            }
        });

        L.TileLayer.prototype.onAdd.call(this, map);
    },
    createTile: function(coords, done){
        if (this.getTileMapElem(coords)) {
            return this.getTileMapElem(coords);
        }
        var that = this,
            tile = L.DomUtil.create('canvas', 'leaflet-tile'),
            size = this.getTileSize();

        // setup tile width and height according to the options
        tile.width = size.x;
        tile.height = size.y;

        jQuery.ajax({
            url: this.getTileUrl(coords),
            dataType: "jsonp",
            success: function(c, t, d) {
                return function(result) {
                    d(null, that.renderTile(c, t, JSON.parse(result)));
                };
            }(coords, tile, done)
        });

        return tile;
    },
    getTileMapElem: function(coords) {
        if (this._map.tileMap.hasOwnProperty(coords.z) &&
                this._map.tileMap[coords.z].hasOwnProperty(coords.x) &&
                this._map.tileMap[coords.z][coords.x].hasOwnProperty(coords.y)) {
            return this._map.tileMap[coords.z][coords.x][coords.y];
        }
        return null;
    },
    addToTileMap: function(coords, tile) {
        if (!this._map.tileMap.hasOwnProperty(coords.z)) {
            this._map.tileMap[coords.z] = {};
        }
        if (!this._map.tileMap[coords.z].hasOwnProperty(coords.x)) {
            this._map.tileMap[coords.z][coords.x] = {};
        }
        this._map.tileMap[coords.z][coords.x][coords.y] = tile;
    },
    renderTile: function(coords, tile, data) {
        // create a <canvas> element for drawing
        var ctx = tile.getContext('2d');

        tile.raw = data;

        if (!data.features) {
            return done('no feature collection');
        }
        // adjust L.CanvasRenderer for render session
        L.CanvasRenderer.setMap(this._map);
        L.CanvasRenderer.setCanvas(ctx);
        L.CanvasRenderer.setTileSize(this.getTileSize());
        L.CanvasRenderer.setTile(coords); // always after setTileSize!

        data.features.forEach(function(feature) {
            if (feature.geometry.type === 'Point') {
                return L.CanvasRenderer.point(ctx, feature);
            }
            if (feature.geometry.type === 'LineString') {
                return L.CanvasRenderer.line(ctx, feature);
            }
            if (feature.geometry.type === 'Polygon') {
                return L.CanvasRenderer.area(ctx,feature);
            }
            console.log('unknown feature type');
            console.log(feature);
        });
        
        this.addToTileMap(coords, tile);

        return tile;
    }
});


L.canvasLayer = function(url, options) {
    return new L.CanvasLayer(url, options);
};