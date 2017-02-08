 (function() {
    'use strict';

    const
        Bound = L.geoBound;

    function tile2long(x, z) {
        return (x / Math.pow(2, z) * 360 - 180);
    }
    function tile2lat(y, z) {
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);

        return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    }

    function isTileObject(obj) {
        return obj.hasOwnProperty('valid') && obj.valid && 
            obj.hasOwnProperty('x') && 
            obj.hasOwnProperty('y') && 
            obj.hasOwnProperty('z');
    }


    function isValidInfo(x, y, z) {
        return Boolean((x || (!x && x === 0)) &&
            (y || (!y && y === 0)) &&
            (z || (!z && z === 0)));
    }

    function url2tileData(urlString) {
        let parts = urlString.split('/'),
            lastIdx = parts.length - 1,
            x, y, z;

        if (lastIdx < 3) {
            // invalid url passed, need at least three values, separated by /
            return {
                valid : false
            };
        }

        x = parts[lastIdx - 1];
        y = parts[lastIdx].split('.')[0];
        z = parts[lastIdx - 2];

        return {
            valid : isValidInfo(x, y, z),
            x : x,
            y : y,
            z : z
        };
    }

    L.tile2bound = function(x, y, z, opts) {
        if (!opts) {
            opts = {};
        }
        if (typeof x === 'string' || x instanceof String) {
            // passed value equals http tile link. parse it to tile data
            x = url2tileData(x);
        }
        if (isTileObject(x)) {
            if (y) {
                opts = y;
            }

            y = x.y;
            z = x.z;
            x = x.x;
        }

        x = parseInt(x, 10);
        y = parseInt(y, 10);
        z = parseInt(z, 10);

        if (!isValidInfo(x, y, z)) {
            return null;
        }

        let north = tile2long(x, z), 
            west = tile2lat(y, z),
            south = tile2long(x + 1, z),
            east = tile2lat(y + 1, z);

        if (opts.oldBoundStyle) {
            console.log('osmtile2bound - old style is used, will be replaced in 0.3.0. ' +
                'use the converter function of the returned Bound object instead.');
            return [[north, west], [south, west], [south, east], [west, south]];
        }
        return new Bound(north, east, south, west);
    }
}());
