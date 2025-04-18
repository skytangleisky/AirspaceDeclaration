import url from './satellite.json?url'
export default {
    "version": 8,
    "name": "Mapbox Satellite",
    "metadata": {
        "mapbox:autocomposite": true,
        "mapbox:type": "default"
    },
    "sources": {
        "mapbox": {
            "type": "raster",
            url,
            "tileSize": 256
        }
    },
    "center": [
        0,
        0
    ],
    "zoom": 3,
    "sprite": "mapbox://sprites/mapbox/satellite-v9",
    "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "rgb(4,7,14)"
            }
        },
        {
            "id": "satellite",
            "type": "raster",
            "source": "mapbox",
            "source-layer": "mapbox_satellite_full"
        }
    ],
    "created": "1970-01-01T00:00:00.000Z",
    "modified": "1970-01-01T00:00:00.000Z",
    "owner": "mapbox",
    "id": "satellite-v9",
    "draft": false,
    "visibility": "public"
}