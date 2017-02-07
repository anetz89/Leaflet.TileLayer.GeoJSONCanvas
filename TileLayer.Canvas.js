
L.CanvasLayer = L.TileLayer.extend({
    createTile: function(coords, done){

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
    renderTile: function(coords, tile, data) {
        // create a <canvas> element for drawing
        var ctx = tile.getContext('2d')

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
        })

        return tile;
    }
});

L.canvasLayer = function(url, options) {
    return new L.CanvasLayer(url, options);
};