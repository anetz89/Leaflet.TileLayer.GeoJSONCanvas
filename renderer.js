L.CanvasRenderer = {
    style : {
        width : 2,
        color : 'blue'
    },
    setCanvas : function(canvas) {
        this.ctx = canvas;
    },
    setMap : function(map) {
        this.map = map;
    },
    setTile : function(coords) {
        this.pixelOffset = coords.scaleBy(this.tileSize);
        this.zoom = coords.z;
    },
    setTileSize : function(size) {
        this.tileSize = size;
    },
    coord2point : function(coord) {
        var p = this.map.project(L.latLng(coord[1], coord[0]), this.zoom);

        return p._subtract(this.pixelOffset)._round();
    },
    point : function(ctx, feature) {
        var point = this.coord2point(feature.geometry.coordinates);

        ctx.save();
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.style.width * 0.5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    line : function(ctx, feature) {
        var that = this,
            firstHandled = false;

        ctx.save();
        ctx.strokeStyle = this.style.color;
        ctx.lineWidth = this.style.width;
        ctx.beginPath();


        feature.geometry.coordinates.forEach(function(coordinate) {
            var point = that.coord2point(coordinate);

            if (!firstHandled) {
                that.ctx.moveTo(point.x, point.y);
                firstHandled = true;
                return;
            }

            that.ctx.lineTo(point.x, point.y);
        })

        ctx.stroke();
        ctx.restore();
    },
    area : function(ctx, feature) {
        var that = this,
            firstHandled = false;

        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.style.color;
        ctx.lineWidth = this.style.width;
        ctx.beginPath();


        feature.geometry.coordinates[0].forEach(function(coordinate) {
            var point = that.coord2point(coordinate);

            if (!firstHandled) {
                that.ctx.moveTo(point.x, point.y);
                firstHandled = true;
                return;
            }

            that.ctx.lineTo(point.x, point.y);
        })

        ctx.closePath();

        // set fill rules to allow polygons with holes
        ctx.mozFillRule = 'evenodd';  //  mozilla-based
        ctx.fill('evenodd');  // webkit-based

        ctx.restore();
    }
};