(function() {
    'use strict';

    function extractBounds(bounds) {
        if (bounds.getNorth) {
            // Leaflet bounds or identity
            this.north = bounds.getNorth();
            this.east = bounds.getEast();
            this.south = bounds.getSouth();
            this.west = bounds.getWest();
        } else if (bounds.constructor === Array) {
            if (bounds.length === 2) {
                // expect [[north, east], [south, west]] or [L.latLng, L.latLng]
                if (bounds[0].lat) {
                    this.north = bounds[0].lat;
                    this.east = bounds[0].lng;
                } else {
                    this.north = bounds[0][0];
                    this.east = bounds[0][1];
                }
                if (bounds[1].lat) {
                    this.south = bounds[1].lat;
                    this.west = bounds[1].lng;
                } else {
                    this.south = bounds[1][0];
                    this.west = bounds[1][1];
                }
            } else if (bounds.length === 4) {
                // expect [north, east, south, west]
                this.north = bounds[0];
                this.east = bounds[1];
                this.south = bounds[2];
                this.west = bounds[3];
            }
        }

        return this.north && this.east && this.south && this.west;
    }

    L.geoBound = function(bounds) {
        if (arguments.length === 4) {
            bounds = [bounds, arguments[1], arguments[2], arguments[3]];
        }
        if (!extractBounds.call(this, bounds)) {
            throw new Error('invalid data passed to bound constructor');
        }
        this.getNorth = function() {
            return this.north;
        };
        this.getEast = function() {
            return this.east;
        };
        this.getSouth = function() {
            return this.south;
        };
        this.getWest = function() {
            return this.west;
        };
        this.getSouthWest = function() {
            return [this.getSouth(), this.getWest()];
        };
        this.getNorthEast = function() {
            return [this.getNorth(), this.getEast()];
        };
        this.getNorthWest = function() {
            return [this.getNorth(), this.getWest()];
        };
        this.getSouthEast = function() {
            return [this.getSouth(), this.getEast()];
        };
        this.getCenter = function() {
            return [(this.getSouth() + this.getNorth()) / 2,
                (this.getWest() + this.getEast()) / 2];
        };
    };
}());
